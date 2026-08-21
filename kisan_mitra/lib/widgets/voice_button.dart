import 'package:flutter/material.dart';

class VoiceButton extends StatelessWidget {
  final bool isListening;
  final VoidCallback onPressed;
  final String label;

  const VoiceButton({
    super.key,
    required this.isListening,
    required this.onPressed,
    this.label = 'నొక్కి మాట్లాడండి (Speak)',
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: isListening ? Colors.redAccent : const Color(0xFF10B981),
        foregroundColor: Colors.black,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        elevation: 8,
      ),
      icon: Icon(
        isListening ? Icons.mic_off : Icons.mic,
        size: 24,
        color: Colors.black,
      ),
      label: Text(
        isListening ? 'వింటున్నాము... (Listening)' : label,
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
      ),
    );
  }
}
