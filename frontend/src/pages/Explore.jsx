import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PhotoGrid from "../components/PhotoGrid";
import { photoApi } from "../services/api";

const Explore = () => {
  const [searchParams] = useSearchParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const query = searchParams.get("q");
  const sort = searchParams.get("sort");

  useEffect(() => {
    loadPhotos();
  }, [query, sort]);

  const loadPhotos = async (loadMore = false) => {
    setLoading(!loadMore);
    try {
      let res;
      if (query) {
        res = await photoApi.search(query);
      } else if (sort === "trending") {
        res = await photoApi.getTrending();
      } else {
        res = await photoApi.getAll(loadMore ? page + 1 : 1, 12);
      }

      const newPhotos = res.data || [];
      setPhotos(loadMore ? [...photos, ...newPhotos] : newPhotos);
      setHasMore(newPhotos.length === 12);
      if (loadMore) setPage((p) => p + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="flex items-center justify-center gap-3 text-3xl font-bold text-slate-50">
            {query ? (
              <>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300">
                  <i className="fas fa-search" />
                </span>
                Search:{" "}
                <span className="bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
                  {query}
                </span>
              </>
            ) : sort === "trending" ? (
              <>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400">
                  <i className="fas fa-fire" />
                </span>
                Trending Photos
              </>
            ) : (
              <>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                  <i className="fas fa-compass" />
                </span>
                Explore
              </>
            )}
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {photos.length} {photos.length === 1 ? "photo" : "photos"} found
          </p>
        </div>

        {/* Grid */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4 shadow-xl">
          <PhotoGrid photos={photos} loading={loading} />
        </div>

        {/* Load more */}
        {hasMore && !loading && !query && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => loadPhotos(true)}
              className="rounded-full border border-slate-700 bg-slate-900/70 px-6 py-2 text-sm font-medium text-slate-100 backdrop-blur hover:border-slate-500 hover:bg-slate-900/90"
            >
              Load More
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && photos.length === 0 && (
          <div className="mt-20 flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-300">
              <i className="fas fa-camera text-2xl" />
            </div>
            <p className="text-sm text-slate-300">
              Nothing found... try a different search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
