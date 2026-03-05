import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const EmployerDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [stats, setStats] = useState({ jobs: 0, applicants: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/dashboard/employer', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setStats({
            jobs: res.data.data.jobs.total || 0,
            applicants: res.data.data.applications.total || 0
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex h-screen bg-brand-black overflow-hidden font-sans text-white">
      
      {/* Sidebar Component */}
      <Sidebar role="employer" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-gold rounded-full mix-blend-multiply filter blur-[150px] opacity-10 pointer-events-none"></div>

        {/* Top Center Logo Area */}
        <div className="w-full py-6 flex justify-center items-center border-b border-gray-800 relative z-10">
          <div className="flex items-center gap-3">
            <img src={logo} alt="HireSphere Logo" className="h-10 object-contain bg-white/90 px-2 py-1 rounded-lg" />
            <h1 className="text-2xl font-heading font-bold tracking-tight">
              Hire<span className="text-brand-gold">Sphere</span> <span className="text-sm font-sans text-gray-500 font-normal ml-2">| Employer Area</span>
            </h1>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8 relative z-10 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">Employer Dashboard</h2>
              <p className="text-gray-400">Manage your job postings and review applicants.</p>
            </div>
            <Link to="/post-job">
              <button className="px-6 py-3 bg-brand-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors shadow-[0_0_15px_rgba(197,157,95,0.3)]">
                + Post New Job
              </button>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-brand-darkgray border border-gray-800 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
              <p className="text-gray-400 text-sm mb-1 relative z-10">Active Job Postings</p>
              <p className="text-4xl font-bold text-white relative z-10">
                {loading ? <span className="animate-pulse text-gray-600">...</span> : stats.jobs}
              </p>
            </div>
            <div className="p-6 bg-brand-darkgray border border-gray-800 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
              <p className="text-gray-400 text-sm mb-1 relative z-10">Total Applicants</p>
              <p className="text-4xl font-bold text-white relative z-10">
                {loading ? <span className="animate-pulse text-gray-600">...</span> : stats.applicants}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployerDashboard;