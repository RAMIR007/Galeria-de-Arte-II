# 👑 Manual Operativo para SuperAdmin - Galería Virtual de Arte Cubano

**Titularidad:** Dirección General - Galería Virtual de Arte Cubano  
**Rol:** SuperAdmin & Coordinación General  
**Modelo de Negocio:** Comisión de Galería (20%) / Payout Neto Artista (80%) con Consignación Exclusiva por Obra  

Este manual contiene las instrucciones operativas completas para la administración global de la plataforma, gestión de equipo, contratos de consignación exclusiva, auditoría de base de datos y resguardo de la identidad institucional.

---

## 🏛️ 1. Modelo Comercial: Comisión 80/20 & Consignación Exclusiva

* **Regla de Negocio (Norma Internacional):**
  * Toda obra catalogada se maneja bajo el régimen de **Consignación Exclusiva por Obra**.
  * De la venta final: la **Galería retiene el 20%** (gastos de plataforma, curaduría, certificación y marketing) y liquida el **80% neto al artista**.
* **Contrato Digital de Consignación:**
  * Accesible e imprimible directamente en el panel del artista y superadmin (`ConsignmentContractModal.tsx`).
* **Anonimato e Identidad Institucional:**
  * Los certificados de autenticidad y documentos oficiales están firmados bajo la credencial anónima **"Dirección General - Galería Virtual de Arte Cubano"**.

---

## 🔑 2. Acceso y Autenticación SuperAdmin

1. Inicia sesión en la plataforma desde el botón **"Acceso Creadores"** en la barra superior.
2. Introduce tus credenciales principales (ej: `contacto@galeriacubana.art` o usuario registrado como SuperAdmin).
3. Al autenticarte, el sistema reconocerá tu rol de **SuperAdmin** y desplegará el distintivo dorado: **`Panel SuperAdmin`**.

---

## 🛠️ 3. Módulos del Panel de Control Global

### Módulo 1: Gestión de Artistas & Perfiles Multimedia
- **Dar de alta nuevo artista:**
  - Presiona **"+ Dar de Alta Nuevo Artista"**.
  - Rellena nombre, ciudad/provincia, foto de perfil, WhatsApp/Email, video de presentación (YouTube/Vimeo/MP4), fotos de taller y archivos PDF.
- **Alternar Modo de Contacto Directo:**
  - **Directo (Verde):** Las consultas de WhatsApp de sus obras van directo al teléfono personal del artista.
  - **Asistido (Amarillo):** Las consultas van dirigidas a la atención de la plataforma.

---

### Módulo 2: Control y Curaduría de Obras en Catálogo
- **Publicar obras en consignación exclusiva:**
  - Ingresa título, técnica, medidas, año, precio de referencia en USD y carga las fotos.
  - El sistema muestra el desglose dinámico: **Precio Venta (100%)**, **Comisión Galería (20%)** y **Neto Artista (80%)**.

---

### Módulo 3: Equipo de Gestión & Atendientes Oficiales
- **Registrar miembro del equipo:**
  - Registra gestores o coordinadores con su número de WhatsApp/Email de contacto.

---

## 🌐 4. Despliegue & Mantenimiento (Supabase & Vercel)

- **Consola de Supabase:** [supabase.com](https://supabase.com)
- **Consola de Vercel:** [vercel.com](https://vercel.com)
- **Variables de Entorno:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

© {new Date().getFullYear()} Galería Virtual de Arte Cubano. Documento confidencial para uso operativo exclusivo del SuperAdmin.
