# 🚀 Guía de Despliegue en Producción - Galería Virtual de Arte Cubano

Esta guía explica paso a paso cómo conectar la aplicación con un proyecto real de **Supabase** y desplegarla en **Vercel** o cualquier servidor de producción.

---

## 1. Configuración de Supabase Cloud

1. **Crear Proyecto en Supabase:**
   - Registra o inicia sesión en [supabase.com](https://supabase.com).
   - Crea un nuevo proyecto e ingresa el nombre (ejemplo: `galeria-arte-cubano`) y una contraseña segura para la base de datos Postgres.

2. **Ejecutar el Esquema SQL y Políticas de Seguridad:**
   - En la consola de Supabase, ve al menú **SQL Editor** (Editor de Consultas SQL).
   - Abre el archivo del proyecto [`supabase/schema.sql`](file:///c:/Users/ramir/Documents/Programacion%20proyectos/Galeria%20de%20Arte%20II/supabase/schema.sql).
   - Copia todo el contenido, pégalo en el editor SQL de Supabase y haz clic en **Run**.
   - Esto creará automáticamente:
     - Las tablas `artistas`, `obras` y `contactos_plataforma`.
     - Los buckets de imágenes `obras-imagenes` y `artistas-imagenes`.
     - El trigger de autoregistro de usuarios `on_auth_user_created`.
     - Las políticas de seguridad Row Level Security (RLS).
     - Los índices de alto rendimiento.

3. **Obtener Credenciales API:**
   - Ve a **Project Settings -> API**.
   - Copia la **Project URL** y la **`anon` public API Key**.

---

## 2. Configuración Local (`.env.local`)

Crea un archivo llamado `.env.local` en la raíz de tu proyecto (puedes tomar como base `.env.local.example`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

> **Nota:** Si estas variables están vacías o no existen, la aplicación funcionará al 100% en **Modo Demostración / Simulador**, utilizando datos en memoria sin interrumpir la experiencia.

---

## 3. Despliegue en Vercel (Recomendado)

1. **Subir Cambios a Git:**
   ```bash
   git add .
   git commit -m "feat: complete gallery with production schema and deployment guide"
   git push origin main
   ```

2. **Crear Proyecto en Vercel:**
   - Inicia sesión en [vercel.com](https://vercel.com).
   - Haz clic en **Add New -> Project** e importa tu repositorio de GitHub/GitLab.

3. **Configurar Variables de Entorno en Vercel:**
   - En la sección **Environment Variables**, añade:
     - `NEXT_PUBLIC_SUPABASE_URL`: Tu URL de Supabase.
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Tu clave `anon` de Supabase.

4. **Desplegar:**
   - Haz clic en **Deploy**. Vercel compilará la aplicación con Next.js y generará tu URL pública de producción con SSL gratuito (https).

---

## 🔒 Arquitectura de Seguridad & Resumen de Funcionalidades

- **Doble Modalidad de Contacto:** *Contacto Directo* con el artista o *Atención Asistida* coordinada por la galería.
- **Seguridad RLS:** Restricción de edición de obras únicamente para el artista autor de la pieza.
- **Wishlist & Filtros:** Guardado local de favoritos y ordenación por precio o año.
- **Autenticación Integrada:** Inicio de sesión y registro automático conectado con Supabase Auth.
