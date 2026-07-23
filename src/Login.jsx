import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageWrapper from './PageWrapper';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify({ email }));
      navigate('/');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: 'url("/fotor-ai-20250629162535.jpg")',
      }}
    >
     <PageWrapper>
  <div className="max-w-md w-full bg-black bg-opacity-70 backdrop-blur-sm p-6 rounded-lg shadow-lg text-white">
    
    <form onSubmit={handleLogin}>
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full p-2 mb-3 border border-gray-300 rounded text-black"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
      />

      <button type="submit" className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
        Login
      </button>

      <p className="mt-4 text-center text-sm text-gray-300">
        Don't have an account?{' '}
        <Link to="/signup" className="text-red-400 font-medium hover:underline">
          Create one!
        </Link>
      </p>
    </form>
  </div>
</PageWrapper>

    </div>
  );
}

export default Login;
