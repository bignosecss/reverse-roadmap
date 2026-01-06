import { ModeToggle } from "../theme-toggle";
import { SidebarTrigger } from "../ui/sidebar";

export function FlowHeader() {
  return (
    <div className="flex flex-row justify-between items-center p-4 border-b">
      <SidebarTrigger className="md:hidden" />
      <h1>慢慢来，谁还没有一个努力的过程。</h1>
      <ModeToggle />
    </div>
  );
}
