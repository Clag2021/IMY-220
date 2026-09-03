function EditPost() {
  return (
    <section>
      <h2>Edit Post</h2>

      <form>
        <label htmlFor="editCaption">Caption</label>

        <textarea
          id="editCaption"
          defaultValue="Beautiful afternoon in Pretoria!"
        />

        <label htmlFor="editImage">Change Image</label>

        <input
          id="editImage"
          type="file"
          accept="image/*"
        />

        <button type="submit">Save Changes</button>
      </form>
    </section>
  );
}

export default EditPost;