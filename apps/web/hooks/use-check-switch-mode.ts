import { useMutation } from "@tanstack/react-query";
import { checkSwitchMode } from "@/lib/service/auth";
import { SwitchModeDto } from "@/lib/types/apiRequests";

export const useCheckSwitchMode = () => {
  return useMutation({
    mutationFn: (switchModeDto: SwitchModeDto) =>
      checkSwitchMode(switchModeDto),
  });
};
