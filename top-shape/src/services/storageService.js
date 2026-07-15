import { supabase } from "../lib/supabase";

/**
 * Sube una foto de progreso al bucket 'progress-photos'.
 * La ruta del archivo será: {userId}/{phase}/{view}.jpg
 * 
 * @param {string} userId - UUID del usuario.
 * @param {File} file - Objeto File del input.
 * @param {'before' | 'after'} phase - Fase del progreso.
 * @param {'front' | 'side' | 'back'} view - Ángulo visual.
 * @returns {Promise<string>} - Ruta relativa del archivo guardado.
 */
export async function uploadProgressPhoto(userId, file, phase, view) {
    const filePath = `${userId}/${phase}/${view}.jpg`;

    // Subimos o sobreescribimos la foto (upsert: true)
    const { data, error } = await supabase.storage
        .from("progress-photos")
        .upload(filePath, file, {
            upsert: true,
            contentType: file.type
        });

    if (error) {
        throw error;
    }

    return data.path;
}

/**
 * Obtiene una URL firmada para poder visualizar una foto de progreso privada.
 * 
 * @param {string} userId - UUID del usuario.
 * @param {'before' | 'after'} phase - Fase del progreso.
 * @param {'front' | 'side' | 'back'} view - Ángulo visual.
 * @param {number} expiresIn - Segundos de validez de la firma (default: 3600).
 * @returns {Promise<string>} - URL firmada del archivo.
 */
export async function getProgressPhotoUrl(userId, phase, view, expiresIn = 3600) {
    const filePath = `${userId}/${phase}/${view}.jpg`;

    const { data, error } = await supabase.storage
        .from("progress-photos")
        .createSignedUrl(filePath, expiresIn);

    if (error) {
        throw error;
    }

    return data.signedUrl;
}

/**
 * Obtiene una URL firmada para descargar/ver un documento del programa.
 * 
 * @param {string} fileName - Nombre del archivo (ej: 'training.pdf').
 * @param {number} expiresIn - Segundos de validez de la firma.
 * @returns {Promise<string>} - URL firmada.
 */
export async function getDocumentUrl(fileName, expiresIn = 3600) {
    const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(fileName, expiresIn);

    if (error) {
        throw error;
    }

    return data.signedUrl;
}

/**
 * Obtiene una URL firmada para reproducir un video del programa.
 * 
 * @param {string} fileName - Nombre del archivo (ej: 'welcome.mp4').
 * @param {number} expiresIn - Segundos de validez de la firma.
 * @returns {Promise<string>} - URL firmada.
 */
export async function getVideoUrl(fileName, expiresIn = 7200) {
    const { data, error } = await supabase.storage
        .from("videos")
        .createSignedUrl(fileName, expiresIn);

    if (error) {
        throw error;
    }

    return data.signedUrl;
}

/**
 * Guarda o actualiza el registro de la foto de progreso en la base de datos (public.progress_photos).
 */
export async function saveProgressPhotoRecord(userId, phase, view, storagePath) {
    const { data, error } = await supabase
        .from("progress_photos")
        .upsert({
            user_id: userId,
            phase,
            view,
            image_url: storagePath,
            uploaded_at: new Date().toISOString()
        }, {
            onConflict: "user_id,phase,view"
        });

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Obtiene todos los registros de fotos de progreso de un participante.
 */
export async function getUserPhotos(userId) {
    const { data, error } = await supabase
        .from("progress_photos")
        .select("*")
        .eq("user_id", userId);

    if (error) {
        throw error;
    }

    return data;
}
