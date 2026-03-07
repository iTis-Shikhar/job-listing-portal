import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import Sidebar from '../components/Sidebar';

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch applications for this employer's jobs
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get('/api/applications/employer/me', {
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

  const updateStatus = async (id, newStatus) => {
    // Save previous state for rollback
    const previousApplications = applications;

    setApplications(prev => prev.map(app =>
      app._id === id ? { ...app, status: newStatus } : app
    ));

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.patch(`/api/applications/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      setApplications(previousApplications);
      alert('Failed to update status. Changes reverted.');
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Accepted': return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'Shortlisted': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200'; // Applied/Reviewed
    }
  };

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden font-sans text-brand-text relative">
      <Sidebar role="employer" />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative p-8">
        {/* Soft Modern Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary rounded-full filter blur-[150px] opacity-[0.03] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <h2 className="text-3xl font-bold mb-2 text-brand-text">Review Applicants</h2>
          <p className="text-brand-muted mb-8">Manage candidates who have applied to your open positions.</p>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 bg-brand-surface rounded-xl border border-brand-border shadow-sm">
              <div className="bg-brand-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-brand-text mb-1">No applications yet</h3>
              <p className="text-brand-muted">Check back later when candidates start applying to your jobs.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((app) => (
                <div key={app._id} className="p-6 bg-brand-surface border border-brand-border rounded-xl flex flex-col md:flex-row gap-6 hover:shadow-md hover:border-brand-primary/30 transition-all duration-200">
                  
                  {/* Left Col: Candidate Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-brand-text">{app.jobSeekerProfile?.fullName || app.jobSeeker?.name}</h3>
                      <span className={`px-3 py-1 rounded-md text-xs font-semibold border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    
                    <p className="text-brand-muted text-sm font-medium mb-4">
                      Applied for: <span className="text-brand-primary font-semibold">{app.job?.title || 'Deleted Job'}</span>
                    </p>

                    <div className="text-sm text-brand-text space-y-1.5 mb-5 bg-brand-bg p-4 rounded-lg border border-brand-border inline-block min-w-[250px]">
                      <p className="flex items-center gap-2"><svg className="w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> {app.jobSeekerProfile?.alternateEmail || app.jobSeeker?.email}</p>
                      <p className="flex items-center gap-2"><svg className="w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> {app.jobSeekerProfile?.phone || 'No phone provided'}</p>
                      {app.jobSeekerProfile?.currentJobTitle && <p className="flex items-center gap-2"><svg className="w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> {app.jobSeekerProfile?.currentJobTitle}{app.jobSeekerProfile?.yearsOfExperience ? ` (${app.jobSeekerProfile.yearsOfExperience} yrs exp)` : ''}</p>}
                    </div>

                    {app.coverLetter && (
                      <div className="bg-brand-bg p-4 rounded-lg border border-brand-border relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary rounded-l-lg"></div>
                        <p className="text-xs text-brand-muted font-bold uppercase tracking-wider mb-1">Cover Letter</p>
                        <p className="text-sm text-brand-text italic leading-relaxed">"{app.coverLetter}"</p>
                      </div>
                    )}
                  </div>

                  {/* Right Col: Actions */}
                  <div className="md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-brand-border pt-6 md:pt-0 md:pl-6 gap-4">
                    
                    {app.resume?.url ? (
                      <a
                        href={app.resume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-brand-surface border-2 border-brand-primary text-brand-primary rounded-lg font-semibold hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center gap-2 group"
                      >
                        <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        View Resume
                      </a>
                    ) : (
                      <button
                        disabled
                        aria-disabled="true"
                        title="Resume not available"
                        className="w-full py-2.5 bg-brand-bg border-2 border-brand-border text-brand-muted rounded-lg font-semibold flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Resume not available
                      </button>
                    )}

                    <div className="space-y-3 bg-brand-bg p-4 rounded-lg border border-brand-border">
                      <p className="text-xs text-brand-muted font-bold uppercase tracking-wider text-center">Update Status</p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => updateStatus(app._id, 'Shortlisted')}
                          disabled={app.status === 'Shortlisted'}
                          className="py-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Shortlist
                        </button>
                        <button 
                          onClick={() => updateStatus(app._id, 'Accepted')}
                          disabled={app.status === 'Accepted'}
                          className="py-2 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-md hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Accept
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => updateStatus(app._id, 'Rejected')}
                        disabled={app.status === 'Rejected'}
                        className="w-full py-2 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-md hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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