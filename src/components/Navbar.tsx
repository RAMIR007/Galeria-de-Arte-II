'use client';

import React from 'react';
import Link from 'next/link';
import { Palette, Shield, User, LogIn, LogOut, Crown, Phone } from 'lucide-react';
import { RolUsuario, Artista } from '@/types/database';

interface NavbarProps {
  currentUserEmail: string | null;
  currentRole: RolUsuario | 'visitante';
  activeArtist: Artista | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenArtistDashboard: () => void;
  onToggleAdminPanel: () => void;
  isAdminPanelOpen: boolean;
}

export function Navbar({
  currentUserEmail,
  currentRole,
  activeArtist,
  onOpenAuth,
  onLogout,
  onOpenArtistDashboard,
  onToggleAdminPanel,
  isAdminPanelOpen,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0b0e]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-xl font-serif tracking-wider font-bold gold-gradient-text leading-tight">
              GALERÍA CUBANA
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.18em] text-slate-400 uppercase font-medium hidden xs:block">
              Arte Virtual & Curaduría
            </span>
          </div>
        </Link>

        {/* Navigation & Role Badge */}
        <nav className="flex items-center gap-2.5 sm:gap-5">
          <Link
            href="#obras"
            className="text-xs sm:text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors hidden xs:inline"
          >
            Catálogo
          </Link>
          <Link
            href="#artistas"
            className="text-xs sm:text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors hidden sm:inline"
          >
            Artistas
          </Link>

          {/* Estado de Autenticación & Rol */}
          {currentRole === 'superadmin' || currentRole === 'gestor' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleAdminPanel}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
                  isAdminPanelOpen
                    ? 'bg-amber-500/30 text-amber-200 border-amber-500/50 ring-1 ring-amber-400'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Panel SuperAdmin</span>
                <span className="sm:hidden">Admin</span>
              </button>

              <button
                onClick={onLogout}
                title="Cerrar Sesión"
                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : currentRole === 'artista' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenArtistDashboard}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 hover:bg-purple-500/30 transition-all shadow-md"
              >
                <User className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-none">
                  Mi Dashboard ({activeArtist?.nombre.split(' ')[0] || 'Artista'})
                </span>
              </button>

              <button
                onClick={onLogout}
                title="Cerrar Sesión"
                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Acceso Creadores</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
