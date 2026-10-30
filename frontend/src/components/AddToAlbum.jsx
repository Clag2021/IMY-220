import { useEffect, useState } from "react";

function AddToAlbumModal({ postId, onClose }) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = loggedUser?._id || loggedUser?.id;

  useEffect(() => {
    async function fetchUserAlbums() {
      if (!currentUserId) return;
      try {
        const response = await fetch(`http://localhost:3000/api/users/${currentUserId}/albums`);
        const data = await response.json();
        if (response.ok) {
          setAlbums(data.albums || []);
        }
      } catch (error) {
        console.error("Failed to load user albums:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserAlbums();
  }, [currentUserId]);

  const handleAddToAlbum = async (albumId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/albums/${albumId}/posts/${postId}`,
        { method: "POST" }
      );
      const data = await response.json();

      if (response.ok) {
        alert("Post added to album!");
        onClose();
      } else {
        alert(data.message || "Failed to add post to album");
      }
    } catch (error) {
      console.error("Error adding post to album:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-xl p-6 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-bold">Add to Album</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black font-bold text-xl">
            ✕
          </button>
        </div>

        {loading ? (
          <p className="text-center py-6">Loading albums...</p>
        ) : albums.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No albums found. Create one first!</p>
        ) : (
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {albums.map((album) => (
              <button
                key={album._id}
                onClick={() => handleAddToAlbum(album._id)}
                className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-100 transition text-left"
              >
                <div>
                  <p className="font-semibold text-gray-800">{album.name}</p>
                  <p className="text-xs text-gray-500">{album.posts?.length || 0} posts</p>
                </div>
                <span className="text-[#961515] font-bold text-sm">+ Add</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddToAlbumModal;