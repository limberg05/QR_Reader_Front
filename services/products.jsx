import { api } from '../utils/api';

export const fetchProduct = async (id) => {
  try {
    const res = await api.get(`/products/${id}`);
    return res.data;
  } catch (err) {
    console.log('Error en fetchProduct:', err);
    throw err;
  }
};

export const createProduct = async (product) => {
  try {
    const res = await api.post(`/products/register`, product);
    return res.data;
  } catch (err) {
    console.log('Error createProduct:', err);
    throw err;
  }
};

export const updateStock = async (barcode, newStock, notes = '') => {
  try {
    const res = await api.put(`/products/${barcode}/stock`, {
      newStock,
      notes,
    });
    return res.data;
  } catch (err) {
    console.log('ERROR BACKEND:', err.response?.data); // <-- importante
    throw err;
  }
};
