import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch applications for this employer's jobs
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/applications/employer/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(res.data.data || []);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Update application status
  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/applications/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update UI instantly
      setApplications(applications.map(app => 
        app._id === id ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      alert('Failed to update status');
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Shortlisted': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'; // Applied/Reviewed
    }
  };

  return (
    <div className="flex h-screen bg-brand-black overflow-hidden font-sans text-white relative">
      <Sidebar role="employer" />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative p-8">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold rounded-full mix-blend-multiply filter blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <h2 className="text-3xl font-heading font-bold mb-2">Review Applicants</h2>
          <p className="text-gray-400 mb-8">Manage candidates who have applied to your open positions.</p>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-10 bg-brand-darkgray/30 rounded-xl border border-gray-800">
              <p className="text-gray-400">No applications yet. Check back later!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((app) => (
                <div key={app._id} className="p-6 bg-brand-darkgray border border-gray-800 rounded-xl flex flex-col md:flex-row gap-6 hover:border-brand-gold/30 transition-colors">
                  
                  {/* Left Col: Candidate Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{app.jobSeekerProfile?.fullName || app.jobSeeker?.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    
                    <p className="text-brand-gold text-sm font-medium mb-4">
                      Applied for: <span className="text-white">{app.job?.title || 'Deleted Job'}</span>
                    </p>

                    <div className="text-sm text-gray-400 space-y-1 mb-4">
                      <p>📧 {app.jobSeekerProfile?.alternateEmail || app.jobSeeker?.email}</p>
                      <p>📱 {app.jobSeekerProfile?.phone || 'No phone provided'}</p>
                      {app.jobSeekerProfile?.currentJobTitle && <p>💼 {app.jobSeekerProfile.currentJobTitle} ({app.jobSeekerProfile.yearsOfExperience} yrs exp)</p>}
                    </div>

                    {app.coverLetter && (
                      <div className="bg-brand-black p-4 rounded-lg border border-gray-800">
                        <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Cover Letter</p>
                        <p className="text-sm text-gray-300 italic">"{app.coverLetter}"</p>
                      </div>
                    )}
                  </div>

                  {/* Right Col: Actions */}
                  <div className="md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-800 pt-6 md:pt-0 md:pl-6 gap-4">
                    
                    <a 
                      href={app.resume?.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-brand-black border border-brand-gold/30 text-brand-gold rounded-lg font-medium hover:bg-brand-gold hover:text-black transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      View Resume
                    </a>

                    <div className="space-y-2">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Update Status</p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => updateStatus(app._id, 'Shortlisted')}
                          disabled={app.status === 'Shortlisted'}
                          className="py-2 bg-blue-500/10 text-blue-400 text-sm font-medium rounded hover:bg-blue-500/20 disabled:opacity-50 transition-colors"
                        >
                          Shortlist
                        </button>
                        <button 
                          onClick={() => updateStatus(app._id, 'Accepted')}
                          disabled={app.status === 'Accepted'}
                          className="py-2 bg-green-500/10 text-green-400 text-sm font-medium rounded hover:bg-green-500/20 disabled:opacity-50 transition-colors"
                        >
                          Accept
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => updateStatus(app._id, 'Rejected')}
                        disabled={app.status === 'Rejected'}
                        className="w-full py-2 bg-red-500/10 text-red-400 text-sm font-medium rounded hover:bg-red-500/20 disabled:opacity-50 transition-colors mt-2"
                      >
                        Reject
                      </button>
                    </div>

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

export default Applicants;