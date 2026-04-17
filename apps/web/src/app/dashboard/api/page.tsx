import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { syncPublicUser } from "@/lib/sync-user";
import ApiDashboardClient from "./ApiDashboardClient";

export const metadata = {
  title: "API Dashboard — Sky Style",
};

export default async function ApiDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  await syncPublicUser(session);

  return <ApiDashboardClient />;
}
