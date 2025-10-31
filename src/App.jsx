import React from "react"

// Auth
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignInPage } from "./pages/AuthPages/SigninPage";
import { SignUpPage } from "./pages/AuthPages/SignupPage";
import { ResetPasswordPage } from "./pages/AuthPages/ResetPasswordPage";

// Globales

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
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />


        {/* Paginas del admin */}
        <Route path="/admin" element={<AdminPage />} />

        {/* Paginas del driver */}
        <Route path="/driver" element={<DriverPage />} />

      </Routes>
    </BrowserRouter>
  )
};

export default App;