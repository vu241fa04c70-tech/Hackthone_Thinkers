import 'package:flutter/material.dart';
import '../../services/tts_service.dart';
import '../../services/api_service.dart';
import '../../models/crop_model.dart';

class CropDiseaseScreen extends StatefulWidget {
  final String lang;
  const CropDiseaseScreen({super.key, required this.lang});

  @override
  State<CropDiseaseScreen> createState() => _CropDiseaseScreenState();
}

class _CropDiseaseScreenState extends State<CropDiseaseScreen> {
  final TtsService _tts = TtsService();
  CropDiagnosis? _diagnosis;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tts.init();
    _loadSample();
  }

  Future<void> _loadSample() async {
    final res = await ApiService.analyzeCropSample('sample_tomato_early_blight');
    setState(() {
      _diagnosis = res;
      _isLoading = false;
    });
  }

  void _speakDiagnosis() {
    if (_diagnosis != null) {
      final text = 'మీ టమాటా పంటకు ${_diagnosis!.diseaseName} సోకింది. ${_diagnosis!.pesticideName} మందు కొట్టండి. 1 లీటరు నీటికి 2 స్పూన్లు వాడండి. ఖరీదు సుమారు ${_diagnosis!.estimatedCost} రూపాయలు.';
      _tts.speak(text, lang: widget.lang == 'te' ? 'te-IN' : 'hi-IN');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.lang == 'te' ? '📷 పైరు వ్యాధి పరీక్ష' : '📷 फसल बीमारी जांच'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF10B981)))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Camera Upload Button
                  ElevatedButton.icon(
                    onPressed: _loadSample,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10B981),
                      foregroundColor: Colors.black,
                      padding: const EdgeInsets.all(16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    ),
                    icon: const Icon(Icons.camera_alt, size: 24),
                    label: const Text('ఫోటో తీయండి (Take Leaf Photo)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  ),

                  const SizedBox(height: 20),

                  // Result Card
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Colors.roseAccent.withOpacity(0.5), width: 1.5),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                const Text('🔴 ', style: TextStyle(fontSize: 24)),
                                Text(
                                  _diagnosis!.diseaseName,
                                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                                ),
                              ],
                            ),
                            IconButton(
                              icon: const Icon(Icons.volume_up, color: Color(0xFF10B981)),
                              onPressed: _speakDiagnosis,
                            ),
                          ],
                        ),

                        const Divider(color: Color(0xFF334155), height: 24),

                        const Text('ఈ రోజు చేయాల్సిన పని (Do This TODAY):', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF6EE7B7))),
                        const SizedBox(height: 8),

                        _buildBullet('మందు: ${_diagnosis!.pesticideName}'),
                        _buildBullet('మోతాదు: 1 లీటరు నీటికి 2 స్పూన్లు (${_diagnosis!.dosage})'),
                        _buildBullet('సమయం: సాయంత్రం వేళలో పిచికారీ చేయండి'),

                        const SizedBox(height: 16),

                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFF0F172A),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('అంచనా ఖరీదు (Cost):', style: TextStyle(color: Colors.white70)),
                              Text('~₹${_diagnosis!.estimatedCost}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF10B981))),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildBullet(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('✅ ', style: TextStyle(fontSize: 14)),
          Expanded(child: Text(text, style: const TextStyle(fontSize: 14, color: Colors.white))),
        ],
      ),
    );
  }
}
