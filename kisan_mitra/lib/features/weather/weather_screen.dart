import 'package:flutter/material.dart';
import '../../services/tts_service.dart';
import '../../services/api_service.dart';
import '../../models/weather_model.dart';

class WeatherScreen extends StatefulWidget {
  final String lang;
  const WeatherScreen({super.key, required this.lang});

  @override
  State<WeatherScreen> createState() => _WeatherScreenState();
}

class _WeatherScreenState extends State<WeatherScreen> {
  final TtsService _tts = TtsService();
  WeatherInfo? _weather;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tts.init();
    _loadWeather();
  }

  Future<void> _loadWeather() async {
    final w = await ApiService.fetchWeather('Nashik, Maharashtra');
    setState(() {
      _weather = w;
      _isLoading = false;
    });
  }

  void _speakWeather() {
    if (_weather != null) {
      _tts.speak(_weather!.simpleAdvice, lang: widget.lang == 'te' ? 'te-IN' : 'hi-IN');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.lang == 'te' ? '🌤️ ఈనాటి వాతావరణం' : '🌤️ आज का मौसम'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)))
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: const Color(0xFF0EA5E9), width: 1.5),
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(_weather!.location, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white70)),
                            IconButton(
                              icon: const Icon(Icons.volume_up, color: Color(0xFF10B981)),
                              onPressed: _speakWeather,
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        const Text('🌧️ 28.5°C', style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.white)),
                        const SizedBox(height: 8),
                        Text('నమస్కారం! మధ్యాహ్నం 2 గంటలకు వర్షం పడే అవకాశం ఉంది.', style: const TextStyle(fontSize: 14, color: Color(0xFF38BDF8))),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
