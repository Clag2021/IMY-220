import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupForm() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("Password123");
  const [confirmPassword, setConfirmPassword] =
    useState("Password123");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const form = event.target;

    const signupData = {
      name: form.name.value,
      username: form.username.value,
      email: form.signupEmail.value,
      password: password,
    };

    try {
      const response = await fetch(
        "http://localhost:3000/api/signup",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(signupData),
        }
      );

      const data = await response.json();

      console.log(data);

      if (data.success) {
        alert(data.message);
        navigate("/home");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Could not connect to the server.");
    }
  };

  return (
    <section>
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength="2"
          defaultValue="Alex Smith"
        />

        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          required
          minLength="3"
          defaultValue="alexsmith"
        />

        <label htmlFor="signupEmail">Email</label>
        <input
          id="signupEmail"
          name="signupEmail"
          type="email"
          required
          defaultValue="alex@example.com"
        />

        <label htmlFor="signupPassword">
          Password
        </label>

        <input
          id="signupPassword"
          type="password"
          required
          minLength="6"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
        />

        <label htmlFor="confirmPassword">
          Confirm Password
        </label>

        <input
          id="confirmPassword"
          type="password"
          required
          minLength="6"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(event.target.value)
          }
        />

        {confirmPassword &&
          password !== confirmPassword && (
            <p>Passwords do not match.</p>
          )}

        <button
          type="submit"
          disabled={
            password.length < 6 ||
            confirmPassword.length < 6 ||
            password !== confirmPassword
          }
        >
          Sign Up
        </button>
      </form>
    </section>
  );
}

export default SignupForm;