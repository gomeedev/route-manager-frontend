import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";


// Auth
import { SignInPage } from "./pages/authPages/SignInPage";
import { SignUpPage } from "./pages/authPages/SignUpPage";
import { ResetPasswordRequestPage } from "./pages/authPages/ResetPasswordRequestPage";
import { ResetPasswordPage } from "./pages/authPages/ResetPasswordPage";
import ProtectedRoute from "./hooks/ProtectedRoute";

// Globales
import NotFound from "./pages/otherPages/NotFound";

// Admin
import AdminLayout from "./layout/adminLayout/AdminLayout";
import { AdminPage } from "./pages/adminPages/AdminPage";
import { AdminProfile } from "./pages/profile/AdminProfile";


// Driver
import DriverLayout from "./layout/driverLayout/DriverLayout";
import { DriverPage } from "./pages/driverPages/DriverPage";
import { DriverProfile } from "./pages/profile/DriverProfile";




function App() {

  return (
    <BrowserRouter>
      <Routes>

        {/* Pagina de auth */}
        <Route path="/" element={<SignInPage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ResetPasswordRequestPage />} />
        <Route path="/reset-password-form" element={<ResetPasswordPage />} />

        {/* Paginas del admin */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminLayout />} >
            <Route index element={<AdminPage />} />
            <Route path="profile" element={< AdminProfile />} />
          </Route>
        </Route>

        {/* Paginas del driver */}
        <Route element={<ProtectedRoute role="driver" />}>
          <Route path="/driver" element={<DriverLayout />} >
            <Route index element={<DriverPage />} />
            <Route path="profile" element={<DriverProfile />} />
          </Route>
        </Route>

        {/* 404 */}
        < Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
};

export default App;