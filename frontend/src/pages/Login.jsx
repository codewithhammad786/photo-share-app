import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
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

      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/85 backdrop-blur p-7 shadow-2xl">
        {/* Brand header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300">
              <i className="fas fa-film text-lg" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">PhotoShareApp</p>
              <p className="text-[11px] text-slate-400">
                Your space for visual stories
              </p>
            </div>
          </div>
          <Link
            to="/signup"
            className="text-xs text-sky-400 hover:text-sky-300"
          >
            Create account
          </Link>
        </div>

        {/* Title */}
        <div className="mb-5">
          <h1 className="text-xl font-semibold sm:text-2xl">
            Welcome back
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to continue to PhotoShareApp.
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
          {/* Email */}
          <div>
            <label className="block text-slate-300 text-sm mb-1">Email</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-10 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-10 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
              />
            </div>
            <div className="mt-1 flex justify-end">
              <button
                type="button"
                className="text-[11px] text-slate-400 hover:text-slate-300"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:brightness-105 disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-2">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-[11px] uppercase tracking-widest text-slate-400">
            or continue with
          </span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        {/* Microsoft button */}
        <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 py-2 text-sm text-slate-200 hover:bg-slate-900/90">
          <i className="fab fa-microsoft text-slate-300" />
          Microsoft account
        </button>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link className="text-sky-400 hover:text-sky-300" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
