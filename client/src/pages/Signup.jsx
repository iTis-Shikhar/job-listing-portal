import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) {
      alert("Please select a role (Job Seeker or Employer)");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Registration Successful!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors z-20 font-sans font-medium text-sm group">
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-effect relative z-10 w-full max-w-md p-8 md:p-10 rounded-[30px]"
      >
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🚀</div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-white/60 text-sm">Join the HireSphere community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Full Name</label>
            <input 
              type="text" name="name" onChange={handleChange} required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-cyan-400 text-white transition-all placeholder:text-white/30 disabled:opacity-50"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Email Address</label>
            <input 
              type="email" name="email" onChange={handleChange} required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-cyan-400 text-white transition-all placeholder:text-white/30 disabled:opacity-50"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
            <input 
              type="password" name="password" onChange={handleChange} required
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-cyan-400 text-white transition-all placeholder:text-white/30 disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">I am a...</label>
            <div className="relative">
              <select 
                name="role" 
                onChange={handleChange} 
                value={formData.role}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-cyan-400 text-white transition-all cursor-pointer appearance-none disabled:opacity-50"
              >
                <option value="" disabled className="bg-[#12002b] text-white/40">Select Role...</option>
                <option value="user" className="bg-[#12002b]">Job Seeker</option>
                <option value="employer" className="bg-[#12002b]">Employer</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-white/60 text-sm">
          Already have an account? <Link to="/login" className="text-cyan-400 hover:underline font-medium">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;