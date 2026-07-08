# Estructura de Almacenamiento - Supabase Storage

Este documento describe la arquitectura del sistema de almacenamiento de archivos de **Top Shape**, gestionado a través de **Supabase Storage**. Se definen los buckets de almacenamiento, el tipo de archivos que albergan, las políticas de acceso y la estructura lógica de los directorios.

---

## 1. Catálogo de Buckets

El almacenamiento en la nube se organiza en tres buckets independientes con propósitos y configuraciones de seguridad específicas:

| Bucket | Tipo de Acceso | Formatos Permitidos | Propósito |
|---|---|---|---|
| **`progress-photos`** | Privado (Protegido por RLS) | `jpeg`, `jpg`, `png` | Fotos de progreso físico de los participantes (antes/después, frontal/perfil/espalda). |
| **`documents`** | Público / Lectura Autenticados | `pdf` | Planes de alimentación, guías escritas y rutinas en PDF de los entrenadores. |
| **`videos`** | Público / Lectura Autenticados | `mp4`, `webm` | Tutoriales de técnicas de ejercicios y videos de bienvenida. |

---

## 2. Descripción de Buckets y Estructura de Archivos

### 2.1. Bucket: `progress-photos`
Este bucket contiene las imágenes de control físico que suben los participantes. Dado que son datos personales sensibles, requiere restricciones de seguridad estrictas.

* **Estructura lógica de directorios**:
  Los archivos se organizan por carpetas utilizando el identificador único del usuario (`UUID`), lo que simplifica la segmentación y las reglas de seguridad.
  ```text
  progress-photos/
  └── {user_id}/
      ├── before_front.jpg
      ├── before_side.jpg
      ├── before_back.jpg
      ├── after_front.jpg
      ├── after_side.jpg
      └── after_back.jpg
  ```
* **Acceso y Seguridad**:
  * **Acceso Privado**: El bucket no tiene URL de acceso público.
  * **Políticas RLS**:
    * **Lectura**: Un usuario autenticado solo puede leer y descargar sus propias fotos. Los administradores pueden leer las fotos de todos los participantes.
    * **Escritura (Inserción/Actualización)**: Un usuario autenticado solo puede subir archivos dentro de su directorio `{user_id}/`.
    * **Eliminación**: Deshabilitada para usuarios regulares para preservar el historial de progreso. Solo administradores pueden realizar limpiezas.

---

### 2.2. Bucket: `documents`
Almacena archivos PDF de soporte para los participantes. Estos documentos son cargados exclusivamente por el equipo de administración de Top Shape.

* **Estructura lógica de directorios**:
  Se estructuran por categorías que coinciden con las categorías temáticas de los recursos:
  ```text
  documents/
  ├── welcome/
  │   └── guia_de_bienvenida.pdf
  ├── training/
  │   ├── rutina_hipertrofia_principiantes.pdf
  │   └── guia_tecnica_estiramiento.pdf
  └── nutrition/
      ├── plan_alimentario_base.pdf
      └── lista_de_compras_saludables.pdf
  ```
* **Acceso y Seguridad**:
  * **Acceso de Lectura**: Público para todos los usuarios de la plataforma que estén autenticados, lo que permite visualizar los archivos mediante enlaces firmados o URLs públicas controladas.
  * **Acceso de Escritura**: Restringido exclusivamente al rol `admin`. Los usuarios regulares no tienen permisos para subir ni modificar estos archivos.

---

### 2.3. Bucket: `videos`
Almacena los contenidos multimedia para el aprendizaje dinámico y guía de ejercicios.

* **Estructura lógica de directorios**:
  Al igual que los documentos, se agrupan temáticamente para mantener una fácil administración y mantenimiento:
  ```text
  videos/
  ├── welcome/
  │   └── video_bienvenida_coach.mp4
  ├── training/
  │   ├── ejecucion_sentadilla_perfecta.mp4
  │   └── tecnica_peso_muerto.mp4
  └── nutrition/
      └── preparacion_viandas_semanales.mp4
  ```
* **Acceso y Seguridad**:
  * **Acceso de Lectura**: Permitido para usuarios autenticados. Se recomienda el uso de reproductores de video HTML5 en el frontend que apunten a los recursos cargados.
  * **Acceso de Escritura**: Exclusivo para administradores (`admin`). Se aconseja limitar el tamaño máximo de subida para prevenir el agotamiento de recursos del plan de Supabase.
