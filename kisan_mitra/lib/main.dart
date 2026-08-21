import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'core/constants/app_constants.dart';
import 'core/theme/app_theme.dart';
import 'features/language_selection/language_screen.dart';
import 'features/home/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();
  final savedLang = prefs.getString(AppConstants.keyLanguage);

  runApp(KisanMitraApp(savedLang: savedLang));
}

class KisanMitraApp extends StatelessWidget {
  final String? savedLang;
  const KisanMitraApp({super.key, this.savedLang});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'కిసాన్ మిత్ర (Kisan Mitra)',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: savedLang != null
          ? HomeScreen(langCode: savedLang!)
          : const LanguageScreen(),
    );
  }
}
