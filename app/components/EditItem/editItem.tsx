import { useState } from 'react';

interface EditItemProps {
  item: { id: number; name: string; type: string; rarity: string; description?: string; quantity: number };
  onUpdate: (updatedItem: any) => void;
  onDelete: (itemId: number) => void;
  onEquip: (item: any) => void;
  isEquipped: boolean;
}

export default function EditItem({ item, onUpdate, onDelete, onEquip, isEquipped }: EditItemProps) {
  // État local pour gérer le mode d'édition
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);

  // Gestion des changements dans les champs de saisie
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof editedItem) => {
    setEditedItem({ ...editedItem, [field]: e.target.value });
  };

  // Fonction pour sauvegarder les modifications
  const handleSave = () => {
    onUpdate(editedItem);
    setIsEditing(false);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
      {isEditing ? (
        <>
          {/* Champs de saisie pour éditer les détails de l'objet */}
          <div className="flex-1 space-y-4 w-full">
            <input
              type="text"
              value={editedItem.name}
              onChange={(e) => handleInputChange(e, 'name')}
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 placeholder-gray-400 bg-gray-100 text-gray-800"
              placeholder="Nom"
            />
            <input
              type="text"
              value={editedItem.type}
              onChange={(e) => handleInputChange(e, 'type')}
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 placeholder-gray-400 bg-gray-100 text-gray-800"
              placeholder="Type"
            />
            <input
              type="text"
              value={editedItem.rarity}
              onChange={(e) => handleInputChange(e, 'rarity')}
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 placeholder-gray-400 bg-gray-100 text-gray-800"
              placeholder="Rareté"
            />
            <input
              type="number"
              value={editedItem.quantity}
              onChange={(e) => handleInputChange(e, 'quantity')}
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 placeholder-gray-400 bg-gray-100 text-gray-800"
              placeholder="Quantité"
            />
            <input
              type="text"
              value={editedItem.description || ''}
              onChange={(e) => handleInputChange(e, 'description')}
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 bg-gray-100 text-gray-800"
              placeholder="Description"
            />
          </div>
          {/* Boutons pour annuler ou sauvegarder les modifications */}
          <div className="flex space-x-2 md:space-x-4 mt-4 w-full">
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
            >
              Valider
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Affichage des détails de l'objet */}
          <div className="flex-1 space-y-2 w-full">
            <div className="font-semibold text-gray-800 text-lg">{item.name}</div>
            <div className="text-gray-600">{item.type} - {item.rarity} - {item.quantity}</div>
            {item.description && <div className="text-gray-500">{item.description}</div>}
          </div>
          {/* Boutons pour modifier, supprimer ou équiper l'objet */}
          <div className="flex space-x-2 md:space-x-4 mt-4 w-full">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full"
            >
              Modifier
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 w-full"
            >
              Supprimer
            </button>
            <button
              onClick={() => onEquip(item)}
              className={`bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full ${isEquipped ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isEquipped ? 'Équipé' : 'Équiper'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
