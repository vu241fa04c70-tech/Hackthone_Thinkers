import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/constants/app_constants.dart';
import '../home/home_screen.dart';

class LanguageScreen extends StatelessWidget {
  const LanguageScreen({super.key});

  Future<void> _selectLang(BuildContext context, String langCode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppConstants.keyLanguage, langCode);

    if (context.mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => HomeScreen(langCode: langCode)),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF090D16),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('🌾', style: TextStyle(fontSize: 64), textAlign: TextAlign.center),
              const SizedBox(height: 16),
              const Text(
                'కిసాన్ మిత్ర (Kisan Mitra)',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'దయచేసి మీ భాషను ఎంచుకోండి / अपनी भाषा चुनें',
                style: TextStyle(fontSize: 14, color: Colors.white70),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),

              _buildLangTile(context, 'తెలుగు (Telugu)', '🇮🇳', 'te'),
              const SizedBox(height: 12),
              _buildLangTile(context, 'हिंदी (Hindi)', '🇮🇳', 'hi'),
              const SizedBox(height: 12),
              _buildLangTile(context, 'English', '🌐', 'en'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLangTile(BuildContext context, String label, String flag, String code) {
    return ElevatedButton(
      onPressed: () => _selectLang(context, code),
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFF1E293B),
        padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 20),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        side: const BorderSide(color: Color(0xFF10B981), width: 1.5),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text('$flag  $label', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
          const Icon(Icons.arrow_forward_ios, size: 18, color: Color(0xFF10B981)),
        ],
      ),
    );
  }
}
