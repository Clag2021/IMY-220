import { useState } from "react";

function EditAlbum({ album, onUpdateSuccess, onClose }) {
  const [name, setName] = useState(album.name || "");
  const [description, setDescription] = useState(album.description || "");
  const [hashtags, setHashtags] = useState(album.hashtags?.join(", ") || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedHashtags = hashtags
      .split(",")
      .map((tag) => tag.trim().replace(/^#/, ""))
      .filter((tag) => tag.length > 0);

    try {
      const response = await fetch(`http://localhost:3000/api/albums/${album._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, hashtags: formattedHashtags }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Album updated!");
        if (onUpdateSuccess) onUpdateSuccess(data.album);
        onClose();
      } else {
        alert(data.message || "Failed to update album");
      }
    } catch (error) {
      console.error("Error updating album:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-xl p-6 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold">Edit Album</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black font-bold text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Album Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full border p-2 rounded" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Hashtags (comma separated)</label>
            <input type="text" value={hashtags} onChange={(e) => setHashtags(e.target.value)} className="w-full border p-2 rounded" />
          </div>

          <div className="flex gap-2 justify-end mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded font-semibold text-gray-700 hover:bg-gray-100">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-[#961515] text-white rounded font-semibold hover:bg-[#7a1010]">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditAlbum;