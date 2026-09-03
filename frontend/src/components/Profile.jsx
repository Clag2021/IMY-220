function Profile({ user }) {
  return (
    <section>
      <img
        src="https://placehold.co/150x150"
        alt={`${user.name}'s profile`}
      />

      <h1>{user.name}</h1>

      <p>@{user.username}</p>

      <p>{user.bio}</p>

      <p>{user.location}</p>

      <p>Posts: {user.posts}</p>

      <p>Friends: {user.friends}</p>
    </section>
  );
}

export default Profile;