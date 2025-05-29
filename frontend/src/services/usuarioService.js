import axios from "axios";

const API = "http://localhost:3001/api/usuarios";

export const getUsuarios = async () => (await axios.get(API)).data;
export const getUsuario = async (id) => (await axios.get(`${API}/${id}`)).data;
export const createUsuario = async (usuario) => (await axios.post(API, usuario)).data;
export const updateUsuario = async (id, usuario) => (await axios.put(`${API}/${id}`, usuario)).data;
export const deleteUsuario = async (id) => (await axios.delete(`${API}/${id}`)).data;