import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', jobType: 'Full-time', 
    city: '', state: '', country: '', isRemote: false,
    minSalary: '', maxSalary: '', currency: 'INR',
    requirements: '', responsibilities: '', 
    experienceLevel: 'Entry Level', openings: 1, applicationDeadline: ''
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const jobData = {
        title: formData.title,
        description: formData.description,
        jobType: formData.jobType,
        location: {
            city: formData.city,
            state: formData.state,
            country: formData.country,
            isRemote: formData.isRemote
        },
        salaryRange: {
            min: formData.minSalary ? Number(formData.minSalary) : null,
            max: formData.maxSalary ? Number(formData.maxSalary) : null,
            currency: formData.currency
        },
        requirements: {
            experience: formData.experienceLevel,
            skills: formData.requirements.split(',').map(req => req.trim()).filter(Boolean)
        },
        responsibilities: formData.responsibilities.split(',').map(res => res.trim()).filter(Boolean),
        openings: Number(formData.openings)
      };

      if (formData.applicationDeadline) {
          jobData.applicationDeadline = formData.applicationDeadline;
      }

      await axiosInstance.post('/jobs', jobData, config);
      alert('Job Posted Successfully!');
      navigate('/employer-dashboard');
      
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong while posting the job.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden font-sans text-brand-text relative">
      <Sidebar role="employer" />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative p-8">
        {/* Soft Modern Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary rounded-full filter blur-[150px] opacity-[0.03] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto w-full relative z-10">
          <div className="mb-8 border-b border-brand-border pb-4">
            <h2 className="text-3xl font-bold mb-2 text-brand-text">Post a New Job</h2>
            <p className="text-brand-muted">Fill out the details below to publish a new opportunity to the job board.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-brand-surface border border-brand-border p-8 rounded-2xl shadow-sm space-y-8">
            
            {/* Basic Details Section */}
            <div>
              <h3 className="text-lg font-semibold border-b border-brand-border pb-2 mb-4 text-brand-text">Basic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Job Title <span className="text-red-500">*</span></label>
                  <input type="text" name="title" required onChange={handleChange} placeholder="e.g. Senior Frontend Developer"
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Job Type <span className="text-red-500">*</span></label>
                  <select name="jobType" onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-1">Job Description <span className="text-red-500">*</span> <span className="text-brand-muted font-normal text-xs">(Min 50 chars)</span></label>
                <textarea name="description" required rows="4" minLength="50" onChange={handleChange} placeholder="Describe the role, the team, and what the candidate will be doing..."
                  className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"></textarea>
              </div>
            </div>

            {/* Requirements Section */}
            <div>
              <h3 className="text-lg font-semibold border-b border-brand-border pb-2 mb-4 text-brand-text">Requirements & Responsibilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Required Skills <span className="text-red-500">*</span> <span className="text-brand-muted font-normal text-xs">(Comma separated)</span></label>
                  <textarea name="requirements" required rows="3" onChange={handleChange} placeholder="React, Node.js, MongoDB..." 
                    className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Responsibilities <span className="text-red-500">*</span> <span className="text-brand-muted font-normal text-xs">(Comma separated)</span></label>
                  <textarea name="responsibilities" required rows="3" onChange={handleChange} placeholder="Build UI, Write APIs, Mentor juniors..." 
                    className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"></textarea>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div>
              <h3 className="text-lg font-semibold border-b border-brand-border pb-2 mb-4 text-brand-text">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">City <span className="text-red-500">*</span></label>
                  <input type="text" name="city" required onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">State/Prov <span className="text-red-500">*</span></label>
                  <input type="text" name="state" required onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Country <span className="text-red-500">*</span></label>
                  <input type="text" name="country" required onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
                </div>
                <div className="flex items-center mt-8 pl-2">
                  <input type="checkbox" name="isRemote" id="isRemote" onChange={handleChange} 
                    className="w-5 h-5 accent-brand-primary rounded border-brand-border cursor-pointer"/>
                  <label htmlFor="isRemote" className="ml-2 text-sm font-semibold text-brand-text cursor-pointer">Fully Remote</label>
                </div>
              </div>
            </div>

            {/* Compensation & Details Section */}
            <div>
              <h3 className="text-lg font-semibold border-b border-brand-border pb-2 mb-4 text-brand-text">Compensation & Hiring Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Min Salary</label>
                  <input type="number" name="minSalary" onChange={handleChange} placeholder="e.g. 50000"
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Max Salary</label>
                  <input type="number" name="maxSalary" onChange={handleChange} placeholder="e.g. 80000"
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Currency</label>
                  <select name="currency" onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Experience Level</label>
                  <select name="experienceLevel" onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text">
                    <option value="Entry Level">Entry Level</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Number of Openings <span className="text-red-500">*</span></label>
                  <input type="number" name="openings" min="1" required defaultValue="1" onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Deadline <span className="text-brand-muted font-normal">(Optional)</span></label>
                  <input type="date" name="applicationDeadline" onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-border flex justify-end">
              <button type="submit" disabled={loading} className="px-8 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primaryHover transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2">
                {loading && <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                {loading ? 'Posting Job...' : 'Post Job'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;