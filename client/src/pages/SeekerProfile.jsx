import { useState, useEffect } from 'react';
import axios from 'axios';
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
        const res = await axios.get('http://localhost:5000/api/profile/jobseeker/me', {
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
        await axios.put('http://localhost:5000/api/profile/jobseeker', submitData, config);
        alert('Profile Updated Successfully!');
      } else {
        await axios.post('http://localhost:5000/api/profile/jobseeker', submitData, config);
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
    <div className="flex h-screen bg-brand-black overflow-hidden font-sans text-white">
      <Sidebar role="user" />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative p-8">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-gold rounded-full mix-blend-multiply filter blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto w-full relative z-10">
          <h2 className="text-3xl font-heading font-bold mb-2">My Profile</h2>
          <p className="text-gray-400 mb-8">Complete your profile and upload your resume to start applying.</p>

          <form onSubmit={handleSubmit} className="bg-brand-darkgray/60 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl shadow-2xl space-y-6">
            
            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number *</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
              </div>
            </div>

            {/* Professional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Current Job Title</label>
                <input type="text" name="currentJobTitle" value={formData.currentJobTitle} onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Years of Experience</label>
                <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Skills (Comma separated)</label>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python..." className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" placeholder="Tell employers about yourself..." className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"></textarea>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">LinkedIn URL</label>
                <input type="url" name="linkedIn" value={formData.linkedIn} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Portfolio URL</label>
                <input type="url" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-3 bg-brand-black border border-gray-700 rounded-lg focus:border-brand-gold focus:outline-none"/>
              </div>
            </div>

            {/* Resume Upload Box */}
            <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-brand-gold transition-colors">
              <label className="block text-sm font-medium text-gray-300 mb-2">Upload Resume (PDF, Max 5MB)</label>
              <input 
                type="file" 
                name="resume" 
                accept=".pdf,.doc,.docx" 
                onChange={handleFileChange} 
                className="text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-gold file:text-black hover:file:bg-yellow-500 cursor-pointer"
              />
              {existingResumeUrl && !resumeFile && (
                <p className="mt-3 text-sm text-green-400">✅ Resume already uploaded. <a href={existingResumeUrl} target="_blank" rel="noreferrer" className="underline hover:text-green-300">View Current Resume</a></p>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" disabled={loading} className="px-8 py-3 bg-brand-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors shadow-[0_0_15px_rgba(197,157,95,0.3)] disabled:opacity-50">
                {loading ? 'Uploading & Saving...' : (isExistingProfile ? 'Update Profile' : 'Save Profile')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfile;