import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

function SplashPage() {
  return (
    <main>
      <section>
        <h1>PhotoShare</h1>
        <p>Share your favourite moments with friends.</p>
      </section>

      <section>
        <LoginForm />
        <SignupForm />
      </section>
    </main>
  );
}

export default SplashPage;