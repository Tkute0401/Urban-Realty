import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../../services/admin_service.dart';
import '../../utils/file_saver.dart';

class AdminReportsScreen extends StatefulWidget {
  const AdminReportsScreen({super.key});

  @override
  State<AdminReportsScreen> createState() => _AdminReportsScreenState();
}

class _AdminReportsScreenState extends State<AdminReportsScreen> {
  final AdminService _adminService = AdminService();
  String _reportType = 'overview';
  String _dateRange = '30';
  String _startDate = '';
  String _endDate = '';
  String _email = '';
  String _subject = '';
  String _message = '';
  bool _loading = false;
  bool _working = false;
  String? _error;
  String? _success;
  Map<String, dynamic>? _reportData;

  final List<Map<String, String>> _reportTypes = const [
    {'value': 'overview', 'label': 'Overview'},
    {'value': 'users', 'label': 'Users'},
    {'value': 'properties', 'label': 'Properties'},
    {'value': 'revenue', 'label': 'Revenue'},
    {'value': 'agents', 'label': 'Agents'},
    {'value': 'inquiries', 'label': 'Inquiries'},
    {'value': 'subscriptions', 'label': 'Subscriptions'},
    {'value': 'locations', 'label': 'Locations'},
  ];

  final List<Map<String, String>> _dateRanges = const [
    {'value': '7', 'label': 'Last 7 days'},
    {'value': '30', 'label': 'Last 30 days'},
    {'value': '90', 'label': 'Last 90 days'},
    {'value': '365', 'label': 'Last year'},
    {'value': 'custom', 'label': 'Custom'},
  ];

  @override
  void initState() {
    super.initState();
    _generate();
  }

  Future<void> _generate() async {
    setState(() { _loading = true; _error = null; _success = null; });
    try {
      final data = await _adminService.generateReport(
        type: _reportType,
        dateRange: _dateRange,
        startDate: _dateRange == 'custom' ? _startDate : null,
        endDate: _dateRange == 'custom' ? _endDate : null,
      );
      setState(() { _reportData = data; });
    } catch (e) {
      setState(() { _error = 'Failed to generate report'; });
    } finally {
      setState(() { _loading = false; });
    }
  }

  Future<void> _export(String format) async {
    setState(() { _working = true; _error = null; _success = null; });
    try {
      final bytes = await _adminService.exportReport(
        type: _reportType,
        format: format,
        dateRange: _dateRange,
        startDate: _dateRange == 'custom' ? _startDate : null,
        endDate: _dateRange == 'custom' ? _endDate : null,
      );
      final savedPath = await FileSaver.saveBytes(
        bytes: bytes,
        fileName: '${_reportType}_report_${DateTime.now().toIso8601String().replaceAll(':', '-')}.${format == 'excel' ? 'xlsx' : format}',
        subdirectory: 'UrbanRealty/Reports',
      );
      setState(() { _success = 'Report saved to: $savedPath'; });
    } catch (e) {
      setState(() { _error = 'Failed to export report'; });
    } finally {
      setState(() { _working = false; });
    }
  }

  Future<void> _emailReport() async {
    setState(() { _working = true; _error = null; _success = null; });
    try {
      if (_email.trim().isEmpty) {
        setState(() { _error = 'Please enter recipient email'; });
        return;
      }
      final res = await _adminService.emailReport(
        email: _email.trim(),
        subject: _subject.trim().isEmpty ? 'Report: $_reportType' : _subject.trim(),
        message: _message.trim().isEmpty ? 'Please find the attached report.' : _message.trim(),
        type: _reportType,
        dateRange: _dateRange,
        startDate: _dateRange == 'custom' ? _startDate : null,
        endDate: _dateRange == 'custom' ? _endDate : null,
      );
      if (res['success'] == true) {
        setState(() { _success = 'Report emailed successfully'; });
      } else {
        setState(() { _error = res['message'] ?? 'Failed to email report'; });
      }
    } catch (e) {
      setState(() { _error = 'Failed to email report'; });
    } finally {
      setState(() { _working = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Admin Reports')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
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
            Row(
              children: [
                Expanded(child: _buildDropdown(
                  label: 'Report Type',
                  value: _reportType,
                  items: _reportTypes.map((e) => e['value']!).toList(),
                  labels: { for (final e in _reportTypes) e['value']!: e['label']! },
                  onChanged: (v) { setState(() { _reportType = v; }); _generate(); },
                )),
                const SizedBox(width: 12),
                Expanded(child: _buildDropdown(
                  label: 'Date Range',
                  value: _dateRange,
                  items: _dateRanges.map((e) => e['value']!).toList(),
                  labels: { for (final e in _dateRanges) e['value']!: e['label']! },
                  onChanged: (v) { setState(() { _dateRange = v; }); _generate(); },
                )),
              ],
            ),
            if (_dateRange == 'custom')
              Row(
                children: [
                  Expanded(child: TextField(
                    decoration: const InputDecoration(labelText: 'Start Date (YYYY-MM-DD)'),
                    onChanged: (v) => _startDate = v,
                  )),
                  const SizedBox(width: 12),
                  Expanded(child: TextField(
                    decoration: const InputDecoration(labelText: 'End Date (YYYY-MM-DD)'),
                    onChanged: (v) => _endDate = v,
                  )),
                ],
              ),
            const SizedBox(height: 12),
            const Text('Email Report', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            TextField(
              decoration: const InputDecoration(labelText: 'Recipient Email'),
              keyboardType: TextInputType.emailAddress,
              onChanged: (v) => _email = v,
            ),
            const SizedBox(height: 8),
            TextField(
              decoration: const InputDecoration(labelText: 'Subject (optional)'),
              onChanged: (v) => _subject = v,
            ),
            const SizedBox(height: 8),
            TextField(
              decoration: const InputDecoration(labelText: 'Message (optional)'),
              maxLines: 3,
              onChanged: (v) => _message = v,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                ElevatedButton(
                  onPressed: _loading ? null : _generate,
                  child: Text(_loading ? 'Loading...' : 'Generate'),
                ),
                const SizedBox(width: 12),
                OutlinedButton(
                  onPressed: _working ? null : () => _export('csv'),
                  child: const Text('Export CSV'),
                ),
                const SizedBox(width: 8),
                OutlinedButton(
                  onPressed: _working ? null : () => _export('pdf'),
                  child: const Text('Export PDF'),
                ),
                const SizedBox(width: 8),
                OutlinedButton(
                  onPressed: _working ? null : _emailReport,
                  child: const Text('Email Report'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Expanded(
              child: _loading
                  ? const Center(child: CircularProgressIndicator())
                  : _reportData == null
                      ? const Center(child: Text('No report data'))
                      : SingleChildScrollView(
                          child: Text(const JsonEncoder.withIndent('  ').convert(_reportData)),
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDropdown({
    required String label,
    required String value,
    required List<String> items,
    required Map<String, String> labels,
    required ValueChanged<String> onChanged,
  }) {
    return DropdownButtonFormField<String>(
      decoration: InputDecoration(labelText: label),
      value: value,
      onChanged: (v) { if (v != null) onChanged(v); },
      items: items
          .map((e) => DropdownMenuItem<String>(value: e, child: Text(labels[e] ?? e)))
          .toList(),
    );
  }
}

