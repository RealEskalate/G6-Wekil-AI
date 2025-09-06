import 'package:equatable/equatable.dart';

class LoginInput extends Equatable {
  final String email;
  final String password;
  const LoginInput({required this.email, required this.password});
  
  @override
  
  List<Object?> get props => [email, password];
}
