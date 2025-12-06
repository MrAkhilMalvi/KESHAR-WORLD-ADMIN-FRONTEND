import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import {
  Loader2,
  Users,
  BookOpen,
  Layers,
  Video,
  Trophy,
  TrendingUp,
  DollarSign,
  PieChart,
  ShoppingBag,
} from "lucide-react";
import { dashboardStats } from "@/features/DASHBOARD/services/dashboardService"; // Keep your service import
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { DashboardData } from "../types/dashboard";




const Dashboard = () => {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await dashboardStats();
        // Accessing data[0].admin_dashboard_count based on your JSON structure
        if (res.data && res.data[0] && res.data[0].admin_dashboard_count) {
          setStats(res.data[0].admin_dashboard_count);
        } else {
          throw new Error("Invalid data structure");
        }
      } catch (err: any) {
        toast.error("Failed to sync dashboard metrics");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">
          Syncing Analytics...
        </p>
      </div>
    );
  }

  if (!stats) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120 },
    },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back. Here's what's happening in your academy today.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-800">
          <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Platform Activity: <span className="font-bold">Healthy</span>
          </span>
        </div>
      </div>

      {/* 1. TOP ROW: Core Metrics (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={stats.total_students}
          icon={Users}
          color="bg-blue-500"
          subtext="Active learners"
        />
        <StatCard
          title="Courses Active"
          value={stats.total_courses}
          icon={BookOpen}
          color="bg-indigo-500"
          subtext="Across all categories"
        />
        <StatCard
          title="Content Modules"
          value={stats.total_modules}
          icon={Layers}
          color="bg-violet-500"
          subtext="Learning units"
        />
        <StatCard
          title="Video Library"
          value={stats.total_videos}
          icon={Video}
          color="bg-pink-500"
          subtext="Total lectures"
        />
      </div>

      {/* 2. MIDDLE ROW: The "Bento" Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Most Purchased Course (Highlight Card) */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/10 dark:to-gray-900 border-amber-200 dark:border-amber-900/50 shadow-sm relative overflow-hidden group">
            {/* Decoration */}
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Trophy size={180} />
            </div>

            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                  Top Performer
                </span>
              </div>
              <CardTitle className="text-2xl text-gray-900 dark:text-white z-10">
                {stats.most_purchased_course.name}
              </CardTitle>
              <CardDescription>
                Most popular among students this month
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-end gap-6 z-10 relative">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Sales
                  </p>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {stats.most_purchased_course.purchase_user_count}
                   
                    <span className="text-lg text-gray-400 font-medium">
                      Students
                    </span>
                  </div>
                </div>
                <div className="h-12 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Price Point
                  </p>
                  <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                    ₹{stats.most_purchased_course.price}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* RIGHT: Revenue Insight */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="h-full flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600">
                  <DollarSign size={20} />
                </div>
                Avg. Order Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mt-2 mb-4">
                ₹{stats.average_purchase_price}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is the average revenue generated per course sale across the
                platform.
              </p>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Paid Sales</p>
                  <p className="font-bold text-lg">
                    {stats.total_paid_course_purchases}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Free Enrollments
                  </p>
                  <p className="font-bold text-lg">
                    {stats.total_free_course_purchases}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 3. BOTTOM ROW: Content Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Types */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PieChart size={18} className="text-gray-500" /> Course
                Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Paid Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Paid Courses
                  </span>
                  <span className="font-bold">{stats.total_paid_courses}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        (stats.total_paid_courses / stats.total_courses) * 100
                      }%`,
                    }}
                    className="h-full bg-primary"
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
              {/* Free Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Free Courses
                  </span>
                  <span className="font-bold">{stats.total_free_courses}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        (stats.total_free_courses / stats.total_courses) * 100
                      }%`,
                    }}
                    className="h-full bg-green-500"
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Purchase Types */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShoppingBag size={18} className="text-gray-500" /> Purchase
                Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Paid Purchases */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Premium Purchases
                  </span>
                  <span className="font-bold">
                    {stats.total_paid_course_purchases}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-full rounded-full" />
                </div>
              </div>
              {/* Free Purchases */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Free Enrollments
                  </span>
                  <span className="font-bold">
                    {stats.total_free_course_purchases}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400 w-full rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

// --- Helper Component for Top Grid ---
const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 },
    }}
  >
    <Card
      className="hover:shadow-lg transition-shadow duration-300 border-l-4"
      style={{ borderLeftColor: "transparent" }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
            {value} 
            </div>
            <p className="text-xs text-gray-400 mt-1">{subtext}</p>
          </div>
          <div className={`p-3 rounded-xl text-white shadow-md ${color}`}>
            <Icon size={20} />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
