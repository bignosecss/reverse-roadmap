import { SquarePen, Search } from "lucide-react";

export const HEAD_MENU_ITEMS = [
  {
    title: "搜索",
    url: "#",
    icon: Search,
  },
  {
    title: "新目标",
    url: "#",
    icon: SquarePen,
  },
] as const;

export type HeadMenuItem = (typeof HEAD_MENU_ITEMS)[number];
