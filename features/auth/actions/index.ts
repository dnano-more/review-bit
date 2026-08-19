"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type AuthState = {
  error?: string;
} | null;

export async function signInWithGithub(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const callback = formData.get("callbackUrl");

  const result = await auth.api.signInSocial({
    body: {
      provider: "github",
      callbackURL: typeof callback === "string" && callback.startsWith("/") ? callback : "/dashboard",
    },
    headers: await headers(),
  });

  if (result.url) {
    redirect(result.url);
  }

  return { error: "Failed to redirect to GitHub sign-in." };
}

