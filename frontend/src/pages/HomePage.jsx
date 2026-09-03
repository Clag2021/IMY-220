import Header from "../components/Header";
import Feed from "../components/Feed";
import SearchInput from "../components/SearchInput";

function HomePage() {
  return (
    <>
      <Header />

      <main>
        <section>
          <h1>Home</h1>
          <p>See what your friends have been sharing.</p>

          <SearchInput />
        </section>

        <section>
          <h2>Recent Posts</h2>
          <Feed />
        </section>
      </main>
    </>
  );
}

export default HomePage;