import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  User,
  FileText,
  Settings,
  Users,
  BarChart3,
  BookOpen,
  GraduationCap,
  UserCheck,
} from "lucide-react";
import { statisticsService, Statistics } from "@/services/statistics";
import HeaderProfileMenu from "@/components/HeaderProfileMenu";

interface AdminDashboardProps {
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const AdminDashboard = ({ user, onNavigate, onLogout }: AdminDashboardProps) => {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const result = await statisticsService.getStatistics();
        if (result.success && result.statistics) {
          setStatistics(result.statistics);
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const quickLinks = [
    {
      icon: Users,
      title: "User Management",
      description: "Manage all system users",
      page: "users",
    },
    {
      icon: BookOpen,
      title: "Course Management",
      description: "Create and manage courses",
      page: "courses",
    },
    {
      icon: FileText,
      title: "Content Management",
      description: "Manage modules, lessons, and materials",
      page: "content",
    },
    {
      icon: BarChart3,
      title: "System Analytics",
      description: "View system performance metrics",
      page: "analytics",
    },
    {
      icon: FileText,
      title: "Reports",
      description: "Generate system reports",
      page: "reports",
    },
    {
      icon: User,
      title: "My Profile",
      description: "View and edit your information",
      page: "profile",
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Manage system settings",
      page: "settings",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-secondary/30 sticky top-0 z-50">
        <div className="px-8 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Admin Portal</p>
            </div>

            <HeaderProfileMenu
              user={user}
              roleLabel="Admin"
              onNavigate={onNavigate}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome, {user.firstName}! 🛡️
          </h2>
          <p className="text-muted-foreground">
            Administer users, courses, and system settings
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          <div className="p-6 rounded-lg border border-border bg-blue-50 dark:bg-blue-950/30">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-muted-foreground font-medium">Total Students</p>
            </div>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {loading ? "..." : statistics?.total_students.toLocaleString() || "0"}
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-green-50 dark:bg-green-950/30">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-5 h-5 text-green-600" />
              <p className="text-sm text-muted-foreground font-medium">Total Teachers</p>
            </div>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {loading ? "..." : statistics?.total_teachers.toLocaleString() || "0"}
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-purple-50 dark:bg-purple-950/30">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <p className="text-sm text-muted-foreground font-medium">Total Courses</p>
            </div>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {loading ? "..." : statistics?.total_courses.toLocaleString() || "0"}
            </p>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-foreground mb-4">Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <motion.button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                whileHover={{ scale: 1.02, y: -5 }}
                className="p-4 rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-left transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <link.icon className="w-6 h-6 text-red-600" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h4 className="font-semibold text-foreground">{link.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
