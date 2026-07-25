'use client';

import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'galeria_cubana_favoritos';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavoriteIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error leyendo favoritos de localStorage:', e);
    }
  }, []);

  const toggleFavorite = (obraId: string) => {
    setFavoriteIds((prev) => {
      let updated: string[];
      if (prev.includes(obraId)) {
        updated = prev.filter((id) => id !== obraId);
      } else {
        updated = [...prev, obraId];
      }
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error guardando favoritos en localStorage:', e);
      }
      return updated;
    });
  };

  const isFavorite = (obraId: string) => favoriteIds.includes(obraId);

  return { favoriteIds, toggleFavorite, isFavorite };
}
