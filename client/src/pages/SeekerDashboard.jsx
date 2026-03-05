import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import logo from '../assets/logo.png'; 

const SeekerDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Modal States
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/jobs');
        const activeJobs = res.data.data?.filter(job => job.status === 'Active') || [];
        setJobs(activeJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
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

      await axios.post('http://localhost:5000/api/applications', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Application submitted successfully!');
      setSelectedJob(null);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  // --- FILTERING LOGIC ---
  const filteredJobs = jobs.filter(job => {
    const matchSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        job.employerProfile?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLocation = job.location?.city?.toLowerCase().includes(locationTerm.toLowerCase()) ||
                          job.location?.state?.toLowerCase().includes(locationTerm.toLowerCase());
    const matchType = typeFilter ? job.jobType === typeFilter : true;
    
    return matchSearch && matchLocation && matchType;
  });

  return (
    <div className="flex h-screen bg-brand-black overflow-hidden font-sans text-white relative">
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
          <h2 className="text-3xl font-heading font-bold mb-2">Find your next role, {user?.name || 'Job Seeker'}</h2>
          
          {/* --- SEARCH BAR SECTION --- */}
          <div className="bg-brand-darkgray/80 border border-gray-800 p-4 rounded-xl mb-8 flex flex-col md:flex-row gap-4 shadow-lg backdrop-blur-md">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Search job title or company..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:outline-none focus:border-brand-gold text-white"
              />
            </div>
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="City or State..." 
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:outline-none focus:border-brand-gold text-white"
              />
            </div>
            <div className="md:w-48">
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:outline-none focus:border-brand-gold text-white"
              >
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
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-10 bg-brand-darkgray/30 rounded-xl border border-gray-800">
              <p className="text-gray-400">No jobs match your search criteria. Try clearing your filters!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
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
                    <button 
                      onClick={() => handleApplyClick(job)}
                      className="px-4 py-2 bg-brand-gold text-black rounded-lg font-bold hover:bg-yellow-500 transition-colors shadow-[0_0_10px_rgba(197,157,95,0.3)]"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal remains exactly the same as before */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-brand-darkgray border border-gray-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
              <h3 className="text-xl font-bold">Apply for {selectedJob.title}</h3>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={submitApplication} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cover Letter / Note to Employer</label>
                <textarea 
                  required rows="4" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Why are you a great fit for this role?"
                  className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:outline-none focus:border-brand-gold text-white"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Attach Resume (PDF) *</label>
                <input 
                  type="file" required accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-gold/10 file:text-brand-gold hover:file:bg-brand-gold hover:file:text-black cursor-pointer"
                />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setSelectedJob(null)} className="px-5 py-2 text-gray-400 hover:text-white transition-colors font-medium">Cancel</button>
                <button type="submit" disabled={applying} className="px-6 py-2 bg-brand-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors shadow-[0_0_10px_rgba(197,157,95,0.3)] disabled:opacity-50">
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