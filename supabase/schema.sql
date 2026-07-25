-- ==============================================================================
-- Galería Virtual de Arte Cubano - Esquema de Base de Datos para Producción (Supabase Postgres)
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
-- Índices de Rendimiento para Búsquedas Rápidas
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_obras_artista_id ON public.obras(artista_id);
CREATE INDEX IF NOT EXISTS idx_obras_disponible ON public.obras(disponible);
CREATE INDEX IF NOT EXISTS idx_obras_tecnica ON public.obras(tecnica);
CREATE INDEX IF NOT EXISTS idx_artistas_contacto_directo ON public.artistas(contacto_directo);
CREATE INDEX IF NOT EXISTS idx_artistas_user_id ON public.artistas(user_id);

-- ==============================================================================
-- Trigger de Autoregistro de Usuarios en 'artistas' al Crear Cuenta en Auth
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.artistas (user_id, nombre, whatsapp_email_contacto, rol, contacto_directo)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nombre_completo', split_part(NEW.email, '@', 1)),
        NEW.email,
        'artista',
        false
    )
    ON CONFLICT DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger asociado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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
-- Datos Iniciales de Prueba (Seed Data)
-- ==============================================================================
INSERT INTO public.contactos_plataforma (nombre_encargado, whatsapp_email, activo) VALUES
('Ramiro - Coordinación Galería', '+53 50000000 / contacto@galeriacubana.art', true),
('Soporte Plataforma', 'info@galeriacubana.art', true)
ON CONFLICT DO NOTHING;
