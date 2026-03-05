import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetching the applications specific to the logged-in job seeker
        const res = await axios.get('http://localhost:5000/api/applications/my-applications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(res.data.data || []);
      } catch (error) {
        console.error('Error fetching my applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyApplications();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Shortlisted': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'; // Pending/Applied
    }
  };

  return (
    <div className="flex h-screen bg-brand-black overflow-hidden font-sans text-white relative">
      <Sidebar role="user" />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative p-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-gold rounded-full mix-blend-multiply filter blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto w-full relative z-10">
          <h2 className="text-3xl font-heading font-bold mb-2">My Applications</h2>
          <p className="text-gray-400 mb-8">Track the status of jobs you have applied for.</p>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-10 bg-brand-darkgray/30 rounded-xl border border-gray-800">
              <p className="text-gray-400">You haven't applied to any jobs yet. Head to the dashboard to find your next role!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {applications.map((app) => (
                <div key={app._id} className="p-6 bg-brand-darkgray border border-gray-800 rounded-xl flex flex-col hover:border-brand-gold/30 transition-colors">
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{app.job?.title || 'Job No Longer Available'}</h3>
                      <p className="text-brand-gold text-sm font-medium mt-1">
                        {app.job?.employerProfile?.companyName || 'Unknown Company'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-800 space-y-2">
                    <p className="text-sm text-gray-400">
                      <span className="font-medium text-gray-300">Applied on:</span> {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                    {app.coverLetter && (
                      <p className="text-sm text-gray-400 line-clamp-2">
                        <span className="font-medium text-gray-300">Your Note:</span> "{app.coverLetter}"
                      </p>
                    )}
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

export default MyApplications;