import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PhotoGrid from '../components/PhotoGrid';
import { photoApi, userApi } from '../services/api';

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [trending, setTrending] = useState([]);
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [photosRes, trendingRes, creatorsRes] = await Promise.all([
        photoApi.getAll(1, 12),
        photoApi.getTrending(),
        userApi.getCreators(),
      ]);
      setPhotos(photosRes.data);
      setTrending(trendingRes.data);
      setCreators(creatorsRes.data || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient shapes */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 top-[-6rem] h-72 w-72 rounded-full bg-purple-600/40 blur-3xl" />
          <div className="absolute -left-20 bottom-[-6rem] h-72 w-72 rounded-full bg-cyan-500/30 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pb-16 pt-20 md:flex-row md:items-stretch md:pt-24 lg:gap-16">
          {/* Hero content */}
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live photo-sharing prototype
            </span>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Share your&nbsp;
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                best moments
              </span>
            </h1>

            <p className="max-w-xl text-sm text-slate-300 sm:text-base">
              Upload, explore, and be inspired by stunning photos from creators all over the world.
              Built for speed, simplicity, and creativity.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <i className="fas fa-compass" />
                Explore Photos
              </Link>

              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-6 py-2.5 text-sm font-semibold text-slate-100 backdrop-blur transition hover:border-slate-500 hover:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <i className="fas fa-user-plus" />
                Join Now
              </Link>
            </div>

            {/* Hero stats */}
            <div className="mt-6 grid grid-cols-3 gap-4 max-w-md text-xs sm:text-sm">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                <p className="text-slate-400">Photos</p>
                <p className="text-lg font-semibold text-slate-50">
                  {photos.length || '1.2k+'}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                <p className="text-slate-400">Creators</p>
                <p className="text-lg font-semibold text-slate-50">
                  {creators.length || '350+'}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                <p className="text-slate-400">Trending</p>
                <p className="text-lg font-semibold text-slate-50">
                  {trending.length || 'Hot now'}
                </p>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="flex-1">
            <div className="relative mx-auto h-[320px] w-full max-w-md">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-purple-600/40 via-slate-900 to-cyan-500/40 blur-2xl" />
              <div className="relative grid h-full w-full grid-cols-3 gap-3 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl backdrop-blur">
                {trending.slice(0, 3).map((photo, i) => (
                  <div
                    key={photo._id}
                    className={`col-span-1 overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900/60 shadow-lg ${
                      i === 0 ? 'row-span-2' : 'row-span-1'
                    }`}
                  >
                    <img
                      src={photo.blobUrl}
                      alt={photo.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                ))}

                {/* Placeholder tiles if not enough trending yet */}
                {trending.length < 3 &&
                  Array.from({ length: 3 - trending.length }).map((_, idx) => (
                    <div
                      key={`placeholder-${idx}`}
                      className="col-span-1 row-span-1 flex items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 text-xs text-slate-500"
                    >
                      Coming soon
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content container */}
      <main className="mx-auto mt-4 flex max-w-6xl flex-col gap-10 px-4 pb-16">
        {/* Trending Section */}
        {trending.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-50 sm:text-xl">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10 text-orange-400">
                    <i className="fas fa-fire" />
                  </span>
                  Trending now
                </h2>
                <p className="text-xs text-slate-400 sm:text-sm">
                  Most loved photos from the community.
                </p>
              </div>
              <Link
                to="/explore?sort=trending"
                className="text-xs font-medium text-sky-400 hover:text-sky-300 sm:text-sm"
              >
                See all →
              </Link>
            </div>

            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
              {trending.map((photo) => (
                <Link
                  to={`/photo/${photo._id}`}
                  key={photo._id}
                  className="group relative h-52 w-40 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-md transition hover:border-sky-500/60 hover:shadow-sky-500/30"
                >
                  <img
                    src={photo.blobUrl}
                    alt={photo.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-2">
                    <span className="line-clamp-1 text-xs font-medium text-slate-50">
                      {photo.title || 'Untitled'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest Photos */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-50 sm:text-xl">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/10 text-sky-400">
                  <i className="fas fa-images" />
                </span>
                Latest uploads
              </h2>
              <p className="text-xs text-slate-400 sm:text-sm">
                Fresh photos just added to the feed.
              </p>
            </div>
            <Link
              to="/explore"
              className="text-xs font-medium text-sky-400 hover:text-sky-300 sm:text-sm"
            >
              View all →
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4">
            <PhotoGrid photos={photos} loading={loading} />
          </div>
        </section>

        {/* Featured Creators */}
        {creators.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-50 sm:text-xl">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                    <i className="fas fa-star" />
                  </span>
                  Featured creators
                </h2>
                <p className="text-xs text-slate-400 sm:text-sm">
                  Follow the people behind the most inspiring shots.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {creators.slice(0, 6).map((creator) => (
                <Link
                  to={`/creator/${creator._id}`}
                  key={creator._id}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-500/60 hover:shadow-purple-500/20"
                >
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        creator.displayName
                      )}&background=6366f1&color=fff&size=80`}
                      alt={creator.displayName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-semibold text-slate-50 group-hover:text-purple-300">
                      {creator.displayName}
                    </h4>
                    <span className="text-xs text-slate-400">
                      {creator.photoCount || 0} photos
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;
