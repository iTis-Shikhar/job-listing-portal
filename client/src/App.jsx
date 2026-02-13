import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* This is the Routing System */}
      <Routes>
        
        {/* HOME PAGE: Now with Buttons! */}
        <Route path="/" element={
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-8 text-blue-900">Welcome to Job Portal!</h1>
            <p className="mb-8 text-gray-600">Please choose an option to continue:</p>
            
            <div className="space-x-4">
              <Link to="/login">
                <button className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition">
                  Login
                </button>
              </Link>
              
              <Link to="/signup">
                <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        } />

        {/* The other pages are hidden here */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
      </Routes>
    </div>
  );
}

export default App;