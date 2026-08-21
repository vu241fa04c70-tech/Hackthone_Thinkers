import 'package:flutter/material.dart';
import '../../services/tts_service.dart';

class SchemesScreen extends StatefulWidget {
  final String lang;
  const SchemesScreen({super.key, required this.lang});

  @override
  State<SchemesScreen> createState() => _SchemesScreenState();
}

class _SchemesScreenState extends State<SchemesScreen> {
  final TtsService _tts = TtsService();

  @override
  void initState() {
    super.initState();
    _tts.init();
  }

  void _speakScheme(String title, String desc) {
    _tts.speak('$title. $desc', lang: widget.lang == 'te' ? 'te-IN' : 'hi-IN');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.lang == 'te' ? '📜 ప్రభుత్వ పథకాలు' : '📜 सरकारी योजनाएं'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSchemeCard(
            'PM-KISAN (పిఎం కిసాన్)',
            'ఏడాదికి ₹6,000 రైతుల ఖాతాల్లో నేరుగా జమ. 17వ విడత విడుదలైంది.',
            '₹6,000 / ఏడాది',
          ),
          const SizedBox(height: 12),
          _buildSchemeCard(
            'రైతు భరోసా (Rythu Bharosa)',
            'ఆంధ్రప్రదేశ్ మరియు తెలంగాణ రైతు పెట్టుబడి సహాయం.',
            '₹13,500 / ఏడాది',
          ),
          const SizedBox(height: 12),
          _buildSchemeCard(
            'ఫసల్ బీమా యోజన (Crop Insurance)',
            'అకాల వర్షాలు మరియు కరువు నష్టాలకు పంట భీమా పరిహారం.',
            'పంట నష్ట పరిహారం',
          ),
        ],
      ),
    );
  }

  Widget _buildSchemeCard(String title, String desc, String tag) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFA855F7).withOpacity(0.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
              IconButton(
                icon: const Icon(Icons.volume_up, color: Color(0xFF10B981)),
                onPressed: () => _speakScheme(title, desc),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(desc, style: const TextStyle(fontSize: 13, color: Colors.white70)),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFFA855F7).withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(tag, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFD8B4FE))),
          ),
        ],
      ),
    );
  }
}
