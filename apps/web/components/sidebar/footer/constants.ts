import { RrRootStatus } from "@/lib/types/models";
import { KeyRound, LogOut, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type FooterMenuItem = {
  mode: RrRootStatus;
  title: string;
  description: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export const FOOTER_MENU_ITEMS: FooterMenuItem[] = [
  {
    mode: RrRootStatus.public,
    title: "公开模式",
    description: "asd",
    icon: LogOut,
  },
  {
    mode: RrRootStatus.private,
    title: "私有模式",
    description: "创建一个新的目标树",
    icon: KeyRound,
  },
] as const;
