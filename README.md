# 🎨 Galería Virtual de Arte Cubano - Plataforma Oficial

Plataforma web de alta gama diseñada para la exhibición, promoción y comercialización de obras originales de las artes plásticas cubanas contemporáneas. Garantiza un modelo transparente de contacto directo con artistas de confianza o negociación asistida por el equipo de la galería.

---

## 🚀 Características Principales

1. **Catálogo Curado Interactivo:**
   - Visualización de obras con fichas técnicas detalladas (medidas, técnica, año, precio de referencia en USD y disponibilidad).
   - Filtros avanzados por artista, técnica, disponibilidad y rango de precio.
   - Ordenación dinámica (más recientes, precio ascendente/descendente, año y título A-Z).
   - Buscador rápido por palabras clave.

2. **Modelo de Contacto Dual (Key Feature):**
   - **Contacto Directo:** Mensajes pre-redactados automáticos para WhatsApp o Email directo hacia el artista personal.
   - **Atención Asistida por Plataforma:** Consultas coordinadas por el equipo de apoyo y coordinación oficial (Ramiro / Gestores).

3. **Seguridad y Control de Roles Estricto:**
   - **Visitante / Comprador:** Interfaz pública limpia y profesional con catálogo, modal de obras, contacto y favoritos.
   - **Artista Autenticado:** Acceso exclusivo a su **Dashboard Privado** para autogestionar su portafolio de obras, biografía, foto de perfil e imágenes.
   - **SuperAdmin (Ramiro):** Panel de Control Global para administrar el catálogo completo, autorizar artistas, cambiar modalidades de contacto y gestionar el equipo de gestores.

4. **Wishlist / Guardados Local:**
   - Sistema de favoritos con icono de corazón persisente en `localStorage`.

5. **Subida de Imágenes (Supabase Storage):**
   - Componente interactivo drag & drop conectado a los buckets `obras-imagenes` y `artistas-imagenes` con fallback local inmediato en modo demo.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** Next.js 15+ (App Router)
- **UI & Estilos:** React 19 + Tailwind CSS + Lucide Icons + Google Fonts (Playfair Display & Plus Jakarta Sans)
- **Base de Datos & Auth:** Supabase Postgres + Supabase Auth + Row Level Security (RLS)
- **Almacenamiento:** Supabase Storage (Buckets de alta velocidad)
- **Despliegue:** Vercel (Producción con SSL)

---

## 📁 Estructura del Proyecto

```text
├── public/
├── src/
│   ├── app/
│   │   ├── globals.css         # Tokenización de estilos y gradientes dorados
│   │   ├── layout.tsx          # Layout raíz responsivo
│   │   └── page.tsx            # Página principal y orquestador de componentes
│   ├── components/
│   │   ├── AdminPreviewPanel.tsx  # Panel de Control Global de SuperAdmin
│   │   ├── ArtistDashboardModal.tsx # Dashboard privado para Artistas
│   │   ├── ArtistSection.tsx   # Galería pública de creadores
│   │   ├── ArtworkCard.tsx     # Tarjeta de presentación de obras
│   │   ├── ArtworkModal.tsx    # Modal de ficha técnica detallada
│   │   ├── AuthModal.tsx       # Modal de Login / Registro Supabase Auth
│   │   ├── CatalogSection.tsx  # Sección de catálogo con filtros y wishlist
│   │   ├── ImageUploader.tsx   # Componente de subida de imágenes
│   │   └── Navbar.tsx          # Navegación superior responsiva con roles
│   ├── lib/
│   │   ├── mockData.ts         # Datos iniciales de respaldo
│   │   ├── useFavorites.ts     # Hook personalizado de wishlist
│   │   └── supabase/           # Clientes y utilidades de Supabase
│   └── types/
│       └── database.ts         # Interfaces de TypeScript
├── supabase/
│   └── schema.sql              # Esquema SQL Postgres, RLS y triggers
├── DEPLOYMENT.md               # Guía paso a paso de producción en Vercel
├── MANUAL_ARTISTAS.md          # Manual de usuario para Artistas
└── MANUAL_SUPERADMIN.md        # Manual operativo para SuperAdmin (Ramiro)
```

---

## 💻 Instalación y Desarrollo Local

1. **Clonar e instalar dependencias:**
   ```bash
   git clone https://github.com/RAMIR007/Galeria-de-Arte-II.git
   cd Galeria-de-Arte-II
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

3. **Verificar compilación de producción:**
   ```bash
   npx tsc --noEmit
   npm run build
   ```

---

## 📖 Manuales y Guías

- 📘 [Manual de Uso para Artistas](file:///c:/Users/ramir/Documents/Programacion%20proyectos/Galeria%20de%20Arte%20II/MANUAL_ARTISTAS.md)
- 👑 [Manual Operativo para SuperAdmin (Ramiro)](file:///c:/Users/ramir/Documents/Programacion%20proyectos/Galeria%20de%20Arte%20II/MANUAL_SUPERADMIN.md)
- 🚀 [Guía de Despliegue en Vercel & Supabase](file:///c:/Users/ramir/Documents/Programacion%20proyectos/Galeria%20de%20Arte%20II/DEPLOYMENT.md)

---

© {new Date().getFullYear()} Galería Virtual de Arte Cubano. Todos los derechos reservados.
