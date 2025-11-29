import { useState, useEffect } from "react";
import { Video } from "@/features/COURSES/types/video.types";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion"; // Assuming shadcn ui
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  PlusCircle,
  Video as VideoIcon,
  Edit2,
  PlayCircle,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import toast from "react-hot-toast";
import { Module } from "../types/module.types";
import { addModule, getModules, updateModule } from "../services/moduleService";
import { addVideos, getVideos, updateVideos } from "../services/videoService";

interface Props {
  courseId: string;
}

const CurriculumManager = ({ courseId }: Props) => {
  const [modules, setModules] = useState<Module[]>([]);

  // State for Add/Edit Module Dialog
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState<Partial<Module>>({});

  // State for Add/Edit Video Dialog
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Partial<Video>>({});
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  const fetchModules = async () => {
    try {
      const response = await getModules(courseId);

      console.log("Raw modules:", response.data);

      const raw = response?.data;

      // Always convert to array
      const modulesList = Array.isArray(raw) ? raw : raw ? [raw] : [];

      // Fetch videos for each module
      const modulesWithVideos = await Promise.all(
        modulesList.map(async (m: Module) => {
          try {
            const vData = await getVideos(m.module_id);

            const videosRaw = vData?.data;

            const videos = Array.isArray(videosRaw)
              ? videosRaw
              : videosRaw
              ? [videosRaw]
              : [];

            return { ...m, videos };
          } catch (e) {
            return { ...m, videos: [] };
          }
        })
      );

      // Sort by position
      setModules(modulesWithVideos.sort((a, b) => a.position - b.position));
    } catch (error) {
      toast.error("Error loading curriculum");
    }
  };

  // --- Module Handlers ---
  const handleSaveModule = async () => {
    try {
      if (currentModule.module_id) {
        await updateModule(
          currentModule.module_id,
          currentModule.title!,
          currentModule.position || 0
        );
      } else {
        await addModule(courseId, currentModule.title!, modules.length + 1);
      }
      setIsModuleDialogOpen(false);
      fetchModules();
      toast.success("Module saved");
    } catch (e) {
      toast.error("Failed to save module");
    }
  };

  // --- Video Handlers ---
  const handleSaveVideo = async () => {
    if (!activeModuleId) return;
    try {
      if (currentVideo.video_id) {
        await updateVideos(currentVideo.video_id, currentVideo as Video);
      } else {
        await addVideos(activeModuleId, {
          ...currentVideo,
          position: currentVideo.video_position || 1,
        } as Video);
      }
      setIsVideoDialogOpen(false);
      fetchModules(); // Refresh to show new video
      toast.success("Video saved");
    } catch (e) {
      toast.error("Failed to save video");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Course Modules</h3>
        <Button
          onClick={() => {
            setCurrentModule({});
            setIsModuleDialogOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Module
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {modules.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No modules yet. Click "Add Module" to start.
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {modules.map((module) => (
              <AccordionItem
                key={module.module_id}
                value={module.module_id || ""}
                className="border-b last:border-0 dark:border-gray-700"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="font-semibold text-left">
                      {module.title}
                    </span>
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => {
                          setCurrentModule(module);
                          setIsModuleDialogOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-gray-50/50 dark:bg-gray-900/20 px-6 py-4 space-y-3">
                  {/* Video List */}
                  {module.videos &&
                    module.videos.map((video) => (
                      <div
                        key={video.video_id}
                        className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm group hover:border-primary/50 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <PlayCircle size={20} />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{video.title}</h5>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock size={12} /> {video.video_duration} mins
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setActiveModuleId(module.module_id!);
                            setCurrentVideo(video);
                            setIsVideoDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    ))}

                  <Button
                    variant="outline"
                    className="w-full border-dashed mt-2"
                    onClick={() => {
                      setActiveModuleId(module.module_id!);
                      setCurrentVideo({});
                      setIsVideoDialogOpen(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Video to{" "}
                    {module.title}
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* --- Dialogs --- */}

      {/* Module Dialog */}
      <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentModule.module_id ? "Edit" : "Add"} Module
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Module Title</Label>
              <Input
                value={currentModule.title || ""}
                onChange={(e) =>
                  setCurrentModule({ ...currentModule, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <Input
                type="number"
                value={currentModule.position || ""}
                onChange={(e) =>
                  setCurrentModule({
                    ...currentModule,
                    position: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <Button onClick={handleSaveModule} className="w-full">
              Save Module
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {currentVideo.video_id ? "Edit" : "Add"} Video
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Video Title</Label>
              <Input
                value={currentVideo.title || ""}
                onChange={(e) =>
                  setCurrentVideo({
                    ...currentVideo,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Video URL</Label>
              <Input
                value={currentVideo.url || ""}
                onChange={(e) =>
                  setCurrentVideo({
                    ...currentVideo,
                    url: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (e.g. 10:30)</Label>
                <Input
                  value={currentVideo.video_duration || ""}
                  onChange={(e) =>
                    setCurrentVideo({
                      ...currentVideo,
                      video_duration: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  type="number"
                  value={currentVideo.video_position || ""}
                  onChange={(e) =>
                    setCurrentVideo({
                      ...currentVideo,
                      video_position: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={currentVideo.video_description || ""}
                onChange={(e) =>
                  setCurrentVideo({
                    ...currentVideo,
                    video_description: e.target.value,
                  })
                }
              />
            </div>
            <Button onClick={handleSaveVideo} className="w-full">
              Save Video
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CurriculumManager;
