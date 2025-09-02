import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem } from '../types';

interface ItemCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onAdd }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="aspect-w-16 aspect-h-12 bg-gray-200">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-orange-600">₱{item.price}</span>
          <button
            onClick={() => onAdd(item)}
            className="bg-orange-600 hover:bg-orange-700 text-white rounded-full p-3 transition-all duration-200 transform hover:scale-110 shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};