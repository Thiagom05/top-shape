# Registro de Decisiones de Arquitectura (ADR) - Top Shape

Este documento registra las decisiones técnicas clave tomadas durante el diseño y desarrollo de **Top Shape**, detallando el contexto, los motivos y los beneficios asociados a cada elección de arquitectura.

---

## Índice de Decisiones (ADRs)

* [ADR-001: Uso de pnpm como Gestor de Paquetes](#adr-001-uso-de-pnpm-como-gestor-de-paquetes)
* [ADR-002: Adopción de Supabase como Backend-as-a-Service (BaaS)](#adr-002-adopcion-de-supabase-como-backend-as-a-service-baas)
* [ADR-003: Modelado de Roles mediante Tipo ENUM en PostgreSQL](#adr-003-modelado-de-roles-mediante-tipo-enum-en-postgresql)
* [ADR-004: Modelado de Fases del Progreso (phase) mediante ENUM](#adr-004-modelado-de-fases-del-progreso-phase-mediante-enum)
* [ADR-005: Modelado de Ángulos Visuales (view) mediante ENUM](#adr-005-modelado-de-angulos-visuales-view-mediante-enum)
* [ADR-006: Almacenamiento de storage_path en lugar de image_url](#adr-006-almacenamiento-de-storage_path-en-lugar-de-image_url)
* [ADR-007: Relación 1:1 entre profiles y auth.users](#adr-007-relacion-11-entre-profiles-y-authusers)
* [ADR-008: Restricción de Unicidad Compuesta para Fotografías de Progreso](#adr-008-restriccion-de-unicidad-compuesta-para-fotografias-de-progreso)

---

## ADR-001: Uso de pnpm como Gestor de Paquetes

* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
El proyecto requiere una gestión eficiente de dependencias en NodeJS. npm tradicional y yarn v1 tienden a duplicar paquetes en disco y tienen tiempos de instalación lentos debido a la recreación constante de árboles de directorios pesados en `node_modules`.

### Motivo (Decisión)
Se decidió utilizar **pnpm** como el gestor de paquetes predeterminado para el monorrepositorio y las subcarpetas del frontend.

### Beneficio
* **Ahorro de espacio en disco**: A través de su almacén direccionable por contenido (content-addressable store), pnpm comparte dependencias entre proyectos sin duplicar archivos.
* **Instalación ultra rápida**: Las dependencias se enlazan mediante enlaces duros (hard links), reduciendo el tiempo de setup del proyecto a una fracción de lo que requiere npm o yarn.
* **Evita dependencias fantasmas**: Garantiza que el código solo tenga acceso a las dependencias declaradas explícitamente en el `package.json`.

---

## ADR-002: Adopción de Supabase como Backend-as-a-Service (BaaS)

* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
El desarrollo de Top Shape necesita una base de datos relacional robusta, autenticación de usuarios y almacenamiento de recursos (PDFs, fotos y videos). Desarrollar un backend personalizado desde cero (Node/Express, Django, etc.) aumentaría significativamente los tiempos de entrega, la complejidad y el mantenimiento del servidor.

### Motivo (Decisión)
Se adoptó **Supabase** como backend serverless unificado. Provee PostgreSQL de forma nativa, mecanismos de autenticación out-of-the-box y un servicio de storage escalable.

### Beneficio
* **Time-to-Market reducido**: La infraestructura principal está disponible inmediatamente, permitiendo concentrar el esfuerzo de desarrollo en la interfaz y la experiencia de usuario.
* **PostgreSQL Nativo**: A diferencia de otras soluciones serverless (como Firebase), no dependemos de bases de datos NoSQL, lo que nos permite mantener la integridad referencial y realizar consultas relacionales complejas.
* **Seguridad Embebida**: Soporte nativo para Row Level Security (RLS), protegiendo la base de datos directamente desde el motor de PostgreSQL.

---

## ADR-003: Modelado de Roles mediante Tipo ENUM en PostgreSQL

* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
El sistema tiene dos perfiles de usuarios bien diferenciados: administradores (entrenadores/coaches) y usuarios comunes (participantes). Es crítico evitar valores inválidos de roles a nivel de base de datos para prevenir escaladas de privilegios indeseadas.

### Motivo (Decisión)
Se decidió definir un tipo enumerado personalizado (`user_role`) en PostgreSQL con los valores específicos: `'admin'` y `'user'`.

### Beneficio
* **Consistencia de datos**: PostgreSQL rechaza cualquier intento de insertar un rol que no esté predefinido en la base de datos.
* **Eficiencia de almacenamiento**: Los tipos ENUM se almacenan de forma compacta (4 bytes por valor en PostgreSQL), siendo más eficientes que cadenas de texto plano de longitud variable.
* **Auto-documentación**: El esquema es auto-explicativo a nivel de sistema, facilitando la comprensión del dominio de la aplicación.

---

## ADR-004: Modelado de Fases del Progreso (phase) mediante ENUM

* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
La evaluación visual de los participantes se divide estrictamente entre la fase inicial de diagnóstico y la fase final de resultados del programa de acondicionamiento.

### Motivo (Decisión)
Se decidió implementar un tipo ENUM (`progress_phase`) con los valores fijos `'before'` y `'after'`.

### Beneficio
* **Garantía en el dominio**: Limita los datos visuales exclusivamente a los dos puntos de control establecidos en la metodología del programa, previniendo estados inconsistentes.
* **Mantenimiento simplificado**: Facilita el filtrado y comparación en el frontend mediante consultas booleanas o de coincidencia exacta sumamente rápidas.

---

## ADR-005: Modelado de Ángulos Visuales (view) mediante ENUM

* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
Para cada fase del control físico, el participante debe proporcionar tres ángulos visuales estandarizados para que el entrenador pueda realizar una evaluación 360° del cuerpo.

### Motivo (Decisión)
Se creó el tipo ENUM (`progress_view`) con los valores específicos `'front'`, `'side'` y `'back'`.

### Beneficio
* **Estandarización del progreso**: Asegura que todo participante cumpla con el mismo protocolo visual de control fotográfico.
* **Validación estricta**: Previene el registro de ángulos no contemplados o inválidos (por ejemplo, textos libres que introduzcan typos como "frente", "costado", etc.).

---

## ADR-006: Almacenamiento de storage_path en lugar de image_url

* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
Al guardar un archivo en Supabase Storage, se puede guardar la URL pública absoluta (`image_url`) o la ruta interna del objeto (`storage_path`). Las URLs absolutas son rígidas y pueden cambiar si se altera el dominio de la API de Supabase, el bucket cambia de nombre o se introduce un CDN de distribución de contenido.

### Motivo (Decisión)
Se almacena la ruta de archivo relativa (`storage_path`) dentro de la base de datos en lugar de la URL absoluta. El frontend utilizará el SDK de Supabase para resolver dinámicamente la URL firmada o pública en tiempo de ejecución.

### Beneficio
* **Flexibilidad**: Si la aplicación migra de proveedor o el subdominio de Supabase cambia, los datos de la base de datos permanecen inalterados y funcionales.
* **Seguridad**: Permite generar URLs firmadas temporales para recursos privados (como fotos de progreso), limitando el tiempo que una imagen es accesible en internet.
* **Consistencia**: Menor tamaño de almacenamiento en las celdas de la tabla y mayor facilidad de refactorización.

---

## ADR-007: Relación 1:1 entre profiles y auth.users

* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
Supabase aísla la tabla de autenticación (`auth.users`) en un esquema interno seguro (`auth`). No es recomendable guardar información de perfil adicional (nombre, teléfono, rol) directamente en `auth.users`, ya que este esquema está reservado para la lógica de sesión de Supabase y las operaciones de base de datos directa sobre él están limitadas.

### Motivo (Decisión)
Se decidió crear una tabla `profiles` en el esquema público (`public`) cuya clave primaria `id` es también una clave foránea referenciando directamente a `auth.users.id`.

### Beneficio
* **Separación de responsabilidades**: La lógica de perfiles y roles del negocio vive separada de la lógica interna de sesiones del sistema de autenticación.
* **Extensibilidad**: Permite añadir campos descriptivos y específicos a los usuarios sin interferir en los procesos de autenticación, logueo y actualización de contraseñas.
* **Seguridad y RLS**: Simplifica la aplicación de políticas RLS para proteger los perfiles basándose en la coincidencia del ID del usuario autenticado.

---

## ADR-008: Restricción de Unicidad Compuesta para Fotografías de Progreso

* **Fecha**: 8 de Julio, 2026
* **Estado**: Aceptado

### Contexto
Un participante solo debe tener una única foto por cada perspectiva de su evolución física en cada fase del programa (antes o después). Si no se limita esto a nivel de base de datos, el usuario podría subir múltiples fotos de frente para el "antes" (before), generando inconsistencias de datos y consumiendo almacenamiento innecesario.

### Motivo (Decisión)
Se implementó una restricción de unicidad compuesta `UNIQUE(user_id, phase, view)` en la tabla `progress_photos`.

### Beneficio
* **Garantía absoluta de integridad**: La base de datos rechaza inserciones de fotos duplicadas para una misma combinación de fase y perspectiva.
* **Topología exacta de 6 fotos**: Garantiza que cada usuario tenga exactamente un máximo de 6 fotografías registradas en su historial del programa (2 fases x 3 perspectivas).
* **Consistencia en la UI**: El frontend siempre puede consultar con total certeza el registro único para cada combinación, eliminando la necesidad de realizar filtros complejos o lidiar con ambigüedades.
