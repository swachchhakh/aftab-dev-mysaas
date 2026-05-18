import { useState } from "react";

import { useUpdateProfile } from "@/hooks/use-update-profile";

export function ProfileForm({ currentName }: { currentName: string }) {
  const [name, setName] = useState(currentName);
  const updateProfile = useUpdateProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name" className="block text-sm font-medium">
        Display Name
      </label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-1 block w-full rounded-md border px-3 py-2"
      />
      <button
        type="submit"
        disabled={updateProfile.isPending}
        className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white"
      >
        {updateProfile.isPending ? "Saving..." : "Save"}
      </button>
      {updateProfile.isError && (
        <p className="mt-2 text-sm text-red-600">
          Failed to update profile. Please try again.
        </p>
      )}
    </form>
  );
}