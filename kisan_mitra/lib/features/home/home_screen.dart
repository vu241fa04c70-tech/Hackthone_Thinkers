import 'package:flutter/material.dart';
import '../../services/tts_service.dart';
import '../../services/api_service.dart';
import '../../widgets/feature_card.dart';
import '../../widgets/language_selector.dart';
import '../crop_disease/crop_disease_screen.dart';
import '../weather/weather_screen.dart';
import '../market_prices/market_screen.dart';
import '../ai_assistant/ai_assistant_screen.dart';
import '../govt_schemes/schemes_screen.dart';
import '../farming_calendar/calendar_screen.dart';

class HomeScreen extends StatefulWidget {
  final String langCode;
  const HomeScreen({super.key, required this.langCode});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late String _currentLang;
  final TtsService _tts = TtsService();
  bool _isPlayingBriefing = false;
  Map<String, dynamic>? _briefingData;

  @override
  void initState() {
    super.initState();
    _currentLang = widget.langCode;
    _tts.init();
    _loadBriefing();
  }

  Future<void> _loadBriefing() async {
    final langStr = _currentLang == 'te' ? 'Telugu' : (_currentLang == 'hi' ? 'Hindi' : 'English');
    final data = await ApiService.fetchMorningBriefing(language: langStr);
    setState(() {
      _briefingData = data;
    });
  }

  void _toggleBriefingAudio() {
    if (_isPlayingBriefing) {
      _tts.stop();
      setState(() => _isPlayingBriefing = false);
    } else {
      final script = _briefingData?['voice_script'] ?? 'ఈ రోజు వాతావరణం అనుకూలంగా ఉంది.';
      final lang = _currentLang == 'te' ? 'te-IN' : (_currentLang == 'hi' ? 'hi-IN' : 'en-US');
      _tts.speak(script, lang: lang);
      setState(() => _isPlayingBriefing = true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Text('🌾 '),
            Text(_currentLang == 'te' ? 'కిసాన్ మిత్ర' : (_currentLang == 'hi' ? 'किसान मित्र' : 'Kisan Mitra')),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12.0),
            child: LanguageSelector(
              selectedLang: _currentLang,
              onLanguageChanged: (newLang) {
                setState(() => _currentLang = newLang);
                _loadBriefing();
              },
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Morning Voice Briefing Banner
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF064E3B), Color(0xFF0F172A)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFF10B981), width: 1.5),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          _briefingData?['greeting'] ?? 'నమస్కారం రమేష్ గారూ! 🌅',
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                        ElevatedButton.icon(
                          onPressed: _toggleBriefingAudio,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF10B981),
                            foregroundColor: Colors.black,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          ),
                          icon: Icon(_isPlayingBriefing ? Icons.pause : Icons.volume_up, size: 18),
                          label: Text(_isPlayingBriefing ? 'ఆపండి' : '🔊 వాయిస్ వినండి'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      _briefingData?['weather_simple_advice'] ?? '⚠️ ఈ రోజు మధ్యాహ్నం 2 గంటలకు వర్షం: నీరు పెట్టవద్దు.',
                      style: const TextStyle(fontSize: 13, color: Color(0xFF6EE7B7), fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // 6 Feature Cards Grid
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                crossAxisSpacing: 14,
                mainAxisSpacing: 14,
                childAspectRatio: 0.95,
                children: [
                  FeatureCard(
                    title: _currentLang == 'te' ? 'పైరు వ్యాధి పరీక్ష' : (_currentLang == 'hi' ? 'फसल बीमारी जांच' : 'Crop Disease Scan'),
                    subtitle: 'ఫోటో తీయండి → మందు వివరాలు చూడండి',
                    emoji: '📷',
                    accentColor: const Color(0xFFF43F5E),
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => CropDiseaseScreen(lang: _currentLang))),
                  ),
                  FeatureCard(
                    title: _currentLang == 'te' ? 'ఈనాటి వాతావరణం' : (_currentLang == 'hi' ? 'आज का मौसम' : 'Weather Today'),
                    subtitle: 'వర్షం మరియు వాతావరణ హెచ్చరికలు',
                    emoji: '🌤️',
                    accentColor: const Color(0xFF0EA5E9),
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => WeatherScreen(lang: _currentLang))),
                  ),
                  FeatureCard(
                    title: _currentLang == 'te' ? 'మండీ ధరలు' : (_currentLang == 'hi' ? 'मंडी भाव' : 'Market Prices'),
                    subtitle: 'ఈ రోజు ధరలు మరియు ఎప్పుడు అమ్మాలి?',
                    emoji: '💰',
                    accentColor: const Color(0xFFF59E0B),
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => MarketScreen(lang: _currentLang))),
                  ),
                  FeatureCard(
                    title: _currentLang == 'te' ? 'అడగండి తెలుసుకోండి' : (_currentLang == 'hi' ? 'कुछ भी पूछें' : 'Ask Me Anything'),
                    subtitle: 'మాట్లాడండి → వాయిస్ జవాబు వినండి',
                    emoji: '🎤',
                    accentColor: const Color(0xFF14B8A6),
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => AiAssistantScreen(lang: _currentLang))),
                  ),
                  FeatureCard(
                    title: _currentLang == 'te' ? 'ప్రభుత్వ పథకాలు' : (_currentLang == 'hi' ? 'सरकारी योजनाएं' : 'Govt Schemes'),
                    subtitle: 'PM-Kisan & రైతు భరోసా వివరాలు',
                    emoji: '📜',
                    accentColor: const Color(0xFFA855F7),
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => SchemesScreen(lang: _currentLang))),
                  ),
                  FeatureCard(
                    title: _currentLang == 'te' ? 'వ్యవసాయ క్యాలెండర్' : (_currentLang == 'hi' ? 'कृषि कैलेंडर' : 'Farming Calendar'),
                    subtitle: 'వారం వారీ వ్యవసాయ పనుల జాబితా',
                    emoji: '📅',
                    accentColor: const Color(0xFF10B981),
                    onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => CalendarScreen(lang: _currentLang))),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
