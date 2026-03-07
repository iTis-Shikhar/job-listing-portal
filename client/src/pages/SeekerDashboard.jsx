import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Sidebar from '../components/Sidebar';
import logo1 from '../assets/logo1.png'; 

const SeekerDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const [jobsRes, appsRes] = await Promise.all([
          axiosInstance.get('/jobs'),
          axiosInstance.get('/applications/my-applications', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const appliedIds = new Set(appsRes.data.data?.map(app => app.job?._id || app.job) || []);
        setAppliedJobs(appliedIds);

        const now = new Date();
        const validJobs = jobsRes.data.data?.filter(job => {
          const isActive = job.status === 'Active';
          const notExpired = !job.applicationDeadline || new Date(job.applicationDeadline) >= now;
          return isActive && notExpired;
        }) || [];

        setJobs(validJobs);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setCoverLetter('');
    setResumeFile(null);
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!resumeFile) return alert("Please upload your resume to apply.");

    setApplying(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('jobId', selectedJob._id);
      formData.append('coverLetter', coverLetter);
      formData.append('resume', resumeFile);

      await axiosInstance.post('/applications', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Application submitted successfully!');
      
      setAppliedJobs(prev => new Set(prev).add(selectedJob._id));
      setSelectedJob(null);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        job.employerProfile?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation = job.location?.city?.toLowerCase().includes(locationTerm.toLowerCase()) ||
                          job.location?.state?.toLowerCase().includes(locationTerm.toLowerCase());
    const matchType = typeFilter ? job.jobType === typeFilter : true;
    
    return matchSearch && matchLocation && matchType;
  });

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden font-sans text-brand-text relative">
      <Sidebar role="user" />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        {/* Soft Modern Glow (Changed from gold to a subtle blue SaaS glow) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-primary rounded-full filter blur-[150px] opacity-[0.03] pointer-events-none"></div>

        <div className="w-full py-6 flex justify-center items-center border-b border-brand-border bg-brand-surface relative z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <img src={logo1} alt="Profilia Logo" className="h-9 object-contain" />
            <h1 className="text-3xl font-bold tracking-tight text-brand-text">
            </h1>
          </div>
        </div>

        <div className="p-8 relative z-10 max-w-7xl mx-auto w-full">
          <h2 className="text-3xl font-bold mb-2 text-brand-text">Find your next role, {user?.name || 'Job Seeker'}</h2>
          
          {/* SEARCH BAR SECTION - Modernized */}
          <div className="bg-brand-surface border border-brand-border p-4 rounded-xl mb-8 flex flex-col md:flex-row gap-4 shadow-sm">
            <div className="flex-1">
              <input type="text" placeholder="Search job title or company..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-brand-text placeholder-brand-muted transition-all" />
            </div>
            <div className="flex-1">
              <input type="text" placeholder="City or State..." value={locationTerm} onChange={(e) => setLocationTerm(e.target.value)} 
                className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-brand-text placeholder-brand-muted transition-all" />
            </div>
            <div className="md:w-48">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} 
                className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-brand-text transition-all">
                <option value="">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12 bg-brand-surface rounded-xl border border-brand-border shadow-sm">
              <div className="bg-brand-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-brand-text mb-1">No jobs found</h3>
              <p className="text-brand-muted">Try adjusting your search criteria to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => {
                const hasApplied = appliedJobs.has(job._id);
                
                return (
                  <div key={job._id} className="p-6 bg-brand-surface border border-brand-border rounded-xl hover:shadow-md hover:border-brand-primary/30 transition-all duration-200 flex flex-col h-full group">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-brand-text group-hover:text-brand-primary transition-colors">{job.title}</h3>
                        <span className="bg-blue-50 text-brand-primary text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ml-2 border border-blue-100">
                          {job.jobType}
                        </span>
                      </div>
                      
                      <p className="text-brand-primary text-sm mb-2 font-semibold">
                        {job.employerProfile?.companyName || 'Profilia Partner'} 
                        <span className="text-brand-muted font-normal mx-2">•</span> 
                        <span className="text-brand-muted font-medium">{job.location?.city || 'Remote'} {job.location?.isRemote && '(Remote)'}</span>
                      </p>

                      {job.applicationDeadline && (
                        <p className="text-xs text-red-500 mb-3 font-medium flex items-center gap-1.5 bg-red-50 w-fit px-2 py-1 rounded-md border border-red-100">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Apply by {new Date(job.applicationDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                        </p>
                      )}
                      
                      <p className="text-brand-muted text-sm line-clamp-3 mb-4 mt-3 leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-brand-border flex items-center justify-between">
                      <p className="text-sm font-semibold text-brand-text">
                        {job.salaryRange?.currency} {job.salaryRange?.min} - {job.salaryRange?.max}
                      </p>
                      
                      <button 
                        onClick={() => !hasApplied && handleApplyClick(job)}
                        disabled={hasApplied}
                        className={`px-5 py-2 rounded-lg font-medium transition-all ${
                          hasApplied 
                            ? 'bg-gray-100 text-brand-muted cursor-not-allowed border border-brand-border' 
                            : 'bg-brand-primary text-white hover:bg-brand-primaryHover shadow-sm hover:shadow active:scale-95'
                        }`}
                      >
                        {hasApplied ? 'Applied ✓' : 'Apply Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* APPLICATION MODAL - Modernized */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-brand-surface border border-brand-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all">
            <div className="p-6 border-b border-brand-border flex justify-between items-center bg-gray-50/80">
              <h3 className="text-xl font-bold text-brand-text">Apply for {selectedJob.title}</h3>
              <button onClick={() => setSelectedJob(null)} className="text-brand-muted hover:text-brand-text transition-colors bg-white p-1 rounded-md shadow-sm border border-brand-border">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={submitApplication} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">Cover Letter / Note to Employer</label>
                <textarea required rows="4" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Why are you a great fit for this role?" 
                  className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary text-brand-text placeholder-brand-muted transition-all"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-2">Attach Resume (PDF) *</label>
                <div className="border border-dashed border-brand-border p-4 rounded-lg bg-brand-bg text-center hover:bg-gray-50 transition-colors">
                  <input type="file" required accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} 
                    className="w-full text-brand-muted file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-brand-primary hover:file:bg-brand-primary hover:file:text-white cursor-pointer transition-colors" />
                </div>
              </div>
              <div className="pt-4 flex gap-3 justify-end border-t border-brand-border mt-2">
                <button type="button" onClick={() => setSelectedJob(null)} className="px-5 py-2.5 text-brand-muted hover:text-brand-text hover:bg-gray-100 rounded-lg transition-colors font-medium">Cancel</button>
                <button type="submit" disabled={applying} className="px-6 py-2.5 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primaryHover transition-all shadow-sm disabled:opacity-50 flex items-center gap-2">
                  {applying && <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                  {applying ? 'Sending...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerDashboard;