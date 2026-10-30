import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProfilePreviewModal({ userId, onClose }) {
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = loggedUser?._id || loggedUser?.id;

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setProfileUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user preview:", error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) fetchProfile();
  }, [userId]);

  const isFriend =
    Array.isArray(profileUser?.friends) &&
    profileUser.friends.some(
      (item) => (item?._id || item).toString() === currentUserId?.toString()
    );

  const handleFriend = async () => {
    if (!currentUserId) return alert("Please log in first.");

    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}/friend`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId }),
      });
      const data = await response.json();
      if (response.ok) {
        setProfileUser(data.user);
      } else {
        alert(data.message || "Could not add friend");
      }
    } catch (error) {
      console.error("Failed to update friend status:", error);
    }
  };

  if (!userId) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-xl p-6 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-black font-bold text-xl"
        >
          ✕
        </button>

        {loading ? (
          <p className="text-center py-8">Loading profile...</p>
        ) : profileUser ? (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={profileUser.profilePicture || "https://via.placeholder.com/60"}
                alt={profileUser.username}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <h3 className="font-bold text-lg text-gray-900">@{profileUser.username}</h3>
                <p className="text-sm text-gray-500">{profileUser.name}</p>
              </div>
            </div>

            {profileUser.bio && (
              <p className="text-sm text-gray-700 mb-4 bg-gray-50 p-2 rounded">
                {profileUser.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex justify-around bg-gray-100 py-3 rounded-lg mb-5 text-center">
              <div>
                <p className="font-bold text-gray-900">{profileUser.posts?.length || 0}</p>
                <p className="text-xs text-gray-500 font-medium">Posts</p>
              </div>
              <div>
                <p className="font-bold text-gray-900">{profileUser.friends?.length || 0}</p>
                <p className="text-xs text-gray-500 font-medium">Friends</p>
              </div>
            </div>

            {/* Action Button */}
            {currentUserId !== profileUser._id && (
              <div className="mb-4">
                <button
                  onClick={handleFriend}
                  className={`w-full py-2 rounded-lg font-semibold text-sm transition ${
                    isFriend
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200"
                      : "bg-[#961515] text-white hover:bg-[#7a1010]"
                  }`}
                >
                  {isFriend ? "✓ Friend" : "+ Add Friend"}
                </button>
              </div>
            )}

            <div className="text-center pt-2 border-t">
              <Link
                to={`/profile/${profileUser._id}`}
                onClick={onClose}
                className="text-sm text-[#961515] font-semibold hover:underline"
              >
                View Full Profile →
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-center py-8 text-red-500">User not found.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePreviewModal;
