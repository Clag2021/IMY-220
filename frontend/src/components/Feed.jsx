import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PostPreview from "./PostPreview";

function Feed({ type = "global", userId = null }) {
  const [searchParams] = useSearchParams();
  const urlTag = searchParams.get("tag");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHiddenPosts, setShowHiddenPosts] = useState(false);


  const [sortBy, setSortBy] = useState("newest");
  const [selectedHashtag, setSelectedHashtag] = useState(urlTag || "");
  const [favoriteUserIds, setFavoriteUserIds] = useState([]);

  useEffect(() => {
    if (urlTag) {
      setSelectedHashtag(urlTag);
    }
  }, [urlTag]);

  const fetchFeedData = async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const currentUserId = storedUser?._id || storedUser?.id;

      if (currentUserId) {
        const userRes = await fetch(`http://localhost:3000/api/users/${currentUserId}`);
        const userData = await userRes.json();
        if (userRes.ok && userData.user) {
          const favs = (userData.user.favorites || []).map((id) => (id?._id || id).toString());
          setFavoriteUserIds(favs);
        }
      }

      let url = "http://localhost:3000/api/posts";
      if (type === "user" && userId) {
        url = `http://localhost:3000/api/users/${userId}/posts`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        let fetchedPosts = data.posts || [];

        if (type === "local" && currentUserId) {
          const userRes = await fetch(`http://localhost:3000/api/users/${currentUserId}`);
          const userData = await userRes.json();
          if (userRes.ok && userData.user) {
            const friendsList = (userData.user.friends || []).map((id) =>
              (id?._id || id).toString()
            );
            const allowedUserIds = new Set(friendsList);
            fetchedPosts = fetchedPosts.filter((post) => {
              const creatorId = (post.creator?._id || post.creator)?.toString();
              return allowedUserIds.has(creatorId);
            });
          }
        }

        setPosts(fetchedPosts);
      }
    } catch (error) {
      console.error("Error loading feed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedData();
  }, [type, userId]);

  if (loading) {
    return <p className="text-center font-semibold mt-10">Loading feed...</p>;
  }


  const allHashtags = Array.from(new Set(posts.flatMap((p) => p.hashtags || [])));

  let processedPosts = posts.filter((post) => {
    if (!selectedHashtag) return true;
    return post.hashtags?.some(
      (tag) => tag.toLowerCase() === selectedHashtag.toLowerCase()
    );
  });


  processedPosts.sort((a, b) => {
    if (sortBy === "mostCommented") {
      return (b.comments?.length || 0) - (a.comments?.length || 0);
    }
    if (sortBy === "mostLiked") {
      return (b.likes?.length || 0) - (a.likes?.length || 0);
    }
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  processedPosts.sort((a, b) => {
    const aCreatorId = (a.creator?._id || a.creator)?.toString();
    const bCreatorId = (b.creator?._id || b.creator)?.toString();

    const aIsFav = favoriteUserIds.includes(aCreatorId);
    const bIsFav = favoriteUserIds.includes(bCreatorId);

    if (aIsFav && !bIsFav) return -1;
    if (!aIsFav && bIsFav) return 1;
    return 0;
  });

  const hiddenCount = processedPosts.filter((p) => p.reports && p.reports.length >= 2).length;

  const visiblePosts = processedPosts.filter((post) => {
    const isReportedOverLimit = post.reports && post.reports.length >= 2;
    if (isReportedOverLimit && !showHiddenPosts) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 max-w-[1100px] mx-auto w-full">
      <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-700 uppercase">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#961515]"
          >
            <option value="newest">Newest First</option>
            <option value="mostCommented">Most Commented</option>
            <option value="mostLiked">Most Liked</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-700 uppercase">Filter Hashtag:</label>
          <select
            value={selectedHashtag}
            onChange={(e) => setSelectedHashtag(e.target.value)}
            className="border p-2 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#961515]"
          >
            <option value=""># All Hashtags</option>
            {allHashtags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
          {selectedHashtag && (
            <button
              onClick={() => setSelectedHashtag("")}
              className="text-xs text-red-600 font-semibold hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {hiddenCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex justify-between items-center text-sm text-amber-900">
          <span>
            ⚠️ <strong>{hiddenCount}</strong> post(s) hidden due to multiple community reports.
          </span>
          <button
            onClick={() => setShowHiddenPosts(!showHiddenPosts)}
            className="bg-amber-200 text-amber-900 px-3 py-1 rounded font-semibold hover:bg-amber-300 transition"
          >
            {showHiddenPosts ? "Hide Reported Posts" : "View Hidden Posts"}
          </button>
        </div>
      )}

      {visiblePosts.length === 0 ? (
        <p className="text-center text-gray-500 my-10">
          No posts matching your selected filters.
        </p>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-[30px]">
          {visiblePosts.map((post) => {
            const creatorId = (post.creator?._id || post.creator)?.toString();
            const isFavUser = favoriteUserIds.includes(creatorId);

            const safePost = {
              ...post,
              creator:
                typeof post.creator === "object" && post.creator !== null
                  ? post.creator
                  : {
                      username: "User",
                      profilePicture: "https://via.placeholder.com/38",
                    },
            };

            return (
              <div key={post._id} className="relative">
                {isFavUser && (
                  <span className="absolute -top-2 -left-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 border border-black/10">
                    ⭐ Favorite User
                  </span>
                )}
                <PostPreview post={safePost} onPostReported={fetchFeedData} />
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}

export default Feed;