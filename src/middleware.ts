export { auth as middleware } from "@/auth";

export const config = {
  // Protect all routes except login, auth API, static files
  matcher: [
    "/((?!login|api/auth|_next/static|_next/image|favicon\\.ico|.*\\.svg).*)",
  ],
};
