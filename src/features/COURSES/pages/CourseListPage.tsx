import { useEffect, useState } from "react";
import { Course } from "@/features/COURSES/types/course.types";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Edit3, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import toast from "react-hot-toast";
import { getAllCourses, deleteCourse } from "../services/courseService";

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();
      const courseList = response?.data;
      setCourses(Array.isArray(courseList) ? courseList : []);
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId?: string) => {
    if (!courseId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    const toastId = toast.loading("Deleting course...");
    setDeletingId(courseId);

    try {
      await deleteCourse(courseId);

      // Remove from local state
      setCourses((prev) => prev.filter((c) => c.id !== courseId));

      toast.success("Course deleted successfully", { id: toastId });
    } catch (error: any) {
      console.error("Delete course error:", error);
      toast.error(error?.message || "Failed to delete course", {
        id: toastId,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCourses = courses?.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Courses
          </h1>
          <p className="text-muted-foreground">
            Manage your educational content
          </p>
        </div>
        <Button
          onClick={() => navigate("/courses/new")}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Course
        </Button>
      </div>

      {/* Filters */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search courses..."
          className="pl-10 max-w-sm bg-white dark:bg-gray-900/50 backdrop-blur-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course, idx) => (
            <motion.div
              key={course.id || idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              {/* Image */}
              <div className="aspect-video relative overflow-hidden bg-gray-200">
                <img
                  src={course.thumbnail_url || "/placeholder-course.jpg"}
                  alt={course.title}
                  className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-md ${
                      course.is_free
                        ? "bg-green-500/90 text-white"
                        : "bg-white/90 text-black"
                    }`}
                  >
                    {course.is_free ? "FREE" : `₹${course.price}`}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg leading-tight text-gray-900 dark:text-gray-100 line-clamp-2">
                    {course.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{course.category}</span>
                  <span>{course.instructor}</span>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 hover:border-primary hover:text-primary"
                    onClick={() => navigate(`/courses/edit/${course.id}`)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" /> Edit
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex-1"
                    disabled={deletingId === course.id}
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    {deletingId === course.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
