import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../shared/providers/auth_provider.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  String _selectedRole = "buyer";

  void _register() {
    if (_formKey.currentState!.validate()) {
      context.read<AuthProvider>().register(
            name: _nameController.text,
            email: _emailController.text,
            password: _passwordController.text,
            role: _selectedRole,
          );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              theme.colorScheme.primary.withValues(alpha: 0.1),
              theme.colorScheme.primaryContainer.withValues(alpha: 0.1),
              theme.colorScheme.surface,
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      'Create Account',
                      style: theme.textTheme.displaySmall?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: theme.colorScheme.primary,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Join Urban Realty today',
                      style: theme.textTheme.bodyLarge?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 48),
                    Card(
                      elevation: 8,
                      shadowColor: theme.shadowColor.withValues(alpha: 0.1),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(24),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(32.0),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              TextFormField(
                                controller: _nameController,
                                decoration: const InputDecoration(labelText: 'Full Name'),
                                validator: (value) => value!.isEmpty ? 'Please enter your name' : null,
                              ),
                              const SizedBox(height: 20),
                              TextFormField(
                                controller: _emailController,
                                decoration: const InputDecoration(labelText: 'Email'),
                                keyboardType: TextInputType.emailAddress,
                                validator: (value) => (value == null || !value.contains('@')) ? 'Enter a valid email' : null,
                              ),
                              const SizedBox(height: 20),
                              TextFormField(
                                controller: _passwordController,
                                decoration: const InputDecoration(labelText: 'Password'),
                                obscureText: true,
                                validator: (value) => (value == null || value.length < 6) ? 'Password must be at least 6 characters' : null,
                              ),
                              const SizedBox(height: 20),
                              DropdownButtonFormField<String>(
                                initialValue: _selectedRole,
                                decoration: const InputDecoration(labelText: 'I am a...'),
                                items: const [
                                  DropdownMenuItem(value: "buyer", child: Text("Buyer")),
                                  DropdownMenuItem(value: "individual_seller", child: Text("Seller")),
                                  DropdownMenuItem(value: "agent", child: Text("Agent")),
                                  DropdownMenuItem(value: "developer", child: Text("Developer")),
                                ],
                                onChanged: (value) {
                                  setState(() {
                                    _selectedRole = value!;
                                  });
                                },
                              ),
                              const SizedBox(height: 24),
                              Consumer<AuthProvider>(
                                builder: (context, auth, child) {
                                  if (auth.error != null) {
                                    return Text(auth.error!, style: TextStyle(color: theme.colorScheme.error), textAlign: TextAlign.center);
                                  }
                                  return const SizedBox.shrink();
                                },
                              ),
                              const SizedBox(height: 24),
                              Consumer<AuthProvider>(
                                builder: (context, auth, child) {
                                  return SizedBox(
                                    height: 56,
                                    child: ElevatedButton(
                                      onPressed: auth.isLoading ? null : _register,
                                      child: auth.isLoading ? const CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Colors.white)) : const Text('Create Account'),
                                    ),
                                  );
                                },
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text("Already have an account? "),
                        TextButton(
                          onPressed: () => Navigator.of(context).pop(),
                          child: const Text('Sign In'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
