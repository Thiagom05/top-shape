# Arquitectura del Sistema - Top Shape

Este documento describe la arquitectura general, el objetivo del proyecto, la organización del código y el stack tecnológico de **Top Shape**. Su propósito es servir como referencia técnica tanto para nuevos desarrolladores como para el mantenimiento del sistema en producción.

---

## 1. Objetivo del Proyecto
**Top Shape** es una plataforma de coaching y transformación física diseñada para gestionar el progreso de los participantes en programas de acondicionamiento físico. 

El sistema permite a los usuarios:
* Registrar su cuenta e iniciar sesión de forma segura.
* Subir fotos de control en fases específicas (antes y después) y desde diferentes perspectivas (frente, perfil, espalda) para realizar un seguimiento visual estricto de su cambio físico.
* Acceder a recursos educativos de bienvenida, entrenamientos específicos y planes de nutrición organizados por categorías.

---

## 2. Arquitectura General y Flujo de Datos

El sistema implementa una arquitectura basada en un **Frontend SPA (Single Page Application)** conectada directamente a un backend serverless provisto por **Supabase (Backend-as-a-Service - BaaS)**. 

Este diseño desacoplado nos permite eliminar la necesidad de un servidor intermedio para operaciones comunes de CRUD, delegando la autenticación, la persistencia de datos y el almacenamiento de archivos directamente en servicios especializados de la nube mediante políticas seguras de acceso a nivel de fila (RLS - Row Level Security).

### Diagrama de Flujo General del Sistema
El flujo principal de datos y autorizaciones se propaga de la siguiente manera:

```text
React (Vite / Frontend SPA)
       │
       ▼
Supabase Auth (Gestión de Sesiones, JWT y Registro)
       │
       ▼
PostgreSQL (Supabase Database - Datos Estructurados y RLS)
       │
       ▼
Supabase Storage (Almacenamiento de Recursos y Evolución Física)
```

---

## 3. Organización del Código: Arquitectura Modular basada en Features

El frontend de la aplicación está organizado bajo un enfoque **modular basado en features (funcionalidades)**. En lugar de agrupar el código de manera plana por el rol técnico de los archivos (por ejemplo, poner todos los componentes juntos, todos los hooks juntos, etc.), los recursos se dividen y auto-contienen dentro de módulos que representan una funcionalidad específica del negocio.

### Estructura de Carpetas de Features (`src/features/`)
Cada feature dentro del directorio `src/features/` agrupa sus propios componentes, hooks, servicios y utilidades:
* **`auth/`**: Formularios de login, registro, recuperación de contraseña y hooks de estado de sesión.
* **`profile/`**: Componentes e interfaces para completar los perfiles personales y consultar datos de contacto.
* **`progress/`**: Lógica de carga y visualización de la matriz de fotos de evolución antes/después.
* **`resources/`**: Galería de videos y visualizadores de PDFs clasificados por categorías de entrenamiento y nutrición.

Este diseño modular garantiza alta cohesión, bajo acoplamiento y facilita que el proyecto escale de forma limpia sin importar el tamaño del equipo de desarrollo.

---

## 4. Stack Tecnológico

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
| **Git** | Control de Versiones | Seguimiento y versionado del código fuente y documentación del proyecto. |
| **Supabase CLI** | Infraestructura (IaC) | Herramienta local para versionar, depurar y desplegar el esquema de base de datos a través de migraciones locales. |
