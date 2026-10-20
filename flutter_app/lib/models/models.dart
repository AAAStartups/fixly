class DeviceBrand {
  final String id;
  final String name;
  final String logoText;
  final String? logoUrl;
  final int? primaryColorValue;

  const DeviceBrand({
    required this.id,
    required this.name,
    required this.logoText,
    this.logoUrl,
    this.primaryColorValue,
  });

  factory DeviceBrand.fromJson(Map<String, dynamic> json) {
    return DeviceBrand(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      logoText: json['logoText'] as String? ?? (json['name'] as String? ?? '').substring(0, 1),
      logoUrl: json['iconUrl'] as String? ?? json['logoUrl'] as String?,
      primaryColorValue: json['color'] != null
          ? int.tryParse((json['color'] as String).replaceAll('#', '0xFF'))
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'logoText': logoText,
      'logoUrl': logoUrl,
      'color': primaryColorValue != null
          ? '#${primaryColorValue!.toRadixString(16).substring(2)}'
          : null,
    };
  }
}

class DeviceModel {
  final String id;
  final String brandId;
  final String name;
  final String year;
  final String network;
  final String imageUrl;

  const DeviceModel({
    required this.id,
    required this.brandId,
    required this.name,
    required this.year,
    required this.network,
    required this.imageUrl,
  });

  factory DeviceModel.fromJson(Map<String, dynamic> json) {
    return DeviceModel(
      id: json['id'] as String? ?? '',
      brandId: json['brandId'] as String? ?? '',
      name: json['name'] as String? ?? '',
      year: json['year'] as String? ?? '2022',
      network: json['network'] as String? ?? '5G',
      imageUrl: json['imageUrl'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'brandId': brandId,
      'name': name,
      'year': year,
      'network': network,
      'imageUrl': imageUrl,
    };
  }
}

class RepairService {
  final String id;
  final String title;
  final String subtitle;
  final int price;
  final String warrantyText;
  final bool isLiveStreamSupported;

  const RepairService({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.price,
    required this.warrantyText,
    this.isLiveStreamSupported = true,
  });

  factory RepairService.fromJson(Map<String, dynamic> json) {
    return RepairService(
      id: json['code'] as String? ?? json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      subtitle: json['subtitle'] as String? ?? '',
      price: (json['price'] as num?)?.toInt() ?? (json['basePrice'] as num?)?.toInt() ?? 0,
      warrantyText: json['warranty'] as String? ?? json['warrantyText'] as String? ?? '6 months warranty',
      isLiveStreamSupported: json['live'] as bool? ?? json['isLiveStreamSupported'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'subtitle': subtitle,
      'price': price,
      'warrantyText': warrantyText,
      'isLiveStreamSupported': isLiveStreamSupported,
    };
  }
}

class OrderTimelineItem {
  final String id;
  final String status;
  final String title;
  final String description;
  final DateTime timestamp;

  const OrderTimelineItem({
    required this.id,
    required this.status,
    required this.title,
    required this.description,
    required this.timestamp,
  });

  factory OrderTimelineItem.fromJson(Map<String, dynamic> json) {
    return OrderTimelineItem(
      id: json['id'] as String? ?? '',
      status: json['status'] as String? ?? '',
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      timestamp: json['timestamp'] != null
          ? DateTime.tryParse(json['timestamp'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}

class EstimateItemModel {
  final String title;
  final double amount;

  const EstimateItemModel({
    required this.title,
    required this.amount,
  });

  factory EstimateItemModel.fromJson(Map<String, dynamic> json) {
    return EstimateItemModel(
      title: json['title'] as String? ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
    );
  }
}

class EstimateModel {
  final String id;
  final double pickupFee;
  final double laborFee;
  final double discount;
  final double totalAmount;
  final bool? isApproved;
  final List<EstimateItemModel> items;

  const EstimateModel({
    required this.id,
    required this.pickupFee,
    required this.laborFee,
    required this.discount,
    required this.totalAmount,
    this.isApproved,
    required this.items,
  });

  factory EstimateModel.fromJson(Map<String, dynamic> json) {
    final rawItems = json['items'] as List<dynamic>? ?? [];
    return EstimateModel(
      id: json['id'] as String? ?? '',
      pickupFee: (json['pickupFee'] as num?)?.toDouble() ?? 79.0,
      laborFee: (json['laborFee'] as num?)?.toDouble() ?? 0.0,
      discount: (json['discount'] as num?)?.toDouble() ?? 0.0,
      totalAmount: (json['totalAmount'] as num?)?.toDouble() ?? 0.0,
      isApproved: json['isApproved'] as bool?,
      items: rawItems.map((e) => EstimateItemModel.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }
}

class RepairOrderModel {
  final String id;
  final String orderNumber;
  final String status;
  final String issueDescription;
  final double pickupFee;
  final DeviceModel? model;
  final String? pickupAddress;
  final List<OrderTimelineItem> timeline;
  final EstimateModel? estimate;

  const RepairOrderModel({
    required this.id,
    required this.orderNumber,
    required this.status,
    required this.issueDescription,
    required this.pickupFee,
    this.model,
    this.pickupAddress,
    required this.timeline,
    this.estimate,
  });

  factory RepairOrderModel.fromJson(Map<String, dynamic> json) {
    final rawTimeline = json['timeline'] as List<dynamic>? ?? [];
    return RepairOrderModel(
      id: json['id'] as String? ?? '',
      orderNumber: json['orderNumber'] as String? ?? '',
      status: json['status'] as String? ?? 'PICKUP_SCHEDULED',
      issueDescription: json['issueDescription'] as String? ?? '',
      pickupFee: (json['pickupFee'] as num?)?.toDouble() ?? 79.0,
      model: json['model'] != null ? DeviceModel.fromJson(json['model']) : null,
      pickupAddress: json['pickupAddress'] is Map
          ? json['pickupAddress']['addressLine'] as String?
          : json['pickupAddress'] as String?,
      timeline: rawTimeline.map((e) => OrderTimelineItem.fromJson(e as Map<String, dynamic>)).toList(),
      estimate: json['estimate'] != null ? EstimateModel.fromJson(json['estimate']) : null,
    );
  }
}

class BookingState {
  final String? orderId;
  final String? orderNumber;
  final DeviceBrand? selectedBrand;
  final DeviceModel? selectedModel;
  final RepairService? selectedService;
  final String? selectedDate;
  final String? selectedTimeSlot;
  final String pickupAddress;
  final double pickupFee;
  final List<OrderTimelineItem> liveTimeline;

  const BookingState({
    this.orderId,
    this.orderNumber,
    this.selectedBrand,
    this.selectedModel,
    this.selectedService,
    this.selectedDate,
    this.selectedTimeSlot,
    this.pickupAddress = 'Home (Flat 402, Sunshine Heights, Mumbai)',
    this.pickupFee = 79.0,
    this.liveTimeline = const [],
  });

  BookingState copyWith({
    String? orderId,
    String? orderNumber,
    DeviceBrand? selectedBrand,
    DeviceModel? selectedModel,
    RepairService? selectedService,
    String? selectedDate,
    String? selectedTimeSlot,
    String? pickupAddress,
    double? pickupFee,
    List<OrderTimelineItem>? liveTimeline,
  }) {
    return BookingState(
      orderId: orderId ?? this.orderId,
      orderNumber: orderNumber ?? this.orderNumber,
      selectedBrand: selectedBrand ?? this.selectedBrand,
      selectedModel: selectedModel ?? this.selectedModel,
      selectedService: selectedService ?? this.selectedService,
      selectedDate: selectedDate ?? this.selectedDate,
      selectedTimeSlot: selectedTimeSlot ?? this.selectedTimeSlot,
      pickupAddress: pickupAddress ?? this.pickupAddress,
      pickupFee: pickupFee ?? this.pickupFee,
      liveTimeline: liveTimeline ?? this.liveTimeline,
    );
  }

  double get totalAmount {
    final servicePrice = selectedService?.price.toDouble() ?? 0.0;
    return servicePrice + pickupFee;
  }
}
