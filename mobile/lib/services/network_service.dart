import 'dart:io';
import 'package:connectivity_plus/connectivity_plus.dart';

class NetworkService {
  static Future<bool> hasInternetConnection() async {
    try {
      final connectivityResult = await Connectivity().checkConnectivity();
      if (connectivityResult == ConnectivityResult.none) {
        return false;
      }
      
      // Try to connect to a reliable host
      final result = await InternetAddress.lookup('google.com');
      return result.isNotEmpty && result[0].rawAddress.isNotEmpty;
    } catch (e) {
      return false;
    }
  }
  
  static Future<bool> isServerReachable(String baseUrl) async {
    try {
      final uri = Uri.parse(baseUrl);
      final socket = await Socket.connect(uri.host, uri.port, timeout: const Duration(seconds: 5));
      await socket.close();
      return true;
    } catch (e) {
      return false;
    }
  }
  
  static String getNetworkErrorMessage(dynamic error) {
    if (error.toString().contains('Connection refused')) {
      return 'Server is not reachable. Please check your connection or try again later.';
    } else if (error.toString().contains('SocketException')) {
      return 'Network connection failed. Please check your internet connection.';
    } else if (error.toString().contains('TimeoutException')) {
      return 'Request timed out. Please try again.';
    } else if (error.toString().contains('HttpException')) {
      return 'Server error occurred. Please try again later.';
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  }
}