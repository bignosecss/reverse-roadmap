import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, login, logout, register } from "@/lib/service/auth";
import { CreateUserDto } from "@repo/shared/dto";
import useAuthStore from "@/lib/stores/auth";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (loginDto: CreateUserDto) => login(loginDto),
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((state) => state.clearUser);

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearUser();
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (registerDto: CreateUserDto) => register(registerDto),
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};
