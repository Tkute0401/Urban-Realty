import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:math';

class EMICalculatorScreen extends StatefulWidget {
  const EMICalculatorScreen({super.key});

  @override
  State<EMICalculatorScreen> createState() => _EMICalculatorScreenState();
}

class _EMICalculatorScreenState extends State<EMICalculatorScreen> {
  final _formKey = GlobalKey<FormState>();
  final _loanAmountController = TextEditingController();
  final _interestRateController = TextEditingController();
  final _loanTenureController = TextEditingController();
  
  double _emiAmount = 0;
  double _totalAmount = 0;
  double _totalInterest = 0;
  bool _isCalculated = false;

  @override
  void dispose() {
    _loanAmountController.dispose();
    _interestRateController.dispose();
    _loanTenureController.dispose();
    super.dispose();
  }

  void _calculateEMI() {
    if (!_formKey.currentState!.validate()) return;

    final principal = double.parse(_loanAmountController.text);
    final rate = double.parse(_interestRateController.text);
    final tenure = double.parse(_loanTenureController.text);

    // Convert annual rate to monthly rate
    final monthlyRate = rate / (12 * 100);
    final tenureInMonths = tenure * 12;

    // EMI calculation formula
    final emi = (principal * monthlyRate * pow(1 + monthlyRate, tenureInMonths)) /
        (pow(1 + monthlyRate, tenureInMonths) - 1);

    final totalAmount = emi * tenureInMonths;
    final totalInterest = totalAmount - principal;

    setState(() {
      _emiAmount = emi;
      _totalAmount = totalAmount;
      _totalInterest = totalInterest;
      _isCalculated = true;
    });
  }

  void _resetCalculator() {
    _loanAmountController.clear();
    _interestRateController.clear();
    _loanTenureController.clear();
    setState(() {
      _emiAmount = 0;
      _totalAmount = 0;
      _totalInterest = 0;
      _isCalculated = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('EMI Calculator'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _resetCalculator,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildInputSection(),
              const SizedBox(height: 24),
              if (_isCalculated) _buildResultSection(),
              const SizedBox(height: 24),
              _buildActionButtons(),
              const SizedBox(height: 24),
              _buildInfoSection(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildInputSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Loan Details',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _loanAmountController,
              decoration: const InputDecoration(
                labelText: 'Loan Amount (₹)',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.currency_rupee),
                hintText: 'Enter loan amount',
              ),
              keyboardType: TextInputType.number,
              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter loan amount';
                }
                final amount = double.tryParse(value);
                if (amount == null || amount <= 0) {
                  return 'Please enter a valid amount';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _interestRateController,
              decoration: const InputDecoration(
                labelText: 'Interest Rate (% per annum)',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.percent),
                hintText: 'Enter interest rate',
              ),
              keyboardType: TextInputType.number,
              inputFormatters: [
                FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d*')),
              ],
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter interest rate';
                }
                final rate = double.tryParse(value);
                if (rate == null || rate <= 0) {
                  return 'Please enter a valid interest rate';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _loanTenureController,
              decoration: const InputDecoration(
                labelText: 'Loan Tenure (Years)',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.calendar_today),
                hintText: 'Enter loan tenure',
              ),
              keyboardType: TextInputType.number,
              inputFormatters: [
                FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d*')),
              ],
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter loan tenure';
                }
                final tenure = double.tryParse(value);
                if (tenure == null || tenure <= 0) {
                  return 'Please enter a valid tenure';
                }
                return null;
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultSection() {
    return Card(
      color: Theme.of(context).primaryColor.withOpacity(0.1),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'EMI Calculation Results',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildResultRow(
              'Monthly EMI',
              '₹${_emiAmount.toStringAsFixed(2)}',
              Icons.payment,
              Colors.green,
            ),
            const SizedBox(height: 12),
            _buildResultRow(
              'Total Amount',
              '₹${_totalAmount.toStringAsFixed(2)}',
              Icons.account_balance_wallet,
              Colors.blue,
            ),
            const SizedBox(height: 12),
            _buildResultRow(
              'Total Interest',
              '₹${_totalInterest.toStringAsFixed(2)}',
              Icons.trending_up,
              Colors.orange,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildResultRow(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.grey,
                  ),
                ),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    return Row(
      children: [
        Expanded(
          child: ElevatedButton.icon(
            onPressed: _calculateEMI,
            icon: const Icon(Icons.calculate),
            label: const Text('Calculate EMI'),
            style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: OutlinedButton.icon(
            onPressed: _resetCalculator,
            icon: const Icon(Icons.refresh),
            label: const Text('Reset'),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildInfoSection() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'About EMI Calculator',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            const Text(
              'EMI (Equated Monthly Installment) is the fixed payment amount made by a borrower to a lender at a specified date each calendar month.',
              style: TextStyle(fontSize: 14),
            ),
            const SizedBox(height: 8),
            const Text(
              'Formula: EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]',
              style: TextStyle(
                fontSize: 12,
                fontFamily: 'monospace',
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Where: P = Principal, R = Monthly Interest Rate, N = Number of months',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

extension on double {
  double pow(int exponent) {
    double result = 1;
    for (int i = 0; i < exponent; i++) {
      result *= this;
    }
    return result;
  }
}