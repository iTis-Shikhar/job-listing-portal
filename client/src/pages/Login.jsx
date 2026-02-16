import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      if(res.data.role === 'employer') navigate('/employer-dashboard');
      else navigate('/seeker-dashboard');
      
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="relative min-h-screen bg-brand-black flex items-center justify-center p-4 overflow-hidden">
      
      {/* --- NEW: Back to Home Button --- */}
      <Link to="/" className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-gray-400 hover:text-brand-gold transition-colors z-20 font-sans font-medium text-sm group">
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>

      {/* Blurred Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold rounded-full mix-blend-multiply filter blur-[150px] opacity-30"></div>
      
      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md bg-brand-darkgray/60 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 font-sans text-sm">Log in to your HireSphere account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input 
              type="email" name="email" onChange={handleChange} required
              className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:outline-none focus:border-brand-gold text-white transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input 
              type="password" name="password" onChange={handleChange} required
              className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:outline-none focus:border-brand-gold text-white transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full py-3 mt-4 bg-brand-gold text-brand-black font-bold rounded-lg hover:bg-yellow-500 transition-colors hover:shadow-[0_0_15px_rgba(197,157,95,0.4)]">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account? <Link to="/signup" className="text-brand-gold hover:underline font-medium">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;