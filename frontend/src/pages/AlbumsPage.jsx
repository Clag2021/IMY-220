import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "../components/Header";
import CreateAlbum from "../components/CreateAlbum";
import PostPreview from "../components/PostPreview";
import EditAlbum from "../components/EditAlbum";

function AlbumsPage() {
  const [searchParams] = useSearchParams();
  const filterUserId = searchParams.get("userId");

  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = loggedUser?._id || loggedUser?.id;

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      let url = "http://localhost:3000/api/albums";
      if (filterUserId) {
        url = `http://localhost:3000/api/users/${filterUserId}/albums`;
      }

      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setAlbums(data.albums || []);
      }
    } catch (error) {
      console.error("Failed to load albums:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedAlbum(null);
    fetchAlbums();
  }, [filterUserId]);

  const fetchAlbumDetails = async (albumId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/albums/${albumId}`);
      const data = await response.json();
      if (response.ok) {
        setSelectedAlbum(data.album);
      }
    } catch (error) {
      console.error("Failed to fetch album details:", error);
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    if (!window.confirm("Are you sure you want to delete this album?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/albums/${albumId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Album deleted!");
        setSelectedAlbum(null);
        fetchAlbums();
      }
    } catch (error) {
      console.error("Failed to delete album:", error);
    }
  };

  const handleRemovePostFromAlbum = async (postId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/albums/${selectedAlbum._id}/posts/${postId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        fetchAlbumDetails(selectedAlbum._id);
        fetchAlbums();
      }
    } catch (error) {
      console.error("Failed to remove post from album:", error);
    }
  };

  const getCreatorUsername = (creator) => {
    if (typeof creator === "object" && creator !== null && creator.username) {
      return creator.username;
    }
    return "User";
  };

  const getCreatorPicture = (creator) => {
    if (typeof creator === "object" && creator !== null && creator.profilePicture) {
      return creator.profilePicture;
    }
    return "https://via.placeholder.com/32";
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <section className="flex-1 max-w-[1100px] w-full mx-auto px-6 py-8">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedAlbum
              ? selectedAlbum.name
              : filterUserId
              ? "User Albums"
              : "All Albums"}
          </h1>

          <div className="flex gap-3">
            {filterUserId && !selectedAlbum && (
              <Link
                to="/albums"
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-300"
              >
                Explore All Albums →
              </Link>
            )}

            {selectedAlbum ? (
              <button
                onClick={() => setSelectedAlbum(null)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-300"
              >
                ← Back
              </button>
            ) : (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#961515] text-white px-5 py-2 rounded font-semibold hover:bg-[#7a1010]"
              >
                + Create Album
              </button>
            )}
          </div>
        </div>

        {selectedAlbum ? (
          <div>
            <div className="bg-white p-5 rounded-lg border shadow-sm mb-6 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={getCreatorPicture(selectedAlbum.creator)}
                    alt={getCreatorUsername(selectedAlbum.creator)}
                    className="w-[30px] h-[30px] rounded-full object-cover border"
                  />
                  <p className="text-sm font-semibold text-gray-700">
                    By @{getCreatorUsername(selectedAlbum.creator)}
                  </p>
                </div>

                <p className="text-gray-700">{selectedAlbum.description || "No description provided."}</p>

                <p className="text-blue-600 text-sm mt-2">
                  {selectedAlbum.hashtags?.map((tag) => (
                    <span key={tag} className="mr-2">#{tag}</span>
                  ))}
                </p>
              </div>

              {currentUserId === (selectedAlbum.creator?._id || selectedAlbum.creator) && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-black font-semibold"
                  >
                    Edit Album
                  </button>
                  <button
                    onClick={() => handleDeleteAlbum(selectedAlbum._id)}
                    className="bg-[#961515] text-white px-3 py-1 text-sm rounded hover:bg-red-700 font-semibold"
                  >
                    Delete Album
                  </button>
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold mb-4">Posts in this album</h2>

            {selectedAlbum.posts?.length === 0 ? (
              <p className="text-center py-10 text-gray-500">No posts in this album yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedAlbum.posts?.map((post) => (
                  <div key={post._id} className="relative group">
                    <PostPreview post={post} />
                    {currentUserId === (selectedAlbum.creator?._id || selectedAlbum.creator) && (
                      <button
                        onClick={() => handleRemovePostFromAlbum(post._id)}
                        className="mt-2 w-full bg-red-100 text-red-600 py-1 text-xs font-semibold rounded border border-red-300 hover:bg-red-200"
                      >
                        Remove from Album
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (

          <div>
            {loading ? (
              <p className="text-center py-10 font-semibold">Loading albums...</p>
            ) : albums.length === 0 ? (
              <p className="text-center py-10 text-gray-500">
                {filterUserId ? "This user has no albums yet." : "No albums created yet."}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {albums.map((album) => {
                  const creatorName = getCreatorUsername(album.creator);
                  const creatorPic = getCreatorPicture(album.creator);

                  return (
                    <div
                      key={album._id}
                      onClick={() => fetchAlbumDetails(album._id)}
                      className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md cursor-pointer transition flex flex-col justify-between h-52"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                          <img
                            src={creatorPic}
                            alt={creatorName}
                            className="w-[28px] h-[28px] rounded-full object-cover border"
                          />
                          <span className="text-xs font-semibold text-gray-600">
                            @{creatorName}
                          </span>
                        </div>

                        <h3 className="font-bold text-lg text-gray-900 mb-1">{album.name}</h3>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {album.description || "No description"}
                        </p>
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3 mt-2">
                        <span>{album.posts?.length || 0} posts</span>
                        <span className="text-[#961515] font-semibold">View Album →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {showCreateModal && (
        <CreateAlbum
          onAlbumCreated={() => {
            fetchAlbums();
            setShowCreateModal(false);
          }}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showEditModal && selectedAlbum && (
        <EditAlbum
          album={selectedAlbum}
          onUpdateSuccess={(updatedAlbum) => {
            setSelectedAlbum(updatedAlbum);
            fetchAlbums();
          }}
          onClose={() => setShowEditModal(false)}
        />
      )}

      <footer className="h-[70px] bg-[#961515] mt-auto"></footer>
    </main>
  );
}

export default AlbumsPage;