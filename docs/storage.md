# Estructura de Almacenamiento - Supabase Storage

Este documento describe la arquitectura del sistema de almacenamiento de archivos de **Top Shape**, gestionado a través de **Supabase Storage**. 

> [!IMPORTANT]
> **Estado del Módulo**: 
> La infraestructura de almacenamiento descrita a continuación **no está implementada** en el entorno de desarrollo actual. Este documento representa el diseño técnico formal y planificado para el Módulo 2 del proyecto.

---

## 1. Buckets Planificados

El almacenamiento en la nube se organizará en tres buckets independientes con propósitos y configuraciones de seguridad específicas:

| Bucket | Tipo de Acceso | Formatos Permitidos | Propósito |
|---|---|---|---|
| **`progress-photos`** | Privado (Protegido por RLS) | `jpeg`, `jpg`, `png` | Fotos de progreso físico del participante agrupadas por fase. |
| **`documents`** | Lectura Autenticados | `pdf` | Planes de alimentación y rutinas en PDF cargados por los administradores. |
| **`videos`** | Lectura Autenticados | `mp4` | Videos explicativos y de bienvenida cargados por administradores. |

---

## 2. Estructura de Directorios Diseñada

### 2.1. Bucket: `progress-photos`
Este bucket contendrá las imágenes de control físico que suben los participantes. Para facilitar el orden y asegurar el correcto funcionamiento de las políticas de seguridad por RLS, se adopta la siguiente estructura jerárquica basada en directorios:

```text
progress-photos/
└── {user_id}/             <-- UUID del participante (profiles.id)
    ├── before/            <-- Carpeta para la fase inicial del proceso
    │   ├── front.jpg      <-- Vista de frente inicial
    │   ├── side.jpg       <-- Vista lateral inicial
    │   └── back.jpg       <-- Vista de espalda inicial
    └── after/             <-- Carpeta para la fase final de resultados
        ├── front.jpg      <-- Vista de frente final
        ├── side.jpg       <-- Vista lateral final
        └── back.jpg       <-- Vista de espalda final
```

#### Reglas de Acceso y Control
* **Seguridad basada en UID**: Las políticas RLS del storage asegurarán que un usuario únicamente pueda leer y escribir objetos dentro del directorio que coincida con su UUID (`{user_id}`).
* **Nomenclatura Fija**: El frontend mapeará las cargas de imágenes utilizando nombres fijos de archivo (`front.jpg`, `side.jpg`, `back.jpg`) dentro del subdirectorio de fase correspondiente (`before/` o `after/`). Las rutas relativas de almacenamiento guardadas en la tabla `progress_photos` seguirán este formato exacto: `{user_id}/before/front.jpg`.

---

### 2.2. Bucket: `documents`
Almacena los documentos de soporte del programa cargados exclusivamente por el equipo administrador de Top Shape.

* **Estructura Esperada**:
  ```text
  documents/
  ├── training.pdf           <-- Guía de rutinas y ejercicios
  └── nutrition.pdf          <-- Plan alimenticio base
  ```
* **Políticas de Acceso**:
  * **Lectura**: Permitida para cualquier usuario autenticado de la plataforma.
  * **Escritura**: Restringida únicamente al rol `'admin'` a través de la validación RLS correspondiente.

---

### 2.3. Bucket: `videos`
Almacena los archivos multimedia interactivos del programa.

* **Estructura Esperada**:
  ```text
  videos/
  └── welcome.mp4            <-- Video de bienvenida del coach
  ```
* **Políticas de Acceso**:
  * **Lectura**: Permitida para usuarios autenticados. El reproductor del frontend apuntará directamente al path del bucket.
  * **Escritura**: Permitida exclusivamente para usuarios con rol `'admin'`.
