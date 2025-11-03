import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";


// Auth
import { SignInPage } from "./pages/authPages/SignInPage";
import { SignUpPage } from "./pages/authPages/SignUpPage";
import { ResetPasswordRequestPage } from "./pages/authPages/ResetPasswordRequestPague";
import { ResetPasswordPage } from "./pages/authPages/ResetPasswordPage";
import ProtectedRoute from "./hooks/ProtectedRoute";

// Globales
import NotFound from "./pages/otherPages/NotFound";

// Admin
import { AdminPage } from "./pages/adminPages/AdminPage";

// Driver
import { DriverPage } from "./pages/driverPages/DriverPage";




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
        <Route path="/admin" element={<ProtectedRoute role="admin"> <AdminPage />
        </ProtectedRoute>}
        />

        {/* Paginas del driver */}
        <Route path="/driver" element={<ProtectedRoute role="driver">
          <DriverPage />
        </ProtectedRoute>}
        />

        {/* 404 */}
        < Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
};

export default App;