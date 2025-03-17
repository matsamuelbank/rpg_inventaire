import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'inventory.json');

interface Item {
  id: number;
  name: string;
  type: string;
  rarity: string;
  description?: string;
  quantity: number;
}

// Fonction pour s'assurer que le fichier de données existe
const ensureFileExists = () => {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]), 'utf-8');
  }
};

// Gestionnaire pour la méthode GET
export async function GET(request: NextRequest) {
  try {
    ensureFileExists();
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const inventory: Item[] = JSON.parse(data);
    return NextResponse.json(inventory);
  } catch (error) {
    console.error('Erreur lors de la lecture des données d\'inventaire:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Gestionnaire pour la méthode POST
export async function POST(request: NextRequest) {
  try {
    const newItem: Omit<Item, 'id'> = await request.json();

    if (!newItem.name || !newItem.type || !newItem.rarity || newItem.quantity <= 0) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    ensureFileExists();
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const inventory: Item[] = JSON.parse(data);
    const newId = inventory.length ? inventory[inventory.length - 1].id + 1 : 1;
    const itemWithId = { id: newId, ...newItem };
    inventory.push(itemWithId);
    fs.writeFileSync(dataFilePath, JSON.stringify(inventory, null, 2));
    return NextResponse.json(itemWithId, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'écriture des données d\'inventaire:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Gestionnaire pour la méthode DELETE
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    ensureFileExists();
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    let inventory: Item[] = JSON.parse(data);
    inventory = inventory.filter(item => item.id !== id);
    fs.writeFileSync(dataFilePath, JSON.stringify(inventory, null, 2));
    return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'objet:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Gestionnaire pour la méthode PUT
export async function PUT(request: NextRequest) {
  try {
    const updatedItem: Item = await request.json();
    ensureFileExists();
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    let inventory: Item[] = JSON.parse(data);
    inventory = inventory.map(item => item.id === updatedItem.id ? updatedItem : item);
    fs.writeFileSync(dataFilePath, JSON.stringify(inventory, null, 2));
    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'objet:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
