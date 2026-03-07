import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Sidebar from '../components/Sidebar';
import logo1 from '../assets/logo1.png';
import { Link } from 'react-router-dom';

const EmployerDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [stats, setStats] = useState({ jobs: 0, applicants: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get('/dashboard/employer', {
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
    <div className="flex h-screen bg-brand-bg overflow-hidden font-sans text-brand-text relative">
      
      <Sidebar role="employer" />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        
        {/* Soft Modern Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-primary rounded-full filter blur-[150px] opacity-[0.03] pointer-events-none"></div>

        {/* Top Center Logo Area */}
        <div className="w-full py-6 flex justify-center items-center border-b border-brand-border bg-brand-surface relative z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <img src={logo1} alt="Profilia Logo" className="h-9 object-contain" />
            <h1 className="text-2xl font-bold tracking-tight text-brand-text">
            </h1>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8 relative z-10 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-brand-text">Employer Dashboard</h2>
              <p className="text-brand-muted">Manage your job postings and review applicants.</p>
            </div>
            <Link to="/post-job">
              <button className="px-6 py-2.5 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primaryHover transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Post New Job
              </button>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Active Jobs Card */}
            <div className="p-6 bg-brand-surface border border-brand-border rounded-xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
              <div className="relative z-10 flex items-center justify-between mb-4">
                <p className="text-brand-muted text-sm font-semibold uppercase tracking-wider">Active Job Postings</p>
                <div className="p-2 bg-blue-50 text-brand-primary rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-brand-text relative z-10">
                {loading ? <span className="animate-pulse text-brand-muted">...</span> : stats.jobs}
              </p>
            </div>
            
            {/* Total Applicants Card */}
            <div className="p-6 bg-brand-surface border border-brand-border rounded-xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
              <div className="relative z-10 flex items-center justify-between mb-4">
                <p className="text-brand-muted text-sm font-semibold uppercase tracking-wider">Total Applicants</p>
                <div className="p-2 bg-blue-50 text-brand-primary rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
              </div>
              <p className="text-4xl font-bold text-brand-text relative z-10">
                {loading ? <span className="animate-pulse text-brand-muted">...</span> : stats.applicants}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployerDashboard;