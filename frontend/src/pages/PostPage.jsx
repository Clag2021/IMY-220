import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Post from "../components/Post";
import EditPost from "../components/EditPost";

function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);


  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}`);
      const data = await response.json();
      if (response.ok) {
        setPost(data.post);
      }
    } catch (error) {
      console.error("Failed to load post:", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (!post) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Header />
      <main className="max-w-[1000px] mx-auto p-4">
        <Post post={post} />

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
        >
          {isEditing ? "Close Edit" : "Edit Post"}
        </button>

        {isEditing && (
          <EditPost
            post={post}
            onUpdateSuccess={(updatedPost) => {
              setPost(updatedPost);
              setIsEditing(false);
            }}
            onClose={() => setIsEditing(false)}
          />
        )}
      </main>
    </>
  );
}

export default PostPage;