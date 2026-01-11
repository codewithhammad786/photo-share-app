import PhotoCard from "./PhotoCard";

const PhotoGrid = ({ photos, loading }) => {
  // SKELETON STATE
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow animate-pulse"
          >
            <div className="aspect-[4/3] w-full bg-slate-800/80" />
            <div className="p-3 space-y-2">
              <div className="h-4 w-3/4 rounded bg-slate-800/80"></div>
              <div className="h-3 w-1/2 rounded bg-slate-800/80"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // EMPTY STATE
  if (!photos?.length) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center text-slate-300 shadow-lg backdrop-blur">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-purple-300 text-3xl">
          <i className="fas fa-camera" />
        </div>
        <h3 className="text-lg font-semibold text-slate-100">
          No photos found
        </h3>
        <p className="text-sm text-slate-400">
          Be the first to share something amazing!
        </p>
      </div>
    );
  }

  // GRID
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo) => (
        <PhotoCard key={photo._id} photo={photo} />
      ))}
    </div>
  );
};

export default PhotoGrid;
