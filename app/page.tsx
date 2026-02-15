import { routing } from "@/routing";
import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirect to the default locale
  redirect(`/${routing.defaultLocale}`);
}
