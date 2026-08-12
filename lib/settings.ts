import { supabase } from "@/lib/supabase/client";

export async function getBudget(userId: string) {
  const { data, error } = await supabase
    .from("user_settings")
    .select("budget")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data?.budget == null ? undefined : Number(data.budget);
}

export async function saveBudget(userId: string, budget: number) {
  const { error } = await supabase.from("user_settings").upsert(
    { user_id: userId, budget, updated_at: new Date().toISOString() },
    { onConflict: "user_id" },
  );
  if (error) throw error;
  return budget;
}
