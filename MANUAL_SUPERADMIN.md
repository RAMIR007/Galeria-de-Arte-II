# 👑 Manual Operativo para SuperAdmin - Galería Virtual de Arte Cubano

**Propietario / Director General:** Ramiro  
**Rol:** SuperAdmin & Coordinación General  
**Plataforma:** Galería Virtual de Arte Cubano  

Este manual contiene las instrucciones operativas completas para la administración global de la plataforma, gestión de equipo, control de permisos de artistas, auditoría de base de datos y despliegue continuo.

---

## 🔑 1. Acceso y Autenticación SuperAdmin

1. Inicia sesión en la plataforma desde el botón **"Acceso Creadores"** en la barra superior.
2. Introduce tus credenciales principales (ej: `contacto@galeriacubana.art` o usuario registrado como SuperAdmin).
3. Al autenticarte, el sistema reconocerá tu rol de **SuperAdmin** y desplegará el distintivo dorado en la barra superior: **`Panel SuperAdmin`**.
4. Haz clic en **`Panel SuperAdmin`** para abrir o cerrar el centro de control global.

---

## 🛠️ 2. Módulos del Panel de Control Global

Al abrir el panel de administración, tendrás acceso a 3 módulos principales de control del sistema:

### Módulo 1: Gestión de Artistas & Permisos de Contacto Directo
- **Dar de alta nuevo artista:**
  - Presiona **"+ Dar de Alta Nuevo Artista"**.
  - Rellena el nombre, ciudad/provincia, foto de perfil, WhatsApp/Email y biografía.
  - Define si inicia con *Contacto Directo* activado o *Gestión Asistida*.
- **Alternar Modo de Contacto Directo:**
  - En la lista de artistas registrados, puedes cambiar la modalidad de cualquier creador con un solo clic:
    - **Directo (Verde):** Las consultas de WhatsApp de sus obras van directo al teléfono personal del artista.
    - **Asistido (Amarillo):** Las consultas van dirigidas a la atención oficial de la plataforma (Ramiro / Gestores).
- **Eliminar Registro de Artista:**
  - Presiona el icono 🗑️ en la tarjeta del artista. Esto eliminará al artista y desvinculará sus obras asociadas de forma segura.

---

### Módulo 2: Control y Curaduría de Obras en Catálogo
- **Publicar obras en nombre de cualquier artista:**
  - Haz clic en **"+ Publicar Nueva Obra"**.
  - Selecciona el artista autor de la lista desplegable.
  - Ingresa título, técnica, medidas, año, precio de referencia en USD y carga las fotos con el uploader interactivo.
- **Modificar Disponibilidad:**
  - Cambia rápidamente entre **"Disponible"** y **"Reservada"** para cualquier obra del catálogo general.
- **Eliminación de Obras:**
  - Si una obra se retira definitivamente del inventario, puedes eliminarla con el botón 🗑️.

---

### Módulo 3: Equipo de Gestión & Atendientes Oficiales de la Plataforma
Administra quién apoya en la atención a compradores y logística:

- **Registrar miembro del equipo:**
  - Introduce el nombre del gestor/coordinador (ej. *Soporte Plataforma, Coordinación de Envíos*), su número de WhatsApp/Email de contacto y asigna el rol:
    - **Gestor / Coordinador:** Puede atender consultas de compradores y apoyar en la catálogo.
    - **SuperAdmin:** Acceso total al panel de control.
- **Activar / Desactivar Gestor:**
  - Haz clic en el botón de estado (● Activo / ○ Inactivo). Si un gestor se desactiva, los compradores no recibirán su número como vía de atención en el catálogo.

---

## 🔍 3. Modo Inspección / Soporte a Artistas

Como SuperAdmin, tienes acceso de asistencia técnica a cualquier perfil de artista:
1. En el portal de autogestión de perfil, puedes seleccionar cualquier artista del catálogo en el menú desplegable.
2. Esto te permitirá corregir la biografía, actualizar fotos o corregir números de contacto en caso de que un artista te solicite soporte directo.

---

## 🗄️ 4. Mantenimiento de Base de Datos (Supabase Cloud)

- **Consola de Supabase:** [supabase.com](https://supabase.com)
- **Tablas Principales:**
  - `public.artistas`: Contiene perfiles, roles y flag de `contacto_directo`.
  - `public.obras`: Registro de piezas en catálogo relacionales a `artistas`.
  - `public.contactos_plataforma`: Contactos oficiales de atención de la galería.
- **Storage Buckets:**
  - `obras-imagenes`: Fotografías de obras de arte.
  - `artistas-imagenes`: Avatares y fotos de perfil de artistas.
- **Trigger de Autoregistro:** `on_auth_user_created` registra automáticamente en `public.artistas` a cualquier usuario que cree una cuenta mediante email/password.

---

## 🌐 5. Despliegue & Dominio Web (Vercel)

- **Consola de Vercel:** [vercel.com](https://vercel.com)
- **Repositorio:** [github.com/RAMIR007/Galeria-de-Arte-II](https://github.com/RAMIR007/Galeria-de-Arte-II)
- **Despliegue Continuo (CI/CD):** Cada cambio que se envíe a la rama `main` en GitHub se compilará y actualizará en Vercel automáticamente en ~30 segundos.
- **Variables de Entorno:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

© {new Date().getFullYear()} Galería Virtual de Arte Cubano. Documento confidencial para uso operativo exclusivo del SuperAdmin.
