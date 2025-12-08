import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { RrNodeStatus } from "@/lib/types/models";

interface NodeStatusBadgeProps {
  status: RrNodeStatus;
  className?: string;
}

export function NodeStatusBadge({ status, className }: NodeStatusBadgeProps) {
  const getStatusVariant = () => {
    switch (status) {
      case RrNodeStatus.Completed:
        return "success";
      case RrNodeStatus.Deprecated:
        return "destructive";
      case RrNodeStatus.InProgress:
        return "secondary";
      case RrNodeStatus.NotStarted:
        return "outline";
      case RrNodeStatus.Blocked:
        return "destructive";
      case RrNodeStatus.Review:
        return "warning";
      case RrNodeStatus.Cancelled:
        return "outline";
      case RrNodeStatus.Active:
        return "default";
      default:
        return "default";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case RrNodeStatus.Completed:
        return "完成";
      case RrNodeStatus.Deprecated:
        return "废弃";
      case RrNodeStatus.InProgress:
        return "进行中";
      case RrNodeStatus.NotStarted:
        return "未开始";
      case RrNodeStatus.Blocked:
        return "阻塞";
      case RrNodeStatus.Review:
        return "审核中";
      case RrNodeStatus.Cancelled:
        return "已取消";
      case RrNodeStatus.Active:
        return "活跃";
      default:
        return status;
    }
  };

  return (
    <Badge
      variant={getStatusVariant()}
      className={cn(
        status === RrNodeStatus.Completed &&
          "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
        status === RrNodeStatus.Deprecated &&
          "bg-destructive/20 text-destructive border-destructive/30 dark:bg-destructive/10 dark:text-destructive-foreground",
        status === RrNodeStatus.InProgress &&
          "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
        status === RrNodeStatus.NotStarted &&
          "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
        status === RrNodeStatus.Blocked &&
          "bg-destructive/20 text-destructive border-destructive/30 dark:bg-destructive/10 dark:text-destructive-foreground",
        status === RrNodeStatus.Review &&
          "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
        status === RrNodeStatus.Cancelled &&
          "bg-muted text-muted-foreground border-muted-foreground/30",
        status === RrNodeStatus.Active &&
          "bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/40",
        className,
      )}
    >
      {getStatusText()}
    </Badge>
  );
}

// Additional helper components for common statuses
export function CompletedBadge({ className }: { className?: string }) {
  return (
    <NodeStatusBadge status={RrNodeStatus.Completed} className={className} />
  );
}

export function DeprecatedBadge({ className }: { className?: string }) {
  return (
    <NodeStatusBadge status={RrNodeStatus.Deprecated} className={className} />
  );
}

export function InProgressBadge({ className }: { className?: string }) {
  return (
    <NodeStatusBadge status={RrNodeStatus.InProgress} className={className} />
  );
}

export function NotStartedBadge({ className }: { className?: string }) {
  return (
    <NodeStatusBadge status={RrNodeStatus.NotStarted} className={className} />
  );
}

export function BlockedBadge({ className }: { className?: string }) {
  return (
    <NodeStatusBadge status={RrNodeStatus.Blocked} className={className} />
  );
}

export function ReviewBadge({ className }: { className?: string }) {
  return <NodeStatusBadge status={RrNodeStatus.Review} className={className} />;
}

export function CancelledBadge({ className }: { className?: string }) {
  return (
    <NodeStatusBadge status={RrNodeStatus.Cancelled} className={className} />
  );
}

export function ActiveBadge({ className }: { className?: string }) {
  return <NodeStatusBadge status={RrNodeStatus.Active} className={className} />;
}
