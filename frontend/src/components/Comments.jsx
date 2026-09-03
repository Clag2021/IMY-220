function Comments() {
  const comments = [
    {
      id: 1,
      username: "jamielee",
      text: "This photo looks amazing!",
    },
    {
      id: 2,
      username: "samwilliams",
      text: "Great shot 📸",
    },
    {
      id: 3,
      username: "taylorjones",
      text: "Love the view!",
    },
  ];

  return (
    <section>
      <h2>Comments</h2>

      {comments.map((comment) => (
        <article key={comment.id}>
          <strong>@{comment.username}</strong>
          <p>{comment.text}</p>
        </article>
      ))}
    </section>
  );
}

export default Comments;