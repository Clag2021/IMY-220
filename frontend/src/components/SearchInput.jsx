import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function SearchInput({ initialQuery = "", onClose }) {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [results, setResults] = useState({ users: [], posts: [], albums: [] });
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch(searchTerm);
      } else {
        setResults({ users: [], posts: [], albums: [] });
        setSuggestions([]);
      }
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const performSearch = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (response.ok) {
        setSuggestions(data.suggestions || []);
        setResults({
          users: data.users || [],
          posts: data.posts || [],
          albums: data.albums || [],
        });
      }
    } catch (error) {
      console.error("Search request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const cleaned = suggestion.replace(/^[@#]/, "");
    setSearchTerm(cleaned);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl border p-4 text-black">

      <div className="flex items-center gap-3 border-b pb-3">
        <span className="material-symbols-outlined text-gray-500">search</span>
        <input
          type="text"
          placeholder="Search users, posts, albums, or #hashtags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
          className="w-full text-base text-black placeholder-gray-400 focus:outline-none bg-transparent"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSuggestions([]);
            }}
            className="text-gray-400 hover:text-black font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="my-2 py-2 border-b flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-gray-400">Suggestions:</span>
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSuggestionClick(item)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-2.5 py-1 rounded-full font-medium transition"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="text-center py-6 text-sm text-gray-500">Searching...</p>}

      {!loading && searchTerm.trim() !== "" && (
        <div className="mt-4 max-h-96 overflow-y-auto space-y-6 pr-1">
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Users ({results.users.length})
            </h4>
            {results.users.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No matching users found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {results.users.map((user) => (
                  <Link
                    key={user._id}
                    to={`/profile/${user._id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <img
                      src={user.profilePicture || "https://via.placeholder.com/36"}
                      alt={user.username}
                      className="w-9 h-9 rounded-full object-cover border"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-sm text-gray-900 leading-tight">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Posts ({results.posts.length})
            </h4>
            {results.posts.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No matching posts found.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {results.posts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/post/${post._id}`}
                    onClick={onClose}
                    className="flex gap-2 p-2 border rounded-lg hover:bg-gray-50 transition items-center"
                  >
                    <img
                      src={post.img}
                      alt={post.caption}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="truncate">
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {post.caption || "No caption"}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        @{post.creator?.username || "User"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Albums ({results.albums.length})
            </h4>
            {results.albums.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No matching albums found.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {results.albums.map((album) => (
                  <Link
                    key={album._id}
                    to={`/albums`}
                    onClick={onClose}
                    className="flex justify-between items-center p-2 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{album.name}</p>
                      <p className="text-xs text-gray-500">{album.description || "No description"}</p>
                    </div>
                    <span className="text-xs text-[#961515] font-semibold">View Album →</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchInput;