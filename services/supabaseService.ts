import { supabase } from '../lib/supabaseClient';
import { Studio, GeneratedImage } from '../types';

/**
 * Converts a base64 encoded string to a Blob object.
 * @param base64 The base64 encoded string.
 * @param contentType The content type of the file (e.g., 'image/png').
 * @returns A Blob object.
 */
const base64ToBlob = (base64: string, contentType: string = '', sliceSize: number = 512): Blob => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

/**
 * Uploads a base64 image to Supabase Storage and saves its metadata to the database.
 * @param base64Image The raw base64 string of the image.
 * @param mimeType The MIME type of the image ('image/png' or 'image/jpeg').
 * @param userId The ID of the user uploading the image.
 * @param prompt The prompt used to generate the image.
 * @param style The style used for the generation.
 * @param studio The studio where the image was generated.
 * @returns The public URL of the uploaded image.
 */
export const uploadAndSaveGeneration = async (
    base64Image: string,
    mimeType: 'image/png' | 'image/jpeg',
    userId: string,
    prompt: string,
    style: string,
    studio: Studio
): Promise<string> => {
    const fileExtension = mimeType === 'image/png' ? 'png' : 'jpg';
    const blob = base64ToBlob(base64Image, mimeType);
    const filePath = `${userId}/${Date.now()}.${fileExtension}`;
    
    // 1. Upload image to Supabase Storage in the 'generations' bucket
    const { error: uploadError } = await supabase.storage
        .from('generations')
        .upload(filePath, blob);

    if (uploadError) {
        console.error("Supabase storage upload error:", uploadError);
        throw new Error(`Failed to upload image to storage: ${uploadError.message}`);
    }

    // 2. Get the public URL of the uploaded file
    const { data: urlData } = supabase.storage
        .from('generations')
        .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    // 3. Save the generation metadata to the 'generations' table in the database
    const { error: insertError } = await supabase.from('generations').insert({
        user_id: userId,
        image_url: imageUrl,
        prompt: prompt.substring(0, 1000), // Truncate prompt to avoid DB limits
        style,
        studio,
    });

    if (insertError) {
        console.error("Supabase DB insert error:", insertError);
        throw new Error(`Failed to save generation metadata: ${insertError.message}`);
    }

    return imageUrl;
};

/**
 * Fetches all generated images for a specific user from the database.
 * @param userId The ID of the user.
 * @returns A promise that resolves to an array of GeneratedImage objects.
 */
export const fetchGenerations = async (userId: string): Promise<GeneratedImage[]> => {
    const { data, error } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Supabase DB fetch error:", error);
        throw new Error(`Failed to fetch generations: ${error.message}`);
    }
    return data;
};
