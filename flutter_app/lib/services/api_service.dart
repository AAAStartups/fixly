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

  final HttpClient _httpClient = HttpClient()
    ..connectionTimeout = const Duration(seconds: 10);

  Future<dynamic> _get(String path) async {
    try {
      final uri = Uri.parse('$baseUrl$path');
      final request = await _httpClient.getUrl(uri);
      request.headers.set(HttpHeaders.contentTypeHeader, 'application/json');
      final response = await request.close();
      final body = await response.transform(utf8.decoder).join();
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return jsonDecode(body);
      }
      debugPrint('[ApiService] GET $path returned error status: ${response.statusCode}');
      return null;
    } catch (e) {
      debugPrint('[ApiService] GET $path error: $e');
      return null;
    }
  }

  Future<dynamic> _post(String path, Map<String, dynamic> data) async {
    try {
      final uri = Uri.parse('$baseUrl$path');
      final request = await _httpClient.postUrl(uri);
      request.headers.set(HttpHeaders.contentTypeHeader, 'application/json');
      request.write(jsonEncode(data));
      final response = await request.close();
      final body = await response.transform(utf8.decoder).join();
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return jsonDecode(body);
      }
      debugPrint('[ApiService] POST $path returned error status: ${response.statusCode}');
      return null;
    } catch (e) {
      debugPrint('[ApiService] POST $path error: $e');
      return null;
    }
  }

  // 1. Fetch Supported Brands
  Future<List<DeviceBrand>> fetchBrands() async {
    final res = await _get('/catalog/brands');
    if (res is List) {
      return res.map((e) => DeviceBrand.fromJson(e as Map<String, dynamic>)).toList();
    }
    return _fallbackBrands;
  }

  // 2. Fetch Models for Selected Brand
  Future<List<DeviceModel>> fetchModels(String brandId) async {
    final res = await _get('/catalog/brands/$brandId/models');
    if (res is List) {
      return res.map((e) => DeviceModel.fromJson(e as Map<String, dynamic>)).toList();
    }
    return _fallbackModels;
  }

  // 3. Fetch Repair Services
  Future<List<RepairService>> fetchServices() async {
    final res = await _get('/catalog/services');
    if (res is List) {
      return res.map((e) => RepairService.fromJson(e as Map<String, dynamic>)).toList();
    }
    return _fallbackServices;
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

  // Local resilient fallbacks matching plan.md
  static const List<DeviceBrand> _fallbackBrands = [
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

  static const List<DeviceModel> _fallbackModels = [
    DeviceModel(
      id: 'xm-11i',
      brandId: 'xiaomi',
      name: 'Xiaomi 11i 5G',
      year: '2022',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    ),
    DeviceModel(
      id: 'xm-11i-hc',
      brandId: 'xiaomi',
      name: 'Xiaomi 11i HyperCharge',
      year: '2022',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    ),
    DeviceModel(
      id: 'xm-11-lite',
      brandId: 'xiaomi',
      name: 'Xiaomi 11 Lite NE 5G',
      year: '2021',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    ),
    DeviceModel(
      id: 'xm-11t-pro',
      brandId: 'xiaomi',
      name: 'Xiaomi 11T Pro 5G',
      year: '2021',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    ),
    DeviceModel(
      id: 'xm-12-pro',
      brandId: 'xiaomi',
      name: 'Xiaomi 12 Series 12 Pro 5G',
      year: '2022',
      network: '5G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    ),
    DeviceModel(
      id: 'xm-7a',
      brandId: 'xiaomi',
      name: 'Xiaomi 7A',
      year: '2019',
      network: '4G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    ),
    DeviceModel(
      id: 'xm-8',
      brandId: 'xiaomi',
      name: 'Xiaomi 8',
      year: '2018',
      network: '4G',
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    ),
  ];

  static const List<RepairService> _fallbackServices = [
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
