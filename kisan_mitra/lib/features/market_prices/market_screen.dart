import 'package:flutter/material.dart';
import '../../services/tts_service.dart';
import '../../services/api_service.dart';
import '../../models/market_model.dart';

class MarketScreen extends StatefulWidget {
  final String lang;
  const MarketScreen({super.key, required this.lang});

  @override
  State<MarketScreen> createState() => _MarketScreenState();
}

class _MarketScreenState extends State<MarketScreen> {
  final TtsService _tts = TtsService();
  MarketInfo? _market;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tts.init();
    _loadMarket();
  }

  Future<void> _loadMarket() async {
    final m = await ApiService.fetchMarket('Tomato');
    setState(() {
      _market = m;
      _isLoading = false;
    });
  }

  void _speakMarket() {
    if (_market != null) {
      final text = 'టమాటా ధర ఈ రోజు రూ. 24/కిలో ఉంది. 3 రోజులు ఆగితే ధర రూ. 27 వరకు పెరుగుతుంది. ఈ రోజు అమ్మవద్దు.';
      _tts.speak(text, lang: widget.lang == 'te' ? 'te-IN' : 'hi-IN');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.lang == 'te' ? '💰 మండీ ధరలు' : '💰 मंडी भाव'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)))
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: const Color(0xFFF59E0B), width: 1.5),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('💡 అమ్మాలో వద్దో సలహా (Advice):', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFFFBBF24))),
                            IconButton(
                              icon: const Icon(Icons.volume_up, color: Color(0xFF10B981)),
                              onPressed: _speakMarket,
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(_market!.recommendation, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                        const SizedBox(height: 16),
                        _buildPriceTile('మీ ఊరి వ్యాపారి (Village):', '₹20 / kg'),
                        _buildPriceTile('${_market!.nearestMandi}:', '₹24.5 / kg'),
                        _buildPriceTile('3 రోజుల తర్వాత అంచనా:', '₹27.5 / kg'),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildPriceTile(String label, String price) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Colors.white70)),
          Text(price, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF10B981))),
        ],
      ),
    );
  }
}
