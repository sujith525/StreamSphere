import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [nickname, setNickname] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user?.nickname) {
      setNickname(user.nickname);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Center Links */}
      <div className="flex gap-6 mx-auto">
        <Link to="/" className="hover:text-red-500 font-semibold">
          Home
        </Link>
        <Link to="/browse" className="hover:text-red-500 font-semibold">
          Browse
        </Link>
        <Link to="/admin" className="hover:text-red-500 font-semibold">
          Admin
        </Link>
      </div>

      {/* Right side nickname and dropdown */}
      {nickname && (
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700 transition"
          >
            👋 Hi, {nickname}
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg overflow-hidden w-32 z-50">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
                onClick={() => {
                  setShowMenu(false);
                  alert('Profile clicked! (You can implement profile page next)');
                }}
              >
                👤 Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-200"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
