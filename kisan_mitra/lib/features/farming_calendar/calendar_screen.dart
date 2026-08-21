import 'package:flutter/material.dart';
import '../../services/tts_service.dart';

class CalendarScreen extends StatefulWidget {
  final String lang;
  const CalendarScreen({super.key, required this.lang});

  @override
  State<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends State<CalendarScreen> {
  final TtsService _tts = TtsService();

  final List<Map<String, dynamic>> _tasks = [
    {
      'week': 'వారం 1 (ప్రస్తుతం)',
      'title': 'ఆకు పిచికారీ: Mancozeb 75% WP',
      'desc': 'వర్షానికి ముందే ఎకరానికి 600 గ్రాములు చల్లండి.',
      'done': false,
    },
    {
      'week': 'వారం 1 (ప్రస్తుతం)',
      'title': 'డ్రిప్ నీటి సమయం తగ్గించండి',
      'desc': 'నేలలో 34% తేమ ఉంది. 45 నిమిషాలకు పరిమితం చేయండి.',
      'done': false,
    },
    {
      'week': 'వారం 2',
      'title': 'పంట కోత సమయం',
      'desc': 'మండీ ధర రూ. 27/కిలోకు చేరుకుంటుంది. కోత పూర్తి చేయండి.',
      'done': false,
    },
    {
      'week': 'వారం 3',
      'title': 'నేల బలం పెంచడం',
      'desc': 'ఎకరానికి 15 కేజీల Urea డ్రిప్ ద్వారా అందించండి.',
      'done': false,
    },
  ];

  @override
  void initState() {
    super.initState();
    _tts.init();
  }

  void _speakTask(String text) {
    _tts.speak(text, lang: widget.lang == 'te' ? 'te-IN' : 'hi-IN');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.lang == 'te' ? '📅 వ్యవసాయ క్యాలెండర్' : '📅 कृषि कैलेंडर'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _tasks.length,
        itemBuilder: (context, index) {
          final item = _tasks[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: item['done'] ? const Color(0xFF10B981) : const Color(0xFF334155),
              ),
            ),
            child: Row(
              children: [
                Checkbox(
                  value: item['done'],
                  activeColor: const Color(0xFF10B981),
                  onChanged: (val) {
                    setState(() => item['done'] = val);
                  },
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item['week'], style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF10B981))),
                      const SizedBox(height: 2),
                      Text(item['title'], style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.white, decoration: item['done'] ? TextDecoration.lineThrough : null)),
                      const SizedBox(height: 4),
                      Text(item['desc'], style: const TextStyle(fontSize: 12, color: Colors.white70)),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.volume_up, color: Color(0xFF10B981), size: 20),
                  onPressed: () => _speakTask('${item['title']}. ${item['desc']}'),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
