import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import Carousel from "../components/Carasousel";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",

  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log("User logged in:", data);

        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage("Account found successfully!");
        navigate("/home");
      } else {
        setMessage(data.message || "Log in failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to the server");
    }
  }


  return (
    <main className="min-h-screen flex flex-col">

      <section className="h-[50px] bg-[#961515] flex items-center justify-center">
        <h1 className="text-white text-[30px] font-bold">
          EAT WITH ME
        </h1>
      </section>

      <section className="flex flex-1">

        <section className="w-1/2 flex justify-center items-center">

          <form onSubmit={handleSubmit} className="w-full max-w-[700px] px-[40px] py-[10px]">

            <label className="block mb-[10px]">
              <span className="block mb-[8px] font-semibold">
                Email
              </span>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-md p-[8px]"
              />
            </label>

            <label className="block mb-[10px]">
              <span className="block mb-[8px] font-semibold">
                Password
              </span>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-[8px]"
              />
            </label>


            <button
              type="submit"
              className="w-full bg-[#961515] text-white font-semibold py-[10px] rounded-md"
            >
              Log In
            </button>

            {message && (
              <p className="text-center mt-[10px]" >{message} </p>
              )}

            <p className="text-center mt-[30px]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[#961515]"
              >
                Sign up here →
              </Link>
            </p>

          </form>

        </section>

        <section className="w-1/2">
          <Carousel />
        </section>

      </section>

      <footer className="h-[50px] bg-[#961515]"></footer>

    </main>
  );
}

export default Login;