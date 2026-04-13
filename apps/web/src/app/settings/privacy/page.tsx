import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { syncPublicUser } from "@/lib/sync-user";
import PrivacyHubClient from "./PrivacyHubClient";

export const metadata = {
  title: "Privacy Hub — Sky Style",
};

export default async function PrivacyHubPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  await syncPublicUser(session);

  let isPendingDeletion = false;
  let isDev = false;

  try {
    const { data } = await supabaseAdmin
      .from("users")
      .select("pending_deletion, is_dev")
      .eq("id", session.user.id!)
      .single();
    isPendingDeletion = data?.pending_deletion ?? false;
    isDev = data?.is_dev ?? false;
  } catch { /* Non-fatal */ }

  return <PrivacyHubClient isPendingDeletion={isPendingDeletion} isDev={isDev} />;
}
