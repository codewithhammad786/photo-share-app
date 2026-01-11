import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { photoApi } from "../services/api";

const Dashboard = () => {
  const { user, isCreator } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isCreator) {
      loadMyPhotos();
    } else {
      setLoading(false);
    }
  }, [user, isCreator]);

  const loadMyPhotos = async () => {
    try {
      // Use odId from database user object
      const creatorId = user.odId || user._id;
      console.log("Loading photos for creator:", creatorId);
      const res = await photoApi.getByCreator(creatorId);
      setPhotos(res.data || []);
    } catch (err) {
      console.error("Error loading by creator:", err);
      // Fallback: get all and filter by multiple possible IDs
      try {
        const allRes = await photoApi.getAll(1, 100);
        const myPhotos = (allRes.data || []).filter((p) => {
          return (
            p.creatorId === user.odId ||
            p.creatorId === user._id ||
            p.creatorId === user.email
          );
        });
        console.log("Fallback found photos:", myPhotos.length);
        setPhotos(myPhotos);
      } catch (e) {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (photoId) => {
    if (!window.confirm("Delete this photo?")) return;
    try {
      await photoApi.delete(photoId);
      setPhotos((prev) => prev.filter((p) => p._id !== photoId));
    } catch (err) {
      alert(err.message);
    }
  };

  // Access denied state
  if (!user || !isCreator) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <i className="fas fa-lock text-2xl" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-slate-50">
            Creator Access Required
          </h2>
          <p className="text-sm text-slate-400">
            You need a creator account to view the dashboard and manage photos.
          </p>
          <div className="mt-6 flex justify-center gap-3 text-sm">
            <Link
              to="/"
              className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-slate-100 hover:border-slate-500"
            >
              Go Home
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 font-medium text-white hover:brightness-105"
            >
              Become a Creator
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalViews = photos.reduce((sum, p) => sum + (p.viewCount || 0), 0);
  const totalRatings = photos.reduce((sum, p) => sum + (p.ratingCount || 0), 0);
  const avgRating =
    photos.length > 0
      ? (
          photos.reduce((sum, p) => sum + (p.averageRating || 0), 0) /
          photos.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-[-5rem] h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" />
        <div className="absolute -right-16 top-[10rem] h-72 w-72 rounded-full bg-sky-500/25 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Creator Dashboard
            </div>
            <h1 className="mt-3 flex items-center gap-3 text-2xl font-bold text-slate-50 sm:text-3xl">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300">
                <i className="fas fa-chart-bar" />
              </span>
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
                {user.displayName || user.name || "Creator"}
              </span>
            </h1>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Track performance, manage your gallery, and keep your best photos
              in the spotlight.
            </p>
          </div>

          <Link
            to="/upload"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:brightness-105"
          >
            <i className="fas fa-plus" />
            New Photo
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 rounded-2xl border border-purple-500/40 bg-gradient-to-br from-purple-900/40 via-slate-900 to-slate-950 p-4 shadow-lg shadow-purple-500/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300">
              <i className="fas fa-images" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Photos
              </p>
              <p className="text-xl font-semibold text-slate-50">
                {photos.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-sky-500/40 bg-gradient-to-br from-sky-900/40 via-slate-900 to-slate-950 p-4 shadow-lg shadow-sky-500/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300">
              <i className="fas fa-eye" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Total Views
              </p>
              <p className="text-xl font-semibold text-slate-50">
                {totalViews.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-900/40 via-slate-900 to-slate-950 p-4 shadow-lg shadow-amber-400/25">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300">
              <i className="fas fa-star" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Avg Rating
              </p>
              <p className="text-xl font-semibold text-slate-50">{avgRating}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/40 bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-950 p-4 shadow-lg shadow-emerald-400/25">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-300">
              <i className="fas fa-heart" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Ratings
              </p>
              <p className="text-xl font-semibold text-slate-50">
                {totalRatings}
              </p>
            </div>
          </div>
        </div>

        {/* Photos Section */}
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 sm:p-6 shadow-xl">
          <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-50">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-300">
                  <i className="fas fa-camera" />
                </span>
                Your Photos
              </h2>
              <p className="text-xs text-slate-400 sm:text-sm">
                Manage your uploads, track performance, and clean up your
                gallery.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400" />
            </div>
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-300">
                <i className="fas fa-camera text-2xl" />
              </div>
              <p className="text-sm text-slate-300">
                No photos yet. Upload your first photo and start building your
                gallery.
              </p>
              <Link
                to="/upload"
                className="mt-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2 text-sm font-semibold text-white hover:brightness-105"
              >
                Upload Photo
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-200">
                <thead>
                  <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-400">
                    <th className="py-3 pr-4">Photo</th>
                    <th className="py-3 pr-4">Title</th>
                    <th className="py-3 pr-4">Views</th>
                    <th className="py-3 pr-4">Rating</th>
                    <th className="py-3 pr-4">Date</th>
                    <th className="py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {photos.map((photo) => (
                    <tr
                      key={photo._id}
                      className="border-b border-slate-800/70 last:border-none hover:bg-slate-800/60"
                    >
                      <td className="py-3 pr-4">
                        <div className="h-12 w-16 overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
                          <img
                            src={photo.blobUrl}
                            alt={photo.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3 pr-4 align-middle">
                        <Link
                          to={`/photo/${photo._id}`}
                          className="line-clamp-2 text-sm font-medium text-sky-300 hover:text-sky-200"
                        >
                          {photo.title || "Untitled"}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 align-middle text-slate-200">
                        {photo.viewCount || 0}
                      </td>
                      <td className="py-3 pr-4 align-middle">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-1 text-xs text-amber-300">
                          <i className="fas fa-star" />
                          {(photo.averageRating || 0).toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3 pr-4 align-middle text-slate-300">
                        {photo.createdAt
                          ? new Date(photo.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-3 text-center align-middle">
                        <button
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          onClick={() => handleDelete(photo._id)}
                          title="Delete photo"
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
