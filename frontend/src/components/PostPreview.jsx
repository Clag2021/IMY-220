import { useState } from "react";
import { Link } from "react-router-dom";
import ProfilePreviewModal from "./ProfilePreview";
import AddToAlbumModal from "./AddToAlbum";
import { getRandomPlaceholder } from "../utils/placeholder";

function PostPreview({ post, onPostReported }) {
  const [currentPost, setCurrentPost] = useState(post);
  const [showPreview, setShowPreview] = useState(false);
  const [showAddToAlbum, setShowAddToAlbum] = useState(false);

  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = loggedUser?._id || loggedUser?.id;

  const creatorId =
    typeof currentPost.creator === "object" && currentPost.creator !== null
      ? currentPost.creator._id || currentPost.creator.id
      : currentPost.creator;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isLiked =
    Array.isArray(currentPost.likes) &&
    currentUserId &&
    currentPost.likes.some((id) => (id?._id || id).toString() === currentUserId.toString());

  const likeCount = Array.isArray(currentPost.likes) ? currentPost.likes.length : 0;

  const handleLike = async (e) => {
    e.preventDefault();
    if (!currentUserId) return alert("Please log in to like posts.");

    try {
      const response = await fetch(`http://localhost:3000/api/posts/${currentPost._id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentPost(data.post);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUserId) return alert("Please log in to report posts.");

    const reason = window.prompt("Reason for reporting this post:", "Inappropriate or offensive content");
    if (!reason) return;

    try {
      const response = await fetch(`http://localhost:3000/api/posts/${currentPost._id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, reason }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Post reported successfully to admins!");
        if (onPostReported) onPostReported();
      } else {
        alert(data.message || "Failed to report post");
      }
    } catch (error) {
      console.error("Failed to report post:", error);
    }
  };

  return (
    <article className="border rounded-lg p-3 shadow-sm bg-white flex flex-col justify-between">
      <section className="flex items-center justify-between mb-[10px]">
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="flex items-center gap-[10px] text-left hover:opacity-80 transition"
        >
          <img
            src={currentPost.creator?.profilePicture || getRandomPlaceholder()}
            alt={currentPost.creator?.username || "User"}
            className="w-[38px] h-[38px] rounded-full object-cover border"
          />
          <div>
            <p className="font-semibold text-sm leading-tight">
              @{currentPost.creator?.username || "User"}
            </p>
            {currentPost.createdAt && (
              <p className="text-[10px] text-gray-400 font-normal">
                {formatDate(currentPost.createdAt)}
              </p>
            )}
          </div>
        </button>

        <button
          type="button"
          onClick={handleReport}
          title="Report Post"
          className="text-gray-400 hover:text-red-600 text-xs p-1"
        >
          🚩
        </button>
      </section>

      <section className="relative">
        <Link to={`/post/${currentPost._id}`}>
          <img
            src={currentPost.img || getRandomPlaceholder()}
            alt={currentPost.caption}
            className="w-full aspect-square object-cover rounded cursor-pointer"
          />
        </Link>
        <button
          type="button"
          onClick={handleLike}
          className={`absolute bottom-[10px] right-[10px] px-[10px] py-[4px] rounded-full text-xs font-bold transition flex items-center gap-1 ${
            isLiked ? "bg-red-500 text-white shadow" : "bg-black/60 text-white hover:bg-black/80"
          }`}
        >
          <span>{isLiked ? "❤️" : "🤍"}</span>
          <span>{likeCount}</span>
        </button>
      </section>

      <section className="text-[12px] mt-[8px]">
        <p className="font-medium text-gray-800">{currentPost.caption}</p>

        <p className="text-blue-600 mt-1">
          {currentPost.hashtags?.map((hashtag) => (
            <button
              key={hashtag}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/home?tag=${encodeURIComponent(hashtag)}`;
              }}
              className="mr-1 hover:underline font-semibold"
            >
              #{hashtag}
            </button>
          ))}
        </p>

        <div className="flex justify-between items-center mt-3 pt-2 border-t">
          <p className="text-gray-500">Comments: {currentPost.comments?.length || 0}</p>

          <button
            type="button"
            onClick={() => setShowAddToAlbum(true)}
            className="bg-gray-200 px-[15px] py-[4px] rounded font-semibold text-black hover:bg-gray-300 transition"
          >
            ADD
          </button>
        </div>
      </section>

      {showPreview && creatorId && (
        <ProfilePreviewModal userId={creatorId} onClose={() => setShowPreview(false)} />
      )}

      {showAddToAlbum && (
        <AddToAlbumModal postId={currentPost._id} onClose={() => setShowAddToAlbum(false)} />
      )}
    </article>
  );
}

export default PostPreview;