import 'dart:io';

void main() async {
  // Fix profile_service.dart
  await fixFile('lib/services/profile_service.dart');
  
  // Fix mappls_service.dart
  await fixFile('lib/services/mappls_service.dart');
  
  print('Fixed ApiResponse calls in all files');
}

Future<void> fixFile(String filePath) async {
  final file = File(filePath);
  if (!await file.exists()) {
    print('File $filePath does not exist');
    return;
  }
  
  String content = await file.readAsString();
  
  // Fix ApiResponse.success calls
  content = content.replaceAllMapped(
    RegExp(r'ApiResponse\.success\(data: ([^,)]+)\);'),
    (match) => 'ApiResponse.success(\n          data: ${match.group(1)},\n          message: \'Success\',\n        );',
  );
  
  content = content.replaceAllMapped(
    RegExp(r'ApiResponse\.success\(\);'),
    (match) => 'ApiResponse.success(\n          data: null,\n          message: \'Success\',\n        );',
  );
  
  // Fix ApiResponse.error calls
  content = content.replaceAllMapped(
    RegExp(r'ApiResponse\.error\(([^)]+)\);'),
    (match) {
      final param = match.group(1)!;
      if (param.contains('message:') && param.contains('statusCode:')) {
        return 'ApiResponse.error($param);';
      } else if (param.contains('message:')) {
        return 'ApiResponse.error($param, statusCode: 500);';
      } else {
        return 'ApiResponse.error(message: $param, statusCode: 500);';
      }
    },
  );
  
  await file.writeAsString(content);
  print('Fixed $filePath');
}


