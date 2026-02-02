import { create } from "zustand";
import { AuthState } from "../types/models";

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
