import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isUserLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    logout();
    navigate("/");
  };
  return (
    <nav className="bg-white flex justify-around items-center h-14 py-4 mx-auto shadow-sm sticky top-0 z-50">
      <h3 className="font-bold text-xl text-gray-800">Knb task</h3>
      <ul className="hidden sm:flex justify-center items-center gap-3 text-gray-500 text-sm">
        <li className="hover:text-gray-800">
          <Link to="/">Home</Link>
        </li>
        <li className="hover:text-gray-800">
          <Link to="/profile">Profile</Link>
        </li>
        <li className="hover:text-gray-800">
          <Link to="/users">Users</Link>
        </li>
        <li className="hover:text-gray-800">
          <Link to="/dashboard">DashBoard</Link>
        </li>
      </ul>
      <div className="hidden sm:flex gap-2">
        {!isUserLoggedIn ? (
          <ul className="flex justify-center items-center gap-3 text-gray-500 text-sm">
            <li className="hover:text-gray-800">
              <Link to="/signup">Sign Up</Link>
            </li>
            <li className="hover:text-gray-800">
              <Link to="/login">Log in</Link>
            </li>
          </ul>
        ) : (
          <div className="hidden sm:flex gap-3">
            <Link to="/profile">profile</Link>
            <button
              type="button"
              className="text-gray-500 text-sm hover:text-gray-800"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
