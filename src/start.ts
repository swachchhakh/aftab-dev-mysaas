import { redirect } from "@tanstack/react-router";
import { createMiddleware, createStart } from "@tanstack/react-start";
import { getRequestHeaders, getRequestUrl } from "@tanstack/react-start/server";

import { auth } from "@/lib/auth";

const PUBLIC_ROUTES = ["/login", "/api"];

const authMiddleware = createMiddleware({ type: "request" }).server(
  async ({ next }) => {
    const rawHeaders = getRequestHeaders();
    const headers = new Headers(rawHeaders as HeadersInit);
    const url = getRequestUrl();

    const isPublic = PUBLIC_ROUTES.some((route) =>
      url.pathname.startsWith(route)
    );

    if (isPublic) {
      return next(); // ← skip auth check for public routes
    }

    const session = await auth.api.getSession({ headers });

    if (!session?.user) {
      throw redirect({
        to: "/login",
        search: { redirect: url.pathname },
      });
    }

    return next();
  }
);

export const startInstance = createStart(() => ({
  requestMiddleware: [authMiddleware],
}));