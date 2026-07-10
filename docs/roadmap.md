# Roadmap del Proyecto - Top Shape

Este documento describe el estado de implementación del proyecto y los próximos hitos a desarrollar en base a la finalización del **Módulo 1 (Base de Datos)**.

---

## Estado de Avance del Proyecto

* **Módulo Completado**: 🟩 Módulo 1 - Base de Datos
* **Módulo en Progreso**: 🟨 Módulo 2 - Storage (Almacenamiento)
* **Próximos Módulos**: ⬜ Auth, Dashboard, Panel de Administración y Despliegue

---

## Listado de Hitos y Tareas

### 🌐 Arquitectura y Herramientas Iniciales
* [x] **Arquitectura Inicial**: Planificación conceptual de la SPA y del backend serverless.
* [x] **Supabase CLI**: Configuración del entorno de desarrollo local con Docker Desktop y vinculación mediante `supabase link`.
* [x] **Versionado por Migraciones**: Establecimiento del flujo de control de versiones de base de datos como código.

### 🗄️ Módulo 1: Base de Datos & Modelado
* [x] **Estructura de Base de Datos**: Creación e implementación de tablas en PostgreSQL.
  * [x] **Tabla Profiles**: Datos adicionales del participante enlazados 1:1.
  * [x] **Tabla Progress Photos**: Registro de fotos de progreso físico.
  * [x] **Tabla Resources**: Catálogo de videos y guías escritas.
* [x] **Tipos ENUM**: Implementación de validaciones a nivel de motor (`user_role`, `photo_phase`, `photo_view`, `resource_type`, `resource_category`).
* [x] **Seguridad RLS (Row Level Security)**: Aislamiento por usuario de todas las tablas en base a `auth.uid()`.
* [x] **Políticas de Acceso (Policies)**: Reglas granulares de lectura y escritura para perfiles, fotos y recursos.
* [x] **Función Auxiliar**: Creación de `public.is_admin()` para centralizar permisos de administración.
* [x] **Automatización por Trigger**: Implementación de `handle_new_user()` para crear perfiles automáticos.

### 📦 Módulo 2: Storage (Almacenamiento)
* [/] **Configuración de Buckets**: Creación de los repositorios de almacenamiento (`progress-photos`, `documents`, `videos`) en Supabase Storage (en progreso).
* [ ] **Políticas RLS en Storage**: Protección a nivel de directorio para aislar las fotos privadas de cada usuario según su UUID.
* [ ] **Subida e Integración**: Desarrollo en frontend del cargador de imágenes y visualizador de recursos.

### 🔐 Módulo 3: Autenticación & Flujo de Usuarios
* [ ] **Autenticación en Frontend**: Formularios de login y registro.
* [ ] **Registro Simplificado**: Creación de cuentas solicitando inicialmente solo correo y contraseña.
* [ ] **Completado de Perfil**: Interfaz obligatoria para ingresar datos de perfil (nombre, apellido, teléfono) en el primer inicio de sesión del usuario.

### 💻 Módulo 4: Interfaces (Dashboards)
* [ ] **Dashboard del Participante**:
  * [ ] Panel de visualización de rutinas y planes de nutrición.
  * [ ] Cargador y comparador de las 6 fotografías de progreso.
* [ ] **Panel de Administración (Admin Dashboard)**:
  * [ ] Visualización de participantes y comparación interactiva de fotos antes/después.
  * [ ] Carga y publicación de nuevos PDFs y videos de entrenamiento.

### 🚀 Módulo 5: Despliegue e Infraestructura
* [ ] **Configuración de Entornos**: Integración de variables secretas en producción.
* [ ] **Deploy de la Base de Datos**: Despliegue automático de migraciones a producción.
* [ ] **Deploy del Frontend**: Alojamiento público de la SPA.

---

## Leyenda de Estados
* ✅ **Completado**: El requerimiento está programado, probado y versionado.
* 🟡 **En Progreso**: Actualmente bajo diseño o codificación.
* ⬜ **Pendiente**: Planificado para futuros ciclos de desarrollo.
