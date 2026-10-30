import { useState } from "react";

function EditPost({ post, onUpdateSuccess, onClose }) {
  const [caption, setCaption] = useState(post.caption || "");
  const [imgUrl, setImgUrl] = useState(post.img || "");
  const [hashtags, setHashtags] = useState(
    Array.isArray(post.hashtags) ? post.hashtags.join(", ") : ""
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const hashtagsArray = hashtags
      .split(",")
      .map((tag) => tag.trim().replace(/^#/, ""))
      .filter((tag) => tag.length > 0);

    try {
      const response = await fetch(`http://localhost:3000/api/posts/${post._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caption,
          img: imgUrl,
          hashtags: hashtagsArray,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (onUpdateSuccess) {
          onUpdateSuccess(data.post);
        }
        if (onClose) {
          onClose();
        }
      } else {
        setMessage(data.message || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      setMessage("Could not connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-xl p-6 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold">Edit Post</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-black font-bold text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="editCaption" className="block text-sm font-semibold mb-1">
              Caption
            </label>
            <input
              id="editCaption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="editImgUrl" className="block text-sm font-semibold mb-1">
              Image URL
            </label>
            <input
              id="editImgUrl"
              type="url"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="editHashtags" className="block text-sm font-semibold mb-1">
              Hashtags (comma separated)
            </label>
            <input
              id="editHashtags"
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          {message && <p className="text-red-500 text-sm">{message}</p>}

          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#961515] text-white rounded font-semibold hover:bg-[#7a1010]"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost;