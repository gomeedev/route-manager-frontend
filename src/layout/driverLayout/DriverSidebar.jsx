import { NavLink } from "react-router";
import { Bell } from "lucide-react";
import { Ellipsis as HorizontaLDots } from "lucide-react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Home,
  Inventory2,
  LocalShipping,
  Groups2 as Groups2Icon,
  History,
} from "@mui/icons-material";


import { useSidebar } from "../../context/SidebarContext";



const navItems = [
  {
    icon: <Home className="menu-item-icon-size fill-current" />,
    name: "Dashboard",
    path: "/driver",
  },
  {
    icon: <Inventory2 className="menu-item-icon-size fill-current" />,
    name: "Rutas",
    path: "/driver/rutas",
  },
  {
    icon: <LocalShipping className="menu-item-icon-size" />,
    name: "Crear Novedades",
    path: "/driver/novedades",
  },
  {
    icon: <LocationOnIcon className="menu-item-icon-size" />,
    name: "Historial de rutas",
    path: "/driver/routes-history",
  },
  {
    icon: <LocationOnIcon className="menu-item-icon-size" />,
    name: "Historial de novedades",
    path: "/driver/novedades-history",
  },

];

const DriverSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const IconStudyImpetus = "https://kimrxdkvtxfnxzvgtxxj.supabase.co/storage/v1/object/public/interfaz/logo.png";
  const IconResponsive = "https://kimrxdkvtxfnxzvgtxxj.supabase.co/storage/v1/object/public/interfaz/logo_responsive.png";

  const renderMenuItems = (items) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => (
        <li key={nav.name}>
          <NavLink
            to={nav.path}
            end={nav.path === "/driver"}
            className={({ isActive }) =>
              `menu-item group flex items-center gap-2 p-2 rounded-lg ${isActive
                ? "bg-gray-100 dark:bg-gray-800 dark:text-gray-300 font-bold"
                : "text-gray-700 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-300"
              } ${!isExpanded && !isHovered
                ? "lg:justify-center"
                : "lg:justify-start"
              }`
            }
          >
            <span className="menu-item-icon-size text-sm">{nav.icon}</span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="menu-item-text max-w-[200px] truncate text-sm">
                {nav.name}
              </span>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed flex flex-col top-0 left-0 bottom-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 transition-all duration-300 z-50 border-r border-gray-200
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-center items-center bg-white dark:bg-gray-900 mt-14 lg:mt-5">
        <img
          src={isExpanded || isHovered || isMobileOpen ? IconStudyImpetus : IconResponsive}
          alt="Logo"
          className={`mt-5 mb-4 transition-all ${isExpanded || isHovered || isMobileOpen ? "h-16" : "h-10"}`}
        />
      </div>


      <div className="px-5 pt-5 flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <h2
              className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                ? "lg:justify-center"
                : "justify-start"
                }`}
            >
              {isExpanded || isHovered || isMobileOpen ? (
                "Menu"
              ) : (
                <HorizontaLDots className="size-6" />
              )}
            </h2>
            {renderMenuItems(navItems)}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default DriverSidebar;
