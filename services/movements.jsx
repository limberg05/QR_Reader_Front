import { api } from "../utils/api";

export const fetchMovements = async () => {
  try {
    const res = await api.get(`/movements/all`);
    return res.data;
  } catch (err) {
    console.log("Error en fetchMovements:", err);
    throw err;
  }
};
