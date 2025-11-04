/* eslint-disable react/no-unescaped-entities */
// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/authStore";
import { sessionsAPI } from "@/lib/api/sessions";
import { referralsAPI } from "@/lib/api/referrals";
import { Session, Referral } from "@/types";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionsData, referralsData] = await Promise.all([
          sessionsAPI.getSessions("all"),
          referralsAPI.getReferrals("all"),
        ]);
        setSessions(sessionsData);
        setReferrals(referralsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const upcomingSessions = sessions
    .filter((s) => s.status === "scheduled")
    .slice(0, 3);
  const recentReferrals = referrals.slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-300 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-500">
          Here's what's happening with your RefLink profile.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">💼</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black">
                Completed Sessions
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {user?.completedSessions || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">🔗</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black">Active Referrals</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  referrals.filter((r) =>
                    ["submitted", "under-review", "interview"].includes(
                      r.status
                    )
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">👁️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-black">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {user?.profileViews || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Sessions */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Upcoming Sessions
            </h2>
            <Link
              href="/dashboard/sessions"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>

          {upcomingSessions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No upcoming sessions</p>
              <Link
                href="/discover"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Discover talent to book sessions
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {session.consultingOffer.title}
                      </h3>
                      <p className="text-sm text-black">
                        with{" "}
                        {session.jobSeeker._id === user?._id
                          ? session.employee.name
                          : session.jobSeeker.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(session.scheduledAt).toLocaleDateString()} •{" "}
                        {session.duration} mins
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        session.status === "scheduled"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {session.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Referrals */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Referrals
            </h2>
            <Link
              href="/dashboard/referrals"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>

          {recentReferrals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No referrals yet</p>
              <p className="text-sm text-black">
                Complete sessions to get referrals
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentReferrals.map((referral) => (
                <div
                  key={referral._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {referral.position} at {referral.company}
                      </h3>
                      <p className="text-sm text-black">
                        {referral.employee._id === user?._id
                          ? "You referred"
                          : "Referred by"}{" "}
                        {referral.employee.name}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        referral.status === "submitted"
                          ? "bg-blue-100 text-blue-800"
                          : referral.status === "interview"
                          ? "bg-green-100 text-green-800"
                          : referral.status === "hired"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {referral.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/discover"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-semibold text-gray-900">Discover Talent</h3>
            <p className="text-sm text-black">
              Find developers to collaborate with
            </p>
          </Link>

          <Link
            href="/profile/edit"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mb-2">👤</div>
            <h3 className="font-semibold text-gray-900">Edit Profile</h3>
            <p className="text-sm text-black">
              View and edit your public profile
            </p>
          </Link>

          <Link
            href="/dashboard/offers/create"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900">Create Offer</h3>
            <p className="text-sm text-gray-600">
              Create new consulting offers
            </p>
          </Link>

          <Link
            href="/dashboard/referrals/create"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-2xl mb-2">🔗</div>
            <h3 className="font-semibold text-gray-900">Submit Referral</h3>
            <p className="text-sm text-gray-600">
              Refer candidates after sessions
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
