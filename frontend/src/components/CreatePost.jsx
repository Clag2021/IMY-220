import { useState } from "react";
import { getRandomPlaceholder } from "../utils/placeholder";

function CreatePost({ onPostCreated }) {
  const [imgUrl, setImgUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");

  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = loggedUser?._id || loggedUser?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUserId) {
      alert("Please log in first.");
      return;
    }

    const finalImage = imgUrl.trim() !== "" ? imgUrl : getRandomPlaceholder();

    const postData = {
      creator: currentUserId,
      img: finalImage,
      caption: caption,
      hashtags: hashtags
        ? hashtags.split(",").map((tag) => tag.trim().replace(/^#/, ""))
        : [],
    };

    try {
      const response = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Post created successfully!");
        setImgUrl("");
        setCaption("");
        setHashtags("");
        if (onPostCreated) onPostCreated();
      } else {
        alert(data.message || "Failed to create post.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Could not connect to server.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded-lg bg-white shadow-sm flex flex-col gap-3">
      <h3 className="font-bold text-lg">Create a New Post</h3>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
          Image URL <span className="text-gray-400 font-normal">(optional - randomized placeholder will be used)</span>
        </label>
        <input
          type="url"
          value={imgUrl}
          onChange={(e) => setImgUrl(e.target.value)}
          placeholder="https://example.com/image.jpg (leave empty for random image)"
          className="w-full border p-2 rounded text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Caption</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          required
          className="w-full border p-2 rounded text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
          Hashtags <span className="text-gray-400 font-normal">(comma separated)</span>
        </label>
        <input
          type="text"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          placeholder="food, brunch, yummy"
          className="w-full border p-2 rounded text-sm"
        />
      </div>

      <button
        type="submit"
        className="bg-[#961515] text-white py-2 rounded font-semibold hover:bg-[#7a1010] transition"
      >
        Publish Post
      </button>
    </form>
  );
}

export default CreatePost;