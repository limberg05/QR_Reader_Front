import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

const secureStorage = {
  getItem: async (key) => {
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key, value) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key) => {
    await SecureStore.deleteItemAsync(key);
  },
};

export const useUserState = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      logIn: () => set({ isLoggedIn: true }),
      logOut: () => set({ isLoggedIn: false }),
    }),
    {
      name: "userAuth",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
