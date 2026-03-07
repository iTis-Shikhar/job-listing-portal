import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Home = () => {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans overflow-x-hidden">
      
      {/* --- HERO SECTION (Clean & Modern) --- */}
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6">
        
        {/* Subtle Modern Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-primary rounded-full filter blur-[128px] opacity-10 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-300 rounded-full filter blur-[128px] opacity-10"></div>

        {/* Floating Navbar */}
        <header className="absolute top-0 w-full max-w-7xl mx-auto p-6 flex justify-between items-center z-20">
          <div className="flex items-center gap-3">
            <img 
              src={logo} 
              alt="Profilia Logo" 
              className="h-20 object-contain" 
            /> 
            <span className="text-2xl font-bold tracking-tight text-brand-text">
            </span>
          </div>
          
          <div className="space-x-4 md:space-x-6 flex items-center">
            <Link to="/login" className="text-brand-muted hover:text-brand-primary font-medium transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="px-5 py-2 md:px-6 md:py-2.5 bg-brand-primary text-white rounded-full font-medium transition-all duration-300 hover:bg-brand-primaryHover hover:shadow-md active:scale-95">
              Sign Up
            </Link>
          </div>
        </header>

        {/* Main Hero Content */}
        <main className="text-center z-10 max-w-4xl mx-auto mt-20">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-brand-primary text-sm font-semibold tracking-wide">
            Welcome to the Future of Hiring
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-brand-text tracking-tight">
            Find Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-blue-400">
              Career Move.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-brand-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            Profilia is the ultimate platform connecting ambitious talent with industry-leading employers. Discover roles that match your passion, or find the perfect candidate to grow your team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/signup" className="px-8 py-4 w-full sm:w-auto bg-brand-primary text-white rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:bg-brand-primaryHover hover:-translate-y-1">
              Explore Opportunities
            </Link>
            <Link to="/login" className="px-8 py-4 w-full sm:w-auto bg-white border border-brand-border text-brand-text rounded-full font-semibold text-lg transition-all duration-300 hover:border-brand-primary hover:text-brand-primary hover:shadow-sm">
              Post a Job
            </Link>
          </div>
        </main>
      </div>

      {/* --- INFO / FEATURES SECTION --- */}
      <section className="relative z-10 bg-brand-surface py-20 px-6 border-t border-brand-border">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-brand-text">
            Why Choose <span className="text-brand-primary">Profilia?</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-brand-bg border border-brand-border rounded-2xl hover:border-brand-primary/40 hover:shadow-md transition-all hover:-translate-y-2 duration-300">
              <div className="w-14 h-14 bg-white shadow-sm border border-brand-border rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-brand-text">Fast-Track Hiring</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Our smart matching algorithm puts your profile directly in front of recruiters looking for your exact skills and experience.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-brand-bg border border-brand-border rounded-2xl hover:border-brand-primary/40 hover:shadow-md transition-all hover:-translate-y-2 duration-300">
              <div className="w-14 h-14 bg-white shadow-sm border border-brand-border rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-brand-text">Premium Companies</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Access exclusive job postings from top-tier startups and established Fortune 500 enterprises around the globe.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-brand-bg border border-brand-border rounded-2xl hover:border-brand-primary/40 hover:shadow-md transition-all hover:-translate-y-2 duration-300">
              <div className="w-14 h-14 bg-white shadow-sm border border-brand-border rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-brand-text">Secure & Private</h3>
              <p className="text-brand-muted text-sm leading-relaxed">
                Your data is fully protected. You control exactly who sees your resume and contact information at all times.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;