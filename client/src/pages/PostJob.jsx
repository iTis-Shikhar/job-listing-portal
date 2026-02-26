import { useState } from 'react';
import axios from 'axios';
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
      
      // PERFECTLY ALIGNED WITH Job.js SCHEMA
      const jobData = {
        title: formData.title,
        description: formData.description,
        jobType: formData.jobType,
        location: {
            city: formData.city,
            state: formData.state,      // <-- Fixed: Now grabs the state
            country: formData.country,
            isRemote: formData.isRemote
        },
        salaryRange: {                  // <-- Fixed: Name must be salaryRange, not salary
            min: formData.minSalary ? Number(formData.minSalary) : null,
            max: formData.maxSalary ? Number(formData.maxSalary) : null,
            currency: formData.currency
        },
        requirements: {                 // <-- Fixed: Nested inside requirements object
            experience: formData.experienceLevel,
            skills: formData.requirements.split(',').map(req => req.trim()).filter(Boolean)
        },
        responsibilities: formData.responsibilities.split(',').map(res => res.trim()).filter(Boolean),
        openings: Number(formData.openings)
      };

      // Only add deadline if the user actually picked a date
      if (formData.applicationDeadline) {
          jobData.applicationDeadline = formData.applicationDeadline;
      }

      await axios.post('http://localhost:5000/api/jobs', jobData, config);
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
    <div className="flex h-screen bg-brand-black overflow-hidden font-sans text-white">
      <Sidebar role="employer" />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative p-8">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold rounded-full mix-blend-multiply filter blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto w-full relative z-10">
          <h2 className="text-3xl font-heading font-bold mb-2">Post a New Job</h2>
          <p className="text-gray-400 mb-8">Fill out the details below to publish a new opportunity.</p>

          <form onSubmit={handleSubmit} className="bg-brand-darkgray/60 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl shadow-2xl space-y-6">
            
            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Job Title *</label>
                <input type="text" name="title" required onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none" placeholder="e.g. Senior Frontend Developer"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Job Type *</label>
                <select name="jobType" onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Job Description * (Min 50 chars)</label>
              <textarea name="description" required rows="4" minLength="50" onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"></textarea>
            </div>

            {/* Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Required Skills (Comma separated) *</label>
                <textarea name="requirements" required rows="3" onChange={handleChange} placeholder="React, Node.js, MongoDB..." className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Responsibilities (Comma separated) *</label>
                <textarea name="responsibilities" required rows="3" onChange={handleChange} placeholder="Build UI, Write APIs..." className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"></textarea>
              </div>
            </div>

            {/* --- FIXED LOCATION GRID (Added State) --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">City *</label>
                <input type="text" name="city" required onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">State/Prov *</label>
                <input type="text" name="state" required onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Country *</label>
                <input type="text" name="country" required onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
              </div>
              <div className="flex items-center mt-6">
                <input type="checkbox" name="isRemote" onChange={handleChange} className="w-5 h-5 accent-brand-gold"/>
                <label className="ml-2 text-sm font-medium text-gray-300">Remote</label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Min Salary</label>
                <input type="number" name="minSalary" onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Max Salary</label>
                <input type="number" name="maxSalary" onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Currency</label>
                <select name="currency" onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            {/* --- FIXED EXPERIENCE DROPDOWN --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Experience Level</label>
                <select name="experienceLevel" onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none">
                  <option value="Entry Level">Entry Level</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-10 years">5-10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Number of Openings *</label>
                <input type="number" name="openings" min="1" required defaultValue="1" onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Deadline (Optional)</label>
                <input type="date" name="applicationDeadline" onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" disabled={loading} className="px-8 py-3 bg-brand-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors shadow-[0_0_15px_rgba(197,157,95,0.3)] disabled:opacity-50">
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;