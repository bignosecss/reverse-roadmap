import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { RrNodeStatus } from "@repo/shared/models";

interface NodeStatusToggleGroupProps {
  value: RrNodeStatus;
  onChange: (status: RrNodeStatus) => void;
  className?: string;
}

export function NodeStatusToggleGroup({
  value,
  onChange,
  className,
}: NodeStatusToggleGroupProps) {
  const statusOptions = [
    {
      value: RrNodeStatus.Active,
      label: "活跃",
      color:
        "text-blue-700 bg-blue-100 border-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-800",
    },
    {
      value: RrNodeStatus.Completed,
      label: "完成",
      color:
        "text-green-700 bg-green-100 border-green-200 dark:text-green-300 dark:bg-green-900/30 dark:border-green-800",
    },
    {
      value: RrNodeStatus.Deprecated,
      label: "废弃",
      color:
        "text-destructive bg-destructive/20 border-destructive/30 dark:text-destructive-foreground dark:bg-destructive/10 dark:border-destructive/40",
    },
    {
      value: RrNodeStatus.InProgress,
      label: "进行中",
      color:
        "text-blue-700 bg-blue-100 border-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-800",
    },
    {
      value: RrNodeStatus.NotStarted,
      label: "未开始",
      color:
        "text-gray-700 bg-gray-100 border-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700",
    },
    {
      value: RrNodeStatus.Blocked,
      label: "阻塞",
      color:
        "text-destructive bg-destructive/20 border-destructive/30 dark:text-destructive-foreground dark:bg-destructive/10 dark:border-destructive/40",
    },
    {
      value: RrNodeStatus.Review,
      label: "审核中",
      color:
        "text-amber-700 bg-amber-100 border-amber-200 dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-800",
    },
    {
      value: RrNodeStatus.Cancelled,
      label: "已取消",
      color: "text-muted-foreground bg-muted border-muted-foreground/30",
    },
  ];

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(value) => value && onChange(value as RrNodeStatus)}
      className={cn("grid grid-cols-4 gap-2", className)}
      variant="outline"
    >
      {statusOptions.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          className={cn(
            "h-8 text-xs rounded-md capitalize border px-2 py-1",
            value === option.value
              ? option.color
              : "border-input hover:bg-accent hover:text-accent-foreground",
          )}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
