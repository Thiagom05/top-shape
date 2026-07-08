# Roadmap del Proyecto - Top Shape

Este documento describe el estado actual de la implementación del proyecto y los próximos hitos a desarrollar. El progreso está dividido en tres áreas clave: **Backend**, **Frontend** y **Deployment**.

---

## Estado General del Proyecto

* **Fase Actual**: Fase 1 - Cimentación del Modelo de Datos (Completada).
* **Próxima Fase**: Fase 2 - Autenticación, Almacenamiento y Seguridad de Datos (Planificada).

---

## 1. Backend & Base de Datos
Implementación de la infraestructura del servidor de base de datos, persistencia, esquemas y lógica de almacenamiento seguro.

* [x] **Diseño de Base de Datos**: Planificación física y lógica del diagrama de entidad-relación (ERD).
* [x] **Tabla: Profiles**: Configuración de la entidad que extiende de Supabase Auth para datos de usuarios.
* [x] **Tabla: Progress Photos**: Esquema de fotos de evolución física con validaciones de unicidad.
* [x] **Tabla: Resources**: Estructura de recursos educativos para albergar videos y PDFs.
* [ ] **Supabase Storage**: Creación de buckets (`progress-photos`, `documents`, `videos`) y estructuración de carpetas.
* [ ] **Supabase Authentication**: Integración y configuración del flujo de inicio de sesión y registro de usuarios.
* [ ] **Políticas RLS (Row Level Security)**: Definición de reglas estrictas para aislar los datos privados de cada usuario e impedir accesos no autorizados.

---

## 2. Frontend & Aplicación Cliente
Desarrollo de la interfaz de usuario con React, lógica de enrutamiento y consumo de servicios de Supabase.

* [x] **Configuración Inicial del Cliente**: Setup básico de React + Vite y conexión con la API de Supabase en `src/lib/supabase.js`.
* [ ] **Integración de Autenticación**: Formularios de Login, Registro y recuperación de contraseña con sesión persistente.
* [ ] **Dashboard del Participante**:
  * [ ] Panel de visualización de rutinas y planes de alimentación por categorías.
  * [ ] Interfaz de carga y visualización de las 6 fotografías de progreso (antes/después, frente/perfil/espalda).
* [ ] **Panel de Administración (Admin Dashboard)**:
  * [ ] Gestión de usuarios registrados y control de perfiles.
  * [ ] Módulo para subir nuevos PDFs y enlaces de video directamente al storage de recursos.
  * [ ] Visor del historial y comparación de evolución de fotos de los participantes.

---

## 3. Deployment & Infraestructura
Configuración de entornos, CI/CD y publicación del software a producción.

* [ ] **Entornos de Desarrollo e Integración**: Configuración de variables de entorno seguras (`.env`) en producción y local.
* [ ] **Deploy del Frontend**: Publicación de la SPA (por ejemplo, en Vercel, Netlify o Supabase Hosting).
* [ ] **Deploy de la Base de Datos**: Migraciones de base de datos automatizadas y puesta a punto de Supabase en producción.
