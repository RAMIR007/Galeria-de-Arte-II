'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_ARTISTAS, MOCK_OBRAS, MOCK_CONTACTOS_PLATAFORMA } from '@/lib/mockData';
import { Artista, Obra, ContactoPlataforma, RolUsuario } from '@/types/database';
import { fetchInitialData } from '@/lib/supabase/data';
import { Navbar } from '@/components/Navbar';
import { CatalogSection } from '@/components/CatalogSection';
import { ArtistSection } from '@/components/ArtistSection';
import { AdminPreviewPanel } from '@/components/AdminPreviewPanel';
import { ArtistDashboardModal } from '@/components/ArtistDashboardModal';
import { AuthModal } from '@/components/AuthModal';
import { Sparkles, ArrowRight, ShieldCheck, Palette, Award, Lock } from 'lucide-react';

export default function Home() {
  const [artistas, setArtistas] = useState<Artista[]>(MOCK_ARTISTAS);
  const [obras, setObras] = useState<Obra[]>(MOCK_OBRAS);
  const [platformContacts, setPlatformContacts] = useState<ContactoPlataforma[]>(
    MOCK_CONTACTOS_PLATAFORMA
  );
  const [isLive, setIsLive] = useState(false);

  // Estados de Autenticación & Rol del Usuario
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<RolUsuario | 'visitante'>('visitante');
  const [activeArtistDashboard, setActiveArtistDashboard] = useState<Artista | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await fetchInitialData();
      setArtistas(data.artistas);
      setObras(data.obras);
      setPlatformContacts(data.platformContacts);
      setIsLive(data.isLive);
    }
    loadData();
  }, []);

  // Lógica de Autenticación y Asignación de Roles
  const handleAuthSuccess = (email: string) => {
    setCurrentUserEmail(email);
    const emailLower = email.toLowerCase();

    // 1. Detección de SuperAdmin / Gestor (Ramiro o Administrador)
    if (
      emailLower.includes('ramiro') ||
      emailLower.includes('contacto@galeriacubana.art') ||
      emailLower.includes('admin')
    ) {
      setCurrentRole('superadmin');
      setIsAdminPanelOpen(true);
      setActiveArtistDashboard(null);
      return;
    }

    // 2. Detección de Artista por Email o Coincidencia
    const matchedArtist = artistas.find(
      (a) =>
        (a.whatsapp_email_contacto &&
          a.whatsapp_email_contacto.toLowerCase().includes(emailLower)) ||
        a.nombre.toLowerCase().includes(emailLower.split('@')[0])
    ) || artistas[0]; // Fallback al primer artista registrado en demo

    if (matchedArtist) {
      setCurrentRole('artista');
      setActiveArtistDashboard(matchedArtist);
      setIsAdminPanelOpen(false);
    } else {
      setCurrentRole('visitante');
    }
  };

  const handleLogout = () => {
    setCurrentUserEmail(null);
    setCurrentRole('visitante');
    setActiveArtistDashboard(null);
    setIsAdminPanelOpen(false);
  };

  // Handler para alternar contacto_directo de un artista
  const handleToggleContactoDirecto = (artistaId: string) => {
    setArtistas((prevArtistas) =>
      prevArtistas.map((art) => {
        if (art.id === artistaId) {
          const updatedState = !art.contacto_directo;
          return { ...art, contacto_directo: updatedState };
        }
        return art;
      })
    );

    // Actualizar también en el estado de obras relacionales
    setObras((prevObras) =>
      prevObras.map((obra) => {
        if (obra.artista_id === artistaId && obra.artista) {
          return {
            ...obra,
            artista: {
              ...obra.artista,
              contacto_directo: !obra.artista.contacto_directo,
            },
          };
        }
        return obra;
      })
    );

    // Sincronizar estado de modal si está activo
    if (activeArtistDashboard && activeArtistDashboard.id === artistaId) {
      setActiveArtistDashboard((prev) =>
        prev ? { ...prev, contacto_directo: !prev.contacto_directo } : null
      );
    }
  };

  // Handlers para CRUD de Artistas
  const handleAddArtista = (data: {
    nombre: string;
    bio?: string;
    provincia_ciudad?: string;
    foto_perfil?: string;
    whatsapp_email_contacto?: string;
    contacto_directo?: boolean;
  }) => {
    const newArtist: Artista = {
      id: `art-${Date.now()}`,
      nombre: data.nombre,
      bio: data.bio || '',
      provincia_ciudad: data.provincia_ciudad || 'La Habana',
      foto_perfil: data.foto_perfil || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500',
      whatsapp_email_contacto: data.whatsapp_email_contacto || '',
      contacto_directo: data.contacto_directo ?? false,
      rol: 'artista',
      fecha_registro: new Date().toISOString(),
    };
    setArtistas((prev) => [...prev, newArtist]);
  };

  const handleUpdateArtista = (artistaId: string, updates: Partial<Artista>) => {
    setArtistas((prev) =>
      prev.map((art) => (art.id === artistaId ? { ...art, ...updates } : art))
    );

    // Sincronizar en obras relacionales
    setObras((prevObras) =>
      prevObras.map((obra) => {
        if (obra.artista_id === artistaId && obra.artista) {
          return {
            ...obra,
            artista: {
              ...obra.artista,
              ...updates,
            },
          };
        }
        return obra;
      })
    );

    // Sincronizar modal activo
    if (activeArtistDashboard && activeArtistDashboard.id === artistaId) {
      setActiveArtistDashboard((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const handleDeleteArtista = (artistaId: string) => {
    setArtistas((prev) => prev.filter((art) => art.id !== artistaId));
    setObras((prev) => prev.filter((obra) => obra.artista_id !== artistaId));
    if (activeArtistDashboard?.id === artistaId) {
      setActiveArtistDashboard(null);
    }
  };

  // Handlers para CRUD de Obras
  const handleAddObra = (data: {
    titulo: string;
    artista_id: string;
    tecnica?: string;
    medidas?: string;
    año?: number;
    precio_referencia?: number;
    disponible?: boolean;
    imagenes?: string[];
    descripcion?: string;
  }) => {
    const autor = artistas.find((a) => a.id === data.artista_id);
    const newObra: Obra = {
      id: `obra-${Date.now()}`,
      artista_id: data.artista_id,
      titulo: data.titulo,
      descripcion: data.descripcion || '',
      tecnica: data.tecnica || 'Óleo sobre lienzo',
      medidas: data.medidas || '100 x 80 cm',
      año: data.año || new Date().getFullYear(),
      precio_referencia: data.precio_referencia,
      disponible: data.disponible ?? true,
      imagenes: data.imagenes?.length ? data.imagenes : ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000'],
      fecha_creacion: new Date().toISOString(),
      artista: autor,
    };
    setObras((prev) => [newObra, ...prev]);
  };

  const handleUpdateObra = (obraId: string, updates: Partial<Obra>) => {
    setObras((prev) =>
      prev.map((obra) => (obra.id === obraId ? { ...obra, ...updates } : obra))
    );
  };

  const handleDeleteObra = (obraId: string) => {
    setObras((prev) => prev.filter((obra) => obra.id !== obraId));
  };

  const handleToggleObraDisponibilidad = (obraId: string) => {
    setObras((prev) =>
      prev.map((obra) =>
        obra.id === obraId ? { ...obra, disponible: !obra.disponible } : obra
      )
    );
  };

  // Handlers para la gestión de equipo y contactos de plataforma
  const handleAddPlatformContact = (
    nombre: string,
    contacto: string,
    rol: RolUsuario = 'gestor'
  ) => {
    const newContact: ContactoPlataforma = {
      id: `plat-${Date.now()}`,
      nombre_encargado: nombre,
      whatsapp_email: contacto,
      activo: true,
      rol: rol,
      fecha_creacion: new Date().toISOString(),
    };
    setPlatformContacts((prev) => [...prev, newContact]);
  };

  const handleToggleContactActive = (contactId: string) => {
    setPlatformContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, activo: !c.activo } : c))
    );
  };

  const handleChangeContactRole = (contactId: string, rol: RolUsuario) => {
    setPlatformContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, rol } : c))
    );
  };

  const handleDeletePlatformContact = (contactId: string) => {
    setPlatformContacts((prev) => prev.filter((c) => c.id !== contactId));
  };

  return (
    <div className="space-y-8 sm:space-y-12 pb-16">
      {/* Top Header Navbar con Roles */}
      <Navbar
        currentUserEmail={currentUserEmail}
        currentRole={currentRole}
        activeArtist={activeArtistDashboard}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onOpenArtistDashboard={() => setActiveArtistDashboard(activeArtistDashboard || artistas[0])}
        onToggleAdminPanel={() => setIsAdminPanelOpen(!isAdminPanelOpen)}
        isAdminPanelOpen={isAdminPanelOpen}
      />

      {/* Hero Section Público Limpio */}
      <section className="relative py-12 sm:py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-[#0e1017] to-[#0a0b0e] border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-6 max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Plataforma Virtual de Arte Cubano</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-[1.18] mb-4 sm:mb-6">
              Descubre la Grandeza del <span className="gold-gradient-text">Arte Cubano</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed mb-6 sm:mb-8">
              Catálogo oficial de piezas maestras y artistas contemporáneos de Cuba.
              Garantizamos contacto directo con artistas de confianza o negociación asistida
              transparente por el equipo de la plataforma.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="#obras"
                className="px-6 py-3.5 rounded-xl gold-button flex items-center justify-center gap-2 text-sm font-semibold shadow-lg hover:scale-[1.02] transition-all w-full sm:w-auto"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contacto-info"
                className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 text-sm font-semibold flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
              >
                Modelo de Transparencia
              </a>
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Catálogo Curado</h4>
              <p className="text-[11px] text-slate-400">Obras auténticas con fichas técnicas detalladas</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Atención & Gestión Directa</h4>
              <p className="text-[11px] text-slate-400">Trato directo habilitado o negociación guiada por el equipo</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Asistencia Oficial</h4>
              <p className="text-[11px] text-slate-400">Coordinación de envíos y consultas con la plataforma</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <CatalogSection
        obras={obras}
        artistas={artistas}
        platformContacts={platformContacts}
      />

      {/* Artist Showcase Section */}
      <ArtistSection
        artistas={artistas}
        isAdminLoggedIn={currentRole === 'superadmin' || currentRole === 'gestor'}
        onOpenDashboard={(art) => setActiveArtistDashboard(art)}
      />

      {/* Admin Panel Simulator - Solo visible si SuperAdmin / Gestor o panel activado */}
      {(currentRole === 'superadmin' || currentRole === 'gestor' || isAdminPanelOpen) && (
        <AdminPreviewPanel
          artistas={artistas}
          obras={obras}
          platformContacts={platformContacts}
          onToggleContactoDirecto={handleToggleContactoDirecto}
          onAddPlatformContact={handleAddPlatformContact}
          onToggleContactActive={handleToggleContactActive}
          onChangeContactRole={handleChangeContactRole}
          onDeletePlatformContact={handleDeletePlatformContact}
          onAddArtista={handleAddArtista}
          onUpdateArtista={handleUpdateArtista}
          onDeleteArtista={handleDeleteArtista}
          onAddObra={handleAddObra}
          onUpdateObra={handleUpdateObra}
          onDeleteObra={handleDeleteObra}
          onToggleObraDisponibilidad={handleToggleObraDisponibilidad}
        />
      )}

      {/* Modal de Dashboard de Artista Autenticado */}
      {activeArtistDashboard && (
        <ArtistDashboardModal
          isOpen={!!activeArtistDashboard}
          onClose={() => setActiveArtistDashboard(null)}
          artista={activeArtistDashboard}
          obras={obras}
          onUpdateArtista={handleUpdateArtista}
          onToggleContactoDirecto={handleToggleContactoDirecto}
          onAddObra={handleAddObra}
          onUpdateObra={handleUpdateObra}
          onDeleteObra={handleDeleteObra}
          onToggleObraDisponibilidad={handleToggleObraDisponibilidad}
        />
      )}

      {/* Modal de Autenticación */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
