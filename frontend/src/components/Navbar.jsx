import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white text-black px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1
          className="text-xl font-bold tracking-wide cursor-pointer text-black"
          onClick={() => navigate("/dashboard")}
        >
          Excel Analytics
        </h1>

        {user && (
          <div className="flex items-center space-x-4 text-sm">
            <img
              src={`https://ui-avatars.com/api/?name=${user.name}`}
              alt="avatar"
              className="w-8 h-8 rounded-full border"
            />
            <span className="text-black">{user.name}</span>
            <button
              onClick={logout}
              className="bg-black text-white px-3 py-1 rounded hover:bg-gray-900 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;