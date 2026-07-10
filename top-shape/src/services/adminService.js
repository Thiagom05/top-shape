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
