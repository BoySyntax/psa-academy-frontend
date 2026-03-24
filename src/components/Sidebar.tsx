import { motion } from "framer-motion";
import {
  Home,
  Users,
  BookOpen,
  FileText,
  BarChart3,
  Bell,
  Settings,
  Menu,
} from "lucide-react";
import { UserType } from "@/constants/userTypes";

interface SidebarProps {
  userType: UserType;
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

const Sidebar = ({
  userType,
  activePage,
  onNavigate,
  onLogout,
  collapsed,
  onToggleCollapsed,
}: SidebarProps) => {
  const getMenuItems = () => {
    switch (userType) {
      case "admin":
        return [
          { icon: Home, label: "Dashboard", page: "home" },
          { icon: Users, label: "User Management", page: "users" },
          { icon: BookOpen, label: "Course Management", page: "courses" },
          { icon: FileText, label: "Content", page: "content" },
          { icon: BarChart3, label: "Analytics", page: "analytics" },
          { icon: Bell, label: "Notifications", page: "notifications" },
        ];
      case "teacher":
        return [
          { icon: Home, label: "Dashboard", page: "home" },
          { icon: BookOpen, label: "My Courses", page: "teacher-courses" },
          { icon: Users, label: "Students", page: "students" },
          { icon: FileText, label: "Materials", page: "materials" },
          { icon: BarChart3, label: "Analytics", page: "analytics" },
        ];
      case "student":
        return [
          { icon: Home, label: "Dashboard", page: "home" },
          { icon: BookOpen, label: "My Courses", page: "my-courses" },
        ];
      case "management":
        return [
          { icon: Home, label: "Dashboard", page: "home" },
          { icon: BarChart3, label: "Reports", page: "reports" },
          { icon: Users, label: "Users", page: "users" },
          { icon: BookOpen, label: "Courses", page: "courses" },
        ];
      default:
        return [
          { icon: Home, label: "Dashboard", page: "home" },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div
      style={{ willChange: "width" }}
      className={`h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col fixed left-0 top-0 transition-[width] duration-200 ease-in-out overflow-hidden ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <motion.button
            type="button"
            onClick={onToggleCollapsed}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
          <h1
            className={`text-xl font-bold text-sidebar-foreground whitespace-nowrap transition-all duration-200 ease-in-out overflow-hidden ${
              collapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"
            }`}
          >
            PSA Academy
          </h1>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activePage === item.page;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title={collapsed ? item.label : undefined}
              className={`
                w-full flex items-center ${collapsed ? "justify-center" : "gap-3"} px-4 py-3 rounded-lg text-left transition-all
                ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span
                aria-hidden={collapsed}
                className={`font-medium whitespace-nowrap transition-all duration-200 ease-in-out overflow-hidden ${
                  collapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"
                }`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      {userType !== "student" && (
        <div className="p-4 border-t border-sidebar-border space-y-1">
          <motion.button
            onClick={() => onNavigate("settings")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            title={collapsed ? "Settings" : undefined}
            className={`
              w-full flex items-center ${collapsed ? "justify-center" : "gap-3"} px-4 py-3 rounded-lg text-left transition-all
              ${
                activePage === "settings"
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }
            `}
          >
            <Settings className="w-5 h-5" />
            <span
              aria-hidden={collapsed}
              className={`font-medium whitespace-nowrap transition-all duration-200 ease-in-out overflow-hidden ${
                collapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"
              }`}
            >
              Settings
            </span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
