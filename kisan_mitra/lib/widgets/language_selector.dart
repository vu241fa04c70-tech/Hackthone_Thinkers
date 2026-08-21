import 'package:flutter/material.dart';

class LanguageSelector extends StatelessWidget {
  final String selectedLang;
  final ValueChanged<String> onLanguageChanged;

  const LanguageSelector({
    super.key,
    required this.selectedLang,
    required this.onLanguageChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: selectedLang,
          dropdownColor: const Color(0xFF1E293B),
          icon: const Icon(Icons.language, color: Color(0xFF10B981), size: 20),
          items: const [
            DropdownMenuItem(value: 'te', child: Text('తెలుగు (Telugu)')),
            DropdownMenuItem(value: 'hi', child: Text('हिंदी (Hindi)')),
            DropdownMenuItem(value: 'en', child: Text('English')),
          ],
          onChanged: (val) {
            if (val != null) onLanguageChanged(val);
          },
        ),
      ),
    );
  }
}
