import "package:flutter/material.dart";
import "package:intl/intl.dart";

class Utils {
  static String formatCurrency(double amount) {
    final formatter = NumberFormat.currency(symbol: "\$", decimalDigits: 0);
    return formatter.format(amount);
  }

  static DateTime _coerceToDateTime(dynamic value) {
    try {
      if (value == null) return DateTime.now();
      if (value is DateTime) return value;
      if (value is int) {
        final isSeconds = value.toString().length <= 10;
        return DateTime.fromMillisecondsSinceEpoch(isSeconds ? value * 1000 : value);
      }
      if (value is String) {
        final n = int.tryParse(value);
        if (n != null) {
          final isSeconds = value.length <= 10;
          return DateTime.fromMillisecondsSinceEpoch(isSeconds ? n * 1000 : n);
        }
        return DateTime.tryParse(value) ?? DateTime.now();
      }
      if (value is Map) {
        final map = Map<String, dynamic>.from(value as Map);
        if (map['seconds'] is int) return DateTime.fromMillisecondsSinceEpoch((map['seconds'] as int) * 1000);
        if (map['milliseconds'] is int) return DateTime.fromMillisecondsSinceEpoch(map['milliseconds'] as int);
        if (map['ms'] is int) return DateTime.fromMillisecondsSinceEpoch(map['ms'] as int);
        if (map['iso'] is String) return DateTime.tryParse(map['iso'] as String) ?? DateTime.now();
      }
      return DateTime.now();
    } catch (_) {
      return DateTime.now();
    }
  }

  static String formatDate(dynamic date) {
    final dt = _coerceToDateTime(date);
    final formatter = DateFormat("MMM dd, yyyy");
    return formatter.format(dt);
  }

  static String formatDateTime(dynamic date) {
    final dt = _coerceToDateTime(date);
    final formatter = DateFormat("MMM dd, yyyy HH:mm");
    return formatter.format(dt);
  }

  static void showSnackBar(BuildContext context, String message, {Color? backgroundColor}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: backgroundColor),
    );
  }

  static void showErrorSnackBar(BuildContext context, String message) {
    showSnackBar(context, message, backgroundColor: Colors.red);
  }

  static void showSuccessSnackBar(BuildContext context, String message) {
    showSnackBar(context, message, backgroundColor: Colors.green);
  }

  static Future<bool> showConfirmDialog(
    BuildContext context, {
    required String title,
    required String message,
    String confirmText = "Yes",
    String cancelText = "No",
  }) async {
    final result = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: Text(cancelText)),
          ElevatedButton(onPressed: () => Navigator.pop(context, true), child: Text(confirmText))
        ],
      ),
    );
    return result ?? false;
  }

  static String getInitials(String name) {
    final names = name.split(" ");
    if (names.length >= 2) {
      return "${names[0][0]}${names[1][0]}".toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : "";
  }

  static Color getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case "for sale":
        return Colors.green;
      case "for rent":
        return Colors.orange;
      case "sold":
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}
