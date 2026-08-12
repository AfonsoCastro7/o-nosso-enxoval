import { isLocalImage, getSignedImageUrl, removeProductImage, uploadProductImage } from "@/lib/images";
import { mapDatabaseProductToProduct, mapProductToDatabaseProduct } from "@/lib/product-mappers";
import { supabase } from "@/lib/supabase/client";
import type { DatabaseProduct } from "@/types/database";
import type { Product, ProductInput } from "@/types/product";

async function withSignedImage(row: DatabaseProduct) {
  let signedUrl: string | undefined;
  if (row.image_path) {
    try {
      signedUrl = await getSignedImageUrl(row.image_path);
    } catch (error) {
      console.error("Falha ao criar URL assinada para a imagem:", error);
    }
  }
  return mapDatabaseProductToProduct(row, signedUrl);
}

export async function getProducts(userId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return Promise.all((data ?? []).map(withSignedImage));
}

export async function getProduct(userId: string, id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? withSignedImage(data) : undefined;
}

export async function createProduct(userId: string, input: ProductInput) {
  const id = crypto.randomUUID();
  let imagePath: string | undefined;
  try {
    if (isLocalImage(input.image)) {
      imagePath = await uploadProductImage(userId, id, input.image!);
    }
    const payload = mapProductToDatabaseProduct(input, userId, id, imagePath);
    const { data, error } = await supabase
      .from("products")
      .insert(payload)
      .select("*")
      .single();
    if (error) throw error;
    return withSignedImage(data);
  } catch (error) {
    if (imagePath) {
      try { await removeProductImage(imagePath); } catch (cleanupError) {
        console.error("Falha ao limpar imagem após erro:", cleanupError);
      }
    }
    throw error;
  }
}

export async function updateProduct(userId: string, product: Product) {
  const previousImagePath = product.imagePath;
  const hasNewImage = isLocalImage(product.image);
  let imagePath = previousImagePath;

  if (hasNewImage) {
    imagePath = await uploadProductImage(userId, product.id, product.image!);
  } else if (!product.image && previousImagePath) {
    imagePath = undefined;
  }

  const payload = mapProductToDatabaseProduct(
    product,
    userId,
    product.id,
    imagePath,
  );
  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("user_id", userId)
    .eq("id", product.id)
    .select("*")
    .single();
  if (error) {
    if (hasNewImage && imagePath) {
      try { await removeProductImage(imagePath); } catch (cleanupError) {
        console.error("Falha ao limpar a nova imagem:", cleanupError);
      }
    }
    throw error;
  }
  if (previousImagePath && previousImagePath !== imagePath) {
    try { await removeProductImage(previousImagePath); } catch (cleanupError) {
      console.error("Produto atualizado, mas a imagem anterior não foi removida:", cleanupError);
    }
  }
  return withSignedImage(data);
}

export async function deleteProduct(userId: string, product: Product) {
  if (product.imagePath) {
    try {
      await removeProductImage(product.imagePath);
    } catch (error) {
      console.error("Não foi possível remover a imagem do produto:", error);
    }
  }
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("user_id", userId)
    .eq("id", product.id);
  if (error) throw error;
}
