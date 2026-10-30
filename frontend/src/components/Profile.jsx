import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreatePost from "./CreatePost";
import EditProfile from "./EditProfile";
import { getRandomPlaceholder } from "../utils/placeholder";

function Profile({ user: initialUser, onPostCreated, onUserUpdated }) {
  const [user, setUser] = useState(initialUser);
  const [showAddPost, setShowAddPost] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [friendsData, setFriendsData] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const profileUserId = user?._id || user?.id;

  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = loggedUser?._id || loggedUser?.id;
  const isAdmin = loggedUser?.isAdmin;

  const isOwnProfile = currentUserId?.toString() === profileUserId?.toString();

  const isFriend =
    Array.isArray(user?.friends) &&
    user.friends.some(
      (id) => (id?._id || id).toString() === currentUserId?.toString()
    );

  const canViewFriendsList = isOwnProfile || isFriend || isAdmin;

  useEffect(() => {
    async function fetchFriendsDetails() {
      if (!showFriendsList || !user?.friends?.length) {
        setFriendsData([]);
        return;
      }

      setLoadingFriends(true);
      try {
        const friendPromises = user.friends.map(async (friendId) => {
          const id = typeof friendId === "object" ? friendId._id : friendId;
          const res = await fetch(`http://localhost:3000/api/users/${id}`);
          const data = await res.json();
          return data.user;
        });

        const results = await Promise.all(friendPromises);
        setFriendsData(results.filter(Boolean));
      } catch (error) {
        console.error("Failed to load friends list:", error);
      } finally {
        setLoadingFriends(false);
      }
    }

    fetchFriendsDetails();
  }, [showFriendsList, user?.friends]);

  const handleUnfriend = async (friendId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${friendId}/friend`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentUserId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFriendsData((prev) => prev.filter((f) => f._id !== friendId));

        if (onUserUpdated) {
          onUserUpdated({
            ...user,
            friends: user.friends.filter((id) => (id._id || id) !== friendId),
          });
        }
      } else {
        alert(data.message || "Failed to unfriend user");
      }
    } catch (error) {
      console.error("Error unfriending user:", error);
    }
  };

  if (!user) return <p className="text-center py-10">User profile not found.</p>;

  return (
    <section className="max-w-[1000px] mx-auto p-4">
      <section className="flex flex-col md:flex-row items-center gap-[40px] mb-8">
        <img
          src={user.profilePicture || getRandomPlaceholder()}
          alt={`${user.username}'s profile`}
          className="w-[220px] h-[220px] rounded-full object-cover border shadow-sm"
        />

        <section className="flex-1 w-full">
          <div className="flex justify-between items-center mb-[20px]">
            <div>
              <h1 className="text-[28px] font-bold leading-tight">{user.name}</h1>
              <p className="text-gray-500">@{user.username}</p>
            </div>

            {isOwnProfile && (
              <button
                onClick={() => setShowEditProfile(!showEditProfile)}
                className="bg-[#961515] text-white px-[30px] py-[8px] font-semibold rounded hover:bg-[#7a1010] transition"
              >
                {showEditProfile ? "CANCEL" : "EDIT"}
              </button>
            )}
          </div>

          <p className="text-[18px] mb-[20px] text-gray-800">{user.bio}</p>

          <section className="flex gap-[20px]">
            <div className="bg-[#1f2937] text-white px-[35px] py-[15px] text-center rounded min-w-[120px]">
              <p className="font-bold text-lg leading-tight">{user.posts?.length || 0}</p>
              <p className="text-xs text-gray-300 uppercase font-semibold tracking-wider">Posts</p>
            </div>

            <div
              onClick={() => {
                if (canViewFriendsList) setShowFriendsList(true);
              }}
              className={`bg-[#1f2937] text-white px-[35px] py-[15px] text-center rounded min-w-[120px] ${
                canViewFriendsList
                  ? "cursor-pointer hover:bg-[#374151] transition"
                  : ""
              }`}
            >
              <p className="font-bold text-lg leading-tight">{user.friends?.length || 0}</p>
              <p className="text-xs text-gray-300 uppercase font-semibold tracking-wider">Friends</p>
            </div>
          </section>

          <section className="flex gap-[20px] mt-[15px]">
            {isOwnProfile && (
              <button
                onClick={() => setShowAddPost(!showAddPost)}
                className="bg-[#1f2937] text-white px-[45px] py-[10px] font-semibold rounded hover:bg-[#374151] transition"
              >
                {showAddPost ? "Cancel" : "Add Post"}
              </button>
            )}

            <Link
              to={`/albums?userId=${profileUserId}`}
              className="bg-[#1f2937] text-white px-[45px] py-[10px] font-semibold rounded hover:bg-[#374151] transition text-center flex items-center justify-center"
            >
              Albums
            </Link>
          </section>
        </section>
      </section>

      {showFriendsList && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
          onClick={() => setShowFriendsList(false)}
        >
          <div
            className="bg-white text-black w-full max-w-md rounded-xl p-6 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-bold">
                {isOwnProfile ? "Your Friends" : `${user.name}'s Friends`} (
                {friendsData.length})
              </h2>
              <button
                onClick={() => setShowFriendsList(false)}
                className="text-gray-400 hover:text-black font-bold text-xl"
              >
                ✕
              </button>
            </div>

            {loadingFriends ? (
              <p className="text-center py-6 text-gray-600">Loading friends...</p>
            ) : friendsData.length === 0 ? (
              <p className="text-center py-6 text-gray-500">No friends to display.</p>
            ) : (
              <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
                {friendsData.map((friend) => (
                  <div
                    key={friend._id}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <Link
                      to={`/profile/${friend._id}`}
                      onClick={() => setShowFriendsList(false)}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={friend.profilePicture || getRandomPlaceholder()}
                        alt={friend.username}
                        className="w-[40px] h-[40px] rounded-full object-cover border"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 leading-tight">
                          {friend.name}
                        </p>
                        <p className="text-xs text-gray-500">@{friend.username}</p>
                      </div>
                    </Link>

                    {isOwnProfile && (
                      <button
                        onClick={() => handleUnfriend(friend._id)}
                        className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded border border-red-200 font-semibold hover:bg-red-200"
                      >
                        Unfriend
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showEditProfile && (
        <EditProfile
          user={user}
          onUpdateSuccess={(updatedUser) => {
            setShowEditProfile(false);
            if (onUserUpdated) onUserUpdated(updatedUser);
          }}
          onClose={() => setShowEditProfile(false)}
        />
      )}

      {showAddPost && (
        <section className="mt-[30px]">
          <CreatePost
            onPostCreated={() => {
              setShowAddPost(false);
              if (onPostCreated) onPostCreated();
            }}
          />
        </section>
      )}
    </section>
  );
}

export default Profile;