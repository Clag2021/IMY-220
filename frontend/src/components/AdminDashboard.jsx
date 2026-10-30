import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard({ onClose }) {
  const [activeTab, setActiveTab] = useState("reports");
  const [reportedPosts, setReportedPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [reportsRes, usersRes] = await Promise.all([
        fetch("http://localhost:3000/api/admin/reported-posts"),
        fetch("http://localhost:3000/api/admin/users"),
      ]);

      const reportsData = await reportsRes.json();
      const usersData = await usersRes.json();

      if (reportsRes.ok) setReportedPosts(reportsData.posts || []);
      if (usersRes.ok) setAllUsers(usersData.users || []);
    } catch (error) {
      console.error("Failed to load admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Admin: Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        alert("Post deleted by Admin.");
        fetchAdminData();
      }
    } catch (err) {
      console.error("Admin post delete failed:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Admin: Delete this user account permanently?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        alert("User deleted by Admin.");
        fetchAdminData();
      }
    } catch (err) {
      console.error("Admin user delete failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-xl p-6 relative shadow-2xl max-h-[85vh] flex flex-col text-black dark:text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white font-bold text-xl"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-6 border-b pb-3">
          <span className="text-2xl">👑</span>
          <h2 className="text-2xl font-bold">Admin Moderation Control</h2>
        </div>


        <div className="flex gap-4 mb-4 border-b">
          <button
            onClick={() => setActiveTab("reports")}
            className={`pb-2 px-4 font-bold border-b-2 transition ${
              activeTab === "reports"
                ? "border-[#961515] text-[#961515]"
                : "border-transparent text-gray-500 hover:text-black dark:hover:text-white"
            }`}
          >
            Reported Posts ({reportedPosts.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-2 px-4 font-bold border-b-2 transition ${
              activeTab === "users"
                ? "border-[#961515] text-[#961515]"
                : "border-transparent text-gray-500 hover:text-black dark:hover:text-white"
            }`}
          >
            Manage Users ({allUsers.length})
          </button>
        </div>

        {loading ? (
          <p className="text-center py-10 font-semibold">Loading admin panel...</p>
        ) : activeTab === "reports" ? (
  
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {reportedPosts.length === 0 ? (
              <p className="text-center py-10 text-gray-500">No reported posts right now.</p>
            ) : (
              reportedPosts.map((post) => (
                <div key={post._id} className="border p-4 rounded-xl flex gap-4 items-start bg-gray-50 dark:bg-gray-800">
                  <img src={post.img} alt={post.caption} className="w-24 h-24 object-cover rounded-lg border" />
                  
                  <div className="flex-1">
                    <p className="font-bold text-sm">@{post.creator?.username || "User"}</p>
                    <p className="text-sm mt-1">{post.caption}</p>


                    <div className="mt-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-2 rounded text-xs text-red-900 dark:text-red-200">
                      <span className="font-bold block mb-1">🚩 Reasons ({post.reports?.length}):</span>
                      <ul className="list-disc list-inside space-y-1">
                        {post.reports?.map((rep, i) => (
                          <li key={i}>
                            <strong>@{rep.user?.username || "Anonymous"}:</strong> {rep.reason || "No reason specified"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/post/${post._id}`}
                      onClick={onClose}
                      className="bg-gray-200 dark:bg-gray-700 px-3 py-1 text-xs rounded text-center font-semibold"
                    >
                      View Post
                    </Link>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="bg-red-600 text-white px-3 py-1 text-xs rounded font-semibold hover:bg-red-700"
                    >
                      Delete Post
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {allUsers.map((u) => (
              <div key={u._id} className="border p-3 rounded-lg flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <img
                    src={u.profilePicture || "https://via.placeholder.com/40"}
                    alt={u.username}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                  <div>
                    <p className="font-bold text-sm">
                      {u.name} <span className="text-xs text-gray-500">(@{u.username})</span>
                      {u.isAdmin && <span className="ml-2 bg-yellow-400 text-black text-[10px] font-extrabold px-1.5 py-0.5 rounded">ADMIN</span>}
                    </p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                </div>

                {!u.isAdmin && (
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="bg-red-600 text-white text-xs px-3 py-1.5 rounded font-semibold hover:bg-red-700"
                  >
                    Delete Account
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;