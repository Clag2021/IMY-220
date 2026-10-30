function Comments({ comments = [] }) {
  return (
    <section className="mt-[20px] max-h-[500px] overflow-y-auto flex flex-col gap-[10px]">
      <h3 className="font-bold text-[16px] border-b pb-[5px]">Comments</h3>

      {comments && comments.length > 0 ? (
        comments.map((comment, index) => (
          <article key={comment._id || index} className="bg-gray-100 p-[8px] rounded text-[14px]">
            <span className="font-semibold">@{comment.username || "User"}: </span>
            <span>{comment.text}</span>
          </article>
        ))
      ) : (
        <p className="text-gray-400 text-[14px]">No comments yet.</p>
      )}
    </section>
  );
}

export default Comments;