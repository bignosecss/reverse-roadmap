import { SwitchModeDto } from "../types/apiRequests";
import { apiClient } from "./client";

export const checkSwitchMode = async (switchModeDto: SwitchModeDto) => {
  const result = await apiClient("auth/switch-mode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(switchModeDto),
  });
  return result.data;
};
