import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import RoleRoute from './components/RoleRoute';

// Public Pages
import Home from './pages/Home';
import Services from './pages/Services';
import KnowledgeBase from './pages/KnowledgeBase';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import FloatingSupportButton from './components/FloatingSupportButton';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// User Dashboard Pages
import UserDashboard from './pages/dashboard/user/UserDashboard';
import BookAppointment from './pages/dashboard/user/BookAppointment';
import UserAppointments from './pages/dashboard/user/Appointments';
import MyTickets from './pages/dashboard/user/MyTickets';
import UserNotifications from './pages/dashboard/user/Notifications';
import UserProfile from './pages/dashboard/user/Profile';

// Agent Dashboard Pages
import AgentDashboard from './pages/dashboard/agent/AgentDashboard';
import AgentAppointments from './pages/dashboard/agent/Appointments';
import AssignedTickets from './pages/dashboard/agent/AssignedTickets';
import AgentAvailability from './pages/dashboard/agent/Availability';

// Admin Dashboard Pages
import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import AdminUsers from './pages/dashboard/admin/Users';
import AdminAgents from './pages/dashboard/admin/Agents';
import AdminSettings from './pages/dashboard/admin/Settings';

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <FloatingSupportButton />
  </>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
            <Route path="/knowledge-base" element={<PublicLayout><KnowledgeBase /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />
            <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />

            {/* User Dashboard Routes */}
            <Route path="/dashboard/user" element={<RoleRoute allowedRoles={['user']}><DashboardLayout /></RoleRoute>}>
              <Route index element={<UserDashboard />} />
              <Route path="book" element={<BookAppointment />} />
              <Route path="appointments" element={<UserAppointments />} />
              <Route path="tickets" element={<MyTickets />} />
              <Route path="notifications" element={<UserNotifications />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* Agent Dashboard Routes */}
            <Route path="/dashboard/agent" element={<RoleRoute allowedRoles={['agent']}><DashboardLayout /></RoleRoute>}>
              <Route index element={<AgentDashboard />} />
              <Route path="appointments" element={<AgentAppointments />} />
              <Route path="tickets" element={<AssignedTickets />} />
              <Route path="availability" element={<AgentAvailability />} />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route path="/dashboard/admin" element={<RoleRoute allowedRoles={['admin']}><DashboardLayout /></RoleRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="agents" element={<AdminAgents />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Legacy Redirects */}
            <Route path="/slots" element={<Navigate to="/dashboard/user/book" replace />} />
            <Route path="/book/:id" element={<Navigate to="/dashboard/user/book" replace />} />
            <Route path="/my-bookings" element={<Navigate to="/dashboard/user/appointments" replace />} />
            
            {/* Fallback */}
            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

