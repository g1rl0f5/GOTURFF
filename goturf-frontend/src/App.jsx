






import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import AddTurfPage from './pages/AddTurfPage';
import ManagerDashboard from './pages/ManagerDashboard';
import AddTurfSuccessPage from './pages/AddTurfSuccessPage';
import TurfManagementPage from './pages/TurfManagementPage';
import ManagerProfilePage from './pages/ManagerProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import TurfDetailsPage from './pages/TurfDetailsPage'; 
import BookingApprovalPage from './pages/BookingApprovalPage';
import SlotManagementPage from './pages/SlotManagementPage';
import ProtectedRoute from './components/ProtectedRoute';
import UserDashboardPage from './pages/UserDashboardPage';
import TurfsPage from './pages/TurfsPage';
import PaymentPage from './pages/PaymentPage'; 
import EditTurfPage from './pages/EditTurfPage';

function App() {
  return (
    
    <Routes>

      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/turfs/:id" element={<TurfDetailsPage />} />
      <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      <Route path="/manager/my-turfs" element={<TurfManagementPage />} />
      <Route path="/add-success" element={<AddTurfSuccessPage />} />
      <Route path="/manager/bookings" element={<BookingApprovalPage />} />
      <Route path="/manager/slots" element={<SlotManagementPage />} />
      <Route path="/payment/:bookingId" element={<PaymentPage />} />
      <Route path="/manager/edit-turf/:id" element={<EditTurfPage />} />
      <Route
  path="/user/dashboard"
  element={
    <ProtectedRoute allowedRole="user">
      <UserDashboardPage />
    </ProtectedRoute>
  }
/>     
      <Route path="/turfs" element={<TurfsPage />} />

      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRole="manager">
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
<Route
  path="/manager/turf-management"
  element={
    <ProtectedRoute allowedRole="manager">
      <TurfManagementPage />
    </ProtectedRoute>
  }
/>

      <Route
        path="/manager/profile"
        element={
          <ProtectedRoute allowedRole="manager">
            <ManagerProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-turf"
        element={
          <ProtectedRoute allowedRole="manager">
            <AddTurfPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/turf-added"
        element={
          <ProtectedRoute allowedRole="manager">
            <AddTurfSuccessPage />
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute allowedRole="admin">
      <AdminDashboardPage />
    </ProtectedRoute>
  }
/>


      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}



export default App;

