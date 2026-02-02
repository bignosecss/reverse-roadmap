import { UserDto, CreateUserDto } from "@repo/shared/dto";
import { apiClient } from "./client";

export interface LoginResponse {
  user: UserDto;
}

export interface MeResponse {
  user: UserDto;
}

export const login = async (loginDto: CreateUserDto) => {
  // 注意：由于使用 cookie-session，需要设置 credentials
  const result = await apiClient<UserDto>("auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginDto),
  });

  return result.data;
};

export const logout = async () => {
  const result = await apiClient("auth/logout", {
    method: "POST",
  });

  return result.data;
};

export const register = async (registerDto: CreateUserDto) => {
  const result = await apiClient<UserDto>("auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerDto),
  });

  return result.data;
};

export const getCurrentUser = async () => {
  const result = await apiClient<MeResponse>("auth/me");

  return result.data;
};
