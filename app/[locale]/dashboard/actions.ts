"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  createLink as createLinkInDb,
  updateLink as updateLinkInDb,
  deleteLink as deleteLinkInDb,
} from "@/data/links";

// Define input type
interface CreateLinkInput {
  url: string;
  shortCode?: string;
}

// Define Zod schema for validation
const createLinkSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  shortCode: z
    .string()
    .min(3, "Short code must be at least 3 characters")
    .max(32, "Short code must be less than 32 characters")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Short code can only contain letters, numbers, hyphens, and underscores",
    )
    .optional()
    .or(z.literal("")),
});

// Define return type
interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server action to create a new shortened link.
 * Validates input, checks authentication, and delegates to data layer.
 *
 * @param input - The link data (url and optional custom shortCode)
 * @returns Action result with success status and data or error
 */
export async function createLink(
  input: CreateLinkInput,
): Promise<ActionResult<{ shortCode: string }>> {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate input
    const validated = createLinkSchema.parse({
      url: input.url,
      shortCode: input.shortCode || undefined,
    });

    // Create link via data helper
    const link = await createLinkInDb({
      clerkUserId: userId,
      url: validated.url,
      shortCode: validated.shortCode || "",
    });

    // Revalidate dashboard to show new link
    revalidatePath("/dashboard");

    return {
      success: true,
      data: { shortCode: link.shortCode },
    };
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation failed",
      };
    }

    // Handle other errors
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Server action to update an existing link.
 * Validates input, checks authentication and ownership, and delegates to data layer.
 *
 * @param linkId - The ID of the link to update
 * @param input - The updated link data (url and/or shortCode)
 * @returns Action result with success status and data or error
 */
export async function updateLink(
  linkId: number,
  input: CreateLinkInput,
): Promise<ActionResult<{ shortCode: string }>> {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Validate input
    const validated = createLinkSchema.parse({
      url: input.url,
      shortCode: input.shortCode || undefined,
    });

    // Update link via data helper
    const link = await updateLinkInDb(linkId, userId, {
      url: validated.url,
      shortCode: validated.shortCode || undefined,
    });

    // Revalidate dashboard to show updated link
    revalidatePath("/dashboard");

    return {
      success: true,
      data: { shortCode: link.shortCode },
    };
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validation failed",
      };
    }

    // Handle other errors
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Server action to delete a link.
 * Checks authentication and ownership, and delegates to data layer.
 *
 * @param linkId - The ID of the link to delete
 * @returns Action result with success status or error
 */
export async function deleteLink(linkId: number): Promise<ActionResult<void>> {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Delete link via data helper
    await deleteLinkInDb(linkId, userId);

    // Revalidate dashboard to remove deleted link
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    // Handle errors
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
