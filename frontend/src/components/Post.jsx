function Post() {
  const post = {
    username: "alexsmith",
    caption: "Beautiful afternoon in Pretoria!",
    likes: 42,
    date: "3 September 2026",
  };

  return (
    <section>
      <h2>@{post.username}</h2>
      <p>{post.caption}</p>
      <p>❤️ {post.likes} likes</p>
      <small>{post.date}</small>
    </section>
  );
}

export default Post;