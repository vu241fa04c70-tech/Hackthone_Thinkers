import 'package:flutter/material.dart';

class AppTheme {
  static const Color primaryGreen = Color(0xFF10B981);
  static const Color accentTeal = Color(0xFF14B8A6);
  static const Color darkBg = Color(0xFF090D16);
  static const Color cardBg = Color(0xFF1E293B);
  static const Color borderSlate = Color(0xFF334155);

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: darkBg,
      primaryColor: primaryGreen,
      colorScheme: const ColorScheme.dark(
        primary: primaryGreen,
        secondary: accentTeal,
        surface: cardBg,
      ),
      fontFamily: 'Roboto',
      appBarTheme: const AppBarTheme(
        backgroundColor: Color(0xFF0F172A),
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
    );
  }
}
