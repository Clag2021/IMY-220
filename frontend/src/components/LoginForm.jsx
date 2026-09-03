import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;

    const loginData = {
      email: form.loginEmail.value,
      password: form.loginPassword.value,
    };

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      console.log(data);

      if (data.success) {
        alert(data.message);
        navigate("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Could not connect to the server.");
    }
  };

  return (
    <section>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="loginEmail">Email</label>
        <input
          id="loginEmail"
          name="loginEmail"
          type="email"
          defaultValue="alex@example.com"
          required
        />

        <label htmlFor="loginPassword">Password</label>
        <input
          id="loginPassword"
          name="loginPassword"
          type="password"
          defaultValue="Password123"
          required
        />

        <button type="submit">
          Login
        </button>
      </form>
    </section>
  );
}

export default LoginForm;