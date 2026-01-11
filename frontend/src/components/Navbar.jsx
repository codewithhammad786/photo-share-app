import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isCreator } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/70 backdrop-blur-md border-b border-slate-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3">

        {/* BRAND */}
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-slate-100 hover:text-purple-300"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
            <i className="fas fa-film" />
          </span>
          <span className="hidden sm:block text-lg tracking-wide">
            PhotoShareApp
          </span>
        </Link>

        {/* SEARCH BAR */}
        <form
          className="relative hidden flex-1 items-center sm:flex"
          onSubmit={handleSearch}
        >
          <i className="fas fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
          <input
            type="text"
            placeholder="Search photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
          />
        </form>

        {/* ACTION ICONS */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-slate-400 hover:text-purple-300 transition text-lg"
          >
            <i className="fas fa-house" />
          </Link>

          <Link
            to="/explore"
            className="text-slate-400 hover:text-purple-300 transition text-lg"
          >
            <i className="fas fa-compass" />
          </Link>

          {user ? (
            <>
              {isCreator && (
                <Link
                  to="/upload"
                  className="hidden sm:flex text-purple-400 hover:text-purple-300 text-lg"
                >
                  <i className="fas fa-circle-plus" />
                </Link>
              )}

              {/* USER AVATAR MENU */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="h-9 w-9 overflow-hidden rounded-full border border-slate-700"
                >
                  <img
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.displayName || user.name || "U"
                      )}&background=6366f1&color=fff`
                    }
                    alt="User"
                    className="h-full w-full object-cover"
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-700 bg-slate-900 shadow-xl overflow-hidden animate-fade-in">
                    <div className="border-b border-slate-700 px-4 py-2">
                      <p className="font-semibold text-slate-100">
                        {user.displayName || user.name}
                      </p>
                      <p className="text-xs text-slate-400 capitalize">
                        {user.role}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                    >
                      <i className="fas fa-user" /> Profile
                    </Link>

                    {isCreator && (
                      <Link
                        to="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                      >
                        <i className="fas fa-chart-line text-purple-300" /> Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-800"
                    >
                      <i className="fas fa-right-from-bracket" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full border border-slate-700 px-4 py-1.5 text-sm text-slate-200 hover:border-slate-500"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-1.5 text-sm font-semibold text-white shadow-purple-500/20 hover:brightness-105"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <form onSubmit={handleSearch} className="sm:hidden px-4 pb-3">
        <div className="relative">
          <i className="fas fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
          <input
            type="text"
            placeholder="Search photos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
          />
        </div>
      </form>
    </nav>
  );
};

export default Navbar;
