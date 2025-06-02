import axios from "axios";

const API = "http://localhost:3001/api/libros";

export const getLibros = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get("http://localhost:3001/api/libros", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};



export const createLibro = async (libro) => {
  const res = await axios.post(API, libro);
  return res.data;
};

export const updateLibro = async (id, libro) => {
  const res = await axios.put(`${API}/${id}`, libro);
  return res.data;
};

export const deleteLibro = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};
