import Sidebar from '../components/Sidebar';
import logo from '../assets/logo.png'; 

const SeekerDashboard = () => {
  // Retrieve the logged-in user's data from local storage
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="flex h-screen bg-brand-black overflow-hidden font-sans text-white">
      
      {/* Sidebar Component (Passing 'user' role) */}
      <Sidebar role="user" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-gold rounded-full mix-blend-multiply filter blur-[150px] opacity-10 pointer-events-none"></div>

        {/* Top Center Logo Area */}
        <div className="w-full py-6 flex justify-center items-center border-b border-gray-800 relative z-10">
          <div className="flex items-center gap-3">
            <img src={logo} alt="HireSphere Logo" className="h-10 object-contain bg-white/90 px-2 py-1 rounded-lg" />
            <h1 className="text-2xl font-heading font-bold tracking-tight">
              Hire<span className="text-brand-gold">Sphere</span>
            </h1>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8 relative z-10 max-w-7xl mx-auto w-full">
          <h2 className="text-3xl font-heading font-bold mb-2">Welcome back, {user?.name || 'Job Seeker'}!</h2>
          <p className="text-gray-400 mb-8">Here are the latest opportunities matching your profile.</p>

          {/* Placeholder for future Job Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-brand-darkgray border border-gray-800 rounded-xl hover:border-brand-gold/50 transition-colors">
              <h3 className="text-xl font-bold mb-1">Software Engineer</h3>
              <p className="text-brand-gold text-sm mb-4">TechCorp Inc. • Remote</p>
              <p className="text-gray-400 text-sm line-clamp-2">We are looking for a skilled developer to join our growing team...</p>
              <button className="mt-4 px-4 py-2 w-full bg-brand-gold/10 text-brand-gold rounded-lg font-medium hover:bg-brand-gold hover:text-black transition-colors">View Details</button>
            </div>
            {/* We will map over real database jobs here later! */}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SeekerDashboard;