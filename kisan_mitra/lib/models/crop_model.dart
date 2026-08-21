class CropDiagnosis {
  final String diseaseName;
  final double confidence;
  final String severity;
  final String pesticideName;
  final String dosage;
  final double estimatedCost;

  CropDiagnosis({
    required this.diseaseName,
    required this.confidence,
    required this.severity,
    required this.pesticideName,
    required this.dosage,
    required this.estimatedCost,
  });

  factory CropDiagnosis.fromJson(Map<String, dynamic> json) {
    final pesticide = json['pesticide'] ?? {};
    return CropDiagnosis(
      diseaseName: json['disease_name'] ?? 'Early Blight',
      confidence: (json['confidence'] ?? 0.9).toDouble(),
      severity: json['severity_level'] ?? 'Medium',
      pesticideName: pesticide['name'] ?? 'Mancozeb 75% WP',
      dosage: pesticide['dosage_per_acre'] ?? '600g in 200L water',
      estimatedCost: (pesticide['estimated_cost_inr'] ?? 380.0).toDouble(),
    );
  }
}
