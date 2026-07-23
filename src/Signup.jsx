import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageWrapper from './PageWrapper';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const alreadyExists = users.find((u) => u.email === email);
    if (alreadyExists) {
      alert('Account already exists. Please login.');
      navigate('/');
      return;
    }

    const newUser = { email, password, nickname };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify({ email, nickname }));
    navigate('/browse');
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
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Nickname"
              className="w-full p-3 mb-4 rounded text-black"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-4 rounded text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-4 rounded text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded"
            >
              Create Account
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-red-400 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </PageWrapper>
    </div>
  );
}

export default Signup;
