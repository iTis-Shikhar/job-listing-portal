import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Sidebar from '../components/Sidebar';

const SeekerProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '', phone: '', gender: 'Prefer not to say', dateOfBirth: '',
    city: '', state: '', country: '', 
    currentJobTitle: '', yearsOfExperience: 0, skills: '', bio: '',
    linkedIn: '', portfolio: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [isExistingProfile, setIsExistingProfile] = useState(false);
  const [existingResumeUrl, setExistingResumeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch existing profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get('/profile/jobseeker/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success && res.data.data) {
          const profile = res.data.data;
          setFormData({
            fullName: profile.fullName || '',
            phone: profile.phone || '',
            gender: profile.gender || 'Prefer not to say',
            dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
            city: profile.location?.city || '',
            state: profile.location?.state || '',
            country: profile.location?.country || '',
            currentJobTitle: profile.currentJobTitle || '',
            yearsOfExperience: profile.yearsOfExperience || 0,
            skills: profile.skills ? profile.skills.join(', ') : '',
            bio: profile.bio || '',
            linkedIn: profile.linkedIn || '',
            portfolio: profile.portfolio || ''
          });
          if (profile.resume && profile.resume.url) {
            setExistingResumeUrl(profile.resume.url);
          }
          setIsExistingProfile(true);
        }
      } catch (err) {
        if (err.response?.status !== 404) console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      // We use FormData instead of JSON because we are sending a File
      const submitData = new FormData();
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Append the file if they uploaded one
      if (resumeFile) {
        submitData.append('resume', resumeFile);
      }

      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        } 
      };
      
      if (isExistingProfile) {
        await axiosInstance.put('/profile/jobseeker', submitData, config);
        alert('Profile Updated Successfully!');
      } else {
        await axiosInstance.post('/profile/jobseeker', submitData, config);
        alert('Profile Created Successfully!');
        setIsExistingProfile(true);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong saving your profile.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden font-sans text-brand-text relative">
      <Sidebar role="user" />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative p-8">
        {/* Soft Modern Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary rounded-full filter blur-[150px] opacity-[0.03] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto w-full relative z-10">
          <div className="mb-8 border-b border-brand-border pb-4">
            <h2 className="text-3xl font-bold mb-2 text-brand-text">My Profile</h2>
            <p className="text-brand-muted">Complete your profile and upload your resume to start applying to roles.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-brand-surface border border-brand-border p-8 rounded-2xl shadow-sm space-y-8">
            
            {/* Personal Details Section */}
            <div>
              <h3 className="text-lg font-semibold border-b border-brand-border pb-2 mb-4 text-brand-text">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} required 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div>
              <h3 className="text-lg font-semibold border-b border-brand-border pb-2 mb-4 text-brand-text">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Country</label>
                  <input type="text" name="country" value={formData.country} onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
                </div>
              </div>
            </div>

            {/* Professional Details Section */}
            <div>
              <h3 className="text-lg font-semibold border-b border-brand-border pb-2 mb-4 text-brand-text">Professional Background</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Current Job Title</label>
                  <input type="text" name="currentJobTitle" value={formData.currentJobTitle} onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Years of Experience</label>
                  <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-brand-text mb-1">Skills (Comma separated)</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python..." 
                  className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-brand-text mb-1">Professional Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" placeholder="Tell employers about yourself..." 
                  className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">LinkedIn URL</label>
                  <input type="url" name="linkedIn" value={formData.linkedIn} onChange={handleChange} placeholder="https://linkedin.com/in/..." 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Portfolio URL</label>
                  <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="https://..." 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"/>
                </div>
              </div>
            </div>

            {/* Resume Upload Box - Modern Dropzone Style */}
            <div>
              <h3 className="text-lg font-semibold border-b border-brand-border pb-2 mb-4 text-brand-text">Resume</h3>
              <div className="border-2 border-dashed border-brand-primary/30 rounded-xl p-8 text-center bg-blue-50/50 hover:bg-blue-50 transition-colors">
                <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-blue-100">
                  <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <label className="block text-sm font-semibold text-brand-text mb-2 cursor-pointer hover:text-brand-primary transition-colors">
                  Upload new Resume (PDF, Max 5MB)
                  <input 
                    type="file" 
                    name="resume" 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleFileChange} 
                    className="hidden" // Hide default ugly input, rely on label click
                  />
                </label>
                <p className="text-xs text-brand-muted mb-4">or drag and drop your file here</p>
                
                {/* File Selected Indicator */}
                {resumeFile && (
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-brand-border rounded-md text-sm text-brand-text shadow-sm">
                    <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    {resumeFile.name}
                  </div>
                )}

                {/* Existing File Indicator */}
                {existingResumeUrl && !resumeFile && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg inline-flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-sm font-medium text-green-800">Resume saved.</span>
                    <a href={existingResumeUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-green-700 hover:text-green-800 underline ml-2">View Current</a>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-brand-border flex justify-end">
              <button type="submit" disabled={loading} className="px-8 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primaryHover transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2">
                {loading && <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                {loading ? 'Saving...' : (isExistingProfile ? 'Update Profile' : 'Save Profile')}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfile;