import { useParams } from "react-router-dom";

import Header from "../components/Header";
import Post from "../components/Post";
import PostImage from "../components/PostImage";
import Comments from "../components/Comments";
import EditPost from "../components/EditPost";

function PostPage() {
  const { id } = useParams();

  return (
    <>
      <Header />

      <main>
        <h1>Post</h1>

        <p>Post ID: {id}</p>

        <article>
          <Post />
          <PostImage />
        </article>

        <section>
          <Comments />
        </section>

        <section>
          <EditPost />
        </section>
      </main>
    </>
  );
}

export default PostPage;