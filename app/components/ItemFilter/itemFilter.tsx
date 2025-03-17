import { useState } from 'react';

interface ItemFilterProps {
  onFilter: (type: string, rarity: string, maxQuantity: number | undefined) => void;
}

export default function ItemFilter({ onFilter }: ItemFilterProps) {
  // États locaux pour stocker les valeurs des filtres
  const [type, setType] = useState<string>('');
  const [rarity, setRarity] = useState<string>('');
  const [maxQuantity, setMaxQuantity] = useState<number | undefined>(undefined);

  // Fonction pour appliquer les filtres
  const handleFilter = () => {
    onFilter(type, rarity, maxQuantity);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Titre de la section des filtres */}
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Filtres</h2>

      {/* Champ de saisie pour filtrer par type */}
      <div className="mb-4">
        <label className="block text-gray-700">Type</label>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-400"
          placeholder="Filtrer par type"
        />
      </div>

      {/* Champ de saisie pour filtrer par rareté */}
      <div className="mb-4">
        <label className="block text-gray-700">Rareté</label>
        <input
          type="text"
          value={rarity}
          onChange={(e) => setRarity(e.target.value)}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-400"
          placeholder="Filtrer par rareté"
        />
      </div>

      {/* Champ de saisie pour filtrer par quantité maximale */}
      <div className="mb-4">
        <label className="block text-gray-700">Quantité Maximale</label>
        <input
          type="number"
          value={maxQuantity !== undefined ? maxQuantity : ''}
          onChange={(e) => setMaxQuantity(e.target.value === '' ? undefined : Number(e.target.value))}
          className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-gray-400"
          placeholder="Filtrer par quantité maximale"
        />
      </div>

      {/* Bouton pour appliquer les filtres */}
      <button
        onClick={handleFilter}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Appliquer les filtres
      </button>
    </div>
  );
}
