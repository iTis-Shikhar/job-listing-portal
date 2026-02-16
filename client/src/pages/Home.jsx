import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // Make sure your logo is saved here!

const Home = () => {
  return (
    <div className="min-h-screen bg-brand-black text-white font-sans overflow-x-hidden">
      
      {/* --- HERO SECTION (Floating & Glowing) --- */}
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6">
        
        {/* Background Gradient Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-gold rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-gray-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

        {/* Floating Navbar */}
        <header className="absolute top-0 w-full max-w-7xl mx-auto p-6 flex justify-between items-center z-20">
          <div className="flex items-center gap-3">
            {/* Added a subtle white glow behind the logo so the black text doesn't disappear on the dark background */}
            <img 
              src={logo} 
              alt="HireSphere Logo" 
              className="h-12 object-contain bg-white/90 px-3 py-1 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
            /> 
          </div>
          
          <div className="space-x-4 md:space-x-6">
            <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="px-5 py-2 md:px-6 md:py-2.5 bg-brand-gold/10 text-brand-gold border border-brand-gold/50 rounded-full font-medium transition-all duration-300 hover:bg-brand-gold hover:text-brand-black hover:shadow-[0_0_20px_rgba(197,157,95,0.6)]">
              Sign Up
            </Link>
          </div>
        </header>

        {/* Main Hero Content */}
        <main className="text-center z-10 max-w-4xl mx-auto mt-20">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/5 text-brand-gold text-sm font-semibold tracking-wide">
            Welcome to the Future of Hiring
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
            Find Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-200">
              Career Move.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 font-sans max-w-2xl mx-auto leading-relaxed">
            HireSphere is the ultimate platform connecting ambitious talent with industry-leading employers. Discover roles that match your passion, or find the perfect candidate to grow your team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/signup" className="px-8 py-4 w-full sm:w-auto bg-brand-gold text-brand-black rounded-full font-bold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(197,157,95,0.8)] hover:-translate-y-1">
              Explore Opportunities
            </Link>
            <Link to="/login" className="px-8 py-4 w-full sm:w-auto bg-transparent border border-gray-600 text-white rounded-full font-bold text-lg transition-all duration-300 hover:border-brand-gold hover:text-brand-gold">
              Post a Job
            </Link>
          </div>
        </main>
      </div>

      {/* --- INFO / FEATURES SECTION --- */}
      <section className="relative z-10 bg-[#0f0f0f] py-20 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-16 text-white">
            Why Choose <span className="text-brand-gold">HireSphere?</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-brand-black border border-gray-800 rounded-2xl hover:border-brand-gold/50 transition-all hover:-translate-y-2 duration-300">
              <div className="w-14 h-14 bg-brand-gold/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-brand-gold text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Fast-Track Hiring</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our smart matching algorithm puts your profile directly in front of recruiters looking for your exact skills and experience.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-brand-black border border-gray-800 rounded-2xl hover:border-brand-gold/50 transition-all hover:-translate-y-2 duration-300">
              <div className="w-14 h-14 bg-brand-gold/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-brand-gold text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Companies</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Access exclusive job postings from top-tier startups and established Fortune 500 enterprises around the globe.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-brand-black border border-gray-800 rounded-2xl hover:border-brand-gold/50 transition-all hover:-translate-y-2 duration-300">
              <div className="w-14 h-14 bg-brand-gold/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-brand-gold text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your data is fully encrypted. You control exactly who sees your resume and contact information at all times.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;