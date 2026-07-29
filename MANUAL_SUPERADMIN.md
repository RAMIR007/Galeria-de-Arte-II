# 👑 Manual Operativo para SuperAdmin - Galería Virtual de Arte Cubano

**Titularidad:** Dirección General - Galería Virtual de Arte Cubano  
**Rol:** SuperAdmin & Coordinación General  
**Modelo de Negocio:** Comisión de Galería (20%) / Payout Neto Artista (80%) con Consignación Exclusiva por Obra  

Este manual contiene las instrucciones operativas completas para la administración global de la plataforma, gestión de equipo, contratos de consignación exclusiva, auditoría de base de datos y resguardo de la identidad institucional.

---

## 🏛️ 1. Modelo Comercial: Consignación Variable, Privacidad & Reparto

* **Regla de Negocio Flexible (Personalizable por el SuperAdmin):**
  * Las obras se manejan bajo el régimen de **Consignación Exclusiva acordada con el Artista**.
  * El porcentaje de comisión de la galería **NO es fijo**: es personalizable únicamente por el SuperAdmin para cada artista (ej. 20%, 15%, 10%, etc.).
  * **Privacidad Estricta de Datos Financieros:**
    * Los coleccionistas y usuarios públicos únicamente ven el **precio de venta final** ($ USD / € EUR) sin ningún porcentaje ni comisión expuesta.
    * Los artistas únicamente ven su **propio porcentaje** y contrato en su portal privado, jamás el de otros artistas.
    * El SuperAdmin, Gestores y Curador tienen acceso al desglose completo de repartos en el Panel Admin.
* **Rol de Curador & Porcentaje sobre Ventas:**
  * El SuperAdmin puede registrar a un **Curador de Arte** y asignarle un porcentaje específico de comisión sobre las ventas realizadas (ej. 5% de las ventas).
  * La calculadora multinivel refleja automáticamente la división: **Pago Neto Artista**, **Honorarios Curador** y **Margen Neto Galería**.

---

## 🔑 2. Acceso y Autenticación SuperAdmin

1. Inicia sesión en la plataforma desde el botón **"Acceso Creadores"** en la barra superior.
2. Introduce tus credenciales principales (ej: `contacto@galeriacubana.art` o usuario registrado como SuperAdmin).
3. Al autenticarte, el sistema reconocerá tu rol de **SuperAdmin** y desplegará el distintivo dorado: **`Panel SuperAdmin`**.

---

## 🛠️ 3. Módulos del Panel de Control Global

### Módulo 1: Gestión de Artistas & Permisos de Comisión
- **Ajustar comisión por artista:**
  - En la lista de artistas, el SuperAdmin dispone del selector `Fee: X%` para modificar el porcentaje asignado a ese creador.
- **Dar de alta nuevo artista:**
  - Presiona **"+ Agregar Nuevo Artista"** e ingresa el porcentaje de comisión acordado (por defecto 20%).
- **Alternar Modo de Contacto Directo:**
  - **Directo (Verde):** Las consultas de WhatsApp de sus obras van directo al teléfono personal del artista.
  - **Asistido (Amarillo):** Las consultas van dirigidas a la atención de la plataforma.

---

### Módulo 2: Control y Curaduría de Obras en Catálogo
- **Publicar obras en consignación exclusiva:**
  - Ingresa título, técnica, medidas, año y precio de referencia en USD.
  - El sistema desglosa los valores según la tasa de comisión específica del artista.

---

### Módulo 3: Equipo de Gestión & Curador de Arte
- **Registrar miembro del equipo o Curador:**
  - Registra a gestores o al **Curador de Arte** seleccionando su rol y asignando su porcentaje de comisión por ventas (`% Ventas`, ej. 5%).

---

## 🌐 4. Despliegue & Mantenimiento (Supabase & Vercel)

- **Consola de Supabase:** [supabase.com](https://supabase.com)
- **Consola de Vercel:** [vercel.com](https://vercel.com)
- **Variables de Entorno:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

© {new Date().getFullYear()} Galería Virtual de Arte Cubano. Documento confidencial para uso operativo exclusivo del SuperAdmin.
