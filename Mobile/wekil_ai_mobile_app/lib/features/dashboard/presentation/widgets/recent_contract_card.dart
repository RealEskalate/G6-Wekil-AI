import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:wekil_ai_mobile_app/core/ui/app_svg_icon.dart';

import '../../domain/entities/agreement.dart';

class RecentContractCard extends StatelessWidget {
  final Agreement contract;
  final VoidCallback? onTap;
  final VoidCallback? onEdit;
  const RecentContractCard({
    super.key,
    required this.contract,
    this.onTap,
    this.onEdit,
  });

  String _typeLabel(Agreement a) {
    switch (a.type) {
      case AgreementType.service:
        return 'Service';
      case AgreementType.sales:
        return 'Sales';
      case AgreementType.loan:
        return 'Loan';
      case AgreementType.generic:
        return 'Agreement';
    }
  }

  Color _statusColor(String? status) {
    switch ((status ?? '').toLowerCase()) {
      case 'draft':
        return const Color(0xFF3B82F6); // blue
      case 'pending':
        return const Color(0xFFF59E0B); // amber
      case 'exported':
        return const Color(0xFF10B981); // green
      case 'signed':
        return const Color(0xFF14B8A6); // teal
      case 'rejected':
        return const Color(0xFFEF4444); // red
      default:
        return Colors.grey;
    }
  }

  double _amountValue(Agreement a) {
    if (a.totalAmount != null) return a.totalAmount!;
    if (a.goods.isNotEmpty) {
      return a.goods
          .map((g) => g.quantity * g.unitPrice)
          .fold(0.0, (p, e) => p + e);
    }
    if (a.principal != null) return a.principal!;
    return 0;
  }

  DateTime _displayDate(Agreement a) {
    return a.startDate ??
        (a.dueDates.isNotEmpty ? a.dueDates.first : null) ??
        a.endDate ??
        DateTime.now();
  }

  String _partyLabel(Agreement a) {
    return a.parties.isNotEmpty ? a.parties.first.name : '—';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final border = theme.dividerColor.withOpacity(.25);
    final dateStr = DateFormat('dd MMM yyyy').format(_displayDate(contract));
    final amountStr = NumberFormat('#,##0').format(_amountValue(contract));
    final statusColor = _statusColor(contract.status);

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
                _Pill(
                  label: _typeLabel(contract),
                  color: const Color(0xFF3B82F6),
                ),
                const SizedBox(width: 8),
                _Pill(
                  label: (contract.status ?? 'unknown').toLowerCase(),
                  color: statusColor,
                  lowercase: true,
                ),
                const Spacer(),
                // edit removed per UX: no edit action on recent card
              ],
            ),
            const SizedBox(height: 10),
            Text(
              contract.title ?? 'Agreement',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 4),
            Text(
              _partyLabel(contract),
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.hintColor,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                const AppSvgIcon(
                  name: 'calendar',
                  size: 16,
                  color: Colors.grey,
                  fallback: Icons.event,
                ),
                const SizedBox(width: 6),
                Text(dateStr, style: theme.textTheme.bodySmall),
                const SizedBox(width: 16),
                const AppSvgIcon(
                  name: 'currency-dollar',
                  size: 16,
                  color: Colors.grey,
                  fallback: Icons.attach_money,
                ),
                const SizedBox(width: 4),
                Text(
                  contract.currency.trim().isEmpty
                      ? amountStr
                      : '$amountStr ${contract.currency}',
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

extension on Color {
  Color darken([double amount = .1]) {
    assert(amount >= 0 && amount <= 1);
    final hsl = HSLColor.fromColor(this);
    final hslDark = hsl.withLightness((hsl.lightness - amount).clamp(0.0, 1.0));
    return hslDark.toColor();
  }
}
