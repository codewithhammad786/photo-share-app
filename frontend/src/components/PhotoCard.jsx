import { useState } from "react";
import { Link } from "react-router-dom";

const PhotoCard = ({ photo }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link
      to={`/photo/${photo._id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg backdrop-blur transition hover:border-purple-400 hover:shadow-purple-500/20"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-slate-900">
        {/* Skeleton shimmer */}
        {!loaded && (
          <div className="absolute inset-0 animate-pulse rounded-t-2xl bg-slate-800" />
        )}

        <img
          src={photo.blobUrl}
          alt={photo.title}
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-end justify-end gap-2 p-2 opacity-0 transition group-hover:opacity-100 bg-gradient-to-t from-black/40 via-black/10 to-transparent">
          <div className="flex items-center gap-3 text-xs font-medium text-slate-200">
            <span className="flex items-center gap-1">
              <i className="fas fa-heart text-red-400" /> {photo.ratingCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <i className="fas fa-comment text-sky-300" /> {photo.commentCount || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3">
        <h3 className="truncate font-medium text-slate-100 group-hover:text-purple-300">
          {photo.title}
        </h3>

        {photo.location && (
          <span className="flex items-center text-xs text-slate-400">
            <i className="fas fa-map-marker-alt mr-1 text-slate-500" />
            {photo.location}
          </span>
        )}
      </div>

      {/* Tags */}
      {photo.aiTags?.length > 0 && (
        <div className="flex flex-wrap gap-1 px-3 pb-3">
          {photo.aiTags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="rounded-full bg-purple-500/15 px-2 py-0.5 text-xs capitalize text-purple-300 border border-purple-400/20"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
};

export default PhotoCard;
