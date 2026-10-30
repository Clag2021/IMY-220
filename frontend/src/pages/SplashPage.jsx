import { Link } from "react-router-dom";
function SplashPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <section className="h-[50px] bg-[#961515] flex items-center justify-center">
        <h1 className="text-white text-[30px] font-bold">
          EAT WITH ME
        </h1>
      </section>

        <section className="flex-1 flex items-center justify-center">
          <img
            src="/carasole.png"
            alt="PhotoShare logo"
            className="w-[1900px]"
          />
        </section>

        <section className="flex justify-center gap-100">
        <Link to="/signup">
          <button className="w-[200px] h-[45px] bg-[#961515] text-white px-8 my-4 rounded-lg text-[20px]">
            Sign Up
          </button>
        </Link>

        <Link to="/login">
          <button className="w-[200px] h-[45px] bg-black text-white px-8 my-4 rounded-lg text-[20px]">
            Log In
          </button>
        </Link>
      </section>

      <section>
        <footer className="h-[50px] bg-[#961515] mt-auto">
      </footer>
        
      </section>
    </main>
  );
}

export default SplashPage;
