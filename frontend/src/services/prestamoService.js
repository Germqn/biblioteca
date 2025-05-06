import axios from "axios";

const API = "http://localhost:3000/api/prestamos";

export const getPrestamos = async () => (await axios.get(API)).data;
export const getPrestamo = async (id) => (await axios.get(`${API}/${id}`)).data;
export const createPrestamo = async (prestamo) => (await axios.post(API, prestamo)).data;
export const updatePrestamo = async (id, prestamo) => (await axios.put(`${API}/${id}`, prestamo)).data;
export const deletePrestamo = async (id) => (await axios.delete(`${API}/${id}`)).data;
