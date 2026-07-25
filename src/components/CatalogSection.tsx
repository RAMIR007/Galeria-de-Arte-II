'use client';

import React, { useState, useMemo } from 'react';
import { Obra, Artista, ContactoPlataforma } from '@/types/database';
import { ArtworkCard } from './ArtworkCard';
import { ArtworkModal } from './ArtworkModal';
import { Search, Filter, Sparkles, SlidersHorizontal } from 'lucide-react';

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

  // Extraer lista única de técnicas para filtro
  const tecnicas = useMemo(() => {
    const set = new Set<string>();
    obras.forEach((o) => {
      if (o.tecnica) set.add(o.tecnica);
    });
    return Array.from(set);
  }, [obras]);

  // Obras filtradas
  const filteredObras = useMemo(() => {
    return obras.filter((obra) => {
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

      return queryMatch && artistaMatch && tecnicaMatch && disponibleMatch;
    });
  }, [obras, searchQuery, selectedArtistaId, selectedTecnica, disponiblesOnly]);

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

        {/* Buscador */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por título, artista o técnica..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Bar de Filtros */}
      <div className="bg-[#12141a] p-4 rounded-2xl border border-white/10 mb-10 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-semibold uppercase tracking-wider shrink-0 pr-2 border-r border-white/10">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filtros</span>
        </div>

        {/* Filtro por Artista */}
        <div className="flex items-center gap-2">
          <label className="text-slate-400">Artista:</label>
          <select
            value={selectedArtistaId}
            onChange={(e) => setSelectedArtistaId(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Todos los artistas</option>
            {artistas.map((art) => (
              <option key={art.id} value={art.id}>
                {art.nombre} {art.contacto_directo ? '★' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Técnica */}
        <div className="flex items-center gap-2">
          <label className="text-slate-400 font-medium">Técnica:</label>
          <select
            value={selectedTecnica}
            onChange={(e) => setSelectedTecnica(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">Todas las técnicas</option>
            {tecnicas.map((tec) => (
              <option key={tec} value={tec}>
                {tec}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle Disponible */}
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer ml-auto">
          <input
            type="checkbox"
            checked={disponiblesOnly}
            onChange={(e) => setDisponiblesOnly(e.target.checked)}
            className="accent-amber-500 rounded cursor-pointer w-4 h-4"
          />
          <span>Mostrar solo disponibles</span>
        </label>
      </div>

      {/* Grid de Obras */}
      {filteredObras.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredObras.map((obra) => (
            <ArtworkCard key={obra.id} obra={obra} onSelect={(o) => setSelectedObra(o)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-dashed border-white/10">
          <Filter className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">
            No se encontraron obras con los criterios seleccionados.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedArtistaId('all');
              setSelectedTecnica('all');
              setDisponiblesOnly(false);
            }}
            className="mt-4 text-xs text-amber-400 underline hover:text-amber-300"
          >
            Restablecer todos los filtros
          </button>
        </div>
      )}

      {/* Modal de Detalle */}
      <ArtworkModal
        obra={selectedObra}
        platformContacts={platformContacts}
        onClose={() => setSelectedObra(null)}
      />
    </section>
  );
}
