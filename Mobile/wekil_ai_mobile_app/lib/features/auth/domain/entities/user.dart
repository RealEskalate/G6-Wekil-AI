import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String firstName;
  final String lastName;
  final String? middleName;
  final String email;
  final String telephone;

  const User({
    required this.firstName,
    required this.lastName,
    this.middleName,
    required this.email,
    required this.telephone,
  });

  @override
  List<Object?> get props => [
    firstName,
    lastName,
    middleName,
    email,
    telephone,
  ];
}