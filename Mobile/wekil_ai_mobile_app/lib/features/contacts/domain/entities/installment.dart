class Installment {
  double? amount;      // installment amount
  DateTime? dueDate;   // due date
  String? description; // e.g., "Monthly", "Every 3 months", etc.

  Installment({
    this.amount,
    this.dueDate,
    this.description,
  });
}