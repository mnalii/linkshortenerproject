"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditLinkDialog } from "./edit-link-dialog";
import { DeleteLinkDialog } from "./delete-link-dialog";
import { Pencil, Trash2, ExternalLink, Calendar } from "lucide-react";

interface LinkCardProps {
  link: {
    id: number;
    url: string;
    shortCode: string;
    createdAt: Date;
  };
  locale: string;
  translations: {
    edit: string;
    delete: string;
  };
}

export function LinkCard({ link, locale, translations }: LinkCardProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <Card className="group transition-all hover:shadow-lg hover:border-zinc-400 dark:hover:border-zinc-600">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">
              {link.shortCode}
            </CardTitle>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(link.createdAt).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip open={editDialogOpen ? false : undefined}>
              <EditLinkDialog
                linkId={link.id}
                currentUrl={link.url}
                currentShortCode={link.shortCode}
                onOpenChange={setEditDialogOpen}
              >
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
              </EditLinkDialog>
              <TooltipContent>
                <p>{translations.edit}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip open={deleteDialogOpen ? false : undefined}>
              <DeleteLinkDialog
                linkId={link.id}
                shortCode={link.shortCode}
                onOpenChange={setDeleteDialogOpen}
              >
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
              </DeleteLinkDialog>
              <TooltipContent>
                <p>{translations.delete}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-start gap-2">
          <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all line-clamp-2"
          >
            {link.url}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
