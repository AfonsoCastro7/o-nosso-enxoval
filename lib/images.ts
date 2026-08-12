import { supabase } from "@/lib/supabase/client";

const BUCKET = "product-images";
const SIGNED_URL_SECONDS = 60 * 60;

function dataUrlToBlob(dataUrl: string) {
  const [metadata, encoded] = dataUrl.split(",");
  if (!metadata || !encoded) throw new Error("Imagem inválida.");
  const mime = metadata.match(/data:(.*?);base64/)?.[1] ?? "image/webp";
  const bytes = Uint8Array.from(atob(encoded), (character) =>
    character.charCodeAt(0),
  );
  return new Blob([bytes], { type: mime });
}

export function isLocalImage(image?: string) {
  return Boolean(image?.startsWith("data:image/"));
}

export async function uploadProductImage(
  userId: string,
  productId: string,
  image: string,
) {
  const path = `${userId}/${productId}/${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, dataUrlToBlob(image), {
      contentType: "image/webp",
      cacheControl: "3600",
      upsert: true,
    });
  if (error) throw error;
  return path;
}

export async function getSignedImageUrl(path?: string | null) {
  if (!path) return undefined;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_SECONDS);
  if (error) throw error;
  return data.signedUrl;
}

export async function removeProductImage(path?: string | null) {
  if (!path) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}
