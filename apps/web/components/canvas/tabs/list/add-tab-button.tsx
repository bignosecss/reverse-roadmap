import { PlusIcon } from "@radix-ui/react-icons";

interface AddTabButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function AddTabButton({ onClick, disabled }: AddTabButtonProps) {
  return (
    <button
      className="flex items-center justify-center w-10 h-10 border rounded-t-md bg-muted hover:bg-muted/50 transition-colors"
      onClick={onClick}
      disabled={disabled}
      aria-label="新增标签"
    >
      <PlusIcon />
    </button>
  );
}
