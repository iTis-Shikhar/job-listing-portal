import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png'; 

const Home = () => {
  return (
    <div className="relative min-h-screen w-full text-white font-sans overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 w-full">
        
        {/* Floating Navbar */}
        <header className="absolute top-0 w-full max-w-7xl mx-auto p-6 flex justify-between items-center z-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            {/* --- UPDATED: Magnetic Logo --- */}
            <motion.img 
              src={logo} 
              alt="HireSphere Logo" 
              whileHover={{ scale: 1.1, rotate: 5 }} 
              whileTap={{ scale: 0.9 }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.5}
              className="h-12 object-contain bg-white/90 px-3 py-1 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-grab active:cursor-grabbing" 
            /> 
          </motion.div>
          
          <div className="space-x-4 md:space-x-6">
            <Link to="/login" className="text-white/70 hover:text-white font-medium transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="px-6 py-2.5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-medium transition-all duration-300 hover:bg-white hover:text-black">
              Sign Up
            </Link>
          </div>
        </header>

        {/* Main Hero Content */}
        <main className="text-center z-10 max-w-4xl mx-auto mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 text-sm font-semibold tracking-wide backdrop-blur-sm"
          >
            Welcome to the Future of Hiring
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Find Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Career Move.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            HireSphere is the ultimate platform connecting ambitious talent with industry-leading employers. Discover roles that match your passion.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link to="/signup" className="px-8 py-4 w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:-translate-y-1 text-center">
              Explore Opportunities
            </Link>
            <Link to="/login" className="px-8 py-4 w-full sm:w-auto bg-white/5 border border-white/20 text-white rounded-full font-bold text-lg backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/40 text-center">
              Post a Job
            </Link>
          </motion.div>
        </main>
      </div>

      {/* --- INFO / FEATURES SECTION --- */}
      <section className="relative z-10 py-20 px-6 w-full">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-white">
            Why Choose <span className="text-cyan-400">HireSphere?</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "⚡", title: "Fast-Track Hiring", desc: "Our smart matching algorithm puts your profile directly in front of recruiters." },
              { icon: "🏢", title: "Premium Companies", desc: "Access exclusive job postings from top-tier startups and Fortune 500 enterprises." },
              { icon: "🔒", title: "Secure & Private", desc: "Your data is fully encrypted. You control exactly who sees your information." }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -10 }}
                className="glass-effect p-8 rounded-3xl border border-white/10 transition-all"
              >
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;