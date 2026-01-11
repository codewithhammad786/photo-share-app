import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { photoApi, commentApi, ratingApi } from "../services/api";
import StarRating from "../components/StarRating";

const PhotoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState({ average: 0, total: 0 });
  const [userRating, setUserRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadPhoto = async () => {
    try {
      const [photoRes, commentsRes, ratingsRes] = await Promise.all([
        photoApi.getById(id),
        commentApi.getByPhoto(id),
        ratingApi.getByPhoto(id),
      ]);
      setPhoto(photoRes.data);
      setComments(commentsRes.data || []);
      setRatings(ratingsRes.data || { average: 0, total: 0 });

      if (user) {
        try {
          const myRating = await ratingApi.getUserRating(id);
          setUserRating(myRating.data?.value || 0);
        } catch (e) {
          // ignore if no rating
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (value) => {
    if (!user) return navigate("/login");
    try {
      await ratingApi.rate(id, value);
      setUserRating(value);
      const ratingsRes = await ratingApi.getByPhoto(id);
      setRatings(ratingsRes.data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (!newComment.trim()) return;

    try {
      const res = await commentApi.create(id, newComment);
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400" />
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 px-8 py-6 text-center shadow-xl">
          <h2 className="text-xl font-semibold mb-2">Photo not found</h2>
          <p className="text-sm text-slate-400 mb-4">
            The photo you are looking for doesn&apos;t exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 hover:border-slate-500"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-sky-500/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)]">
          {/* PHOTO SIDE */}
          <div className="relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 text-slate-100 shadow-lg shadow-slate-900/50 hover:bg-slate-800"
            >
              <i className="fas fa-arrow-left text-sm" />
            </button>

            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl">
              <img
                src={photo.blobUrl}
                alt={photo.title}
                className="w-full max-h-[80vh] object-contain bg-slate-950"
              />
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* Header */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
              <div className="flex flex-col gap-2">
                <div>
                  <h1 className="text-xl font-semibold sm:text-2xl text-slate-50">
                    {photo.title || "Untitled Photo"}
                  </h1>
                  {photo.location && (
                    <span className="mt-1 inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-300">
                      <i className="fas fa-map-marker-alt text-pink-400" />
                      {photo.location}
                    </span>
                  )}
                </div>

                {photo.caption && (
                  <p className="mt-2 text-sm text-slate-300">{photo.caption}</p>
                )}
              </div>
            </div>

            {/* AI Analysis */}
            {(photo.aiTags?.length > 0 ||
              photo.aiDescription ||
              photo.dominantColors?.length > 0) && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                    <i className="fas fa-robot" />
                  </span>
                  AI Analysis
                </h4>

                {photo.aiDescription && (
                  <p className="mb-3 text-sm text-slate-300">
                    <i className="fas fa-quote-left mr-1 text-slate-500" />
                    {photo.aiDescription}
                  </p>
                )}

                {photo.aiTags?.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {photo.aiTags.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {photo.dominantColors?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Colors:</span>
                    <div className="flex gap-1.5">
                      {photo.dominantColors.map((color, i) => (
                        <span
                          key={i}
                          title={color}
                          className="h-5 w-5 rounded-full border border-slate-800"
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Rating + Stats */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl space-y-4">
              {/* Rating */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <StarRating value={ratings.average} readonly size="lg" />
                    <span className="text-xs text-slate-400">
                      ({ratings.total}{" "}
                      {ratings.total === 1 ? "rating" : "ratings"})
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-200">
                    {ratings.average.toFixed(1)} / 5.0
                  </span>
                </div>

                {user && (
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
                    <span>Your rating:</span>
                    <StarRating value={userRating} onChange={handleRate} />
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 rounded-2xl bg-slate-800/70 px-3 py-2">
                  <i className="fas fa-eye text-sky-400" />
                  <span className="text-slate-200">
                    {photo.viewCount || 0} views
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-slate-800/70 px-3 py-2">
                  <i className="fas fa-comment text-emerald-400" />
                  <span className="text-slate-200">
                    {comments.length}{" "}
                    {comments.length === 1 ? "comment" : "comments"}
                  </span>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-100">Comments</h3>
              </div>

              {user && (
                <form
                  onSubmit={handleComment}
                  className="mb-4 flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/40"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white disabled:opacity-50"
                  >
                    <i className="fas fa-paper-plane text-sm" />
                  </button>
                </form>
              )}

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex items-start gap-3 rounded-2xl bg-slate-800/70 p-3"
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        comment.userDisplayName || "User"
                      )}&size=32`}
                      alt=""
                      className="h-8 w-8 rounded-full border border-slate-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs text-slate-100">
                            {comment.userDisplayName}
                          </strong>
                          {comment.sentiment &&
                            comment.sentiment !== "unknown" && (
                              <span
                                className={`text-xs ${
                                  comment.sentiment === "positive"
                                    ? "text-emerald-400"
                                    : comment.sentiment === "neutral"
                                    ? "text-slate-300"
                                    : "text-red-400"
                                }`}
                              >
                                {comment.sentiment === "positive" && "😊"}
                                {comment.sentiment === "neutral" && "😐"}
                                {comment.sentiment === "negative" && "😞"}
                              </span>
                            )}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {comment.createdAt
                            ? new Date(
                                comment.createdAt
                              ).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-200">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <p className="text-xs text-slate-400">
                    No comments yet. Be the first!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;
