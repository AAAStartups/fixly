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
}

class BookingState {
  final DeviceBrand? selectedBrand;
  final DeviceModel? selectedModel;
  final RepairService? selectedService;
  final String? selectedDate;
  final String? selectedTimeSlot;
  final String pickupAddress;
  final double pickupFee;

  const BookingState({
    this.selectedBrand,
    this.selectedModel,
    this.selectedService,
    this.selectedDate,
    this.selectedTimeSlot,
    this.pickupAddress = 'Home (Flat 402, Sunshine Heights, Mumbai)',
    this.pickupFee = 79.0,
  });

  BookingState copyWith({
    DeviceBrand? selectedBrand,
    DeviceModel? selectedModel,
    RepairService? selectedService,
    String? selectedDate,
    String? selectedTimeSlot,
    String? pickupAddress,
    double? pickupFee,
  }) {
    return BookingState(
      selectedBrand: selectedBrand ?? this.selectedBrand,
      selectedModel: selectedModel ?? this.selectedModel,
      selectedService: selectedService ?? this.selectedService,
      selectedDate: selectedDate ?? this.selectedDate,
      selectedTimeSlot: selectedTimeSlot ?? this.selectedTimeSlot,
      pickupAddress: pickupAddress ?? this.pickupAddress,
      pickupFee: pickupFee ?? this.pickupFee,
    );
  }

  double get totalAmount {
    final servicePrice = selectedService?.price.toDouble() ?? 0.0;
    return servicePrice + pickupFee;
  }
}
