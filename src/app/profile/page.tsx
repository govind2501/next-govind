import { Suspense } from "react";
import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "Edit Profile | Trade My Property",
};

// Server Component: it only renders the page shell.
// The forms live in the Client Component. Suspense is required
// because the Client Component reads the URL query string.
export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense
        fallback={<p className="p-6 text-center text-sm text-gray-500">Loading...</p>}
      >
        <ProfileClient />
      </Suspense>
    </main>
  );
}