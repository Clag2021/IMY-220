import { useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import Profile from "../components/Profile";
import EditProfile from "../components/EditProfile";
import CreatePost from "../components/CreatePost";
import PostList from "../components/PostList";
import FriendList from "../components/FriendList";

function ProfilePage() {
  const { id } = useParams();

  const [user, setUser] = useState({
    name: "Alex Smith",
    username: "alexsmith",
    bio: "Photography, travelling and good food 📸",
    location: "Pretoria, South Africa",
    posts: 24,
    friends: 156,
  });

  return (
    <>
      <Header />

      <main>
        <h1>Profile</h1>

        {/* <p>Profile ID: {id}</p> */}

        <section>
          <Profile user={user} />
        </section>

        <section>
          <EditProfile
            user={user}
            setUser={setUser}
          />
        </section>

        <section>
          <CreatePost />
        </section>

        <section>
          <h2>Posts</h2>
          <PostList />
        </section>

        <aside>
          <FriendList />
        </aside>
      </main>
    </>
  );
}

export default ProfilePage;