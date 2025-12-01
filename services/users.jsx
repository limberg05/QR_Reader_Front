import { use } from "react";
import { api } from "../utils/api";

export const fetchUser = async (id) => {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (err) {
    console.log("Error en fetchUsers:", err);
    throw err;
  }
};

export const registerUser = async (user) => {
  try {
    const res = await api.post(`/users/register`, user);
    return res.data;
  } catch (err) {
    console.log("Error createUser:", err);
    throw err;
  }
};
