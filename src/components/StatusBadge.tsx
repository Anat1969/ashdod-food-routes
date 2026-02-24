import { Badge } from "@/components/ui/badge";
import { TruckStatus, STATUS_LABELS, STATUS_VARIANTS } from "@/lib/types";

interface StatusBadgeProps {
  status: TruckStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} className={className}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
