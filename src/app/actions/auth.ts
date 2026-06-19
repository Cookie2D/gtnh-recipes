"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function registerAction(
  email: string,
  username: string,
  password: string
): Promise<{ error?: string }> {
  const admin = createAdminClient();

  const { data: takenUsername } = await admin
    .from("users")
    .select("id")
    .eq("username", username)
    .maybeSingle() as { data: { id: string } | null };

  if (takenUsername) {
    return { error: "Username is already taken." };
  }

  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username },
  });

  if (createError) return { error: createError.message };

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError) return { error: signInError.message };
  return {};
}

export async function loginAction(
  identifier: string,
  password: string
): Promise<{ error?: string }> {
  let email = identifier.trim();

  if (!email.includes("@")) {
    const admin = createAdminClient();
    const { data } = await admin
      .from("users")
      .select("email")
      .eq("username", email)
      .maybeSingle() as { data: { email: string } | null };

    if (!data) {
      return { error: "No account found with that username." };
    }
    email = data.email;
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };
  return {};
}
