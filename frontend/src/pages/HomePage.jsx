import { useState } from "react";
import Header from "../components/Header";
import Feed from "../components/Feed";

function HomePage() {
  const [feedType, setFeedType] = useState("global"); 

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <section className="flex justify-center mt-[25px]">
        <button
          onClick={() => setFeedType("local")}
          className={`w-[220px] text-[22px] py-[8px] rounded-l-[15px] font-semibold transition ${
            feedType === "local"
              ? "bg-[#961515] text-white shadow-md"
              : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
        >
          Local Feed
        </button>

        <button
          onClick={() => setFeedType("global")}
          className={`w-[220px] text-[22px] py-[8px] rounded-r-[15px] font-semibold transition ${
            feedType === "global"
              ? "bg-[#961515] text-white shadow-md"
              : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
        >
          Global Feed
        </button>
      </section>

      <section className="flex-1 px-[40px] py-[45px]">
        <Feed type={feedType} />
      </section>


      <footer className="h-[70px] bg-[#961515]"></footer>
    </main>
  );
}

export default HomePage;