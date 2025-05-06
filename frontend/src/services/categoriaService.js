import axios from 'axios';

const API_URL = 'http://localhost:3001/api/categorias';

export const getCategorias = async () => {
  try {
    const response = await axios.get(API_URL);
    return response; 
  } catch (error) {
    console.error('Error fetching categorias:', error);
    throw error;
  }
};

export const deleteCategoria = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting categoria:', error);
    throw error;
  }
};