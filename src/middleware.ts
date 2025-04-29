import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, Locale, locales } from "./i18n/config";

export async function middleware(request: NextRequest) {
  let NEXT_LOCALE = request.cookies.get("NEXT_LOCALE")?.value;
  if (!NEXT_LOCALE) {
    NEXT_LOCALE =
      request.headers.get("accept-language")?.split(",")[0] || defaultLocale;
    if (!locales.includes(NEXT_LOCALE as Locale)) {
      NEXT_LOCALE = defaultLocale;
    }
  }

  const response = NextResponse.next();
  response.cookies.set("NEXT_LOCALE", NEXT_LOCALE);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
