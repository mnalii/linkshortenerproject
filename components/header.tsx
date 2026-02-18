"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/routing";
import { routing } from "@/routing";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Link } from "@/routing";
import { Globe } from "lucide-react";

const languageNames: Record<string, string> = {
  en: "English",
  es: "Español",
  zh: "中文",
  th: "ไทย",
  id: "Indonesia",
};

export function Header() {
  const t = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="flex items-center justify-between gap-3 border-b p-4">
      <Link href="/" className="text-lg font-semibold">
        {t("appName")}
      </Link>
      <div className="flex items-center gap-3">
        <div className="relative group">
          <Button variant="ghost" size="sm" className="gap-2">
            <Globe className="h-4 w-4" />
            {languageNames[locale]}
          </Button>
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            {routing.locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLanguageChange(loc)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 first:rounded-t-md last:rounded-b-md ${
                  locale === loc
                    ? "bg-zinc-100 dark:bg-zinc-800 font-semibold"
                    : ""
                }`}
              >
                {languageNames[loc]}
              </button>
            ))}
          </div>
        </div>
        <SignedOut>
          <SignInButton 
            mode="modal"
            forceRedirectUrl={`/${locale}/dashboard`}
          >
            <Button variant="ghost">{t("signIn")}</Button>
          </SignInButton>
          <SignUpButton 
            mode="modal"
            forceRedirectUrl={`/${locale}/dashboard`}
          >
            <Button>{t("signUp")}</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
