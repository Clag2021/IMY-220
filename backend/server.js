const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
const cors = require("cors");

const User = require("./models/User");
const Post = require("./models/Post");
const Album = require("./models/Album");

dotenv.config();

const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Mongo Conneced."))
  .catch(err => console.log(err));

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (password !== user.password) {
      return res.status(401).json({ success: false, message: "Incorrect password entered" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        isAdmin: !!user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to login user", error: error.message });
  }
});

app.post("/api/users", async (req, res) => {

  try {
    const { name, username, age, profilePicture, email, password, bio} = req.body;

    console.log("Signup request received:");
    console.log(req.body);

    const newUser = await User.create({name, username, age, profilePicture, email, password, bio, createdAt: new Date()});

    res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
            id: newUser._id,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            bio: newUser.bio,
            age: newUser.age,
            profilePicture: newUser.profilePicture
        }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message : "Failed to create user",
      error: error.message
    });
    
  }
  
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing User ID provided",
      });
    }

    let user = await User.findById(id)
      .populate({
        path: "friends",
        select: "username name profilePicture",
        strictPopulate: false,
      })
      .populate({
        path: "posts",
        strictPopulate: false,
      });

    if (!user) {
      user = await User.findById(id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User found",
      user: user,
    });
  } catch (error) {
    console.error("GET User Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to find user",
      error: error.message,
    });
  }
});

app.patch("/api/users/:id", async (req, res) => {

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated",
      user: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message : "Failed to update user information",
      error: error.message
    });
  }
});

app.delete("/api/users/:id", async (req, res) => {

  console.log("DELETE ROUTE REACHED");

  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted",
      user: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message : "Failed to delete user",
      error: error.message
    });
  }
});

app.post("/api/posts", async (req, res) => {

  try {

    const user = await User.findById(req.body.creator);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const { creator,img,caption,hashtags,likes,comments } = req.body;
    
    console.log("Post creation request received:");
    console.log(req.body);

    const newPost = await Post.create({
      creator: req.body.creator,
      img: req.body.img,
      caption: req.body.caption,
      hashtags: req.body.hashtags,
      likes: [],
      comments: [], 
      createdAt: new Date()
    });

    if (!user.posts) user.posts = [];
    user.posts.push(newPost._id);
    await user.save();

    res.status(201).json({
      success: true,
      message : "Post created succesfully",
      post: newPost
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message : "Failed to create post",
      error: error.message
    });
    
  }
  
});

app.get("/api/posts", async (req, res) => {

  try {
    const posts = await Post.find().sort({ createdAt: -1 }).populate("creator", "username profilePicture");

    res.status(200).json({
      success: true,
      message: "Posts found",
      posts: posts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message : "Failed to find posts",
      error: error.message
    });
  }
  
});

app.get("/api/users/:id/posts", async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const posts = await Post.find({
      creator: req.params.id
    }).sort({ createdAt: -1 }).populate("creator", "username profilePicture");

    res.status(200).json({
      success: true,
      message: "Users posts found",
      posts: posts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message : "Failed to find user posts",
      error: error.message
    });
  }
  
});

app.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("creator", "username profilePicture");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    const parentAlbums = await Album.find({ posts: req.params.id }).select("name _id");

    res.status(200).json({
      success: true,
      message: "Post found",
      post: post,
      albums: parentAlbums
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to find post",
      error: error.message
    });
  }
});

app.patch("/api/posts/:id", async (req, res) => {

  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    ).populate("creator", "username profilePicture");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Post updated",
      post: post
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message : "Failed to update post information",
      error: error.message
    });
  }
});

app.delete("/api/posts/:id", async (req, res) => {
  console.log("POST DELETE ROUTE REACHED");

  try {
    const postId = req.params.id;
    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    await User.updateOne(
      { _id: post.creator },
      { $pull: { posts: postId } }
    );

    const parentAlbums = await Album.find({ posts: postId });

    for (const album of parentAlbums) {
      if (album.posts.length === 1 && album.posts[0].toString() === postId.toString()) {
        await Album.findByIdAndDelete(album._id);
        
        await User.updateOne(
          { _id: album.creator },
          { $pull: { albums: album._id } }
        );
      } else {
        album.posts = album.posts.filter((id) => id.toString() !== postId.toString());
        await album.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Post deleted and single-post albums cleaned up successfully",
      post: post
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: error.message
    });
  }
});

app.post("/api/albums", async (req, res) => {

  try {
    
    const { creator,name,description,hashtags,posts} = req.body;

    const user = await User.findById(req.body.creator);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    console.log("Album creation request received:");
    console.log(req.body);

    const newAlbum = await Album.create({
      creator: req.body.creator,
      name: req.body.name,
      description: req.body.description,
      hashtags: req.body.hashtags,
      posts: [],
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      message : "Album created succesfully",
      album: newAlbum
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message : "Failed to create album",
      error: error.message
    });
    
  }
  
});

app.post("/api/albums/:albumId/posts/:postId", async (req, res) => {

  try {

    const album = await Album.findById(req.params.albumId);
    const post = await Post.findById(req.params.postId);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found"
      });
    }

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    };

    const postAlreadyExists = album.posts.some(
        postId => postId.equals(post._id)
    );

    if (postAlreadyExists) {
        return res.status(400).json({
            success: false,
            message: "Post is already in this album"
        });
    };

    album.posts.push(post._id);

    await album.save();

    res.status(201).json({
      success: true,
      message : "Post added succesfully to album",
      album: album
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message : "Failed to add post to album",
      error: error.message
    });
    
  }
  
});

app.get("/api/albums", async (req, res) => {
  try {
    const albums = await Album.find().populate("creator", "username profilePicture");

    res.status(200).json({
      success: true,
      albums
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to find albums",
      error: error.message
    });
  }
});

app.get("/api/albums/:id", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate("creator", "username profilePicture")
      .populate({
        path: "posts",
        populate: { path: "creator", select: "username profilePicture" }
      });

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Album found",
      album: album
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to find album",
      error: error.message
    });
  }
});

app.get("/api/users/:id/albums", async (req, res) => {

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    };

    const albums = await Album.find({
        creator: req.params.id
    }).populate("creator", "username profilePicture");

    res.status(200).json({
      success: true,
      message: "Albums found",
      albums: albums
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message : "Failed to find albums",
      error: error.message
    });
  }
  
});

app.patch("/api/albums/:id", async (req, res) => {

  try {
    const album = await Album.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Album updated",
      album: album
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message : "Failed to update album information",
      error: error.message
    });
  }
});

app.delete("/api/albums/:albumId/posts/:postId", async (req, res) => {

  try {

    const album = await Album.findById(req.params.albumId);
    const post = await Post.findById(req.params.postId);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found"
      });
    }

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    };

    const postAlreadyExists = album.posts.some(
        postId => postId.equals(post._id)
    );

    if (!postAlreadyExists) {
        return res.status(400).json({
            success: false,
            message: "Post is not in this album"
        });
    };

    album.posts = album.posts.filter(
        postId => !postId.equals(post._id)
    );

    await album.save();

    res.status(200).json({
      success: true,
      message : "Post deleted succesfully from album",
      album: album
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message : "Failed to delete post from album",
      error: error.message
    });
    
  }
  
});

app.delete("/api/albums/:id", async (req, res) => {

  console.log("POST DELETE ROUTE REACHED");

  try {
    const album = await Album.findByIdAndDelete(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Album deleted",
      album: album
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message : "Failed to delete album",
      error: error.message
    });
  }
});

app.post("/api/posts/:id/comments", async (req, res) => {
  try {
    const { text, userId, username } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const newComment = {
      user: userId,
      username: username,
      text: text,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      post
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add comment", error: error.message });
  }
});

app.patch("/api/posts/:id/like", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (!Array.isArray(post.likes)) {
      post.likes = [];
    }

    const hasLiked = post.likes.some((id) => id.toString() === userId.toString());

    if (hasLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();
    
    await post.populate("creator", "username profilePicture");

    res.status(200).json({
      success: true,
      message: hasLiked ? "Post unliked" : "Post liked",
      post: post
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update like",
      error: error.message
    });
  }
});

app.patch("/api/users/:id/friend", async (req, res) => {
  try {
    const { currentUserId } = req.body;
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isFriend = targetUser.friends?.some((id) => id.toString() === currentUserId.toString());

    if (isFriend) {
      targetUser.friends = targetUser.friends.filter((id) => id.toString() !== currentUserId.toString());
      currentUser.friends = currentUser.friends.filter((id) => id.toString() !== req.params.id.toString());
    } else {
      if (!Array.isArray(targetUser.friends)) targetUser.friends = [];
      if (!Array.isArray(currentUser.friends)) currentUser.friends = [];
      targetUser.friends.push(currentUserId);
      currentUser.friends.push(req.params.id);
    }

    await targetUser.save();
    await currentUser.save();

    res.status(200).json({ success: true, user: targetUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/api/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.trim() === "") {
      return res.status(200).json({ success: true, users: [], posts: [], albums: [] });
    }

    const cleanQuery = query.startsWith("#") ? query.slice(1) : query;
    const searchRegex = new RegExp(cleanQuery, "i");

    const users = await User.find({
      $or: [
        { name: searchRegex },
        { username: searchRegex },
        { email: searchRegex }
      ],
    }).select("name username profilePicture email");

    const posts = await Post.find({
      $or: [
        { caption: searchRegex },
        { hashtags: searchRegex }
      ],
    }).populate("creator", "username profilePicture");

    const albums = await Album.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { hashtags: searchRegex }
      ],
    }).populate("creator", "username profilePicture");

    res.status(200).json({
      success: true,
      users,
      posts,
      albums,
    });
  } catch (error) {
    console.error("Search API Error:", error);
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message
    });
  }
});

function makeFuzzyPattern(term) {
  const clean = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (clean.length <= 2) return clean;
  return clean.split("").join(".?");
}

app.post("/api/posts/:id/report", async (req, res) => {
  try {
    const { userId, reason } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (!Array.isArray(post.reports)) post.reports = [];

    const alreadyReported = post.reports.some(
      (r) => (r.user?._id || r.user || r).toString() === userId.toString()
    );

    if (!alreadyReported) {
      post.reports.push({
        user: userId,
        reason: reason || "Inappropriate content",
        createdAt: new Date(),
      });
      await post.save();
    }

    await post.populate("creator", "username profilePicture");

    res.status(200).json({
      success: true,
      message: "Post reported successfully",
      reportsCount: post.reports.length,
      post,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to report post", error: error.message });
  }
});

app.get("/api/admin/reported-posts", async (req, res) => {
  try {
    const reportedPosts = await Post.find({ "reports.0": { $exists: true } })
      .populate("creator", "username profilePicture")
      .populate("reports.user", "username email");

    res.status(200).json({ success: true, posts: reportedPosts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch reported posts", error: error.message });
  }
});

app.get("/api/admin/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
});