import axios from "axios";

const API = "http://localhost:3001/api/autores";

export const getAutores = async () => (await axios.get(API)).data;
export const getAutor = async (id) => (await axios.get(`${API}/${id}`)).data;
export const createAutor = async (autor) => (await axios.post(API, autor)).data;
export const updateAutor = async (id, autor) => (await axios.put(`${API}/${id}`, autor)).data;
export const deleteAutor = async (id) => (await axios.delete(`${API}/${id}`)).data;
