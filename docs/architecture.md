# Arquitectura del Sistema - Top Shape

Este documento describe la arquitectura general, el objetivo del proyecto y el stack tecnológico de **Top Shape**. Su propósito es servir como referencia técnica tanto para nuevos desarrolladores como para el mantenimiento del sistema en producción.

---

## 1. Objetivo del Proyecto
**Top Shape** es una plataforma de coaching y transformación física diseñada para gestionar el progreso de los participantes en programas de acondicionamiento físico. 

El sistema permite a los usuarios:
* Registrar sus datos de contacto y perfil.
* Subir fotos de control en fases específicas (antes y después) y desde diferentes ángulos (frente, perfil, espalda) para realizar un seguimiento visual estricto de su cambio físico.
* Acceder a recursos educativos de bienvenida, entrenamientos específicos y planes de nutrición organizados por categorías.

---

## 2. Arquitectura General
El sistema implementa una arquitectura basada en **Frontend SPA (Single Page Application)** conectada directamente a un backend serverless provisto por **Supabase (Backend-as-a-Service - BaaS)**. 

Este diseño desacoplado nos permite eliminar la necesidad de un servidor intermedio para operaciones comunes de CRUD, delegando la autenticación, la persistencia de datos y el almacenamiento de archivos directamente en servicios especializados de la nube mediante políticas seguras de acceso a nivel de fila (RLS - Row Level Security).

### Diagrama de Componentes del Sistema

```text
+---------------------------------------------------------------+
|                         FRONTEND SPA                          |
|                 (React v19 + React Router v7)                 |
+----------------------+----------------+-----------------------+
                       |                |
     HTTPS (Auth API)  |                |  HTTPS (Storage API)
                       v                v
+----------------------+---+        +---+-----------------------+
|      SUPABASE AUTH       |        |     SUPABASE STORAGE      |
|  - Gestión de sesiones   |        |   - progress-photos       |
|  - Registro y login      |        |   - documents             |
|  - Proveedor JWT         |        |   - videos                |
+----------------------+---+        +---------------------------+
                       |
                       | Vincula ID del usuario (auth.users)
                       v
+----------------------+----------------------------------------+
|                 SUPABASE DATABASE (PostgreSQL)                |
|  - Tablas: profiles, progress_photos, resources              |
|  - Tipos ENUM dedicados para validar estados                  |
+---------------------------------------------------------------+
```

---

## 3. Stack Tecnológico

El proyecto está construido utilizando herramientas modernas de desarrollo web enfocadas en rendimiento, robustez y una excelente experiencia de desarrollo (DX):

| Tecnología | Componente | Propósito |
|---|---|---|
| **React (v19)** | Frontend | Biblioteca principal para la interfaz de usuario basada en componentes reactivos. |
| **Vite (v8)** | Frontend Tooling | Entorno de desarrollo rápido y empaquetador de la SPA mediante HMR ultra rápido. |
| **TypeScript** | Frontend | Superset de JavaScript para garantizar el tipado estático y robustez del código. |
| **pnpm** | Package Manager | Gestor de paquetes eficiente mediante enlaces duros, optimizando el espacio en disco y la velocidad de instalación. |
| **React Router (v7)** | Enrutamiento | Manejo del sistema de navegación interna de la aplicación. |
| **Supabase** | Backend (BaaS) | Infraestructura serverless que provee base de datos, autenticación y storage unificados. |
| **PostgreSQL** | Base de Datos | Motor de base de datos relacional para el almacenamiento estructurado y transaccional. |
| **Supabase Auth** | Autenticación | Control de accesos, creación de cuentas y validación de tokens JWT. |
| **Supabase Storage** | Almacenamiento | Guardado de recursos binarios como imágenes de progreso, PDFs y videos explicativos. |
