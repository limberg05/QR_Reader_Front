import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStorage } from "./secureStorage";
import { api } from "./api";
import { jwtDecode } from "jwt-decode";

async function wakeUpAPI() {
  try {
    await api.get(`/health`, { timeout: 8000 });
    console.log("API awake");
  } catch (err) {
    console.log("Wake up error:", err);
  }
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      loading: false,
      error: null,
      isLoggedIn: false,
      isAdmin: false,
      hydrated: false,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          await wakeUpAPI();

          const res = await api.post("/users/login", { email, password });
          const jwt = res.data.access_token;
          const decoded = jwtDecode(jwt);

          api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

          set({
            token: jwt,
            loading: false,
            isLoggedIn: true,
            isAdmin: decoded.isAdmin || false,
          });
        } catch (err) {
          set({
            error: err.response?.data?.message || err.message,
            loading: false,
          });
        }
      },

      logout: () => {
        set({ token: null, isLoggedIn: false, isAdmin: false });
        delete api.defaults.headers.common["Authorization"];
      },

      resetError: () => set({ error: null }),

      setHydrated: () => set({ hydrated: true }), // Helper method
    }),
    {
      name: "auth-token",
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => (state) => {
        // state is the actual state object after rehydration
        if (state) {
          // Mark as hydrated using the store's set method
          useAuthStore.setState({ hydrated: true });

          // If there's a token, restore the Authorization header
          if (state.token) {
            api.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${state.token}`;
          }
        }
      },
    }
  )
);
