import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import UrlShortener from './components/UrlShortener';
import RedirectHandler from './components/RedirectHandler';
import Home from './components/Home';
import { useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <div className="container mx-auto px-4 py-8">
                    <UrlShortener />
                    <Dashboard />
                  </div>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="/:shortCode" element={<RedirectHandler />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
