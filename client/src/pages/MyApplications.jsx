import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Sidebar from '../components/Sidebar';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get('/applications/my-applications', {
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

  // Updated for Modern SaaS: Light pastel backgrounds with crisp borders
  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'Shortlisted': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200'; // Pending/Applied
    }
  };

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden font-sans text-brand-text relative">
      <Sidebar role="user" />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative p-8">
        {/* Soft Modern Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-primary rounded-full filter blur-[150px] opacity-[0.03] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto w-full relative z-10">
          <h2 className="text-3xl font-bold mb-2 text-brand-text">My Applications</h2>
          <p className="text-brand-muted mb-8">Track the status of jobs you have applied for.</p>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 bg-brand-surface rounded-xl border border-brand-border shadow-sm">
              <div className="bg-brand-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-brand-text mb-1">No applications yet</h3>
              <p className="text-brand-muted">You haven't applied to any jobs yet. Head to the dashboard to find your next role!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {applications.map((app) => (
                <div key={app._id} className="p-6 bg-brand-surface border border-brand-border rounded-xl flex flex-col hover:shadow-md hover:border-brand-primary/30 transition-all duration-200">
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-brand-text">{app.job?.title || 'Job No Longer Available'}</h3>
                      <p className="text-brand-primary text-sm font-semibold mt-1">
                        {app.job?.employerProfile?.companyName || 'Unknown Company'}
                      </p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-md text-xs font-semibold border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-brand-border space-y-3">
                    <p className="text-sm text-brand-muted flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="font-semibold text-brand-text">Applied:</span> {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                    </p>
                    {app.coverLetter && (
                      <div className="bg-brand-bg p-3 rounded-md border border-brand-border mt-2">
                        <p className="text-xs text-brand-muted font-semibold uppercase tracking-wider mb-1">Your Note</p>
                        <p className="text-sm text-brand-text italic line-clamp-2">"{app.coverLetter}"</p>
                      </div>
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