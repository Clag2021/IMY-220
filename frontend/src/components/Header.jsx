import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchInput from "./SearchInput";
import AdminDashboard from "./AdminDashboard";
import { useTheme } from "../context/ThemeContext";

function Header({ title }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const { darkMode, toggleDarkMode } = useTheme();

  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const userId = loggedUser?._id || loggedUser?.id;
  const isAdmin = loggedUser?.isAdmin;

  const getPageLabel = () => {
    if (title) return title;
    if (location.pathname.startsWith("/profile")) return "profile page";
    if (location.pathname.startsWith("/post")) return "post page";
    if (location.pathname.startsWith("/albums")) return "albums page";
    return "home page";
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-[#961515] border-b shadow-sm text-white flex flex-col relative z-40">
      <div className="px-6 py-4 flex justify-between items-center">
        <Link to="/home" className="text-xl font-bold tracking-wide">
          EAT WITH ME <span className="text-gray-200 font-normal">{getPageLabel()}</span>
        </Link>

        <button
          type="button"
          onClick={() => setShowSearchModal(true)}
          className="bg-black/20 hover:bg-black/40 text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 border border-white/20 transition"
        >
          <span className="material-symbols-outlined text-lg leading-none">search</span>
          <span>What are you looking for?</span>
        </button>

        <nav className="flex gap-4 text-sm font-semibold items-center">
          {isAdmin && (
            <button
              onClick={() => setShowAdminModal(true)}
              className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold border border-yellow-500 shadow hover:bg-yellow-300 transition"
            >
              👑 Admin Panel
            </button>
          )}


          <button
            onClick={toggleDarkMode}
            className="bg-black/30 hover:bg-black/50 px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 border border-white/20"
            title="Toggle Light/Dark Mode"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <Link to="/home" className="hover:underline">
            Home
          </Link>
          <Link to="/albums" className="hover:underline">
            Albums
          </Link>
          <Link to={userId ? `/profile/${userId}` : "/login"} className="hover:underline">
            Profile
          </Link>
        </nav>
      </div>

      <div className="bg-[#7a1010] px-6 py-1.5 flex justify-between items-center text-xs border-t border-[#b02020]">
        <span className="text-gray-200">
          {loggedUser?.username ? `Logged in as @${loggedUser.username}` : ""}
        </span>
        <button
          onClick={handleLogout}
          className="bg-black/40 hover:bg-black/70 px-3 py-1 rounded font-semibold text-white transition"
        >
          Logout
        </button>
      </div>

      {showSearchModal && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-start pt-20 z-50 p-4"
          onClick={() => setShowSearchModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl">
            <SearchInput onClose={() => setShowSearchModal(false)} />
          </div>
        </div>
      )}

      {showAdminModal && <AdminDashboard onClose={() => setShowAdminModal(false)} />}
    </header>
  );
}

export default Header;