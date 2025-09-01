import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final emailController = TextEditingController();
    final passwordController = TextEditingController();
    final formKey = GlobalKey<FormState>();

    void submit() {
      if (!formKey.currentState!.validate()) return;
      
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      authProvider.login(
        emailController.text.trim(),
        passwordController.text,
      );
    }

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              theme.colorScheme.primary.withOpacity(0.1),
              theme.colorScheme.primaryContainer.withOpacity(0.1),
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
                child: Form(
                  key: formKey,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // App Logo and Title
                      // ... (UI code from previous version can be kept, it's good)

                      const SizedBox(height: 48),

                      // Login Form
                      Card(
                        elevation: 8,
                        shadowColor: theme.shadowColor.withOpacity(0.1),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(24),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(32.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Text(
                                'Welcome Back',
                                style: theme.textTheme.headlineMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Sign in to continue',
                                style: theme.textTheme.bodyMedium?.copyWith(
                                  color: theme.colorScheme.onSurfaceVariant,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 32),
                              
                              // Email Field
                              TextFormField(
                                controller: emailController,
                                decoration: InputDecoration(
                                  labelText: 'Email',
                                  prefixIcon: Icon(Icons.email_outlined, color: theme.colorScheme.primary),
                                ),
                                keyboardType: TextInputType.emailAddress,
                                validator: (value) {
                                  if (value == null || !value.contains('@')) {
                                    return 'Please enter a valid email';
                                  }
                                  return null;
                                },
                              ),
                              
                              const SizedBox(height: 20),
                              
                              // Password Field
                              TextFormField(
                                controller: passwordController,
                                decoration: InputDecoration(
                                  labelText: 'Password',
                                  prefixIcon: Icon(Icons.lock_outline, color: theme.colorScheme.primary),
                                ),
                                obscureText: true,
                                validator: (value) {
                                  if (value == null || value.length < 6) {
                                    return 'Password must be at least 6 characters';
                                  }
                                  return null;
                                },
                              ),
                              
                              const SizedBox(height: 24),
                              
                              // Error Message
                              Consumer<AuthProvider>(
                                builder: (context, auth, child) {
                                  if (auth.error != null) {
                                    return Container(
                                      padding: const EdgeInsets.all(12),
                                      decoration: BoxDecoration(
                                        color: theme.colorScheme.errorContainer,
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        auth.error!,
                                        style: TextStyle(color: theme.colorScheme.error),
                                        textAlign: TextAlign.center,
                                      ),
                                    );
                                  } else {
                                    return const SizedBox.shrink();
                                  }
                                },
                              ),
                              
                              const SizedBox(height: 24),
                              
                              // Login Button
                              Consumer<AuthProvider>(
                                builder: (context, auth, child) {
                                  return SizedBox(
                                    height: 56,
                                    child: ElevatedButton(
                                      onPressed: auth.isLoading ? null : submit,
                                      child: auth.isLoading
                                          ? const CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Colors.white)) 
                                          : const Text('Sign In'),
                                    ),
                                  );
                                },
                              ),
                              
                              const SizedBox(height: 24),
                              
                              // Sign Up Link
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Text("Don't have an account? "),
                                  TextButton(
                                    onPressed: () => Navigator.of(context).pushNamed('/register'),
                                    child: const Text('Sign Up'),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}