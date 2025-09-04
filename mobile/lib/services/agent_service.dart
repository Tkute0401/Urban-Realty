import 'http_client.dart';

class AgentService {
  static final AgentService _instance = AgentService._internal();
  factory AgentService() => _instance;
  AgentService._internal();



  Future<Map<String, dynamic>> getAgentDashboard() async {
    try {
      // Since there's no dedicated agent dashboard endpoint, we'll create dashboard data
      // by combining data from available endpoints
      final agentId = await _getCurrentAgentId();
      if (agentId == null) {
        return _getDefaultAgentDashboardData();
      }

      // Get agent properties
      final propertiesResponse = await HttpClient.get('/properties/agent/$agentId');
      final properties = propertiesResponse.statusCode == 200 ? propertiesResponse.data : {'data': []};
      
      // Create dashboard data from available information
      final List<dynamic> propertiesList = properties is Map && properties['data'] is List 
          ? properties['data'] as List<dynamic>
          : <dynamic>[];

      return {
        'agentName': 'Agent',
        'stats': {
          'totalProperties': propertiesList.length,
          'totalLeads': 0, // Not available from current endpoints
          'totalInquiries': 0, // Not available from current endpoints
          'monthlyRevenue': 0, // Not available from current endpoints
        },
        'recentLeads': [], // Not available from current endpoints
        'properties': propertiesList,
      };
    } catch (e) {
      print('Error in getAgentDashboard: $e');
      // Return default data for any error to prevent app crashes
      return _getDefaultAgentDashboardData();
    }
  }

  Future<String?> _getCurrentAgentId() async {
    try {
      // This would typically come from the auth service or stored user data
      // For now, we'll return a default agent ID
      return '67ebbdbaedcb4f4211053d4a';
    } catch (e) {
      return null;
    }
  }

  Map<String, dynamic> _getDefaultAgentDashboardData() {
    return {
      'agentName': 'Agent',
      'stats': {
        'totalProperties': 0,
        'totalLeads': 0,
        'totalInquiries': 0,
        'monthlyRevenue': 0,
      },
      'recentLeads': [],
      'properties': [],
    };
  }

  Future<List<Map<String, dynamic>>> getAgentProperties({int page = 1, int limit = 10}) async {
    try {
      final agentId = await _getCurrentAgentId();
      if (agentId == null) {
        return [];
      }
      
      final response = await HttpClient.get('/properties/agent/$agentId', query: {'page': page.toString(), 'limit': limit.toString()});
      if (response.statusCode == 200) {
        final data = response.data;
        return List<Map<String, dynamic>>.from((data is Map && data['data'] != null) ? data['data'] : []);
      }
      throw Exception('Failed to load agent properties. Status: ${response.statusCode}');
    } catch (e) {
      if (e.toString().contains('FormatException')) {
        throw Exception('Server returned invalid JSON. Please check your connection.');
      }
      throw Exception('Error: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getAgentLeads({int page = 1, int limit = 10}) async {
    try {
      // Server route provides agent contacts at /contacts/agent
      final response = await HttpClient.get('/contacts/agent', query: {'page': page.toString(), 'limit': limit.toString()});
      if (response.statusCode == 200) {
        final data = response.data;
        return List<Map<String, dynamic>>.from((data is Map && data['data'] is List) ? data['data'] : []);
      }
      throw Exception('Failed to load agent leads. Status: ${response.statusCode}');
    } catch (e) {
      if (e.toString().contains('FormatException')) {
        throw Exception('Server returned invalid JSON. Please check your connection.');
      }
      throw Exception('Error: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getAgentInquiries({int page = 1, int limit = 10}) async {
    try {
      // No distinct inquiries endpoint; reuse contacts for now
      final response = await HttpClient.get('/contacts/agent', query: {'page': page.toString(), 'limit': limit.toString()});
      if (response.statusCode == 200) {
        final data = response.data;
        return List<Map<String, dynamic>>.from((data is Map && data['data'] is List) ? data['data'] : []);
      }
      throw Exception('Failed to load agent inquiries. Status: ${response.statusCode}');
    } catch (e) {
      if (e.toString().contains('FormatException')) {
        throw Exception('Server returned invalid JSON. Please check your connection.');
      }
      throw Exception('Error: $e');
    }
  }

  Future<Map<String, dynamic>> getAgentAnalytics() async {
    try {
      // Not provided by server; synthesize simple analytics from properties count for now
      final props = await getAgentProperties(limit: 50);
      final response = { 'data': { 'monthlyRevenue': 0, 'propertyViews': 0, 'leadConversion': 0, 'responseTime': 0, 'totalProperties': props.length } };
      final data = response['data'];
      if (data is Map<String, dynamic>) return data;
      if (data is Map) return Map<String, dynamic>.from(data);
      return _getDefaultAnalyticsData();
    } catch (e) {
      print('Error in getAgentAnalytics: $e');
      // Return default data for any error to prevent app crashes
      return _getDefaultAnalyticsData();
    }
  }

  Map<String, dynamic> _getDefaultAnalyticsData() {
    return {
      'monthlyRevenue': 0,
      'propertyViews': 0,
      'leadConversion': 0,
      'responseTime': 0,
    };
  }

  Future<Map<String, dynamic>> updateContactStatus({
    required String contactId,
    required String status,
  }) async {
    try {
      final response = await HttpClient.put('/contacts/' + contactId, body: {
        'status': status,
      });
      if (response.statusCode == 200) {
        final data = response.data;
        if (data is Map<String, dynamic>) return data;
        if (data is Map) return Map<String, dynamic>.from(data);
        return {'success': true};
      }
      throw Exception('Failed to update contact status. Status: ' + response.statusCode.toString());
    } catch (e) {
      if (e.toString().contains('FormatException')) {
        throw Exception('Server returned invalid JSON. Please check your connection.');
      }
      throw Exception('Error: ' + e.toString());
    }
  }
}