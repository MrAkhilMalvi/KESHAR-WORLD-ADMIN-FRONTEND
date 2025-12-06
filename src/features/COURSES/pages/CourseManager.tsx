import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import  { Course } from "@/features/COURSES/types/course.types";
import BasicInfoForm from "../components/BasicForm";
import CurriculumManager from "../components/CurriculumManager";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { ArrowLeft, Layers, Video } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import toast from "react-hot-toast";
import { getAllCourses } from "../services/courseService";

const CourseManager = () => {
  const { id } = useParams(); // id
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing data if in Edit Mode
  useEffect(() => {
    if (id) {
      // In a real app, you'd have a getSingleCourse API,
      // or filter from getAllCourses. Let's assume we fetch details.
      // For now, I'll simulate a fetch or you can use location state.
      loadCourseDetails(id);
    }
  }, [id]);
  const loadCourseDetails = async (courseId: string) => {
    setIsLoading(true);
    try {
      const all = await getAllCourses(); // returns { success, data: [...] }
      const courseArray = all?.data || []; // extract actual list
      const found = courseArray.find((c: any) => c.id === courseId);

      if (found) setCourseData(found);
    } catch (e) {
      toast.error("Error loading course");
    }
    setIsLoading(false);
  };

  const handleBasicInfoSave = (savedCourse: Course) => {
    setCourseData(savedCourse);
    // If it was a new course, URL won't have ID.
    // We stay on page but unlock tabs, or navigate to edit URL
    if (!id && savedCourse.id) {
      navigate(`/courses/edit/${savedCourse.id}`, { replace: true });
    }
    setActiveTab("curriculum");
    toast.success("Details saved. You can now add modules.");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Top Bar */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/courses")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold">
          {id ? "Edit Course" : "Create New Course"}
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <TabsTrigger
            value="basic"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all"
          >
            <Layers className="w-4 h-4 mr-2" /> Basic Information
          </TabsTrigger>
          <TabsTrigger
            value="curriculum"
            disabled={!courseData?.id}
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md transition-all disabled:opacity-50"
          >
            <Video className="w-4 h-4 mr-2" /> Curriculum & Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="outline-none">
          <BasicInfoForm
            initialData={courseData}
            onSave={handleBasicInfoSave}
          />
        </TabsContent>

        <TabsContent value="curriculum" className="outline-none">
          {courseData?.id && <CurriculumManager courseId={courseData.id} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseManager;
