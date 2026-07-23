import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import Admin from './Admin';
import Browse from './Browse';
import ProtectedRoute from './ProtectedRoute';
import Home from './Home';

function AppContent({ user, handleLogout }) {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  // Hide Navbar on these routes
  const hideNavbarRoutes = ['/login', '/signup'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && (
        <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
          {/* Center links */}
          <div className="flex gap-6 mx-auto">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/browse" className="hover:underline">
              Browse
            </Link>
            <Link to="/admin" className="hover:underline">
              Admin
            </Link>
          </div>

          {/* Right corner nickname + dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-gray-700 px-4 py-2 rounded-full hover:bg-gray-600 transition"
              >
                👋 Hi, {user.nickname || user.email}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg overflow-hidden w-32 z-50">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-200"
                    onClick={() => {
                      setShowDropdown(false);
                      alert('Profile clicked!'); // Placeholder
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
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <Browse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedIn = JSON.parse(localStorage.getItem('currentUser'));
    if (loggedIn) setUser(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    window.location.href = '/'; // Reload and redirect
  };

  return (
    <Router>
      <AppContent user={user} handleLogout={handleLogout} />
    </Router>
  );
}

export default App;
