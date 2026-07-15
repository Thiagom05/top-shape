/**
 * Comprime un archivo de imagen en el cliente de manera asíncrona usando importación dinámica.
 * Redimensiona a un máximo de 1200px de ancho/alto y un peso objetivo de 200 KB.
 * 
 * @param {File} file - El objeto File de la imagen original.
 * @returns {Promise<File>} - El archivo optimizado listo para subir a Supabase.
 */
export async function compressImage(file) {
    try {
        // Carga diferida dinámica de la librería (Code Splitting)
        const { default: imageCompression } = await import("browser-image-compression");

        const options = {
            maxSizeMB: 0.2, // 200 KB máximo (0.2 MB)
            maxWidthOrHeight: 1200, // Ancho o alto máximo de 1200px
            useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        
        // Re-empaquetamos para asegurar que conserve el nombre del archivo original
        return new File([compressedFile], file.name, {
            type: compressedFile.type,
            lastModified: Date.now()
        });
    } catch (error) {
        console.error("Error al optimizar la imagen, usando archivo original como fallback:", error);
        // Fallback seguro: si falla la compresión, devolvemos el archivo original
        return file;
    }
}
