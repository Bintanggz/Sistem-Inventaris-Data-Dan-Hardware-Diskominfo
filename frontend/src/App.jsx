import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import Categories from './pages/Categories';
import Locations from './pages/Locations';
import Borrowings from './pages/Borrowings';
import Mutations from './pages/Mutations';
import Maintenance from './pages/Maintenance';
import Reports from './pages/Reports';
import ActivityLog from './pages/ActivityLog';
import Users from './pages/Users';
import Profile from './pages/Profile';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/80">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent-500 flex items-center justify-center shadow-lg shadow-accent-500/20">
          <span className="text-white font-bold text-sm">SI</span>
        </div>
        <div className="animate-spin w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full"></div>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/80">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent-500 flex items-center justify-center shadow-lg shadow-accent-500/20">
          <span className="text-white font-bold text-sm">SI</span>
        </div>
        <div className="animate-spin w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full"></div>
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="items" element={<Items />} />
        <Route path="categories" element={<Categories />} />
        <Route path="locations" element={<Locations />} />
        <Route path="borrowings" element={<Borrowings />} />
        <Route path="mutations" element={<Mutations />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="reports" element={<ProtectedRoute roles={['admin','petugas']}><Reports /></ProtectedRoute>} />
        <Route path="activity-log" element={<ProtectedRoute roles={['admin']}><ActivityLog /></ProtectedRoute>} />
        <Route path="users" element={<ProtectedRoute roles={['admin']}><Users /></ProtectedRoute>} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '10px',
              padding: '12px 16px',
              fontSize: '13px',
              fontFamily: 'Inter, system-ui, sans-serif',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.04)',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
