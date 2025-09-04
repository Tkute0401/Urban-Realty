import 'package:flutter/material.dart';
import '../../services/admin_service.dart';

class AdminSettingsScreen extends StatefulWidget {
  const AdminSettingsScreen({super.key});

  @override
  State<AdminSettingsScreen> createState() => _AdminSettingsScreenState();
}

class _AdminSettingsScreenState extends State<AdminSettingsScreen> {
  final AdminService _adminService = AdminService();
  bool _loading = true;
  bool _saving = false;
  Map<String, dynamic> _settings = {};
  String? _error;
  String? _success;

  @override
  void initState() {
    super.initState();
    _fetchSettings();
  }

  Future<void> _fetchSettings() async {
    setState(() { _loading = true; _error = null; });
    try {
      final data = await _adminService.getSettings();
      setState(() { _settings = data; });
    } catch (e) {
      setState(() { _error = 'Failed to load settings'; });
    } finally {
      setState(() { _loading = false; });
    }
  }

  Future<void> _saveSettings() async {
    setState(() { _saving = true; _error = null; _success = null; });
    try {
      final res = await _adminService.updateSettings(_settings);
      if ((res['success'] == true)) {
        setState(() { _success = 'Settings saved successfully'; });
      } else {
        setState(() { _error = res['message'] ?? 'Failed to save settings'; });
      }
    } catch (e) {
      setState(() { _error = 'Failed to save settings'; });
    } finally {
      setState(() { _saving = false; });
    }
  }

  Future<void> _createBackup() async {
    setState(() { _error = null; _success = null; });
    try {
      final res = await _adminService.createBackup();
      if (res['success'] == true) {
        setState(() { _success = 'Backup created successfully'; });
      } else {
        setState(() { _error = res['message'] ?? 'Failed to create backup'; });
      }
    } catch (e) {
      setState(() { _error = 'Failed to create backup'; });
    }
  }

  Future<void> _restoreBackup(String backupId) async {
    setState(() { _error = null; _success = null; });
    try {
      final res = await _adminService.restoreFromBackup(backupId);
      if (res['success'] == true) {
        setState(() { _success = 'System restored successfully'; });
        await _fetchSettings();
      } else {
        setState(() { _error = res['message'] ?? 'Failed to restore system'; });
      }
    } catch (e) {
      setState(() { _error = 'Failed to restore system'; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Admin Settings')),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  if (_error != null)
                    Container(
                      width: double.infinity,
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(12),
                      color: Colors.red.shade50,
                      child: Text(_error!, style: const TextStyle(color: Colors.red)),
                    ),
                  if (_success != null)
                    Container(
                      width: double.infinity,
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(12),
                      color: Colors.green.shade50,
                      child: Text(_success!, style: const TextStyle(color: Colors.green)),
                    ),
                  Expanded(
                    child: ListView(
                      children: [
                        _buildSwitch(
                          title: 'Maintenance Mode',
                          path: ['general', 'maintenanceMode'],
                          defaultValue: false,
                        ),
                        _buildSwitch(
                          title: 'Allow User Registration',
                          path: ['general', 'allowRegistration'],
                          defaultValue: true,
                        ),
                        _buildSwitch(
                          title: 'Require Email Verification',
                          path: ['general', 'requireEmailVerification'],
                          defaultValue: true,
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton(
                                onPressed: _saving ? null : _saveSettings,
                                child: Text(_saving ? 'Saving...' : 'Save Settings'),
                              ),
                            ),
                          ],
                        ),
                        const Divider(height: 32),
                        const Text('System Management', style: TextStyle(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton(
                                onPressed: _createBackup,
                                child: const Text('Create Backup'),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: OutlinedButton(
                                onPressed: () => _restoreBackup('latest'),
                                child: const Text('Restore Latest'),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildSwitch({required String title, required List<String> path, required bool defaultValue}) {
    final bool value = _readBool(path, defaultValue);
    return SwitchListTile(
      title: Text(title),
      value: value,
      onChanged: (v) {
        _write(path, v);
        setState(() {});
      },
    );
  }

  bool _readBool(List<String> path, bool fallback) {
    dynamic cursor = _settings;
    for (final key in path) {
      if (cursor is Map && cursor.containsKey(key)) {
        cursor = cursor[key];
      } else {
        return fallback;
      }
    }
    return cursor is bool ? cursor : fallback;
  }

  void _write(List<String> path, dynamic value) {
    Map<String, dynamic> cursor = _settings;
    for (int i = 0; i < path.length; i++) {
      final key = path[i];
      if (i == path.length - 1) {
        cursor[key] = value;
      } else {
        cursor[key] = (cursor[key] is Map<String, dynamic>) ? cursor[key] : <String, dynamic>{};
        cursor = cursor[key] as Map<String, dynamic>;
      }
    }
  }
}

