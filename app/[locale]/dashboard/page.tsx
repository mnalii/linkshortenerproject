import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getLinksByUserId } from "@/data/links";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateLinkDialog } from "./create-link-dialog";
import { LinkCard } from "./link-card";

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
  const links = await getLinksByUserId(userId);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            {t("welcome")}
          </p>
        </div>
        <CreateLinkDialog>
          <Button size="lg">{t("createLink.button")}</Button>
        </CreateLinkDialog>
      </div>

      <div className="mt-8">
        {links.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <p className="text-zinc-600 dark:text-zinc-400">
                  {t("noLinks")}
                </p>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
                  {t("createFirst")}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                locale={locale}
                translations={{
                  edit: t("table.edit"),
                  delete: t("table.delete"),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
