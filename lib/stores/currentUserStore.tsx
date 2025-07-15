import { User } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserStore = {
  currentUser: User | null | "NOT FOUND";
  set: (user: User) => void;
  setNotFOUND: (data: "NOT FOUND") => void;
  remove: () => void;
  isLoading: boolean;
  setLoading: (state: boolean) => void;
  isLoadingError: Error | null;
  setLoadingError: (error: Error) => void;
  setNull: (data: null) => void;
};

export const useUserStore = create<UserStore>()((set) => ({
  currentUser: null,
  isLoading: false,
  isLoadingError: null,
  setNull: (state) => set({ currentUser: state }),
  setNotFOUND: (state) => set({ currentUser: state }),
  setLoadingError: (state) => set({ isLoadingError: state }),
  setLoading: (state) => set({ isLoading: state }),
  set: (user) => set({ currentUser: user }),
  remove: () => set({ currentUser: null }),
}));
