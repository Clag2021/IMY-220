import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Comments from "./Comments";

function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [parentAlbums, setParentAlbums] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = loggedUser?._id || loggedUser?.id;
  const isAdmin = loggedUser?.isAdmin === true;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}`);
      const data = await response.json();
      if (response.ok) {
        setPost(data.post);
        setParentAlbums(data.albums || []);
      }
    } catch (error) {
      console.error("Failed to load post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!currentUserId) {
      alert("Please log in to like posts.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}/like`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });

      const data = await response.json();

      if (response.ok) {
        setPost(data.post);
      } else {
        alert(data.message || "Failed to like post");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleReport = async () => {
    if (!currentUserId) return alert("Please log in to report posts.");

    const reason = window.prompt("Reason for reporting this post:", "Inappropriate or offensive content");
    if (!reason) return;

    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, reason }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Post reported successfully to admins!");
        fetchPost();
      } else {
        alert(data.message || "Failed to report post");
      }
    } catch (error) {
      console.error("Failed to report post:", error);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post permanently?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Post deleted successfully.");
        navigate("/home");
      } else {
        alert(data.message || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Could not connect to server to delete post.");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!loggedUser) {
      alert("Please log in to comment.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: commentText,
          userId: currentUserId,
          username: loggedUser.username,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCommentText("");
        fetchPost();
      } else {
        alert(data.message || "Could not add comment");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading post...</p>;
  if (!post) return <p className="text-center mt-10">Post not found.</p>;

  const creatorId = post.creator?._id || post.creator;
  const isOwner = currentUserId?.toString() === creatorId?.toString();
  const canDelete = isOwner || isAdmin;

  const isLiked =
    Array.isArray(post.likes) &&
    post.likes.some((item) => (item?._id || item).toString() === currentUserId?.toString());
  const likeCount = Array.isArray(post.likes) ? post.likes.length : post.likes || 0;
  const isReportedByMe =
    Array.isArray(post.reports) &&
    post.reports.some((item) => (item?.user?._id || item?.user || item).toString() === currentUserId?.toString());

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-[1000px] w-full mx-auto my-[40px] p-[20px] bg-white border rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
          {/* LEFT SIDE */}
          <section>
            <div className="flex items-center gap-[15px] pb-[15px] border-b">
              <Link to={`/profile/${creatorId}`} className="flex items-center gap-[10px]">
                <img
                  src={post.creator?.profilePicture || "https://via.placeholder.com/40"}
                  alt={post.creator?.username || "User"}
                  className="w-[40px] h-[40px] rounded-full object-cover"
                />
                <div>
                  <span className="font-bold text-[18px] block">
                    @{post.creator?.username || "User"}
                  </span>
                  {post.createdAt && (
                    <span className="text-xs text-gray-400 font-normal">
                      Posted on {formatDate(post.createdAt)}
                    </span>
                  )}
                </div>
              </Link>
            </div>

            <img
              src={post.img}
              alt={post.caption}
              className="w-full h-auto max-h-[500px] object-cover rounded mt-3"
            />

            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition ${
                  isLiked
                    ? "bg-red-100 text-red-600 border border-red-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{isLiked ? "❤️ Liked" : "🤍 Like"}</span>
                <span>({likeCount})</span>
              </button>

              <button
                onClick={handleReport}
                className={`flex items-center gap-1 px-4 py-2 rounded-full font-bold transition ${
                  isReportedByMe
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700"
                }`}
              >
                🚩 {isReportedByMe ? "Reported" : "Report"}
              </button>

              {canDelete && (
                <button
                  onClick={handleDeletePost}
                  className="bg-red-600 text-white px-4 py-2 rounded-full font-bold hover:bg-red-700 transition"
                >
                  Delete Post
                </button>
              )}
            </div>
          </section>

          {/* RIGHT SIDE */}
          <section className="flex flex-col justify-between">
            <div>
              <p className="mt-[15px] text-[16px]">{post.caption}</p>
              <p className="text-blue-600 text-sm mt-1">
                {post.hashtags?.map((hashtag) => (
                  <button
                    key={hashtag}
                    type="button"
                    onClick={() => {
                      window.location.href = `/home?tag=${encodeURIComponent(hashtag)}`;
                    }}
                    className="mr-2 hover:underline font-semibold text-blue-600"
                  >
                    #{hashtag}
                  </button>
                ))}
              </p>

              <div className="mt-4 p-3 bg-gray-50 border rounded-lg">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Belongs to Album(s):
                </h4>
                {parentAlbums.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">This post does not belong to any album.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {parentAlbums.map((album) => (
                      <Link
                        key={album._id}
                        to="/albums"
                        className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded text-xs font-semibold hover:bg-amber-200 transition flex items-center gap-1"
                      >
                        {album.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Comments comments={post.comments} />
            </div>

            <form onSubmit={handleAddComment} className="flex gap-[10px] mt-[20px] pt-[15px] border-t">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 border p-[8px] rounded"
              />
              <button
                type="submit"
                className="bg-[#961515] text-white px-[20px] py-[8px] rounded font-semibold hover:bg-[#7a1010]"
              >
                Post
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Post;