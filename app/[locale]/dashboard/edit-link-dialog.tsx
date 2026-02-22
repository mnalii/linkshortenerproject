"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateLink } from "./actions";

// Define form schema
const formSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  shortCode: z
    .string()
    .min(3, "Short code must be at least 3 characters")
    .max(32, "Short code must be less than 32 characters")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Short code can only contain letters, numbers, hyphens, and underscores",
    ),
});

type FormValues = z.infer<typeof formSchema>;

interface EditLinkDialogProps {
  children: React.ReactNode;
  linkId: number;
  currentUrl: string;
  currentShortCode: string;
  onOpenChange?: (open: boolean) => void;
}

export function EditLinkDialog({
  children,
  linkId,
  currentUrl,
  currentShortCode,
  onOpenChange,
}: EditLinkDialogProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("Dashboard.editLink");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: currentUrl,
      shortCode: currentShortCode,
    },
  });

  // Reset form with current values when dialog opens or props change
  useEffect(() => {
    if (open) {
      form.reset({
        url: currentUrl,
        shortCode: currentShortCode,
      });
    }
  }, [open, currentUrl, currentShortCode, form]);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    const result = await updateLink(linkId, {
      url: values.url,
      shortCode: values.shortCode,
    });

    if (result.success) {
      // Close dialog
      setOpen(false);
    } else {
      // Show error in form
      form.setError("root", {
        message: result.error || "Failed to update link",
      });
    }

    setIsSubmitting(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("urlLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/very-long-url"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("urlDescription")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("shortCodeLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder="my-link" {...field} />
                  </FormControl>
                  <FormDescription>{t("shortCodeDescription")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
                {form.formState.errors.root.message}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("saving") : t("save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
