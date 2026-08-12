import { createProduct, deleteProduct } from "@/lib/products";
import { saveBudget } from "@/lib/settings";
import { getLegacyData, markMigrationHandled } from "@/lib/storage";

export async function importLegacyData(userId: string) {
  const legacy = getLegacyData();
  const imported = [];
  try {
    for (const product of legacy.products) {
      const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, imagePath: _imagePath, ...input } = product;
      void _id; void _createdAt; void _updatedAt; void _imagePath;
      imported.push(await createProduct(userId, input));
    }
    if (legacy.budget !== undefined) await saveBudget(userId, legacy.budget);
    markMigrationHandled(userId);
  } catch (error) {
    await Promise.allSettled(imported.map((product) => deleteProduct(userId, product)));
    throw error;
  }
}
