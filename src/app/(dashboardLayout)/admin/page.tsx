import { redirect } from "next/navigation";

/** Legacy URL from the navbar — send admins into the real dashboard tree. */
export default function LegacyAdminRedirectPage() {
  redirect("/dashboard/admin");
}
