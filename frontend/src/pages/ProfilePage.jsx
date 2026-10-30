import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import Profile from "../components/Profile";
import Feed from "../components/Feed";

function ProfilePage() {
  const { id: paramId } = useParams();

  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = loggedUser?._id || loggedUser?.id;

  const targetUserId = paramId || currentUserId;

  const [user, setUser] = useState(null);
  const [feedKey, setFeedKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const getUserData = useCallback(async () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/users/${targetUserId}`);
      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Could not load profile data:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  const handlePostCreated = () => {
    getUserData();
    setFeedKey((prevKey) => prevKey + 1);
  };

  const handleUserUpdated = (updatedUser) => {
    setUser(updatedUser);
    setFeedKey((prevKey) => prevKey + 1);
  };

  if (loading) {
    return <p className="text-center mt-10 font-semibold">Loading profile...</p>;
  }

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="text-center my-20">
          <h2 className="text-xl font-bold text-red-600">User Not Found</h2>
          <p className="text-sm text-gray-500 mt-2">
            The requested user profile does not exist or has been deleted.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section className="flex-1 px-[150px] py-[35px]">
        <Profile
          user={user}
          onPostCreated={handlePostCreated}
          onUserUpdated={handleUserUpdated}
        />

        <section className="mt-[40px]">
          <Feed key={feedKey} type="user" userId={targetUserId} />
        </section>
      </section>

      <footer className="h-[70px] bg-[#961515]"></footer>
    </main>
  );
}

export default ProfilePage;