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
import { PackagesManagementPage } from "./pages/adminPages/PackagesManagementPage";
import { RoutesManagementPage } from "./pages/adminPages/RoutesManagementPage";
import { VehiclesManagementPage } from "./pages/adminPages/VehiclesManagementPage";
import { DriversManagementPage } from "./pages/adminPages/DriversManagementPage";
import { DeliveryHistory } from "./pages/adminPages/DeliveryHistory";
import { NovedadesAdminPage } from "./pages/adminPages/NovedadesAdminPage";

// Driver
import DriverLayout from "./layout/driverLayout/DriverLayout";
import { DriverPage } from "./pages/driverPages/DriverPage";
import { DriverProfile } from "./pages/profile/DriverProfile";
import { RutasPage } from "./pages/driverPages/RutasPage";
import { NovedadesPage } from "./pages/driverPages/NovedadesPage";
import { HistorialRutasPage } from "./pages/driverPages/HistorialRutasPage";
import { NovedadesHistoryPage } from "./pages/driverPages/NovedadesHistoryPage";



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
            <Route path="packages-management" element={< PackagesManagementPage />} />
            <Route path="routes-management" element={< RoutesManagementPage />} />
            <Route path="vehicles-management" element={< VehiclesManagementPage />} />
            <Route path="drivers-management" element={< DriversManagementPage />} />
            <Route path="delivery-history" element={< DeliveryHistory />} />
            <Route path="novedades" element={< NovedadesAdminPage />} />
            
          </Route>
        </Route>

        {/* Paginas del driver */}
        <Route element={<ProtectedRoute role="driver" />}>
          <Route path="/driver" element={<DriverLayout />} >
            <Route index element={<DriverPage />} />
            <Route path="profile" element={<DriverProfile />} />
            <Route path="rutas" element={<RutasPage />} />
            <Route path="novedades" element={<NovedadesPage />} />
            <Route path="routes-history" element={<HistorialRutasPage />} />
            <Route path="novedades-history" element={<NovedadesHistoryPage />} />
          </Route>
        </Route>

        {/* 404 */}
        < Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
};

export default App;