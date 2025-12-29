// hooks/useTreeId.ts
import { usePathname } from "next/navigation";

export const useTreeId = () => {
  const pathname = usePathname();

  if (!pathname.startsWith("/g/")) return null;

  const treeId = pathname.split("/g/")[1]!;
  return treeId;
};
