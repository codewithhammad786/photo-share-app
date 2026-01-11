import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { userApi } from "../services/api";

const Profile = () => {
  const { user, isCreator } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const res = await userApi.getStats();
      setStats(res.data || res);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4">
        <div className="max-w-md w-full rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-slate-300">
            <i className="fas fa-user-circle text-3xl" />
          </div>
          <h2 className="text-xl font-semibold mb-1">Please log in</h2>
          <p className="text-sm text-slate-400 mb-5">
            You need an account to view your profile and stats.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:brightness-105"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  const displayName = user.displayName || user.name || "User";
  const avatarUrl =
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=6366f1&color=fff&size=120`;

  const roleLabel = user.role || (isCreator ? "creator" : "viewer");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-sky-500/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* Header card */}
        <div className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl sm:flex-row sm:items-center">
          <div className="flex items-center sm:flex-col sm:items-start md:flex-row md:items-center gap-4">
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-24 w-24 rounded-3xl border border-slate-700 bg-slate-800 object-cover"
            />
            <div>
              <h1 className="text-2xl font-semibold text-slate-50">
                {displayName}
              </h1>
              <div className="mt-2 flex flex-wrap gap-2 items-center">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    isCreator
                      ? "bg-purple-500/15 text-purple-300 border border-purple-500/40"
                      : "bg-sky-500/15 text-sky-300 border border-sky-500/40"
                  }`}
                >
                  <i className={`fas fa-${isCreator ? "camera" : "eye"}`} />
                  {roleLabel}
                </span>
                <span className="text-xs text-slate-400 break-all">
                  {user.email}
                </span>
              </div>
              {user.bio && (
                <p className="mt-3 text-sm text-slate-300 max-w-md">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          {/* Actions for creators */}
          {isCreator && (
            <div className="flex flex-col gap-3 sm:ml-auto sm:items-end">
              <Link
                to="/upload"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:brightness-105"
              >
                <i className="fas fa-upload" />
                Upload Photo
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-5 py-2 text-sm font-semibold text-slate-100 hover:border-slate-500"
              >
                <i className="fas fa-chart-bar" />
                Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-slate-400">
                Photos
              </span>
              <i className="fas fa-images text-slate-300" />
            </div>
            <span className="mt-1 text-2xl font-semibold text-slate-50">
              {stats?.photoCount ?? user.photoCount ?? 0}
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-slate-400">
                Views
              </span>
              <i className="fas fa-eye text-sky-300" />
            </div>
            <span className="mt-1 text-2xl font-semibold text-slate-50">
              {stats?.totalViews ?? user.totalViews ?? 0}
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-slate-400">
                Comments
              </span>
              <i className="fas fa-comment text-emerald-300" />
            </div>
            <span className="mt-1 text-2xl font-semibold text-slate-50">
              {stats?.commentCount ?? user.commentCount ?? 0}
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-slate-400">
                Ratings
              </span>
              <i className="fas fa-star text-amber-300" />
            </div>
            <span className="mt-1 text-2xl font-semibold text-slate-50">
              {stats?.totalRatings ??
                stats?.ratingCount ??
                user.ratingCount ??
                0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
