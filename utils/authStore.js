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
      isLoggedIn: false, //isLoggedIn es para el stack protector
      isAdmin: false,

      //Login que a demás maneja el token para que esté en todas las requests de una
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          // 1. Despertar el backend
          await wakeUpAPI();

          const res = await api.post("/users/login", { email, password });
          const jwt = res.data.access_token;
          const decoded = jwtDecode(jwt);

          set({
            token: jwt,
            loading: false,
            isLoggedIn: true,
            isAdmin: decoded.isAdmin || false,
          });

          // Poner el token en las peticiones futuras
          api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
          //console.log(jwt);
        } catch (err) {
          set({
            error: err.response?.data?.message || err.message,
            loading: false,
          });
          throw err;
        }
      },
      logout: () => {
        set({ token: null, isLoggedIn: false, isAdmin: false });
        delete api.defaults.headers.common["Authorization"];
      },
      resetError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-token",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
