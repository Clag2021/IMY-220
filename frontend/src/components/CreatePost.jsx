import { useState } from "react";

function CreatePost() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (caption.trim().length < 3) {
      alert("Caption must be at least 3 characters.");
      return;
    }

    if (!image) {
      alert("Please select an image.");
      return;
    }

    alert("Post is valid and ready to be created.");
  };

  return (
    <section>
      <h2>Create Post</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="caption">Caption</label>

        <input
          id="caption"
          type="text"
          placeholder="Write a caption..."
          required
          minLength="3"
          maxLength="200"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
        />

        <p>{caption.length}/200 characters</p>

        <label htmlFor="image">Image</label>

        <input
          id="image"
          type="file"
          accept="image/*"
          required
          onChange={(event) => {
            setImage(event.target.files[0]);
          }}
        />

        <button
          type="submit"
          disabled={
            caption.trim().length < 3 ||
            !image
          }
        >
          Create Post
        </button>
      </form>
    </section>
  );
}

export default CreatePost;