class Party {
  final String name;
  final String? phone;
  final String? email;

  Party({required this.name, required this.phone, required this.email});
    @override
  String toString() {
    return 'Party(name: $name, role: $phone, email: $email)';
  }
}
