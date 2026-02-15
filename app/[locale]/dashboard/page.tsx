import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { userId } = await auth();
  const { locale } = await params;

  if (!userId) {
    redirect(`/${locale}`);
  }

  const t = await getTranslations("Dashboard");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        {t("welcome")}
      </p>
    </div>
  );
}
