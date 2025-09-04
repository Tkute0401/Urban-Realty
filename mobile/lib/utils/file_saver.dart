import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart';

class FileSaver {
  static Future<String> saveBytes({
    required List<int> bytes,
    required String fileName,
    String? subdirectory,
  }) async {
    final Directory baseDir = await _getBaseDirectory();
    final Directory targetDir = subdirectory == null
        ? baseDir
        : Directory('${baseDir.path}/$subdirectory');
    if (!await targetDir.exists()) {
      await targetDir.create(recursive: true);
    }
    final String safeName = fileName.replaceAll(RegExp(r"[^A-Za-z0-9._-]"), "_");
    final String fullPath = '${targetDir.path}/$safeName';
    final File file = File(fullPath);
    await file.writeAsBytes(bytes, flush: true);
    return fullPath;
  }

  static Future<Directory> _getBaseDirectory() async {
    if (Platform.isAndroid) {
      // Use Downloads directory when possible (Android 10+ scoped storage can still allow app-specific directories)
      final Directory? downloads = await getDownloadsDirectory();
      if (downloads != null) return downloads;
      final Directory ext = (await getExternalStorageDirectory())!;
      return ext;
    }
    if (Platform.isIOS || Platform.isMacOS) {
      return await getApplicationDocumentsDirectory();
    }
    // Fallback for other platforms
    return await getTemporaryDirectory();
  }
}

