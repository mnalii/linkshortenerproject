import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Link2,
  BarChart3,
  Shield,
  QrCode,
  Layers,
  FolderOpen,
} from "lucide-react";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { userId } = await auth();
  const { locale } = await params;

  if (userId) {
    redirect(`/${locale}/dashboard`);
  }

  const t = await getTranslations("HomePage");

  const features = [
    {
      icon: Link2,
      title: t("features.customLinks.title"),
      description: t("features.customLinks.description"),
    },
    {
      icon: BarChart3,
      title: t("features.analytics.title"),
      description: t("features.analytics.description"),
    },
    {
      icon: Shield,
      title: t("features.secure.title"),
      description: t("features.secure.description"),
    },
    {
      icon: QrCode,
      title: t("features.qrCodes.title"),
      description: t("features.qrCodes.description"),
    },
    {
      icon: Layers,
      title: t("features.bulkShortening.title"),
      description: t("features.bulkShortening.description"),
    },
    {
      icon: FolderOpen,
      title: t("features.linkManagement.title"),
      description: t("features.linkManagement.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-6xl">
            {t("hero.title")}
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
              {t("hero.titleHighlight")}
            </span>
          </h1>
          <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400 md:text-xl">
            {t("hero.description")}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SignUpButton mode="modal">
              <Button size="lg" className="w-full sm:w-auto">
                {t("hero.ctaGetStarted")}
              </Button>
            </SignUpButton>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              asChild
            >
              <a href="#features">{t("hero.ctaLearnMore")}</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
            {t("features.title")}
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {t("features.description")}
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-zinc-200 transition-all hover:shadow-lg dark:border-zinc-800"
              >
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-16 text-center dark:from-blue-700 dark:to-cyan-700">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="mb-8 text-lg text-blue-50">
            {t("cta.description")}
          </p>
          <SignUpButton mode="modal">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              {t("cta.button")}
            </Button>
          </SignUpButton>
        </div>
      </section>
    </div>
  );
}
