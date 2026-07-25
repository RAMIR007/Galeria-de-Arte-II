'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, UserCheck, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/data';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (email: string) => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const isLive = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!isLive) {
      // Simulación en modo Mock
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg(`Sesión iniciada correctamente como (${email || 'demo@galeria.art'}) [Modo Simulación]`);
        onAuthSuccess?.(email || 'demo@galeria.art');
        setTimeout(() => {
          onClose();
        }, 1200);
      }, 600);
      return;
    }

    try {
      const supabase = createClient();

      if (isLoginMode) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
        } else if (data.user) {
          setSuccessMsg('¡Bienvenido! Sesión iniciada correctamente.');
          onAuthSuccess?.(data.user.email || email);
          setTimeout(() => {
            onClose();
          }, 1200);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nombre_completo: nombre,
            },
          },
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg('Registro recibido. Revisa tu correo o inicia sesión.');
          if (data.user) {
            onAuthSuccess?.(data.user.email || email);
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error en el proceso de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#12141a] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl glass-card">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-white">
            {isLoginMode ? 'Acceso a la Plataforma' : 'Registro de Artistas & Gestores'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Galería Virtual de Arte Cubano
          </p>
        </div>

        {!isLive && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Modo Demostración Activo:</strong> Puedes ingresar cualquier email para probar el inicio de sesión y la simulación de permisos.
            </span>
          </div>
        )}

        {/* Form Error / Success notices */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
            {successMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="text-xs text-slate-400 block mb-1">Nombre Completo *</label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Ej: Amelia Peláez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  required={!isLoginMode}
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400 block mb-1">Correo Electrónico *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="usuario@galeria.art"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Contraseña *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gold-button text-xs font-semibold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition-transform disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Procesando...</span>
            ) : isLoginMode ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Iniciar Sesión</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Crear Cuenta</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <button
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            {isLoginMode
              ? '¿Eres un nuevo artista o gestor? Regístrate aquí'
              : '¿Ya tienes una cuenta registrada? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}
