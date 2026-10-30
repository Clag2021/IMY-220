import { useState } from "react";

function EditProfile({ user, onUpdateSuccess, onClose }) {
  const [name, setName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || "");
  const [bio, setBio] = useState(user.bio || "");
  const [profilePicture, setProfilePicture] = useState(user.profilePicture || "");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/api/users/${user._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          bio,
          profilePicture,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const loggedUser = JSON.parse(localStorage.getItem("user"));
        if (loggedUser?._id === user._id || loggedUser?.id === user._id) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        if (onUpdateSuccess) {
          onUpdateSuccess(data.user);
        }
      } else {
        setMessage(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Could not connect to the server");
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
          <h2 className="text-xl font-bold">Edit Profile</h2>
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
            <label htmlFor="editPicture" className="block text-sm font-semibold mb-1">
              Profile Picture URL
            </label>
            <input
              id="editPicture"
              type="url"
              value={profilePicture}
              onChange={(event) => setProfilePicture(event.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#961515]"
            />
          </div>
          
          <div>
            <label htmlFor="editName" className="block text-sm font-semibold mb-1">
              Name
            </label>
            <input
              id="editName"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#961515]"
            />
          </div>

          <div>
            <label htmlFor="editUsername" className="block text-sm font-semibold mb-1">
              Username
            </label>
            <input
              id="editUsername"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#961515]"
            />
          </div>

          <div>
            <label htmlFor="editBio" className="block text-sm font-semibold mb-1">
              Bio
            </label>
            <textarea
              id="editBio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows="3"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#961515]"
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
              className="px-4 py-2 bg-[#961515] text-white rounded font-semibold hover:bg-[#7a1010]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;