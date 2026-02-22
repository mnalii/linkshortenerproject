import { desc, eq } from "drizzle-orm";
import { db, links, type NewLink } from "@/db";

/**
 * Fetches all links for a specific user, ordered by creation date (newest first).
 *
 * @param clerkUserId - The Clerk user ID
 * @returns Array of links belonging to the user
 */
export async function getLinksByUserId(clerkUserId: string) {
  return await db
    .select()
    .from(links)
    .where(eq(links.clerkUserId, clerkUserId))
    .orderBy(desc(links.createdAt));
}

/**
 * Generates a random short code for a link.
 * Uses alphanumeric characters and aims for 6-8 characters.
 *
 * @param length - The length of the short code (default: 6)
 * @returns A random short code
 */
function generateShortCode(length: number = 6): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Checks if a short code already exists in the database.
 *
 * @param shortCode - The short code to check
 * @returns True if the short code exists, false otherwise
 */
export async function shortCodeExists(shortCode: string): Promise<boolean> {
  const result = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);
  return result.length > 0;
}

/**
 * Gets a link by its short code.
 * This is used for public redirect functionality (no auth required).
 *
 * @param shortCode - The short code to look up
 * @returns The link if found, null otherwise
 */
export async function getLinkByShortCode(
  shortCode: string,
): Promise<typeof links.$inferSelect | null> {
  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);

  return link ?? null;
}

/**
 * Generates a unique short code that doesn't exist in the database.
 * Attempts up to 10 times before giving up.
 *
 * @returns A unique short code
 * @throws Error if unable to generate a unique code after 10 attempts
 */
async function generateUniqueShortCode(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const shortCode = generateShortCode();
    const exists = await shortCodeExists(shortCode);
    if (!exists) {
      return shortCode;
    }
    attempts++;
  }

  throw new Error("Unable to generate unique short code");
}

/**
 * Creates a new link in the database.
 * If no custom short code is provided, generates a unique random one.
 *
 * @param data - The link data including url and optional shortCode
 * @returns The created link
 * @throws Error if custom short code already exists
 */
export async function createLink(
  data: Omit<NewLink, "id" | "createdAt" | "updatedAt">,
): Promise<typeof links.$inferSelect> {
  let shortCode = data.shortCode;

  // If custom short code is provided, check if it exists
  if (shortCode) {
    const exists = await shortCodeExists(shortCode);
    if (exists) {
      throw new Error("Short code already exists");
    }
  } else {
    // Generate a unique short code
    shortCode = await generateUniqueShortCode();
  }

  const [link] = await db
    .insert(links)
    .values({
      ...data,
      shortCode,
    })
    .returning();

  return link;
}

/**
 * Gets a single link by its ID and user ID.
 * Ensures users can only access their own links.
 *
 * @param linkId - The ID of the link
 * @param clerkUserId - The Clerk user ID who owns the link
 * @returns The link if found and owned by user, null otherwise
 */
export async function getLinkById(
  linkId: number,
  clerkUserId: string,
): Promise<typeof links.$inferSelect | null> {
  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.id, linkId))
    .limit(1);

  // Ensure the link belongs to the user
  if (!link || link.clerkUserId !== clerkUserId) {
    return null;
  }

  return link;
}

/**
 * Updates a link's URL and/or short code.
 * Ensures the user owns the link and the new short code is available.
 *
 * @param linkId - The ID of the link to update
 * @param clerkUserId - The Clerk user ID who owns the link
 * @param data - The updated link data (url and/or shortCode)
 * @returns The updated link
 * @throws Error if link not found, not owned by user, or short code already exists
 */
export async function updateLink(
  linkId: number,
  clerkUserId: string,
  data: { url?: string; shortCode?: string },
): Promise<typeof links.$inferSelect> {
  // First, verify the link exists and belongs to the user
  const existingLink = await getLinkById(linkId, clerkUserId);
  if (!existingLink) {
    throw new Error("Link not found or unauthorized");
  }

  // If updating short code, check if the new code is available
  if (data.shortCode && data.shortCode !== existingLink.shortCode) {
    const exists = await shortCodeExists(data.shortCode);
    if (exists) {
      throw new Error("Short code already exists");
    }
  }

  const [updatedLink] = await db
    .update(links)
    .set({
      url: data.url ?? existingLink.url,
      shortCode: data.shortCode ?? existingLink.shortCode,
    })
    .where(eq(links.id, linkId))
    .returning();

  return updatedLink;
}

/**
 * Deletes a link by its ID.
 * Ensures the user owns the link before deletion.
 *
 * @param linkId - The ID of the link to delete
 * @param clerkUserId - The Clerk user ID who owns the link
 * @returns True if deleted successfully
 * @throws Error if link not found or not owned by user
 */
export async function deleteLink(
  linkId: number,
  clerkUserId: string,
): Promise<boolean> {
  // First, verify the link exists and belongs to the user
  const existingLink = await getLinkById(linkId, clerkUserId);
  if (!existingLink) {
    throw new Error("Link not found or unauthorized");
  }

  await db.delete(links).where(eq(links.id, linkId));

  return true;
}
