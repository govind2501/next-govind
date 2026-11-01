"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";
import { useRouter, useSearchParams } from "next/navigation";

type Message = { type: "success" | "error"; text: string } | null;

type CurrentUser = {
  username: string;
  email: string;
  pendingEmail?: string;
};

// Messages shown after the user clicks the confirmation link in their email
const EMAIL_CHANGE_MESSAGES: Record<string, Message> = {
  success: { type: "success", text: "Your email address has been updated." },
  invalid: {
    type: "error",
    text: "This confirmation link is invalid or has expired. Please request the change again.",
  },
  taken: {
    type: "error",
    text: "This email address is already registered with another account.",
  },
  error: {
    type: "error",
    text: "Something went wrong. Please try again.",
  },
};

// Sends a request to the profile API and returns a simple result
async function sendRequest(
  url: string,
  method: "PATCH" | "POST",
  body: Record<string, string>
): Promise<{ ok: boolean; message: string; data?: any }> {
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { ok: false, message: json.error || "Something went wrong." };
    }
    return { ok: true, message: json.message || "Saved.", data: json };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}

function StatusMessage({ message }: { message: Message }) {
  if (!message) return null;
  const color =
    message.type === "success"
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-red-50 text-red-700 border-red-200";
  return (
    <p className={`mt-3 rounded border px-3 py-2 text-sm ${color}`}>
      {message.text}
    </p>
  );
}

const inputClass =
  "w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";
const buttonClass =
  "rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60";
const cardClass = "rounded-lg border border-gray-200 bg-white p-5 shadow-sm";

export default function ProfileClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loadError, setLoadError] = useState(false);

  // Username form
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState<Message>(null);
  const [usernameBusy, setUsernameBusy] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<Message>(null);
  const [passwordBusy, setPasswordBusy] = useState(false);

  // Email form
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailMessage, setEmailMessage] = useState<Message>(
    EMAIL_CHANGE_MESSAGES[searchParams.get("emailChange") ?? ""] ?? null
  );
  const [emailBusy, setEmailBusy] = useState(false);

  // Load the current user once when the page opens
  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/users/me");
        if (!response.ok) {
          setLoadError(true);
          return;
        }
        const json = await response.json();
        const loaded = json.data ?? json.user ?? json;
        setUser(loaded);
        setUsername(loaded.username ?? "");
      } catch {
        setLoadError(true);
      }
    }
    loadUser();
  }, []);

  async function handleUsernameSubmit(event: React.FormEvent) {
    event.preventDefault();
    setUsernameBusy(true);
    setUsernameMessage(null);
    const result = await sendRequest("/api/users/profile/username", "PATCH", {
      username,
    });
    if (result.ok) {
      const updatedName = result.data?.user?.username ?? username.trim();
      setUser((previous) =>
        previous ? { ...previous, username: updatedName } : previous
      );
      setUsername(updatedName);
      setUsernameMessage({ type: "success", text: "Username updated." });
      router.refresh();
    } else {
      setUsernameMessage({ type: "error", text: result.message });
    }
    setUsernameBusy(false);
  }

  async function handlePasswordSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPasswordMessage(null);
    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password and confirmation do not match.",
      });
      return;
    }
    setPasswordBusy(true);
    const result = await sendRequest("/api/users/profile/password", "PATCH", {
      currentPassword,
      newPassword,
    });
    if (result.ok) {
      setPasswordMessage({ type: "success", text: "Password updated." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordMessage({ type: "error", text: result.message });
    }
    setPasswordBusy(false);
  }

  async function handleEmailSubmit(event: React.FormEvent) {
    event.preventDefault();
    setEmailBusy(true);
    setEmailMessage(null);
    const result = await sendRequest("/api/users/profile/email", "POST", {
      newEmail,
      currentPassword: emailPassword,
    });
    if (result.ok) {
      setEmailMessage({ type: "success", text: result.message });
      setNewEmail("");
      setEmailPassword("");
    } else {
      setEmailMessage({ type: "error", text: result.message });
    }
    setEmailBusy(false);
  }

  if (loadError) {
    return (
      <p className="p-6 text-center text-sm text-red-600">
        Could not load your profile. Please log in again.
      </p>
    );
  }

  if (!user) {
    return <p className="p-6 text-center text-sm text-gray-500">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Edit Profile</h1>

      {/* Username */}
      <form onSubmit={handleUsernameSubmit} className={cardClass}>
        <h2 className="mb-3 text-lg font-medium">Username</h2>
        <label className="mb-1 block text-sm text-gray-600" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          className={inputClass}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={30}
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          3 to 30 characters. Letters, numbers, spaces, dots, dashes and
          underscores only.
        </p>
        <button className={`${buttonClass} mt-3`} disabled={usernameBusy}>
          {usernameBusy ? "Saving..." : "Save Username"}
        </button>
        <StatusMessage message={usernameMessage} />
      </form>

      {/* Password */}
      <form onSubmit={handlePasswordSubmit} className={cardClass}>
        <h2 className="mb-3 text-lg font-medium">Password</h2>
        <div className="space-y-3">
          <div>
            <label
              className="mb-1 block text-sm text-gray-600"
              htmlFor="currentPassword"
            >
              Current password
            </label>
            <PasswordInput
              id="currentPassword"
              autoComplete="current-password"
              className={inputClass}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Link
              href="/forgotpassword"
              className="mt-1 inline-block text-xs text-blue-600 hover:underline"
            >
              Forgot your current password?
            </Link>
          </div>
          <div>
            <label
              className="mb-1 block text-sm text-gray-600"
              htmlFor="newPassword"
            >
              New password
            </label>
            <PasswordInput
              id="newPassword"
              autoComplete="new-password"
              className={inputClass}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              maxLength={72}
              required
            />
            <p className="mt-1 text-xs text-gray-500">At least 8 characters.</p>
          </div>
          <div>
            <label
              className="mb-1 block text-sm text-gray-600"
              htmlFor="confirmPassword"
            >
              Confirm new password
            </label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              className={inputClass}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <button className={`${buttonClass} mt-3`} disabled={passwordBusy}>
          {passwordBusy ? "Saving..." : "Change Password"}
        </button>
        <StatusMessage message={passwordMessage} />
      </form>

      {/* Email */}
      <form onSubmit={handleEmailSubmit} className={cardClass}>
        <h2 className="mb-3 text-lg font-medium">Email address</h2>
        <p className="mb-3 text-sm text-gray-600">
          Current email: <strong>{user.email}</strong>
        </p>
        {user.pendingEmail && (
          <p className="mb-3 text-xs text-amber-700">
            A change to {user.pendingEmail} is waiting for confirmation.
          </p>
        )}
        <div className="space-y-3">
          <div>
            <label
              className="mb-1 block text-sm text-gray-600"
              htmlFor="newEmail"
            >
              New email address
            </label>
            <input
              id="newEmail"
              type="email"
              autoComplete="email"
              className={inputClass}
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              className="mb-1 block text-sm text-gray-600"
              htmlFor="emailPassword"
            >
              Current password
            </label>
            <PasswordInput
              id="emailPassword"
              autoComplete="current-password"
              className={inputClass}
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          We will send a confirmation link to the new address. Your email will
          change only after you click that link.
        </p>
        <button className={`${buttonClass} mt-3`} disabled={emailBusy}>
          {emailBusy ? "Sending..." : "Send Confirmation Link"}
        </button>
        <StatusMessage message={emailMessage} />
      </form>
    </div>
  );
}