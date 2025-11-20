import { LucideProps, SquarePen } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type HeadMenuItem = {
  title: string;
  description: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  operation: "add";
};

export const HEAD_MENU_ITEMS: HeadMenuItem[] = [
  {
    title: "新目标",
    description: "创建一个新的目标树",
    icon: SquarePen,
    operation: "add",
  },
] as const;
