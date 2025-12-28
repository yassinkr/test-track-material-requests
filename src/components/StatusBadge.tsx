import { MaterialRequestStatus, MaterialRequestPriority } from '@/types/material-request';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: MaterialRequestStatus;
  className?: string;
}

const statusConfig: Record<MaterialRequestStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-status-pending/15 text-warning-foreground border-status-pending/30 hover:bg-status-pending/25',
  },
  approved: {
    label: 'Approved',
    className: 'bg-success/15 text-success border-success/30 hover:bg-success/25',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/25',
  },
  fulfilled: {
    label: 'Fulfilled',
    className: 'bg-accent/15 text-accent border-accent/30 hover:bg-accent/25',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge 
      variant="outline" 
      className={cn('font-medium', config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

interface PriorityBadgeProps {
  priority: MaterialRequestPriority;
  className?: string;
}

const priorityConfig: Record<MaterialRequestPriority, { label: string; className: string }> = {
  low: {
    label: 'Low',
    className: 'bg-priority-low/15 text-accent border-priority-low/30',
  },
  medium: {
    label: 'Medium',
    className: 'bg-priority-medium/15 text-warning-foreground border-priority-medium/30',
  },
  high: {
    label: 'High',
    className: 'bg-priority-high/15 text-primary border-priority-high/30',
  },
  urgent: {
    label: 'Urgent',
    className: 'bg-priority-urgent/15 text-destructive border-priority-urgent/30 animate-pulse',
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <Badge 
      variant="outline" 
      className={cn('font-medium', config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
