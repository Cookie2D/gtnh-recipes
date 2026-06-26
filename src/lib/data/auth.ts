import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireUserId(): Promise<string> {
  const user = await requireUser();
  return user.id;
}

// Reads the user ID from the header set by middleware — no Supabase network call.
// Safe to use in pages because middleware already validated the session before the page runs.
// Do NOT use in Server Actions — those need requireUserId() for independent auth verification.
export async function getUserId(): Promise<string> {
  const headerStore = await headers();
  const userId = headerStore.get("x-user-id");
  if (!userId) redirect("/login");
  return userId;
}
