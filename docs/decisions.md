# Registro de Decisiones de Arquitectura (ADR) - Top Shape

Este documento registra las decisiones técnicas clave tomadas durante el diseño y desarrollo de **Top Shape**, detallando el contexto, los motivos y los beneficios asociados a cada elección de arquitectura.

---

## Índice de Decisiones (ADRs)

* [ADR-001: Uso de pnpm como Gestor de Paquetes](#adr-001-uso-de-pnpm-como-gestor-de-paquetes)
* [ADR-002: Adopción de Supabase como Backend-as-a-Service (BaaS)](#adr-002-adopcion-de-supabase-como-backend-as-a-service-baas)
* [ADR-003: Modelado de Roles mediante Tipo ENUM en PostgreSQL](#adr-003-modelado-de-roles-mediante-tipo-enum-en-postgresql)
* [ADR-004: Modelado de Fases del Progreso mediante ENUM photo_phase](#adr-004-modelado-de-fases-del-progreso-mediante-enum-photo_phase)
* [ADR-005: Modelado de Ángulos Visuales mediante ENUM photo_view](#adr-005-modelado-de-angulos-visuales-mediante-enum-photo_view)
* [ADR-006: Almacenamiento de storage_path en lugar de image_url](#adr-006-almacenamiento-de-storage_path-en-lugar-de-image_url)
* [ADR-007: Relación 1:1 entre profiles y auth.users](#adr-007-relacion-11-entre-profiles-y-authusers)
* [ADR-008: Restricción de Unicidad Compuesta para Fotografías de Progreso](#adr-008-restriccion-de-unicidad-compuesta-para-fotografias-de-progreso)
* [ADR-009: Creación Automática de Perfiles mediante Trigger handle_new_user()](#adr-009-creacion-automatica-de-perfiles-mediante-trigger-handle_new_user)
* [ADR-010: Registro Inicial Simplificado y Completado de Perfil Diferido](#adr-010-registro-inicial-simplificado-y-completado-de-perfil-diferido)
* [ADR-011: Adopción de Supabase CLI y Docker Desktop para Entornos Locales](#adr-011-adopcion-de-supabase-cli-y-docker-desktop-para-entornos-locales)
* [ADR-012: Metodología de Desarrollo por Módulos Completados](#adr-012-metodologia-de-desarrollo-por-modulos-completados)

---

## ADR-001: Uso de pnpm como Gestor de Paquetes
* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
El proyecto requiere una gestión eficiente de dependencias en NodeJS. npm tradicional y yarn tienden a duplicar paquetes en disco y tienen tiempos de instalación lentos debido a la recreación constante de árboles de directorios pesados en `node_modules`.

### Motivo (Decisión)
Se decidió utilizar **pnpm** como el gestor de paquetes predeterminado para el proyecto.

### Beneficios
* **Ahorro de espacio en disco**: A través de su content-addressable store, pnpm comparte dependencias entre proyectos sin duplicar archivos.
* **Instalación ultra rápida**: Las dependencias se enlazan mediante hard links, reduciendo drásticamente el tiempo de setup del entorno.
* **Evita dependencias fantasmas**: Garantiza que el código solo tenga acceso a las dependencias declaradas explícitamente en el `package.json`.

---

## ADR-002: Adopción de Supabase como Backend-as-a-Service (BaaS)
* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
El desarrollo de Top Shape necesita base de datos relacional, autenticación y storage de archivos. Construir un backend a medida desde cero (Node, Python, etc.) requeriría alta inversión en infraestructura, código repetitivo y mantenimiento de servidores.

### Motivo (Decisión)
Se adoptó **Supabase** como backend serverless unificado. Provee PostgreSQL de forma nativa, mecanismos de autenticación y storage en la nube.

### Beneficios
* **Time-to-Market reducido**: La infraestructura principal está disponible inmediatamente, permitiendo concentrarse en el desarrollo del frontend SPA y sus features.
* **PostgreSQL Nativo**: A diferencia de soluciones NoSQL (como Firebase), permite mantener integridad referencial y realizar consultas relacionales y triggers complejos de forma nativa.
* **Seguridad Embebida**: Soporte directo para Row Level Security (RLS), protegiendo la base de datos desde el propio motor relacional.

---

## ADR-003: Modelado de Roles mediante Tipo ENUM en PostgreSQL
* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
El sistema tiene dos perfiles de usuarios diferenciados: administradores y usuarios participantes. Es crítico evitar la inserción de roles inválidos a nivel de base de datos para prevenir fallos de seguridad y escalada de privilegios.

### Motivo (Decisión)
Se definió el tipo enumerado personalizado `user_role` en PostgreSQL con los valores específicos: `'admin'` y `'user'`.

### Beneficios
* **Consistencia absoluta**: PostgreSQL rechaza en tiempo de escritura cualquier rol que no pertenezca al dominio definido.
* **Optimización de recursos**: Los enums se almacenan de forma compacta (4 bytes), siendo más eficientes que el texto variable (VARCHAR).

---

## ADR-004: Modelado de Fases del Progreso mediante ENUM `photo_phase`
* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
La evaluación visual de la evolución del participante requiere dos momentos de control fijos en el tiempo: antes y después del programa.

### Motivo (Decisión)
Se decidió implementar el tipo ENUM `photo_phase` con los valores específicos: `'before'` y `'after'`.

### Beneficios
* **Consistencia**: Evita estados intermedios inconsistentes a nivel de base de datos.
* **Facilidad en consultas**: Agiliza los filtros en el backend y la lógica de renderizado comparativo en el cliente frontend.

---

## ADR-005: Modelado de Ángulos Visuales mediante ENUM `photo_view`
* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
Para realizar un control físico completo (360°), los entrenadores necesitan evaluar fotos del participante tomadas desde tres ángulos específicos.

### Motivo (Decisión)
Se implementó el tipo ENUM `photo_view` restringido a los valores: `'front'`, `'side'` y `'back'`.

### Beneficios
* **Estandarización**: Obliga a que todo participante cumpla con el mismo protocolo visual de control físico.
* **Previene errores**: Elimina typos e inconsistencias gramaticales (como "Frente", "frental", "lateral") que ocurren al utilizar texto plano.

---

## ADR-006: Almacenamiento de `storage_path` en lugar de `image_url`
* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
Al guardar un archivo en Supabase Storage, es posible persistir su URL absoluta en la base de datos. Sin embargo, esto hace que los datos queden acoplados a una URL y dominio específicos, lo que rompería enlaces si el proyecto migra de dominio o si se requiere generar URLs firmadas temporales para archivos privados.

### Motivo (Decisión)
Se almacena la ruta de archivo relativa (`storage_path`) en las tablas `progress_photos` y `resources`. El frontend utilizará el cliente JS de Supabase para resolver y firmar la URL de acceso en tiempo de ejecución.

### Beneficios
* **Desacoplamiento**: El esquema no cambia si la URL de la API de Supabase cambia o se le añade un CDN.
* **Seguridad dinámica**: Permite la generación de URLs firmadas temporales para fotos de progreso privadas, impidiendo que enlaces estáticos queden expuestos permanentemente.

---

## ADR-007: Relación 1:1 entre `profiles` y `auth.users`
* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
Supabase aísla los datos de autenticación en el esquema interno `auth.users`, donde no es recomendable añadir campos propios del negocio. La información de perfil de Top Shape (nombre, teléfono, rol) debe almacenarse en el esquema público accesible de forma segura.

### Motivo (Decisión)
Se diseñó la tabla pública `profiles` cuya clave primaria (`id`) actúa simultáneamente como clave foránea referenciando a `auth.users.id`.

### Beneficios
* **Separación de responsabilidades**: La lógica de sesiones de Supabase queda aislada del modelo de datos de nuestro negocio.
* **Seguridad mediante RLS**: Facilita la aplicación de políticas Row Level Security (RLS) seguras mapeando directamente `auth.uid() = id`.

---

## ADR-008: Restricción de Unicidad Compuesta para Fotografías de Progreso
* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
Un participante debe subir exactamente una fotografía por cada ángulo en cada etapa. Si no existe restricción, se podrían subir múltiples imágenes para una misma fase y perspectiva (ej. dos fotos de frente iniciales), duplicando datos y desordenando el flujo.

### Motivo (Decisión)
Se agregó la restricción de unicidad compuesta `UNIQUE(user_id, phase, view)` en la tabla `progress_photos`.

### Beneficios
* **Garantía física**: La base de datos impide de manera nativa e infalible la duplicidad de capturas de progreso.
* **Estructura exacta**: Asegura que cada participante complete exactamente una cuadrícula de 6 fotografías a lo largo de su transformación (2 fases x 3 perspectivas).

---

## ADR-009: Creación Automática de Perfiles mediante Trigger `handle_new_user()`
* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
Cuando un usuario se registra a través del frontend, la cuenta se crea en `auth.users`. Si la aplicación frontend intentara insertar manualmente los datos en la tabla `profiles` después del registro, un fallo de conexión del cliente en ese instante crítico causaría una cuenta huérfana de perfil.

### Motivo (Decisión)
Se implementó un trigger en PostgreSQL llamado `handle_new_user()` que reacciona ante inserciones en `auth.users` y crea de manera automática el registro correspondiente en `profiles`.

### Beneficios
* **Integridad transaccional**: La creación del perfil se realiza a nivel de base de datos en una misma transacción física, eliminando el riesgo de cuentas sin perfil.
* **Eficiencia**: Evita llamadas de red adicionales desde el cliente frontend durante el flujo de registro.

---

## ADR-010: Registro Inicial Simplificado y Completado de Perfil Diferido
* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
Los flujos de registro que obligan a completar datos descriptivos largos (nombre, apellido, teléfono) en el primer paso reducen la conversión de usuarios nuevos por fatiga de formulario.

### Motivo (Decisión)
Se modificaron las columnas `name` y `last_name` de `profiles` para que acepten valores nulos (`NULL`). El registro inicial solicitará únicamente correo y contraseña, y la aplicación obligará al participante a completar sus datos personales (`name`, `last_name`, `phone`) en una pantalla de bienvenida durante su primer inicio de sesión.

### Beneficios
* **Experiencia de Usuario optimizada**: Registro rápido en un solo paso.
* **Flexibilidad**: El trigger inserta el perfil inmediatamente en blanco con el rol `'user'` por defecto, posponiendo la carga de datos sin romper las restricciones de la base de datos.

---

## ADR-011: Adopción de Supabase CLI y Docker Desktop para Entornos Locales
* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
Modificar las tablas y políticas RLS directamente desde el panel web de Supabase en producción es peligroso, no permite trabajar sin conexión a internet y dificulta el trabajo en equipo, ya que los cambios de base de datos no quedarían versionados.

### Motivo (Decisión)
Se adoptó **Supabase CLI** en conjunto con **Docker Desktop** para desarrollar localmente. El proyecto local está vinculado a la nube mediante `supabase link`.

### Beneficios
* **Desarrollo aislado y offline**: Permite a los desarrolladores levantar una réplica idéntica de la infraestructura de Supabase localmente.
* **Base de Datos como Código**: Las alteraciones de esquemas, triggers y RLS se guardan en archivos SQL de migración versionados en Git.
* **Despliegue seguro**: Las migraciones locales se aplican de manera incremental y controlada sobre el entorno productivo, eliminando errores manuales.

---

## ADR-012: Metodología de Desarrollo por Módulos Completados
* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
Intentar desarrollar paralelamente frontend, storage, autenticación y despliegue incrementa el desorden técnico, aumenta la cantidad de bugs y dificulta las pruebas aisladas.

### Motivo (Decisión)
Se acordó trabajar bajo una metodología estructurada de **módulos completos**, donde no se avanza al siguiente módulo hasta que el actual esté totalmente diseñado, implementado, protegido con políticas RLS y probado en local. El Módulo 1 (Base de Datos) ha sido completado bajo esta regla.

### Beneficios
* **Foco y Calidad**: El equipo concentra el 100% de su capacidad cognitiva en un solo dominio del sistema a la vez.
* **Mitigación de riesgos**: Asegura que cada fase de la infraestructura quede completamente sellada a nivel de seguridad antes de construir código que dependa de ella.
