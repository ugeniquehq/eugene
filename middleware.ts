export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/portal/dashboard/:path*", "/portal/intake/:path*", "/portal/admin/:path*"],
};
