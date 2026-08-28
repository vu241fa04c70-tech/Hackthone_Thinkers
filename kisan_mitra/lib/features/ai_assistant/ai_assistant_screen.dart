import 'package:flutter/material.dart';
import '../../services/tts_service.dart';
import '../../services/stt_service.dart';
import '../../widgets/voice_button.dart';

class AiAssistantScreen extends StatefulWidget {
  final String lang;
  const AiAssistantScreen({super.key, required this.lang});

  @override
  State<AiAssistantScreen> createState() => _AiAssistantScreenState();
}

class _AiAssistantScreenState extends State<AiAssistantScreen> {
  final TtsService _tts = TtsService();
  final SttService _stt = SttService();

  bool _isListening = false;
  String _userQuery = '';
  String _botResponse = 'నమస్కారం! నేను మీ డిజిటల్ రైతు మిత్రుడిని. ఆకులు పసుపు రంగులోకి మారుతున్నాయా? నీటి యాజమాన్యం కావలెనా? క్రింది మైక్ నొక్కి మాట్లాడండి.';

  @override
  void initState() {
    super.initState();
    _tts.init();
    _stt.init();
  }

  void _toggleListening() {
    if (_isListening) {
      _stt.stop();
      setState(() => _isListening = false);
    } else {
      setState(() => _isListening = true);
      _stt.listen(
        onResult: (text) {
          setState(() {
            _userQuery = text;
            _isListening = false;
          });
          _processResponse(text);
        },
        localeId: widget.lang == 'te' ? 'te_IN' : (widget.lang == 'hi' ? 'hi_IN' : 'en_US'),
      );
    }
  }

  Future<void> _processResponse(String query) async {
    setState(() => _botResponse = widget.lang == 'te' ? 'సమాధానం సిద్ధం చేస్తున్నాను...' : (widget.lang == 'hi' ? 'उत्तर तैयार हो रहा है...' : 'Thinking...'));
    final reply = await ApiService.askAiCopilot(query: query, language: widget.lang);
    if (!mounted) return;
    setState(() => _botResponse = reply);
    _tts.speak(reply, lang: widget.lang == 'te' ? 'te-IN' : (widget.lang == 'hi' ? 'hi-IN' : 'en-IN'));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.lang == 'te' ? '🎤 అడగండి తెలుసుకోండి' : '🎤 कुछ भी पूछें'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            children: [
              // Chat Display Card
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: const Color(0xFF14B8A6), width: 1.5),
                  ),
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (_userQuery.isNotEmpty) ...[
                          Align(
                            alignment: Alignment.centerRight,
                            child: Container(
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: const Color(0xFF10B981),
                                borderRadius: BorderRadius.circular(18),
                              ),
                              child: Text(_userQuery, style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                            ),
                          ),
                          const SizedBox(height: 16),
                        ],

                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('🤖 ', style: TextStyle(fontSize: 24)),
                            Expanded(
                              child: Text(
                                _botResponse,
                                style: const TextStyle(fontSize: 16, color: Colors.white, height: 1.5, fontWeight: FontWeight.w600),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // Push-to-Talk Mic Button
              VoiceButton(
                isListening: _isListening,
                onPressed: _toggleListening,
                label: 'మైక్ నొక్కి మాట్లాడండి (Speak)',
              ),
            ],
          ),
        ),
      ),
    );
  }
}
