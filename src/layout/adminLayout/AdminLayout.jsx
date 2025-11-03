import { Outlet } from "react-router";

import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import { SidebarProvider, useSidebar } from "../../context/SidebarContext";

import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import Backdrop from "./Backdrop";


const LayoutContent = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    return (
        <div className="min-h-screen xl:flex">
            <div>
                <AdminSidebar />
                <Backdrop />
            </div>
            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
                    } ${isMobileOpen ? "ml-0" : ""}`}
            >
                <AdminHeader />
                <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
                    <Outlet />
                </div>
                <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
                    <ThemeTogglerTwo />
                </div>
            </div>
        </div>
    );
};

const AdminLayout = () => {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    );
};

export default AdminLayout;
