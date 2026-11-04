import { redirect } from "next/navigation";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModels";
import { getServerUser } from "@/helpers/getServerUser";
import UsersClient from "./UsersClient";

export default async function AdminUsersPage() {
  // Server-side admin check - runs before any HTML is sent to the browser
  const currentUser = await getServerUser();

  if (!currentUser || !currentUser.isAdmin) {
    redirect("/dashboard");
  }

  await connect();

  // Pick only the fields the page needs: never passwords or tokens
  const usersRaw = await User.find({ isAdmin: false })
    .select("username email isVerified")
    .sort({ _id: -1 });
  const users = JSON.parse(JSON.stringify(usersRaw));

  return <UsersClient users={users} />;
}