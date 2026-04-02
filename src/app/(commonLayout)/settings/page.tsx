import { redirect } from "next/navigation";

export default function SettingsLegacyRedirectPage() {
  redirect("/dashboard/settings");
}
