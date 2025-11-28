import { api } from '../utils/api';

export const fetchMovements = async () => {
  try {
    const res = await api.get(`/movements/all`);
    return res.data;
  } catch (err) {
    console.log('Error en fetchMovements:', err);
    throw err;
  }
};
export const fetchMovementsPerProduct = async (barcode) => {
  try {
    const res = await api.get(`/movements/${barcode}`);
    return res.data;
  } catch (err) {
    console.log('Error en fetchMovementsPerProduct:', err);
    throw err;
  }
};
