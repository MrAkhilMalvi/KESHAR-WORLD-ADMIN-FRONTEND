import { useState, useEffect, ChangeEvent } from "react";
import { Video } from "@/features/COURSES/types/video.types";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/components/ui/accordion";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { PlusCircle, Edit2, PlayCircle, Clock, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import toast from "react-hot-toast";
import { Module } from "../types/module.types";
import {
  addModule,
  deleteModule,
  getModules,
  updateModule,
} from "../services/moduleService";
import {
  addVideos,
  deleteVideo,
  getVideos,
  updateVideos,
  uploadToSignedUrl,
} from "../services/videoService";
import { uploadDirect } from "../services/courseService"; // Your R2 upload service

interface Props {
  courseId: string;
}

const CurriculumManager = ({ courseId }: Props) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState<Partial<Module>>({});
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Partial<Video>>({});
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const [deletingModuleId, setDeletingModuleId] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  const fetchModules = async () => {
    try {
      const response = await getModules(courseId);
      const raw = Array.isArray(response?.data) ? response.data : [];
      const modulesWithVideos = await Promise.all(
        raw.map(async (m: Module) => {
          const vData = await getVideos(m.module_id);
          const videos = Array.isArray(vData?.data) ? vData.data : [];
          return { ...m, videos };
        })
      );
      setModules(modulesWithVideos.sort((a, b) => a.position - b.position));
    } catch (err) {
      toast.error("Failed to load modules");
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );
    if (!confirmDelete) return;

    const toastId = toast.loading("Deleting video...");
    setDeletingVideoId(videoId);

    try {
      await deleteVideo(videoId);

      // ✅ Remove video from UI state
      setModules((prev) =>
        prev.map((module) => ({
          ...module,
          videos: module.videos.filter((v) => v.video_id !== videoId),
        }))
      );

      toast.success("Video deleted successfully", { id: toastId });
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete video", { id: toastId });
    } finally {
      setDeletingVideoId(null);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    const confirmDelete = window.confirm(
      "Deleting this module will remove all videos inside it. Continue?"
    );
    if (!confirmDelete) return;

    const toastId = toast.loading("Deleting module...");
    setDeletingModuleId(moduleId);

    try {
      await deleteModule(moduleId);

      // ✅ Remove module from UI
      setModules((prev) => prev.filter((m) => m.module_id !== moduleId));

      toast.success("Module deleted successfully", { id: toastId });
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete module", { id: toastId });
    } finally {
      setDeletingModuleId(null);
    }
  };

  const handleThumbnailUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("Please select an image");

    if (!activeModuleId) return;

    try {
      // 1️⃣ Request a signed URL for thumbnail
      const { uploadUrl, objectKey } = await uploadDirect({
        type: "video_thumbnail",
        module_id: activeModuleId,
        video_id: currentVideo.video_id,
        file: file,
      });

      // 2️⃣ Upload to Cloudflare R2
      await uploadToSignedUrl(file, uploadUrl);

      // 3️⃣ Save image key into state
      setCurrentVideo((prev) => ({
        ...prev,
        thumbnail_url: objectKey,
      }));

      toast.success("Thumbnail uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Thumbnail upload failed");
    }
  };

  // Module Handlers
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
    } catch (err) {
      toast.error("Failed to save module");
    }
  };

  // Video Handlers
  const handleSaveVideo = async () => {
    if (!activeModuleId) return;

    if (!currentVideo.objectKey) {
      toast.error("Please upload a video first");
      return;
    }

    try {
      if (currentVideo.video_id) {
        // UPDATE
        await updateVideos(currentVideo.video_id, {
          title: currentVideo.title!,
          objectKey: currentVideo.objectKey!,
          thumbnail_url: currentVideo.thumbnail_url || "",
          video_duration: currentVideo.video_duration || "",
          video_description: currentVideo.video_description || "",
          video_position: currentVideo.video_position || 1,
        });
      } else {
        // INSERT
        await addVideos(activeModuleId, {
          title: currentVideo.title!,
          objectKey: currentVideo.objectKey!,
          thumbnail_url: currentVideo.thumbnail_url || "",
          video_duration: currentVideo.video_duration || "",
          video_description: currentVideo.video_description || "",
          video_position: currentVideo.video_position || 1,
        });
      }

      setIsVideoDialogOpen(false);
      fetchModules();
      toast.success("Video saved successfully!");
    } catch (err) {
      toast.error("Failed to save video");
    }
  };

  // File Upload Handler
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!activeModuleId) return;

    const file = e.target.files?.[0];
    if (!file) return toast.error("Please select a video file");

    try {
      // 1️⃣ Ask backend for signed URL
      const { uploadUrl, objectKey } = await uploadDirect({
        type: "video",
        module_id: activeModuleId,
        video_id: currentVideo.video_id, // MUST pass video ID
        file: file,
      });

      // 2️⃣ Upload directly to Cloudflare R2
      await uploadToSignedUrl(file, uploadUrl);

      // 3️⃣ Store objectKey in database via your existing flow
      setCurrentVideo((prev) => ({ ...prev, objectKey: objectKey }));

      toast.success("Video uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Video upload failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Module List and Add Button */}
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
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="font-semibold">{module.title}</span>
                    <div className="flex items-center gap-2">
                      {/* EDIT MODULE */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentModule(module);
                          setIsModuleDialogOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4 text-gray-500" />
                      </Button>

                      {/* DELETE MODULE */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation(); // ✅ VERY IMPORTANT
                          handleDeleteModule(module.module_id!);
                        }}
                        disabled={deletingModuleId === module.module_id}
                      >
                        {deletingModuleId === module.module_id ? (
                          <Clock className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-gray-50/50 dark:bg-gray-900/20 px-6 py-4 space-y-3">
                  {module.videos?.map((video) => (
                    <div
                      key={video.video_id}
                      className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
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
                      <div className="flex items-center gap-2">
                        {/* EDIT VIDEO */}
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

                        {/* DELETE VIDEO */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteVideo(video.video_id!)}
                          disabled={deletingVideoId === video.video_id}
                        >
                          {deletingVideoId === video.video_id ? (
                            <Clock className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
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

      {/* Module Dialog */}
      <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentModule.module_id ? "Edit" : "Add"} Module
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label>Module Title</Label>
            <Input
              value={currentModule.title || ""}
              onChange={(e) =>
                setCurrentModule({ ...currentModule, title: e.target.value })
              }
            />
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
            <Label>Video Title</Label>
            <Input
              value={currentVideo.title || ""}
              onChange={(e) =>
                setCurrentVideo({ ...currentVideo, title: e.target.value })
              }
            />

            {/* File Upload */}
            <Label>Upload Video</Label>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileUpload(e)} // Now fixed
            />
            <Label>Thumbnail Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
            />

            <div className="grid grid-cols-2 gap-4">
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
