import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import logo from '../assets/logo.png'; 

const SeekerDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs from the database when the page loads
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/jobs');
        // The backend returns the array of jobs inside res.data.data
        setJobs(res.data.data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="flex h-screen bg-brand-black overflow-hidden font-sans text-white">
      
      <Sidebar role="user" />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-gold rounded-full mix-blend-multiply filter blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="w-full py-6 flex justify-center items-center border-b border-gray-800 relative z-10">
          <div className="flex items-center gap-3">
            <img src={logo} alt="HireSphere Logo" className="h-10 object-contain bg-white/90 px-2 py-1 rounded-lg" />
            <h1 className="text-2xl font-heading font-bold tracking-tight">
              Hire<span className="text-brand-gold">Sphere</span>
            </h1>
          </div>
        </div>

        <div className="p-8 relative z-10 max-w-7xl mx-auto w-full">
          <h2 className="text-3xl font-heading font-bold mb-2">Welcome back, {user?.name || 'Job Seeker'}!</h2>
          <p className="text-gray-400 mb-8">Here are the latest opportunities matching your profile.</p>

          {/* Dynamic Job Cards from Database */}
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-10 bg-brand-darkgray/30 rounded-xl border border-gray-800">
              <p className="text-gray-400">No jobs available right now. Please check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job._id} className="p-6 bg-brand-darkgray border border-gray-800 rounded-xl hover:border-brand-gold/50 transition-colors flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{job.title}</h3>
                      <span className="bg-brand-gold/10 text-brand-gold text-xs px-2 py-1 rounded font-medium">
                        {job.jobType}
                      </span>
                    </div>
                    
                    <p className="text-brand-gold text-sm mb-3 font-medium">
                      {job.employerProfile?.companyName || 'HireSphere Partner'} 
                      <span className="text-gray-500 mx-2">•</span> 
                      {job.location?.city || 'Remote'} {job.location?.isRemote && '(Remote)'}
                    </p>
                    
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                      {job.description}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                      {job.salaryRange?.currency} {job.salaryRange?.min} - {job.salaryRange?.max}
                    </p>
                    <button className="px-4 py-2 bg-brand-gold/10 text-brand-gold rounded-lg font-medium hover:bg-brand-gold hover:text-black transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SeekerDashboard;