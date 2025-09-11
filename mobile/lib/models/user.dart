class User {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? mobile;
  final String? occupation;
  final String? reraId;
  final String? subscriptionStatus;
  final Map<String, dynamic>? professionalInfo;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.mobile,
    this.occupation,
    this.reraId,
    this.subscriptionStatus,
    this.professionalInfo,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json["_id"] ?? json["id"] ?? '',
      name: json["name"] ?? '',
      email: json["email"] ?? '',
      role: json["role"] ?? '',
      mobile: json["mobile"],
      occupation: json["occupation"],
      reraId: json["reraId"],
      subscriptionStatus: json["subscriptionStatus"],
      professionalInfo: json["professionalInfo"],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'mobile': mobile,
      'occupation': occupation,
      'reraId': reraId,
      'subscriptionStatus': subscriptionStatus,
      'professionalInfo': professionalInfo,
    };
  }
}
