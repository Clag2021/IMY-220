import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <nav>
        <h1>PhotoShare</h1>

        <Link to="/">Splash Page</Link>
        <Link to="/home">Home</Link>
        <Link to="/profile/1">Profile</Link>
      </nav>
    </header>
  );
}

export default Header;