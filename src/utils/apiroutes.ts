export type AppRouteGroup = "website" | "user" | "supplier" | "admin";

export const websiteRoutes = [
  "/",
  "/request-flow",
  "/vehicle-confirmation",
  "/parts-selection",
  "/supplier-profile",
  "/supplier-onboarding",
  "/how-it-works",
  "/suppliers",
  "/about",
  "/contact",
  "/auth",
] as const;

export const userRoutes = [
  "/products",
  "/quotes",
  "/chat",
  "/notifications",
  "/history",
  "/suppliers-list",
] as const;

export const supplierRoutes = [
  "/supplier",
  "/supplier/onboarding",
  "/supplier/requests",
  "/supplier/quotes",
  "/supplier/analytics",
  "/supplier/messages",
  "/supplier/profile",
] as const;

export const adminRoutes = ["/admin-dashboard"] as const;

export const publicRoutes = [...websiteRoutes] as const;

type RouteTuple = ReadonlyArray<string>;

interface RouteGuard {
  group: AppRouteGroup;
  routes: RouteTuple;
}

export const protectedRouteGuards: RouteGuard[] = [
  { group: "user", routes: userRoutes },
  { group: "supplier", routes: supplierRoutes },
  { group: "admin", routes: adminRoutes },
];

export function matchRoute(pathname: string, candidates: RouteTuple) {
  return candidates.some((route) => {
    if (route === "/") {
      return pathname === "/";
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

export function requiredRoleForPath(pathname: string): AppRouteGroup | null {
  const guard = protectedRouteGuards.find(({ routes }) =>
    matchRoute(pathname, routes)
  );
  return guard?.group ?? null;
}

export function isPublicPath(pathname: string) {
  return matchRoute(pathname, publicRoutes as RouteTuple);
}

export const apiRoutes = {
  auth: {
    login: "/auth/login",
    signup: "/auth/register",
    logout: "/auth/logout",
    profile: "/auth/profile",
  },
  user: {
    quote: {
      listoffers: "user/quote/offer",
      acceptoffer: (offerId: string) => {
        return `user/quote/offer/${offerId}/accept`;
      },
      requestQuote: "/user/quote/request",
    },
    chat: {
      listchats: "user/chat/list",
      chatmessage: "user/chat",
    },
  },
  supplier: {
    quote: {
      newrequests: "supplier/quotes/request",
      listoffers: "supplier/quote/offer",
      sendoffer: "supplier/quote/offer",
    },
    chat: {
      listchats: "supplier/chat/list",
      chatmessage: "supplier/chat",
    },
  },
  admin: {
    users: {
      list: "/admin/users",
      update: (id: string) => `/admin/users/${id}/activate`,
    },
    supplier: {
      list: "/admin/suppliers",
      read: (id: string) => `/admin/suppliers/${id}`,
      approve: (id: string) => `/admin/suppliers/${id}/approve`,
      reject: (id: string) => `/admin/suppliers/${id}/reject`,
      active: (id: string) => `/admin/suppliers/${id}/enable`,
      suspend: (id: string) => `/admin/suppliers/${id}/disable`,
    },
  },
  website: {
    heroContent: "/website/content/hero",
  },
} as const;
