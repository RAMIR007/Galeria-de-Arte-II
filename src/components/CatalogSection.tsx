'use client';

import React, { useState, useMemo } from 'react';
import { Obra, Artista, ContactoPlataforma } from '@/types/database';
import { ArtworkCard } from './ArtworkCard';
import { ArtworkModal } from './ArtworkModal';
import { useFavorites } from '@/lib/useFavorites';
import { Search, Filter, Sparkles, SlidersHorizontal, Heart, ArrowUpDown, RotateCcw } from 'lucide-react';

interface CatalogSectionProps {
  obras: Obra[];
  artistas: Artista[];
  platformContacts: ContactoPlataforma[];
}

export function CatalogSection({ obras, artistas, platformContacts }: CatalogSectionProps) {
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtistaId, setSelectedArtistaId] = useState<string>('all');
  const [selectedTecnica, setSelectedTecnica] = useState<string>('all');
  const [disponiblesOnly, setDisponiblesOnly] = useState<boolean>(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('recent');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites();

  // Extraer lista única de técnicas para filtro
  const tecnicas = useMemo(() => {
    const set = new Set<string>();
    obras.forEach((o) => {
      if (o.tecnica) set.add(o.tecnica);
    });
    return Array.from(set);
  }, [obras]);

  // Obras filtradas y ordenadas
  const filteredAndSortedObras = useMemo(() => {
    const filtered = obras.filter((obra) => {
      // Búsqueda por texto (título, artista, técnica)
      const queryMatch =
        !searchQuery ||
        obra.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obra.artista?.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obra.tecnica?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por artista
      const artistaMatch = selectedArtistaId === 'all' || obra.artista_id === selectedArtistaId;

      // Filtro por técnica
      const tecnicaMatch = selectedTecnica === 'all' || obra.tecnica === selectedTecnica;

      // Filtro disponible
      const disponibleMatch = !disponiblesOnly || obra.disponible;

      // Filtro solo favoritos
      const favoriteMatch = !showFavoritesOnly || favoriteIds.includes(obra.id);

      // Filtro por precio
      const numMinPrice = minPrice ? parseFloat(minPrice) : null;
      const numMaxPrice = maxPrice ? parseFloat(maxPrice) : null;
      const priceVal = obra.precio_referencia ?? null;

      let priceMatch = true;
      if (numMinPrice !== null) {
        priceMatch = priceMatch && priceVal !== null && priceVal >= numMinPrice;
      }
      if (numMaxPrice !== null) {
        priceMatch = priceMatch && priceVal !== null && priceVal <= numMaxPrice;
      }

      return (
        queryMatch &&
        artistaMatch &&
        tecnicaMatch &&
        disponibleMatch &&
        favoriteMatch &&
        priceMatch
      );
    });

    // Ordenación
    return [...filtered].sort((a, b) => {
      if (sortBy === 'price-asc') {
        return (a.precio_referencia || 0) - (b.precio_referencia || 0);
      }
      if (sortBy === 'price-desc') {
        return (b.precio_referencia || 0) - (a.precio_referencia || 0);
      }
      if (sortBy === 'title') {
        return a.titulo.localeCompare(b.titulo);
      }
      if (sortBy === 'year-desc') {
        return (b.año || 0) - (a.año || 0);
      }
      // Default: 'recent' por ID o fecha de creación
      return b.id.localeCompare(a.id);
    });
  }, [
    obras,
    searchQuery,
    selectedArtistaId,
    selectedTecnica,
    disponiblesOnly,
    showFavoritesOnly,
    favoriteIds,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const hasActiveFilters =
    searchQuery ||
    selectedArtistaId !== 'all' ||
    selectedTecnica !== 'all' ||
    disponiblesOnly ||
    showFavoritesOnly ||
    minPrice ||
    maxPrice ||
    sortBy !== 'recent';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedArtistaId('all');
    setSelectedTecnica('all');
    setDisponiblesOnly(false);
    setShowFavoritesOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('recent');
  };

  return (
    <section id="obras" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header de Sección */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold mb-2 block flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Colección Curada
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
            Catálogo de Obras Cubanas
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            Explora selecciones originales directas de los talleres y galerías de artistas cubanos.
          </p>
        </div>

        {/* Buscador y Botón de Favoritos */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar obra, artista o técnica..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>

          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-3.5 py-2.5 rounded-xl border font-semibold text-xs flex items-center gap-2 transition-all shrink-0 ${
              showFavoritesOnly
                ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-lg shadow-red-500/10'
                : 'bg-slate-900/80 text-slate-300 border-white/10 hover:border-red-500/30'
            }`}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-red-500 text-red-500' : 'text-red-400'}`} />
            <span className="hidden sm:inline">Guardados</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-white">
              {favoriteIds.length}
            </span>
          </button>
        </div>
      </div>

      {/* Bar de Filtros Avanzados */}
      <div className="bg-[#12141a] p-4 rounded-2xl border border-white/10 mb-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-amber-400 font-semibold uppercase tracking-wider shrink-0 pr-2 border-r border-white/10">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros</span>
            </div>

            {/* Filtro por Artista */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-400">Artista:</label>
              <select
                value={selectedArtistaId}
                onChange={(e) => setSelectedArtistaId(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="all">Todos ({artistas.length})</option>
                {artistas.map((art) => (
                  <option key={art.id} value={art.id}>
                    {art.nombre} {art.contacto_directo ? '★' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Técnica */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-400">Técnica:</label>
              <select
                value={selectedTecnica}
                onChange={(e) => setSelectedTecnica(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="all">Todas las técnicas</option>
                {tecnicas.map((tec) => (
                  <option key={tec} value={tec}>
                    {tec}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenación */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
              <label className="text-slate-400">Orden:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="recent">Más recientes</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="year-desc">Año: Reciente primero</option>
                <option value="title">Título (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Toggle Disponible */}
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={disponiblesOnly}
                onChange={(e) => setDisponiblesOnly(e.target.checked)}
                className="accent-amber-500 rounded cursor-pointer w-4 h-4"
              />
              <span>Disponibles</span>
            </label>

            {/* Botón Reset */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-amber-400 hover:text-amber-300 text-xs font-medium flex items-center gap-1 transition-colors border-l border-white/10 pl-3"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Fila secundaria: Rango de precio */}
        <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-slate-400 text-[11px] font-medium">Rango de Precio (USD):</span>
          <input
            type="number"
            placeholder="Min USD"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-24 px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <span className="text-slate-600">-</span>
          <input
            type="number"
            placeholder="Max USD"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-24 px-2.5 py-1 rounded-lg bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />

          <span className="text-[11px] text-slate-500 ml-auto">
            Mostrando {filteredAndSortedObras.length} de {obras.length} obra(s)
          </span>
        </div>
      </div>

      {/* Grid de Obras */}
      {filteredAndSortedObras.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedObras.map((obra) => (
            <ArtworkCard
              key={obra.id}
              obra={obra}
              onSelect={(o) => setSelectedObra(o)}
              isFavorite={isFavorite(obra.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-dashed border-white/10">
          <Filter className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">
            No se encontraron obras con los criterios seleccionados.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 rounded-xl gold-button text-xs font-semibold inline-flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Filtros</span>
          </button>
        </div>
      )}

      {/* Modal de Detalle de Obra */}
      <ArtworkModal
        obra={selectedObra}
        platformContacts={platformContacts}
        onClose={() => setSelectedObra(null)}
        isFavorite={selectedObra ? isFavorite(selectedObra.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </section>
  );
}
