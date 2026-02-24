import { Badge } from "@/components/ui/badge";
import { TruckStatus, STATUS_LABELS, STATUS_VARIANTS } from "@/lib/types";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const truckStatus = status as TruckStatus;
  const label = STATUS_LABELS[truckStatus] || status;
  const variant = STATUS_VARIANTS[truckStatus] || 'outline';
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
