import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SeekerDashboard from './pages/SeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      {/* This makes page transitions smooth and interactive */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;