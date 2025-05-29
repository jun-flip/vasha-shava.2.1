'use client';

import { useEffect, useState } from 'react';
import { MenuItem } from '../../types';

export default function TestPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/menu');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Menu data:', data);
        setMenuItems(data);
      } catch (e) {
        console.error('Error fetching menu:', e);
        setError(e instanceof Error ? e.message : 'Unknown error');
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Menu Loading</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map(item => (
          <div key={item.id} className="border p-4 rounded">
            <h2 className="font-bold">{item.name}</h2>
            <p>{item.description}</p>
            <p className="text-green-600">{item.price} ₽</p>
            <p>Category: {item.category}</p>
            {item.additives && (
              <div className="mt-2">
                <p className="font-semibold">Additives:</p>
                <ul className="list-disc list-inside">
                  {item.additives.map(additive => (
                    <li key={additive.id}>
                      {additive.name} (+{additive.price}₽)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 