import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth/client";

const getCurrentUser = createServerFn().handler(async () => {
  const rawHeaders = getRequestHeaders();
  const headers = new Headers(rawHeaders as HeadersInit);
  const session = await auth.api.getSession({ headers });
  return session?.user ?? null;
});

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUser();
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: location.pathname } });
    }
    return { user };
  },
  component: AuthenticatedLayout,
});

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/settings", label: "Settings", icon: Settings },
];

function AuthenticatedLayout() {
  const { user } = Route.useRouteContext();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } });
  };

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-white border-r border-zinc-100 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-zinc-100">
          <span className="font-semibold text-base tracking-tight text-zinc-900">MySaaS</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = currentPath === to || currentPath.startsWith(to + "/");
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User menu */}
        <div className="p-3 border-t border-zinc-100 relative">
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-700 shrink-0">
              {user?.image ? (
                <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-medium text-zinc-900 truncate">{user?.name ?? "User"}</p>
              <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          </button>

          {userMenuOpen && (
            <div className="absolute bottom-16 left-3 right-3 bg-white border border-zinc-200 rounded-xl shadow-lg py-1 z-50">
              <Link
                to="/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 w-full"
              >
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <div className="border-t border-zinc-100 my-1" />
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}