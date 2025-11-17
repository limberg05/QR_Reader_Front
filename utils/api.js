import axios from "axios";

export const api = axios.create({
  baseURL: "https://movilesprimerparcial-elias-angel-pipo.onrender.com", // cambia a tu URL
});

// Opcional: interceptor para manejar 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si recibes 401, cerrar sesión
      // No usar hook directamente: usar getState
      const { logout } = require("./authStore").useAuthStore.getState();
      logout();
    }
    return Promise.reject(error);
  }
);
