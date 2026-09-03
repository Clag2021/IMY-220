const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Allow requests from the React frontend
app.use(cors());

// Allow Express to read JSON request bodies
app.use(express.json());


// SIGN IN ENDPOINT
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  console.log("Login request received:");
  console.log(req.body);

  // Dummy response - no real authentication yet
  res.json({
    success: true,
    message: "Login successful",
    user: {
      id: 1,
      name: "Alex Smith",
      username: "alexsmith",
      email: email,
    },
  });
});


// SIGN UP ENDPOINT
app.post("/api/signup", (req, res) => {
  const { name, username, email, password } = req.body;

  console.log("Signup request received:");
  console.log(req.body);

  // Dummy response - user is NOT actually stored yet
  res.json({
    success: true,
    message: "Account created successfully",
    user: {
      id: 2,
      name: name,
      username: username,
      email: email,
    },
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});