import 'package:speech_to_text/speech_to_text.dart' as stt;

class SttService {
  final stt.SpeechToText _speech = stt.SpeechToText();
  bool _isAvailable = false;

  Future<bool> init() async {
    _isAvailable = await _speech.initialize();
    return _isAvailable;
  }

  void listen({required Function(String) onResult, String localeId = 'te_IN'}) {
    if (_isAvailable) {
      _speech.listen(
        onResult: (val) => onResult(val.recognizedWords),
        localeId: localeId,
      );
    }
  }

  void stop() {
    _speech.stop();
  }
}
