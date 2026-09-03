import { useState } from "react";

function EditProfile({ user, setUser }) {
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [location, setLocation] = useState(user.location);

  const handleSubmit = (event) => {
    event.preventDefault();

    setUser({
      ...user,
      name: name,
      username: username,
      bio: bio,
      location: location,
    });

    alert("Profile updated!");
  };

  return (
    <section>
      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="editName">Name</label>

        <input
          id="editName"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <label htmlFor="editUsername">Username</label>

        <input
          id="editUsername"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <label htmlFor="editBio">Bio</label>

        <textarea
          id="editBio"
          value={bio}
          onChange={(event) => setBio(event.target.value)}
        />

        <label htmlFor="editLocation">Location</label>

        <input
          id="editLocation"
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />

        <button type="submit">
          Save Changes
        </button>
      </form>
    </section>
  );
}

export default EditProfile;