import { create } from "zustand";
import { UserDto } from "@repo/shared/dto";

interface AuthState {
  user: UserDto | null;
  setUser: (user: UserDto | null) => void;
  clearUser: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => {
    set({ user });
  },
  clearUser: () => {
    set({ user: null });
  },
}));

export default useAuthStore;
