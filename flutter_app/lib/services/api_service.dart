import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import '../models/models.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  // Dynamic base URL:
  // - Android Emulator: 10.0.2.2:3000
  // - iOS Simulator / Desktop / Web: localhost:3000
  String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:3000/api/v1';
    }
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:3000/api/v1';
    }
    return 'http://localhost:3000/api/v1';
  }

  // Fast connection timeout to avoid blocking UI when backend is offline
  final HttpClient _httpClient = HttpClient()
    ..connectionTimeout = const Duration(milliseconds: 1500);

  Future<dynamic> _get(String path) async {
    try {
      final uri = Uri.parse('$baseUrl$path');
      final request = await _httpClient.getUrl(uri).timeout(const Duration(milliseconds: 1500));
      request.headers.set(HttpHeaders.contentTypeHeader, 'application/json');
      final response = await request.close().timeout(const Duration(milliseconds: 1500));
      final body = await response.transform(utf8.decoder).join();
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return jsonDecode(body);
      }
      debugPrint('[ApiService] GET $path returned error status: ${response.statusCode}');
      return null;
    } catch (e) {
      debugPrint('[ApiService] GET $path error or offline: $e');
      return null;
    }
  }

  Future<dynamic> _post(String path, Map<String, dynamic> data) async {
    try {
      final uri = Uri.parse('$baseUrl$path');
      final request = await _httpClient.postUrl(uri).timeout(const Duration(milliseconds: 2000));
      request.headers.set(HttpHeaders.contentTypeHeader, 'application/json');
      request.write(jsonEncode(data));
      final response = await request.close().timeout(const Duration(milliseconds: 2000));
      final body = await response.transform(utf8.decoder).join();
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return jsonDecode(body);
      }
      debugPrint('[ApiService] POST $path returned error status: ${response.statusCode}');
      return null;
    } catch (e) {
      debugPrint('[ApiService] POST $path error or offline: $e');
      return null;
    }
  }

  // 1. Fetch Supported Brands (Cache-First)
  Future<List<DeviceBrand>> fetchBrands() async {
    final res = await _get('/catalog/brands');
    if (res is List) {
      return res.map((e) => DeviceBrand.fromJson(e as Map<String, dynamic>)).toList();
    }
    return fallbackBrands;
  }

  // 2. Fetch Models for Selected Brand (Cache-First)
  Future<List<DeviceModel>> fetchModels(String brandId) async {
    final res = await _get('/catalog/brands/$brandId/models');
    if (res is List) {
      return res.map((e) => DeviceModel.fromJson(e as Map<String, dynamic>)).toList();
    }
    return getFallbackModels(brandId);
  }

  // 3. Fetch Repair Services (Cache-First)
  Future<List<RepairService>> fetchServices() async {
    final res = await _get('/catalog/services');
    if (res is List) {
      return res.map((e) => RepairService.fromJson(e as Map<String, dynamic>)).toList();
    }
    return fallbackServices;
  }

  // 4. Create New Repair Booking
  Future<RepairOrderModel?> createBooking(BookingState state) async {
    final payload = {
      'modelId': state.selectedModel?.id ?? 'xm-11t-pro',
      'brandId': state.selectedBrand?.id ?? 'xiaomi',
      'serviceId': state.selectedService?.id ?? 'display',
      'pickupDate': state.selectedDate ?? 'Mon 19 Oct',
      'pickupSlot': state.selectedTimeSlot ?? '10:00 AM',
      'pickupAddress': state.pickupAddress,
      'issueDescription': '${state.selectedService?.title ?? "Hardware"} repair service',
    };

    final res = await _post('/orders/create', payload);
    if (res is Map<String, dynamic> && res['order'] != null) {
      return RepairOrderModel.fromJson(res['order'] as Map<String, dynamic>);
    }
    return null;
  }

  // 5. Get Active Repair Order
  Future<RepairOrderModel?> fetchActiveOrder() async {
    final res = await _get('/orders/active');
    if (res is Map<String, dynamic>) {
      return RepairOrderModel.fromJson(res);
    }
    return null;
  }

  // 6. Respond to Estimate
  Future<bool> respondToEstimate(String orderId, bool isApproved, [String? rejectionReason]) async {
    final res = await _post('/orders/$orderId/estimate/respond', {
      'isApproved': isApproved,
      'rejectionReason': rejectionReason ?? '',
    });
    return res != null && res['success'] == true;
  }

  // 7. Initiate 30-Day Warranty Claim
  Future<bool> claimWarranty(String orderId, String notes) async {
    final res = await _post('/orders/$orderId/warranty/claim', {
      'claimNotes': notes,
    });
    return res != null && res['success'] == true;
  }

  // Instant In-Memory Fallbacks for 0ms Screen Load
  static const List<DeviceBrand> fallbackBrands = [
    DeviceBrand(id: 'apple', name: 'Apple', logoText: ''),
    DeviceBrand(id: 'samsung', name: 'Samsung', logoText: 'SAMSUNG'),
    DeviceBrand(id: 'oneplus', name: 'OnePlus', logoText: '1+'),
    DeviceBrand(id: 'google', name: 'Google', logoText: 'G'),
    DeviceBrand(id: 'xiaomi', name: 'Xiaomi', logoText: 'mi'),
    DeviceBrand(id: 'vivo', name: 'Vivo', logoText: 'vivo'),
    DeviceBrand(id: 'motorola', name: 'Motorola', logoText: 'M'),
    DeviceBrand(id: 'realme', name: 'Realme', logoText: 'realme'),
    DeviceBrand(id: 'oppo', name: 'OPPO', logoText: 'oppo'),
    DeviceBrand(id: 'poco', name: 'POCO', logoText: 'POCO'),
    DeviceBrand(id: 'iqoo', name: 'iQOO', logoText: 'iQOO'),
    DeviceBrand(id: 'huawei', name: 'Huawei', logoText: 'HUAWEI'),
  ];

  static List<DeviceModel> getFallbackModels(String brandId) {
    switch (brandId.toLowerCase()) {
      case 'apple':
        return const [
          DeviceModel(id: 'ap-15-pm', brandId: 'apple', name: 'iPhone 15 Pro Max', year: '2023', network: '5G'),
          DeviceModel(id: 'ap-15-pro', brandId: 'apple', name: 'iPhone 15 Pro', year: '2023', network: '5G'),
          DeviceModel(id: 'ap-15', brandId: 'apple', name: 'iPhone 15', year: '2023', network: '5G'),
          DeviceModel(id: 'ap-14-pro', brandId: 'apple', name: 'iPhone 14 Pro', year: '2022', network: '5G'),
          DeviceModel(id: 'ap-14', brandId: 'apple', name: 'iPhone 14', year: '2022', network: '5G'),
          DeviceModel(id: 'ap-13', brandId: 'apple', name: 'iPhone 13 128GB', year: '2021', network: '5G'),
          DeviceModel(id: 'ap-12', brandId: 'apple', name: 'iPhone 12', year: '2020', network: '5G'),
          DeviceModel(id: 'ap-11', brandId: 'apple', name: 'iPhone 11', year: '2019', network: '4G'),
        ];
      case 'samsung':
        return const [
          DeviceModel(id: 'sm-s24-ultra', brandId: 'samsung', name: 'Galaxy S24 Ultra 5G', year: '2024', network: '5G'),
          DeviceModel(id: 'sm-s23-ultra', brandId: 'samsung', name: 'Galaxy S23 Ultra', year: '2023', network: '5G'),
          DeviceModel(id: 'sm-s22', brandId: 'samsung', name: 'Samsung Galaxy S22', year: '2022', network: '5G'),
          DeviceModel(id: 'sm-s21-fe', brandId: 'samsung', name: 'Galaxy S21 FE 5G', year: '2022', network: '5G'),
          DeviceModel(id: 'sm-a54', brandId: 'samsung', name: 'Galaxy A54 5G', year: '2023', network: '5G'),
          DeviceModel(id: 'sm-m34', brandId: 'samsung', name: 'Galaxy M34 5G', year: '2023', network: '5G'),
        ];
      case 'oneplus':
        return const [
          DeviceModel(id: 'op-12', brandId: 'oneplus', name: 'OnePlus 12 5G', year: '2024', network: '5G'),
          DeviceModel(id: 'op-11', brandId: 'oneplus', name: 'OnePlus 11 5G', year: '2023', network: '5G'),
          DeviceModel(id: 'op-10-pro', brandId: 'oneplus', name: 'OnePlus 10 Pro', year: '2022', network: '5G'),
          DeviceModel(id: 'op-nord-3', brandId: 'oneplus', name: 'OnePlus Nord 3 5G', year: '2023', network: '5G'),
          DeviceModel(id: 'op-nord-ce3', brandId: 'oneplus', name: 'OnePlus Nord CE 3 Lite', year: '2023', network: '5G'),
        ];
      case 'google':
        return const [
          DeviceModel(id: 'gg-8-pro', brandId: 'google', name: 'Pixel 8 Pro', year: '2023', network: '5G'),
          DeviceModel(id: 'gg-8', brandId: 'google', name: 'Pixel 8', year: '2023', network: '5G'),
          DeviceModel(id: 'gg-7a', brandId: 'google', name: 'Pixel 7a', year: '2023', network: '5G'),
          DeviceModel(id: 'gg-7-pro', brandId: 'google', name: 'Pixel 7 Pro', year: '2022', network: '5G'),
          DeviceModel(id: 'gg-6a', brandId: 'google', name: 'Pixel 6a', year: '2022', network: '5G'),
        ];
      default:
        return const [
          DeviceModel(id: 'xm-11i', brandId: 'xiaomi', name: 'Xiaomi 11i 5G', year: '2022', network: '5G'),
          DeviceModel(id: 'xm-11i-hc', brandId: 'xiaomi', name: 'Xiaomi 11i HyperCharge', year: '2022', network: '5G'),
          DeviceModel(id: 'xm-11-lite', brandId: 'xiaomi', name: 'Xiaomi 11 Lite NE 5G', year: '2021', network: '5G'),
          DeviceModel(id: 'xm-11t-pro', brandId: 'xiaomi', name: 'Xiaomi 11T Pro 5G', year: '2021', network: '5G'),
          DeviceModel(id: 'xm-12-pro', brandId: 'xiaomi', name: 'Xiaomi 12 Series 12 Pro 5G', year: '2022', network: '5G'),
          DeviceModel(id: 'xm-7a', brandId: 'xiaomi', name: 'Xiaomi 7A', year: '2019', network: '4G'),
          DeviceModel(id: 'xm-8', brandId: 'xiaomi', name: 'Xiaomi 8', year: '2018', network: '4G'),
        ];
    }
  }

  static const List<RepairService> fallbackServices = [
    RepairService(
      id: 'display',
      title: 'Display',
      subtitle: 'Screen replacement (OEM)',
      price: 4299,
      warrantyText: '6 months warranty',
    ),
    RepairService(
      id: 'battery',
      title: 'Battery',
      subtitle: 'Battery replacement (OEM)',
      price: 2249,
      warrantyText: '6 months warranty',
    ),
    RepairService(
      id: 'charging-port',
      title: 'Charging Port',
      subtitle: 'Charging issue / port replacement',
      price: 1299,
      warrantyText: '6 months warranty',
    ),
    RepairService(
      id: 'camera',
      title: 'Camera',
      subtitle: 'Front / Back camera replacement',
      price: 2999,
      warrantyText: '6 months warranty',
    ),
    RepairService(
      id: 'speaker',
      title: 'Speaker',
      subtitle: 'Sound issue / speaker replacement',
      price: 1499,
      warrantyText: '6 months warranty',
    ),
    RepairService(
      id: 'water-damage',
      title: 'Water Damage',
      subtitle: 'Diagnosis & repair',
      price: 1999,
      warrantyText: '6 months warranty',
    ),
  ];
}
