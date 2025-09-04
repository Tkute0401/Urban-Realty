import 'http_client.dart';

class ContactService {
  static final ContactService _instance = ContactService._internal();
  factory ContactService() => _instance;
  ContactService._internal();

  Future<Map<String, dynamic>> createPropertyContact({
    required String propertyId,
    required String message,
    String contactMethod = 'message',
  }) async {
    final response = await HttpClient.post(
      '/contacts/property/$propertyId',
      body: {
        'message': message,
        'contactMethod': contactMethod,
      },
    );
    return response as Map<String, dynamic>;
  }
}

