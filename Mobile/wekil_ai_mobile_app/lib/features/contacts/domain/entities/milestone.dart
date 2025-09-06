class Milestone {
  String? description; // what the milestone is about
  double? amount;      // optional amount associated with milestone
  DateTime? dueDate;   // when it's due

  Milestone({
    this.description,
    this.amount,
    this.dueDate,
  });
  @override
  String toString(){
    return 'Milestone (description: $description amount: $amount dueDate: $dueDate';
  }
}