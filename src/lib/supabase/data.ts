import { createClient } from './client';
import { Artista, Obra, ContactoPlataforma } from '@/types/database';
import { MOCK_ARTISTAS, MOCK_OBRAS, MOCK_CONTACTOS_PLATAFORMA } from '@/lib/mockData';

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return false;
  if (url.includes('placeholder') || url.includes('tu-proyecto')) return false;
  if (key.includes('placeholder') || key.includes('tu-anon-key')) return false;

  return true;
}

export async function fetchInitialData(): Promise<{
  artistas: Artista[];
  obras: Obra[];
  platformContacts: ContactoPlataforma[];
  isLive: boolean;
}> {
  if (!isSupabaseConfigured()) {
    console.info('Supabase: no configurado con credenciales reales. Usando Mock Data.');
    return {
      artistas: MOCK_ARTISTAS,
      obras: MOCK_OBRAS,
      platformContacts: MOCK_CONTACTOS_PLATAFORMA,
      isLive: false,
    };
  }

  try {
    const supabase = createClient();

    const [artistasRes, obrasRes, contactosRes] = await Promise.all([
      supabase.from('artistas').select('*').order('fecha_registro', { ascending: false }),
      supabase.from('obras').select('*, artista:artistas(*)').order('fecha_creacion', { ascending: false }),
      supabase.from('contactos_plataforma').select('*').order('fecha_creacion', { ascending: false }),
    ]);

    if (artistasRes.error || obrasRes.error || contactosRes.error) {
      console.warn('Error cargando datos de Supabase, recurriendo a Mock Data:', {
        artistasErr: artistasRes.error?.message,
        obrasErr: obrasRes.error?.message,
        contactosErr: contactosRes.error?.message,
      });
      return {
        artistas: MOCK_ARTISTAS,
        obras: MOCK_OBRAS,
        platformContacts: MOCK_CONTACTOS_PLATAFORMA,
        isLive: false,
      };
    }

    const fetchedArtistas = (artistasRes.data as Artista[]) || [];
    const fetchedObras = (obrasRes.data as Obra[]) || [];
    const fetchedContacts = (contactosRes.data as ContactoPlataforma[]) || [];

    return {
      artistas: fetchedArtistas.length > 0 ? fetchedArtistas : MOCK_ARTISTAS,
      obras: fetchedObras.length > 0 ? fetchedObras : MOCK_OBRAS,
      platformContacts: fetchedContacts.length > 0 ? fetchedContacts : MOCK_CONTACTOS_PLATAFORMA,
      isLive: true,
    };
  } catch (error) {
    console.error('Excepción al conectar con Supabase, usando Mock Data:', error);
    return {
      artistas: MOCK_ARTISTAS,
      obras: MOCK_OBRAS,
      platformContacts: MOCK_CONTACTOS_PLATAFORMA,
      isLive: false,
    };
  }
}
