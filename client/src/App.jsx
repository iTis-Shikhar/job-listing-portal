import { Route, Routes } from 'react-router-dom';
import Applicants from './pages/Applicants';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployerProfile from './pages/EmployerProfile';
import Home from './pages/Home';
import Login from './pages/Login';
import MyApplications from './pages/MyApplications';
import PostJob from './pages/PostJob';
import SeekerDashboard from './pages/SeekerDashboard';
import SeekerProfile from './pages/SeekerProfile';
import Signup from './pages/Signup';

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
        <Route path="/applicants" element={<Applicants />} />
        <Route path="/my-applications" element={<MyApplications />} />
      </Routes>
    </div>
  );
}

export default App;