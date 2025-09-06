import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable{
  const Failure([List properties = const<dynamic>[]]);

  @override
      List<Object?> get props => [];
}

//General failures
class ServerFailure extends Failure {
  final String message;
  ServerFailure({this.message = 'Server Failure'}) : super([message]);

  @override
  List<Object?> get props => [message];
}

class CacheFailure extends Failure {}

class NetworkFailure extends Failure {
  final String message;
  NetworkFailure({this.message = 'Network Failure'}) : super([message]);

  @override
  List<Object?> get props => [message];
}

// class SocketFailure extends Failure {}