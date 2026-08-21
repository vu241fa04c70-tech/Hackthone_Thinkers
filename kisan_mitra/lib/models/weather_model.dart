class WeatherInfo {
  final String location;
  final double currentTemp;
  final double humidity;
  final String simpleAdvice;

  WeatherInfo({
    required this.location,
    required this.currentTemp,
    required this.humidity,
    required this.simpleAdvice,
  });

  factory WeatherInfo.fromJson(Map<String, dynamic> json) {
    return WeatherInfo(
      location: json['location'] ?? 'Nashik, Maharashtra',
      currentTemp: (json['current_temp_c'] ?? 28.5).toDouble(),
      humidity: (json['current_humidity_pct'] ?? 82.0).toDouble(),
      simpleAdvice: json['weather_simple_advice'] ?? '⚠️ Rain expected at 2 PM today: Pause spraying.',
    );
  }
}
