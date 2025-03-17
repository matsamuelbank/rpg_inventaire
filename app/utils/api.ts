import axios from 'axios';

// Création d'une instance axios pour centraliser les requêtes API
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Fonction pour récupérer l'inventaire depuis l'API
export const fetchInventory = async () => {
  try {
    const response = await api.get('/inventory');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'inventaire:', error);
    throw error;
  }
};

// Fonction pour ajouter un nouvel objet à l'inventaire
export const addItemToInventory = async (newItem: any) => {
  try {
    const response = await api.post('/inventory', newItem);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'objet:', error);
    throw error;
  }
};
