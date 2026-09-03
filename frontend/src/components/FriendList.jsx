import ProfilePreview from "./ProfilePreview";

function FriendsList() {
  const friends = [
    {
      id: 1,
      name: "Jamie Lee",
      username: "jamielee",
      image: "https://placehold.co/80x80",
    },
    {
      id: 2,
      name: "Sam Williams",
      username: "samwilliams",
      image: "https://placehold.co/80x80",
    },
    {
      id: 3,
      name: "Taylor Jones",
      username: "taylorjones",
      image: "https://placehold.co/80x80",
    },
  ];

  return (
    <section>
      <h2>Friends</h2>

      {friends.map((friend) => (
        <ProfilePreview
          key={friend.id}
          id={friend.id}
          name={friend.name}
          username={friend.username}
          image={friend.image}
        />
      ))}
    </section>
  );
}

export default FriendsList;