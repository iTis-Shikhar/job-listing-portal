import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const EmployerProfile = () => {
  const [formData, setFormData] = useState({
    companyName: '', industry: '', companySize: '', foundedYear: '', 
    website: '', about: '', companyPhone: '', companyEmail: '',
    street: '', city: '', state: '', country: '', postalCode: ''
  });
  const [isExistingProfile, setIsExistingProfile] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load existing profile data when the page loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/profile/employer/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success && res.data.data) {
          const profile = res.data.data;
          setFormData({
            companyName: profile.companyName || '',
            industry: profile.industry || '',
            companySize: profile.companySize || '',
            foundedYear: profile.foundedYear || '',
            website: profile.website || '',
            about: profile.about || '',
            companyPhone: profile.companyPhone || '',
            companyEmail: profile.companyEmail || '',
            street: profile.address?.street || '',
            city: profile.address?.city || '',
            state: profile.address?.state || '',
            country: profile.address?.country || '',
            postalCode: profile.address?.postalCode || ''
          });
          setIsExistingProfile(true);
        }
      } catch (err) {
        // 404 just means they haven't created one yet, which is fine!
        if (err.response?.status !== 404) {
          console.error('Error fetching profile:', err);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (isExistingProfile) {
        // Update existing profile
        await axios.put('http://localhost:5000/api/profile/employer', formData, config);
        alert('Profile Updated Successfully!');
      } else {
        // Create new profile
        await axios.post('http://localhost:5000/api/profile/employer', formData, config);
        alert('Profile Created Successfully!');
        setIsExistingProfile(true);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Something went wrong');
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
            <h2 className="text-3xl font-bold mb-2 text-brand-text">Company Profile</h2>
            <p className="text-brand-muted">Establish your brand presence to attract top talent.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-brand-surface border border-brand-border p-8 rounded-2xl shadow-sm space-y-8">
            
            {/* Company Info Section */}
            <div>
              <h3 className="text-lg font-semibold border-b border-brand-border pb-2 mb-4 text-brand-text">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Company Name <span className="text-red-500">*</span></label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Industry <span className="text-red-500">*</span></label>
                  <input type="text" name="industry" value={formData.industry} onChange={handleChange} required placeholder="e.g. Information Technology" 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Company Size <span className="text-red-500">*</span></label>
                  <select name="companySize" value={formData.companySize} onChange={handleChange} required 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text">
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Founded Year</label>
                  <input type="number" name="foundedYear" value={formData.foundedYear} onChange={handleChange} placeholder="e.g. 2010"
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text" />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div>
              <h3 className="text-lg font-semibold border-b border-brand-border pb-2 mb-4 text-brand-text">About the Company</h3>
              <div>
                <label className="block text-sm font-semibold text-brand-text mb-1">Company Overview <span className="text-red-500">*</span></label>
                <textarea name="about" value={formData.about} onChange={handleChange} required rows="4" placeholder="Describe your company's mission, culture, and goals..."
                  className="w-full px-4 py-3 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text"></textarea>
              </div>
            </div>

            {/* Contact & Location Section */}
            <div>
              <h3 className="text-lg font-semibold border-b border-brand-border pb-2 mb-4 text-brand-text">Contact & Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Company Email <span className="text-red-500">*</span></label>
                  <input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} required placeholder="contact@company.com"
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Company Phone <span className="text-red-500">*</span></label>
                  <input type="text" name="companyPhone" value={formData.companyPhone} onChange={handleChange} required placeholder="+1 234 567 8900"
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Website URL</label>
                  <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://www.company.com" 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">City <span className="text-red-500">*</span></label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} required 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">State/Province <span className="text-red-500">*</span></label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} required 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-brand-text mb-1">Country <span className="text-red-500">*</span></label>
                  <input type="text" name="country" value={formData.country} onChange={handleChange} required 
                    className="w-full px-4 py-2.5 bg-brand-bg border border-brand-border rounded-lg focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary focus:outline-none transition-all text-brand-text" />
                </div>
              </div>
            </div>

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

export default EmployerProfile;