import { Link } from "react-router-dom";

function ProfilePreview({ id, name, username, image }) {
  return (
    <article>
      <img src={image} alt={`${name}'s profile`} />

      <h3>{name}</h3>
      <p>@{username}</p>

      <Link to={`/profile/${id}`}>
        View Profile
      </Link>
    </article>
  );
}

export default ProfilePreview;