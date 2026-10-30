import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import Carousel from "../components/Carasousel"

function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    username: "",
    password: "",
    bio: "",
    profilePicture: ""
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
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        console.log("User created:", data);
        localStorage.setItem("user", JSON.stringify(data.user))
        
        setMessage("Account created successfully!");
        navigate("/login");
      } else {
        setMessage(data.message || "Signup failed.");
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

            <div className="flex gap-[10px] mb-[10px]">

              <label className="flex-1">
                <span className="block mb-[8px] font-semibold">
                  First name
                </span>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-[8px]"
                />
              </label>

              <label className="flex-1">
                <span className="block mb-[8px] font-semibold">
                  Age
                </span>

                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-[8px]"
                />
              </label>

            </div>

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

            <label className="block mb-[10px]">
              <span className="block mb-[8px] font-semibold">
                Username
              </span>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-[8px]"
              />
            </label>


            <label className="block mb-[10px]">
              <span className="block mb-[8px] font-semibold">
                What's your first bio?
              </span>

              <textarea
                rows="2"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-[8px]"
              />
            </label>

            <label className="block mb-[30px]">
              <span className="block mb-[8px] font-semibold">
                Show us you! What's your profile picture?
              </span>

              <input
                type="url"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleChange}
                accept="image/*"
                className="w-full border border-gray-300 rounded-md p-[8px]"
              />
            </label>


            <button
              type="submit"
              className="w-full bg-[#961515] text-white font-semibold py-[10px] rounded-md"
            >
              Sign Up
            </button>

            <p className="text-center mt-[30px]">
              Already have an account?{" "}

              <Link
                to="/login"
                className="font-semibold text-[#961515]"
              >
                Log in here →
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

export default Signup;