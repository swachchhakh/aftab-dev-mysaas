import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save } from "lucide-react";
import { useUpdateProfile } from "@/hooks/use-update-profile";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

export default function SettingsPage() {
  const { user } = Route.useRouteContext();
  const [name, setName] = useState(user?.name ?? "");
  const updateProfile = useUpdateProfile();

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "?";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ name });
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your account preferences.</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
        <h2 className="text-sm font-medium text-zinc-900 mb-5">Profile</h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-medium text-indigo-700 overflow-hidden shrink-0">
            {user?.image ? (
              <img src={user.image} alt="" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900">{user?.name ?? "—"}</p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Avatar is pulled from your GitHub profile.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-zinc-700 mb-1.5">
              Display name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={user?.email ?? ""}
              disabled
              className="w-full rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm text-zinc-400 cursor-not-allowed"
            />
            <p className="text-xs text-zinc-400 mt-1.5">
              Email is managed through your GitHub account.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={updateProfile.isPending || name === user?.name}
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              {updateProfile.isPending ? "Saving…" : "Save changes"}
            </button>

            {updateProfile.isSuccess && (
              <p className="text-sm text-emerald-600">Changes saved.</p>
            )}
            {updateProfile.isError && (
              <p className="text-sm text-red-500">Failed to save. Try again.</p>
            )}
          </div>
        </form>
      </div>

      {/* Connected accounts */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 mb-6">
        <h2 className="text-sm font-medium text-zinc-900 mb-4">Connected accounts</h2>
        <div className="flex items-center justify-between py-3 border border-zinc-100 rounded-lg px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900">GitHub</p>
              <p className="text-xs text-zinc-400">{user?.email}</p>
            </div>
          </div>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
            Connected
          </span>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-100 p-6">
        <h2 className="text-sm font-medium text-red-700 mb-2">Danger zone</h2>
        <p className="text-sm text-zinc-500 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          className="text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
          onClick={() => window.confirm("Are you sure? This cannot be undone.") && console.log("TODO: delete account")}
        >
          Delete account
        </button>
      </div>
    </div>
  );
}