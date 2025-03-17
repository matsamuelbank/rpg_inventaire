"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import ItemFilter from '../components/ItemFilter/itemFilter';
import EditItem from '../components/EditItem/editItem';

// Définition de l'interface Item pour typer les objets de l'inventaire
interface Item {
  id: number;
  name: string;
  type: string;
  rarity: string;
  description?: string;
  quantity: number;
}

export default function Home() {
  const [inventory, setInventory] = useState<Item[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<Omit<Item, 'id'>>({
    name: '',
    type: '',
    rarity: '',
    description: '',
    quantity: 1,
  });
  const [equippedItems, setEquippedItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // useEffect pour charger les données d'inventaire au montage du composant
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('/api/inventory');
        setInventory(response.data);
        setFilteredInventory(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'inventaire:', error);
      }
    };

    fetchInventory();
  }, []);

  // Gestionnaire de soumission du formulaire pour ajouter un nouvel objet
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation des champs obligatoires
    if (!newItem.name.trim() || !newItem.type.trim() || !newItem.rarity.trim() || newItem.quantity <= 0) {
      setError('Veuillez remplir tous les champs obligatoires et assurez-vous que la quantité est positive.');
      return;
    }

    // Confirmation de l'ajout de l'objet
    if (!window.confirm('Voulez-vous vraiment ajouter cet objet ?')) {
      return;
    }

    try {
      const response = await axios.post('/api/inventory', newItem);
      setInventory([...inventory, response.data]);
      setFilteredInventory([...inventory, response.data]);
      setNewItem({ name: '', type: '', rarity: '', description: '', quantity: 1 });
      setError(null);
      setSuccessMessage(`Objet "${response.data.name}" ajouté avec succès!`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'objet:', error);
    }
  };

  const handleFilter = (type: string, rarity: string, maxQuantity: number | undefined) => {
    const filtered = inventory.filter(item =>
      (type ? item.type.includes(type) : true) &&
      (rarity ? item.rarity.includes(rarity) : true) &&
      (maxQuantity !== undefined ? item.quantity <= maxQuantity : true)
    );
    setFilteredInventory(filtered);
  };
  
  
  // Fonction pour supprimer un objet
  const handleDelete = async (itemId: number) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet objet ?')) {
      return;
    }

    try {
      await axios.delete('/api/inventory', { data: { id: itemId } });
      setInventory(inventory.filter(item => item.id !== itemId));
      setFilteredInventory(filteredInventory.filter(item => item.id !== itemId));
      setEquippedItems(equippedItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'objet:', error);
    }
  };

  // Fonction pour mettre à jour un objet
  const handleUpdate = async (updatedItem: Item) => {
    if (!window.confirm('Voulez-vous vraiment modifier cet objet ?')) {
      return;
    }

    try {
      await axios.put('/api/inventory', updatedItem);
      setInventory(inventory.map(item => item.id === updatedItem.id ? updatedItem : item));
      setFilteredInventory(filteredInventory.map(item => item.id === updatedItem.id ? updatedItem : item));
      setEquippedItems(equippedItems.map(item => item.id === updatedItem.id ? updatedItem : item));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'objet:', error);
    }
  };

  // Fonction pour équiper ou déséquiper un objet
  const handleEquip = (item: Item) => {
    setEquippedItems(prevEquippedItems =>
      prevEquippedItems.some(equippedItem => equippedItem.id === item.id)
        ? prevEquippedItems.filter(equippedItem => equippedItem.id !== item.id)
        : [...prevEquippedItems, item]
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 p-4">
      <div className="w-full md:w-1/4 p-4 mb-4 md:mb-0">
        <ItemFilter onFilter={handleFilter} />
      </div>
      <div className="w-full md:w-3/4 p-4">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-700">Inventaire RPG</h1>
        {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nom"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400 text-gray-400"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Type"
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400 text-gray-400"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Rareté"
              value={newItem.rarity}
              onChange={(e) => setNewItem({ ...newItem, rarity: e.target.value })}
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400 text-gray-400"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400 text-gray-400"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Quantité"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-400 text-gray-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-400"
          >
            Ajouter
          </button>
        </form>
        <div className="space-y-4">
          {filteredInventory.map((item) => (
            <EditItem
              key={item.id}
              item={item}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onEquip={handleEquip}
              isEquipped={equippedItems.some(equippedItem => equippedItem.id === item.id)}
            />
          ))}
        </div>
        {equippedItems.length > 0 && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Objets Équipés</h2>
            {equippedItems.map(item => (
              <div key={item.id} className="font-semibold text-gray-700">
                {item.name} - {item.type} - {item.rarity}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
