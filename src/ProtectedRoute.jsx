import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    alert("Please login to access this page.");
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
