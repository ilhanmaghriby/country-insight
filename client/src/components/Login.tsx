import { useEffect, useState } from "react";

interface User {
  name: string;
  picture: string;
}

const AuthButton = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google"; // Ganti dengan endpoint OAuth
  };

  const handleLogout = () => {
    setUser(null);
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("http://localhost:3000/auth/user", {
        credentials: "include",
      });
      const userData = await response.json();
      if (userData) {
        setUser(userData);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex justify-start pl-2 md:pl-8 py-2 bg-gray-100">
      {user ? (
        <div className="flex items-center gap-4">
          <img
            src={user.picture}
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-gray-800">{user.name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-1 text-white bg-red-600 rounded-lg duration-150 hover:bg-red-700 active:shadow-lg"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-1 text-white bg-gray-600 rounded-lg duration-150 hover:bg-gray-700 active:shadow-lg"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default AuthButton;
