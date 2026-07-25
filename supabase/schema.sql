-- ==============================================================================
-- Galería Virtual de Arte Cubano - Esquema de Base de Datos Base (Supabase Postgres)
-- ==============================================================================

-- 1. Tabla de Artistas
CREATE TABLE IF NOT EXISTS public.artistas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nombre TEXT NOT NULL,
    bio TEXT,
    provincia_ciudad TEXT,
    foto_perfil TEXT,
    redes_sociales JSONB DEFAULT '{}'::jsonb,
    whatsapp_email_contacto TEXT,
    contacto_directo BOOLEAN NOT NULL DEFAULT false, -- True: contacto directo habilitado | False: negociación asistida por equipo
    rol TEXT NOT NULL DEFAULT 'artista', -- 'artista', 'gestor', 'superadmin'
    fecha_registro TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tabla de Obras
CREATE TABLE IF NOT EXISTS public.obras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artista_id UUID NOT NULL REFERENCES public.artistas(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    tecnica TEXT,
    medidas TEXT,
    año INTEGER,
    precio_referencia NUMERIC(12, 2),
    disponible BOOLEAN NOT NULL DEFAULT true,
    imagenes TEXT[] NOT NULL DEFAULT '{}'::text[],
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tabla de Equipo y Contactos de la Plataforma (Admins & Gestores)
CREATE TABLE IF NOT EXISTS public.contactos_plataforma (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nombre_encargado TEXT NOT NULL,
    whatsapp_email TEXT NOT NULL,
    rol TEXT NOT NULL DEFAULT 'gestor', -- 'superadmin' (Ramiro) o 'gestor' (equipo de apoyo)
    activo BOOLEAN NOT NULL DEFAULT true,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- Habilitar Row Level Security (RLS)
-- ==============================================================================
ALTER TABLE public.artistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contactos_plataforma ENABLE ROW LEVEL SECURITY;

-- Políticas para 'artistas'
CREATE POLICY "Lectura pública de artistas" ON public.artistas
    FOR SELECT USING (true);

CREATE POLICY "Artistas pueden actualizar su propio perfil" ON public.artistas
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Artistas pueden insertar su propio perfil" ON public.artistas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para 'obras'
CREATE POLICY "Lectura pública de obras" ON public.obras
    FOR SELECT USING (true);

CREATE POLICY "Artistas pueden gestionar sus obras" ON public.obras
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.artistas
            WHERE public.artistas.id = public.obras.artista_id
            AND public.artistas.user_id = auth.uid()
        )
    );

-- Políticas para 'contactos_plataforma'
CREATE POLICY "Lectura pública de contactos activos de la plataforma" ON public.contactos_plataforma
    FOR SELECT USING (activo = true);

-- ==============================================================================
-- Configuración de Storage para Imágenes de Obras y Perfiles
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('obras-imagenes', 'obras-imagenes', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('artistas-imagenes', 'artistas-imagenes', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage
CREATE POLICY "Acceso público de lectura para imágenes de obras" ON storage.objects
    FOR SELECT USING (bucket_id = 'obras-imagenes' OR bucket_id = 'artistas-imagenes');

CREATE POLICY "Usuarios autenticados pueden subir imágenes" ON storage.objects
    FOR INSERT WITH CHECK (
        (bucket_id = 'obras-imagenes' OR bucket_id = 'artistas-imagenes') 
        AND auth.role() = 'authenticated'
    );

-- ==============================================================================
-- Datos iniciales de prueba (Seed Data)
-- ==============================================================================
INSERT INTO public.contactos_plataforma (nombre_encargado, whatsapp_email, activo) VALUES
('Ramiro - Coordinación Galería', '+53 50000000 / contacto@galeriacubana.art', true),
('Soporte Plataforma', 'info@galeriacubana.art', true)
ON CONFLICT DO NOTHING;
