import 'package:equatable/equatable.dart';

class UserProfile extends Equatable {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String? middleName;
  final String telephone;
  final String? address;
  final String accountType;
  final bool isVerified;
  final String? profileImage;
  final String? signature;

  const UserProfile({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    this.middleName,
    required this.telephone,
    this.address,
    required this.accountType,
    required this.isVerified,
    this.profileImage,
    this.signature,
  });

  @override
  List<Object?> get props => [
    id,
    email,
    firstName,
    lastName,
    middleName,
    telephone,
    address,
    accountType,
    isVerified,
    profileImage,
    signature,
  ];
}
