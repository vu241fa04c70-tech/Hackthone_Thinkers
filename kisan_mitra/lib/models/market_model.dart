class MarketInfo {
  final String crop;
  final String nearestMandi;
  final double currentPrice;
  final double projectedPrice;
  final String recommendation;

  MarketInfo({
    required this.crop,
    required this.nearestMandi,
    required this.currentPrice,
    required this.projectedPrice,
    required this.recommendation,
  });

  factory MarketInfo.fromJson(Map<String, dynamic> json) {
    return MarketInfo(
      crop: json['crop'] ?? 'Tomato',
      nearestMandi: json['nearest_mandi'] ?? 'Nashik APMC Mandi',
      currentPrice: (json['current_price_per_quintal'] ?? 2450.0).toDouble(),
      projectedPrice: (json['projected_7d_price'] ?? 2750.0).toDouble(),
      recommendation: json['harvest_recommendation'] ?? 'Harvest in 3 Days (Pre-Rain Window)',
    );
  }
}
