import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';

/// Represents the authentication state
class AuthState {
  final User? user;
  final String? token;
  final String? error;
  final bool isLoading;

  const AuthState({
    this.user,
    this.token,
    this.error,
    this.isLoading = false,
  });

  AuthState copyWith({
    User? user,
    String? token,
    String? error,
    bool? isLoading,
  }) {
    return AuthState(
      user: user ?? this.user,
      token: token ?? this.token,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

/// Authentication Notifier
class AuthNotifier extends StateNotifier<AuthState> {
  final AuthService _authService;

  AuthNotifier(this._authService) : super(const AuthState(isLoading: true)) {
    _loadUser();
  }

  Future<void> _loadUser() async {
    try {
      final user = await _authService.getCurrentUser();
      state = state.copyWith(user: user, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<AuthResult> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final result = await _authService.login(email, password);
      if (result.isSuccess) {
        state = state.copyWith(user: result.user, token: result.token, isLoading: false);
      } else {
        state = state.copyWith(error: result.message, isLoading: false);
      }
      return result;
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
      return AuthResult.error('Login failed: ${e.toString()}');
    }
  }

  Future<AuthResult> register({
    required String name,
    required String email,
    required String password,
    required String phone,
    String role = 'user',
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final result = await _authService.register(
        name: name,
        email: email,
        password: password,
        phone: phone,
        role: role,
      );
      if (result.isSuccess) {
        state = state.copyWith(user: result.user, token: result.token, isLoading: false);
      } else {
        state = state.copyWith(error: result.message, isLoading: false);
      }
      return result;
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
      return AuthResult.error('Registration failed: ${e.toString()}');
    }
  }

  Future<void> logout() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _authService.logout();
      state = state.copyWith(user: null, token: null, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }
}

final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService();
});

final authServiceProvider = Provider<AuthService>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return AuthService(apiService: apiService);
});

final authStateProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authService = ref.watch(authServiceProvider);
  return AuthNotifier(authService);
});
