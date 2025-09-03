import 'http_client.dart';

class AgentService {
  static final AgentService _instance = AgentService._internal();
  factory AgentService() => _instance;
  AgentService._internal();



  Future<Map<String, dynamic>> getAgentDashboard() async {
    try {
      final response = await HttpClient.get('/agent/dashboard');
      if (response.statusCode == 200) {
        final data = response.data;
        if (data is Map<String, dynamic>) return data;
        if (data is Map) return Map<String, dynamic>.from(data);
        if (data is String) {
          print('Warning: Server returned string instead of JSON: $data');
          return _getDefaultAgentDashboardData();
        }
        // Return default data for unexpected formats
        print('Warning: Unexpected response format: ${data.runtimeType}');
        return _getDefaultAgentDashboardData();
      }
      throw Exception('Failed to load agent dashboard. Status: ${response.statusCode}');
    } catch (e) {
      print('Error in getAgentDashboard: $e');
      // Return default data for any error to prevent app crashes
      return _getDefaultAgentDashboardData();
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
    };
  }

  Future<List<Map<String, dynamic>>> getAgentProperties({int page = 1, int limit = 10}) async {
    try {
      final response = await HttpClient.get('/agent/properties', query: {'page': page.toString(), 'limit': limit.toString()});
      if (response.statusCode == 200) {
        final data = response.data;
        return List<Map<String, dynamic>>.from((data is Map && data['properties'] != null) ? data['properties'] : []);
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
      final response = await HttpClient.get('/agent/leads', query: {'page': page.toString(), 'limit': limit.toString()});
      if (response.statusCode == 200) {
        final data = response.data;
        return List<Map<String, dynamic>>.from((data is Map && data['leads'] != null) ? data['leads'] : []);
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
      final response = await HttpClient.get('/agent/inquiries', query: {'page': page.toString(), 'limit': limit.toString()});
      if (response.statusCode == 200) {
        final data = response.data;
        return List<Map<String, dynamic>>.from((data is Map && data['inquiries'] != null) ? data['inquiries'] : []);
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
      final response = await HttpClient.get('/agent/analytics');
      if (response.statusCode == 200) {
        final data = response.data;
        if (data is Map<String, dynamic>) return data;
        if (data is Map) return Map<String, dynamic>.from(data);
        if (data is String) {
          print('Warning: Server returned string instead of JSON: $data');
          return _getDefaultAnalyticsData();
        }
        // Return default data for unexpected formats
        print('Warning: Unexpected response format: ${data.runtimeType}');
        return _getDefaultAnalyticsData();
      }
      throw Exception('Failed to load agent analytics. Status: ${response.statusCode}');
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
}