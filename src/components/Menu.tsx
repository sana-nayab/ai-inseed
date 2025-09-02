import React from 'react';
import { MenuCategory, MenuItem } from '../types';
import { ItemCard } from './ItemCard';

interface MenuProps {
  categories: MenuCategory[];
  activeCategory: string;
  onAddToCart: (item: MenuItem) => void;
}

export const Menu: React.FC<MenuProps> = ({ categories, activeCategory, onAddToCart }) => {
  const currentCategory = categories.find(cat => cat.id === activeCategory);

  if (!currentCategory) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-gray-500 text-center">Category not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">{currentCategory.name}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentCategory.items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            onAdd={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};