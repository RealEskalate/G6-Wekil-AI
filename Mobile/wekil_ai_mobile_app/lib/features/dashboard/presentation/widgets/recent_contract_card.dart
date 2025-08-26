import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../domain/entities/contract.dart';

class RecentContractCard extends StatelessWidget {
  final Contract contract;
  final VoidCallback? onTap;
  final VoidCallback? onEdit;
  const RecentContractCard({
    super.key,
    required this.contract,
    this.onTap,
    this.onEdit,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final border = theme.dividerColor.withOpacity(.25);
    final dateStr = DateFormat('dd MMM yyyy').format(contract.createdAt);
    final amountStr = NumberFormat('#,##0').format(contract.amount);

    Color statusColor;
    switch (contract.status) {
      case ContractStatus.draft:
        statusColor = const Color(0xFF3B82F6); // blue
        break;
      case ContractStatus.exported:
        statusColor = const Color(0xFF10B981); // green
        break;
      case ContractStatus.signed:
        statusColor = const Color(0xFF14B8A6); // teal
        break;
    }

    return InkWell(
      borderRadius: BorderRadius.circular(14),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: border),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                _Pill(label: contract.type, color: const Color(0xFF3B82F6)),
                const SizedBox(width: 8),
                _Pill(
                  label: contract.status.name,
                  color: statusColor,
                  lowercase: true,
                ),
                const Spacer(),
                _EditIcon(onPressed: onEdit),
              ],
            ),
            const SizedBox(height: 10),
            Text(
              contract.title,
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Text(
              contract.party,
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.hintColor,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                const Icon(Icons.event, size: 16, color: Colors.grey),
                const SizedBox(width: 6),
                Text(dateStr, style: theme.textTheme.bodySmall),
                const SizedBox(width: 16),
                const Icon(Icons.attach_money, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text(
                  '$amountStr ${contract.currency}',
                  style: theme.textTheme.bodySmall?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _Pill extends StatelessWidget {
  final String label;
  final Color color;
  final bool lowercase;
  const _Pill({
    required this.label,
    required this.color,
    this.lowercase = false,
  });

  @override
  Widget build(BuildContext context) {
    final text = lowercase ? label.toLowerCase() : label;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(.2)),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color.darken(0.1),
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class _EditIcon extends StatelessWidget {
  final VoidCallback? onPressed;
  const _EditIcon({this.onPressed});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return InkResponse(
      onTap: onPressed,
      radius: 18,
      child: Container(
        width: 32,
        height: 28,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: theme.dividerColor.withOpacity(.25)),
        ),
        child: const Icon(Icons.edit_outlined, size: 16),
      ),
    );
  }
}

extension on Color {
  Color darken([double amount = .1]) {
    assert(amount >= 0 && amount <= 1);
    final hsl = HSLColor.fromColor(this);
    final hslDark = hsl.withLightness((hsl.lightness - amount).clamp(0.0, 1.0));
    return hslDark.toColor();
  }
}
