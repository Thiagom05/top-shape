import { supabase } from "../lib/supabase";

/**
 * Obtiene la lista de todos los participantes del reto (role = 'user').
 */
export async function getParticipants() {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "user")
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Obtiene la información del perfil de un participante específico.
 */
export async function getParticipantProfile(userId) {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Obtiene las referencias de las fotos de progreso de un participante.
 */
export async function getParticipantPhotos(userId) {
    const { data, error } = await supabase
        .from("progress_photos")
        .select("*")
        .eq("user_id", userId);

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Sube un recurso administrativo (PDF o video) al almacenamiento de Supabase.
 * Sobrescribe el archivo si ya existe (upsert: true).
 */
export async function uploadResourceFile(file, fileName, type) {
    const bucket = type === "pdf" ? "documents" : "videos";

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
            upsert: true,
            contentType: file.type
        });

    if (error) {
        throw error;
    }

    return data.path;
}

/**
 * Obtiene la lista de todos los recursos que son videos (para recursos adicionales).
 */
export async function fetchAdminResourceVideos() {
    const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("type", "video")
        .eq("category", "training")
        .order("created_at", { ascending: true });

    if (error) {
        throw error;
    }

    return data;
}

/**
 * Agrega un nuevo video de recurso: sube el archivo al storage y crea el registro en la base de datos.
 */
export async function addResourceVideo(title, subtitle, file) {
    // Generar un nombre único basado en timestamp para evitar sobreescribir otros
    const fileExt = file.name.split('.').pop() || 'mp4';
    const uniqueFileName = `resource_video_${Date.now()}.${fileExt}`;

    // 1. Subir el archivo al Storage
    const { error: storageError } = await supabase.storage
        .from("videos")
        .upload(uniqueFileName, file, {
            contentType: file.type
        });

    if (storageError) {
        throw storageError;
    }

    const formattedTitle = `${title} | ${subtitle}`;

    // 2. Insertar el registro en la tabla resources
    const { data: dbData, error: dbError } = await supabase
        .from("resources")
        .insert([
            {
                title: formattedTitle,
                type: "video",
                category: "training",
                storage_path: uniqueFileName
            }
        ])
        .select();

    if (dbError) {
        // Si falla la BD, intentamos limpiar el archivo subido
        await supabase.storage.from("videos").remove([uniqueFileName]);
        throw dbError;
    }

    return dbData[0];
}

/**
 * Elimina un video de recurso: borra el registro de la base de datos y el archivo del storage.
 */
export async function deleteResourceVideo(id, storagePath) {
    // 1. Eliminar el registro en la base de datos
    const { error: dbError } = await supabase
        .from("resources")
        .delete()
        .eq("id", id);

    if (dbError) {
        throw dbError;
    }

    // 2. Eliminar el archivo del Storage
    if (storagePath) {
        const { error: storageError } = await supabase.storage
            .from("videos")
            .remove([storagePath]);
        
        if (storageError) {
            console.warn("No se pudo eliminar el archivo del Storage:", storageError.message);
        }
    }
}
