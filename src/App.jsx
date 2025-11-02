import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";


// Auth
import { SignInPage } from "./pages/authPages/SignInPage";
import { SignUpPage } from "./pages/authPages/SignUpPage";
import { ResetPasswordPage } from "./pages/authPages/ResetPasswordPage";

// Globales


// Admin
import { AdminPage } from "./pages/adminPages/AdminPage";

// Driver
import { DriverPage } from "./pages/driverPages/DriverPage";
import ProtectedRoute from "./hooks/ProtectedRoute";
import NotFound from "./pages/otherPages/NotFound";



function App() {

  return (
    <BrowserRouter>
      <Routes>

        {/* Pagina de auth */}
        <Route path="/" element={<SignInPage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Paginas del admin */}
        <Route path="/admin" element={<ProtectedRoute> <AdminPage />
        </ProtectedRoute>}
        />

        {/* Paginas del driver */}
        <Route path="/driver" element={<DriverPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
};

export default App;