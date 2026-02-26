import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SeekerDashboard from './pages/SeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployerProfile from './pages/EmployerProfile';
import PostJob from './pages/PostJob';
import SeekerProfile from './pages/SeekerProfile';

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* New Dashboard Routes */}
        <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
        <Route path="/employer-dashboard" element={<EmployerDashboard />} />
        <Route path="/employer-profile" element={<EmployerProfile />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/seeker-profile" element={<SeekerProfile />} />
      </Routes>
    </div>
  );
}

export default App;