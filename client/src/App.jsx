import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SeekerDashboard from './pages/SeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';

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
      </Routes>
    </div>
  );
}

export default App;