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

  Future<List<Map<String, dynamic>>> getAgentContactRequests() async {
    try {
      final response = await HttpClient.get('/contacts/agent');
      if (response.statusCode == 200) {
        final data = response.data;
        return List<Map<String, dynamic>>.from((data is Map && data['contacts'] != null) ? data['contacts'] : []);
      }
      throw Exception('Failed to load contact requests');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<Map<String, dynamic>> updateContactRequest({
    required String contactId,
    required String status,
  }) async {
    try {
      final response = await HttpClient.put(
        '/contacts/$contactId',
        body: {'status': status},
      );
      if (response.statusCode == 200) {
        return response.data as Map<String, dynamic>;
      }
      throw Exception('Failed to update contact request');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getAllContactRequests() async {
    try {
      final response = await HttpClient.get('/contacts');
      if (response.statusCode == 200) {
        final data = response.data;
        return List<Map<String, dynamic>>.from((data is Map && data['contacts'] != null) ? data['contacts'] : []);
      }
      throw Exception('Failed to load contact requests');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  Future<Map<String, dynamic>> deleteContactRequest(String contactId) async {
    try {
      final response = await HttpClient.delete('/contacts/$contactId');
      if (response.statusCode == 200) {
        return response.data as Map<String, dynamic>;
      }
      throw Exception('Failed to delete contact request');
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}

