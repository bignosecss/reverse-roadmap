import { SquarePen, Search } from "lucide-react";

export const HEAD_MENU_ITEMS = [
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "New Project",
    url: "#",
    icon: SquarePen,
  },
] as const;

export type HeadMenuItem = (typeof HEAD_MENU_ITEMS)[number];
