"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

type CustomerUser = {
  _id: string;
  username: string;
  email: string;
  isVerified?: boolean;
};

export default function UsersClient({ users }: { users: CustomerUser[] }) {
  const [list, setList] = useState<CustomerUser[]>(users);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [busy, setBusy] = useState(false);

  // Filter the list by username or email while the admin types
  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      (user) =>
        user.username.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }, [list, search]);

  const startEditing = (userId: string) => {
    setEditingId(userId);
    setNewEmail("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setNewEmail("");
  };

  const handleChangeEmail = async (
    event: React.FormEvent,
    user: CustomerUser
  ) => {
    event.preventDefault();

    const cleanedEmail = newEmail.trim().toLowerCase();
    if (!cleanedEmail) {
      toast.error("Please enter the new email address");
      return;
    }

    const confirmed = window.confirm(
      `Change the email of ${user.username} to ${cleanedEmail}?\n\n` +
        "The user will be logged out on every device and a password reset link will be sent to the new email."
    );
    if (!confirmed) return;

    try {
      setBusy(true);
      const response = await axios.post("/api/admin/users/change-email", {
        userId: user._id,
        newEmail: cleanedEmail,
      });
      toast.success(response.data.message || "Email changed");
      setList((previous) =>
        previous.map((item) =>
          item._id === user._id ? { ...item, email: cleanedEmail } : item
        )
      );
      cancelEditing();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not change the email");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-3 py-8">
      <div className="rounded-2xl bg-white/95 p-5 shadow-xl dark:bg-slate-800/95">
        <h1 className="text-2xl font-bold text-orange-900 dark:text-orange-300">
          Users
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          {list.length} customer accounts. Use &quot;Change email&quot; when a
          customer cannot receive emails at the address they registered with.
        </p>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username or email..."
          className="mt-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:border-orange-500 focus:outline-none"
        />

        <ul className="mt-4 space-y-3">
          {filteredUsers.length === 0 && (
            <li className="text-sm text-gray-500">No users found.</li>
          )}

          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className="rounded-lg border border-gray-200 p-3 dark:border-slate-600"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {user.username}
                    {user.isVerified === false && (
                      <span className="ml-2 rounded bg-yellow-100 px-1.5 py-0.5 text-xs font-normal text-yellow-800">
                        Not verified
                      </span>
                    )}
                  </p>
                  <p className="break-all text-sm text-gray-600 dark:text-gray-300">
                    {user.email}
                  </p>
                </div>

                {editingId !== user._id && (
                  <button
                    type="button"
                    onClick={() => startEditing(user._id)}
                    className="shrink-0 rounded-md bg-orange-600 px-3 py-1 text-sm font-bold text-black hover:bg-orange-700"
                  >
                    Change email
                  </button>
                )}
              </div>

              {editingId === user._id && (
                <form
                  onSubmit={(e) => handleChangeEmail(e, user)}
                  className="mt-3 flex flex-col gap-2 sm:flex-row"
                >
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="New email address"
                    autoFocus
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:border-orange-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={busy}
                      className="rounded-md bg-orange-600 px-3 py-2 text-sm font-bold text-black hover:bg-orange-700 disabled:opacity-50"
                    >
                      {busy ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={busy}
                      className="rounded-md border border-gray-400 px-3 py-2 text-sm text-gray-700 dark:text-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}