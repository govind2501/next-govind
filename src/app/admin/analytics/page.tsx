import { redirect } from "next/navigation";
import { connect } from "@/dbConfig/dbConfig";
import Visit from "@/models/visitmodels";
import Feedback from "@/models/feedbackmodels";
import { getServerUser } from "@/helpers/getServerUser";
import AnalyticsClient from "./AnalyticsClient";

export default async function AdminAnalyticsPage() {
  // Server-side admin check
  const currentUser = await getServerUser();

  if (!currentUser || !currentUser.isAdmin) {
    redirect("/dashboard");
  }

  await connect();

  // Group all visits by page, calculate total visits and average duration
  const statsRaw = await Visit.aggregate([
    {
      $group: {
        _id: "$page",
        totalVisits: { $sum: 1 },
        averageDurationSeconds: { $avg: "$durationSeconds" },
        totalDurationSeconds: { $sum: "$durationSeconds" },
      },
    },
    { $sort: { totalVisits: -1 } },
  ]);
  const stats = JSON.parse(JSON.stringify(statsRaw));

  // Fetch all feedback, newest first
  const feedbackListRaw = await Feedback.find({})
    .populate("user", "username email")
    .sort({ createdAt: -1 });
  const feedbackList = JSON.parse(JSON.stringify(feedbackListRaw));

  return <AnalyticsClient initialStats={stats} initialFeedbackList={feedbackList} />;
}