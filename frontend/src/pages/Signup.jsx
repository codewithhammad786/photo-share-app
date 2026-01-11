import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("consumer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, role, name);
      navigate("/");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 text-slate-100">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-purple-600/30 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/30 blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.3fr]">
          {/* LEFT SIDE – BRAND PANEL */}
          <div className="relative hidden md:flex flex-col justify-between bg-gradient-to-br from-purple-500 via-indigo-500 to-sky-500 px-8 py-8 text-white">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <i className="fas fa-film text-xl" />
                </span>
                <div>
                  <h1 className="text-xl font-semibold tracking-wide">
                    PhotoShareApp
                  </h1>
                  <p className="text-xs text-white/70">
                    Share. Discover. Inspire.
                  </p>
                </div>
              </div>

              <p className="mb-6 text-sm text-white/90">
                Create a free account to share your photos, explore creative work
                from others, and let AI help you organize your visual stories.
              </p>

              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-xs">
                    <i className="fas fa-bolt" />
                  </span>
                  <span>Instant uploads with automatic AI tagging.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-xs">
                    <i className="fas fa-globe" />
                  </span>
                  <span>Discover photos from creators around the world.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-xs">
                    <i className="fas fa-heart" />
                  </span>
                  <span>Save favorites and build your visual collection.</span>
                </li>
              </ul>
            </div>

            <p className="mt-6 text-xs text-white/70">
              Already with us?{" "}
              <Link to="/login" className="underline underline-offset-2">
                Sign in instead
              </Link>
            </p>
          </div>

          {/* RIGHT SIDE – FORM */}
          <div className="px-6 py-8 sm:px-8">
            {/* Mobile heading */}
            <div className="mb-6 md:hidden text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300">
                <i className="fas fa-user-plus text-xl" />
              </div>
              <h2 className="text-xl font-semibold">Create your account</h2>
              <p className="text-xs text-slate-400 mt-1">
                Join PhotoShareApp and start sharing your moments.
              </p>
            </div>

            {/* Desktop header */}
            <div className="hidden md:block mb-4">
              <h2 className="text-xl font-semibold sm:text-2xl">
                Create your PhotoShareApp account
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                A few details and you&apos;re ready to share.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 w-full rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Display Name */}
              <div>
                <label className="block text-slate-300 text-sm mb-1">
                  Display Name
                </label>
                <div className="relative">
                  <i className="fas fa-id-card absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="How should we call you?"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-10 py-2 text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-300 text-sm mb-1">
                  Email
                </label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-10 py-2 text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-slate-300 text-sm mb-1">
                  Password
                </label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength="8"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-10 py-2 text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
                  />
                </div>
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Consumer */}
                  <label
                    className={`flex cursor-pointer flex-col items-center rounded-xl border px-3 py-3 text-center transition ${
                      role === "consumer"
                        ? "border-emerald-400 bg-emerald-500/15 text-emerald-300"
                        : "border-slate-700 bg-slate-800 hover:border-slate-500"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={role === "consumer"}
                      value="consumer"
                      onChange={(e) => setRole(e.target.value)}
                      name="role"
                      className="hidden"
                    />
                    <i className="fas fa-eye text-lg mb-1" />
                    <span className="font-medium text-sm">Viewer</span>
                    <small className="text-xs opacity-70">
                      Browse & react to photos
                    </small>
                  </label>

                  {/* Creator */}
                  <label
                    className={`flex cursor-pointer flex-col items-center rounded-xl border px-3 py-3 text-center transition ${
                      role === "creator"
                        ? "border-indigo-400 bg-indigo-500/15 text-indigo-300"
                        : "border-slate-700 bg-slate-800 hover:border-slate-500"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={role === "creator"}
                      value="creator"
                      onChange={(e) => setRole(e.target.value)}
                      name="role"
                      className="hidden"
                    />
                    <i className="fas fa-camera text-lg mb-1" />
                    <span className="font-medium text-sm">Creator</span>
                    <small className="text-xs opacity-70">
                      Upload & share photos
                    </small>
                  </label>
                </div>
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:brightness-105 disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-2">
              <div className="h-px flex-1 bg-slate-700" />
              <span className="text-xs uppercase tracking-widest text-slate-400">
                or
              </span>
              <div className="h-px flex-1 bg-slate-700" />
            </div>

            {/* Microsoft button */}
            <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 py-2 text-slate-200 hover:bg-slate-900/90">
              <i className="fab fa-microsoft text-slate-300" />
              Continue with Microsoft
            </button>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link className="text-sky-400 hover:text-sky-300" to="/login">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
