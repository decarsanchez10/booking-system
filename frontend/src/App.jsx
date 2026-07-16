import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';
import RoleRoute from './components/RoleRoute';

import Navbar from './components/Navbar';
import FloatingSupportButton from './components/FloatingSupportButton';
import DashboardLayout from './components/layout/DashboardLayout';

const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const KnowledgeBase = lazy(() => import('./pages/KnowledgeBase'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));
const UserDashboard = lazy(() => import('./pages/dashboard/user/UserDashboard'));
const BookAppointment = lazy(() => import('./pages/dashboard/user/BookAppointment'));
const UserAppointments = lazy(() => import('./pages/dashboard/user/Appointments'));
const MyTickets = lazy(() => import('./pages/dashboard/user/MyTickets'));
const UserNotifications = lazy(() => import('./pages/dashboard/user/Notifications'));
const UserProfile = lazy(() => import('./pages/dashboard/user/Profile'));
const AgentDashboard = lazy(() => import('./pages/dashboard/agent/AgentDashboard'));
const AgentAppointments = lazy(() => import('./pages/dashboard/agent/Appointments'));
const AssignedTickets = lazy(() => import('./pages/dashboard/agent/AssignedTickets'));
const AgentAvailability = lazy(() => import('./pages/dashboard/agent/Availability'));
const AdminDashboard = lazy(() => import('./pages/dashboard/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/dashboard/admin/Users'));
const AdminAgents = lazy(() => import('./pages/dashboard/admin/Agents'));
const AdminReports = lazy(() => import('./pages/dashboard/admin/Reports'));
const AdminSettings = lazy(() => import('./pages/dashboard/admin/Settings'));

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <FloatingSupportButton />
  </>
);

const RouteFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
    <div className="loading-bar"><div className="loading-bar-inner"></div></div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Suspense fallback={<RouteFallback />}>
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
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Legacy Redirects */}
            <Route path="/slots" element={<Navigate to="/dashboard/user/book" replace />} />
            <Route path="/book/:id" element={<Navigate to="/dashboard/user/book" replace />} />
            <Route path="/my-bookings" element={<Navigate to="/dashboard/user/appointments" replace />} />
            
              {/* Fallback */}
              <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
