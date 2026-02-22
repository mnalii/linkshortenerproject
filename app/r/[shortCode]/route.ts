import { NextRequest, NextResponse } from "next/server";
import { getLinkByShortCode } from "@/data/links";

/**
 * GET handler for redirect route
 * Looks up a short code and redirects to the destination URL
 *
 * @param request - The incoming request
 * @param params - Route parameters containing the shortCode
 * @returns Redirect response or 404 if not found
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> },
) {
  const { shortCode } = await params;

  // Look up the link by short code
  const link = await getLinkByShortCode(shortCode);

  // If link not found, return 404
  if (!link) {
    return new NextResponse("Link not found", { status: 404 });
  }

  // Redirect to the destination URL
  return NextResponse.redirect(link.url, { status: 307 });
}
