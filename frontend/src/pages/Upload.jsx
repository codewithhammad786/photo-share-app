import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { photoApi } from "../services/api";

const Upload = () => {
  const { user, isCreator } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [people, setPeople] = useState("");
  const [enableAI, setEnableAI] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  if (!user || !isCreator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4">
        <div className="max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
            <i className="fas fa-lock text-2xl" />
          </div>
          <h2 className="text-xl font-semibold mb-1">Creator Access Required</h2>
          <p className="text-sm text-slate-400 mb-5">
            Only creators can upload photos
          </p>
        </div>
      </div>
    );
  }

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (!selected?.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (!dropped?.type.startsWith("image/")) return;
    setError("");
    setFile(dropped);
    setPreview(URL.createObjectURL(dropped));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) return;
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);
      formData.append("caption", caption);
      formData.append("location", location);
      formData.append("people", people);
      formData.append("enableAI", enableAI);

      await photoApi.create(formData);
      navigate("/");
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8">
      {/* BG GLASS GLOW */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
        <h1 className="mb-6 flex items-center gap-3 text-2xl font-semibold text-slate-50">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-300">
            <i className="fas fa-cloud-upload-alt" />
          </span>
          Upload Photo
        </h1>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DROPZONE */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={`relative flex cursor-pointer items-center justify-center rounded-3xl border-2 border-dashed border-slate-700 bg-slate-900/70 p-6 text-center transition hover:border-slate-500 ${
              preview
                ? "overflow-hidden border-slate-500"
                : "border-slate-700"
            }`}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-[350px] w-full object-cover rounded-2xl shadow-lg"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <i className="fas fa-image text-3xl text-slate-500" />
                <p className="text-sm">Drag & drop or click to upload</p>
                <span className="text-xs opacity-70">
                  JPG, PNG, GIF, WebP supported
                </span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileSelect}
            />
          </div>

          {preview && (
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1 text-xs text-slate-200 hover:border-red-400 hover:text-red-400"
            >
              <i className="fas fa-times" /> Remove
            </button>
          )}

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your photo a title"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-1">
                Caption
              </label>
              <textarea
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Tell the story behind this photo..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-slate-300 text-sm mb-1">
                  <i className="fas fa-map-marker-alt mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where was this taken?"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm mb-1">
                  <i className="fas fa-users mr-1" />
                  People
                </label>
                <input
                  type="text"
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  placeholder="Tag people (comma separated)"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
                />
              </div>
            </div>

            {/* AI Toggle */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={enableAI}
                  onChange={(e) => setEnableAI(e.target.checked)}
                  className="peer sr-only"
                />
                <span className="relative h-6 w-12 rounded-full bg-slate-700 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-purple-500 peer-checked:after:translate-x-6"></span>
                <span className="text-sm text-slate-300 flex items-center gap-1">
                  <i className="fas fa-robot" /> Enable AI Tagging
                </span>
              </label>
              <p className="ml-1 mt-2 text-xs text-slate-500">
                {enableAI
                  ? "AI will generate tags, descriptions & colors automatically"
                  : "Upload will skip AI analysis"}
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!file || !title || uploading}
            className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:brightness-105 disabled:opacity-60"
          >
            {uploading ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                {enableAI ? "Uploading & Analyzing..." : "Uploading..."}
              </span>
            ) : (
              <>
                <i className="fas fa-upload mr-2" /> Upload Photo
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
