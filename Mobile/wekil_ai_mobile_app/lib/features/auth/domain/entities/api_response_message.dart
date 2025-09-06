import 'package:equatable/equatable.dart';

class ApiResponseMessage extends Equatable {
  final String message;
  final bool? success;
  final String? code;

  const ApiResponseMessage({required this.message, this.success, this.code});
  
  @override
  List<Object?> get props => [message, success, code];
}
