import { useState, useEffect } from "react";
import { Course } from "@/features/COURSES/types/course.types";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { Save, Loader2, Image as ImageIcon } from "lucide-react";

import {
  addCourse,
  updateCourse,
  uploadDirect,
} from "../services/courseService";
import { uploadToSignedUrl } from "../services/videoService";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { normalizeObjectKey } from "@/lib/normalizeObjectKey";

/* ───────────────────────────────────────────────
   TEMP FIELDS USED ONLY DURING UPLOAD FOR NEW COURSE
──────────────────────────────────────────────── */
interface ExtendedCourse extends Course {
  _thumbnailFile?: File;
  _thumbnailFileName?: string;
  _thumbnailContentType?: string;
}

interface Props {
  initialData: Course | null;
  onSave: (data: Course) => void;
}

const BasicInfoForm = ({ initialData, onSave }: Props) => {
  const [loading, setLoading] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const { id } = useParams();
  const isEditMode = Boolean(id);

  /* ───────────────────────────────────────────────
     INITIAL EMPTY STATE
  ─────────────────────────────────────────────── */
  const [formData, setFormData] = useState<ExtendedCourse>({
    id: undefined,
    title: "",
    price: 0,
    description: "",
    is_free: false,
    instructor: "",
    original_price: 0,
    badge: "",
    category: "",
  });

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      ...initialData,
      thumbnail_url: normalizeObjectKey(initialData.thumbnail_url),
    });
  }, [initialData]);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    /* NEW COURSE — store only, do NOT upload */
    if (!isEditMode) {
      setFormData((prev) => ({
        ...prev,
        _thumbnailFile: file,
        _thumbnailFileName: file.name,
        _thumbnailContentType: file.type,
      }));
      return;
    }

    /* EDIT COURSE — upload immediately but NO updateCourse */
    try {
      setUploadingThumb(true);

      const courseId = initialData?.id;
      if (!courseId) return;

      const { uploadUrl, objectKey } = await uploadDirect({
        type: "course_thumbnail",
        course_id: courseId,
        file,
      });

      await uploadToSignedUrl(file, uploadUrl);

      setFormData((prev) => ({
        ...prev,
        thumbnail_url: objectKey,
        _thumbnailFile: undefined,
      }));

      toast.success("Thumbnail uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Thumbnail upload failed");
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      /* ───── UPDATE COURSE ───── */
      if (isEditMode && initialData?.id) {
        const updated = await updateCourse({
          ...formData,
          id: initialData.id,
          thumbnail_url: formData.thumbnail_url,
        });

        onSave(updated);
        return;
      }

      /* ───── CREATE NEW COURSE ───── */
      const createResponse = await addCourse({
        title: formData.title,
        price: formData.price,
        description: formData.description,
        category: formData.category,
        instructor: formData.instructor,
        badge: formData.badge,
        is_free: formData.is_free,
        original_price: formData.original_price,

        // required ONLY for signed upload URL
        contentType: formData._thumbnailContentType,
        fileName: formData._thumbnailFileName,
      });

      const { course_id, objectKey } = createResponse;

      // Upload thumbnail to Cloudflare R2
      if (formData._thumbnailFile) {
        await uploadToSignedUrl(formData._thumbnailFile, objectKey);
      }

      onSave({
        ...formData,
        id: course_id,
        thumbnail_url: objectKey,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────────── */
  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* LEFT SIDE — FORM */}
      <div className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border shadow-sm">
        <div>
          <Label>Course Title</Label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Category</Label>
            <Input
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Instructor</Label>
            <Input
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
          <div>
            <Label>Price</Label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              disabled={formData.is_free}
            />
          </div>

          <div>
            <Label>Original Price</Label>
            <Input
              type="number"
              name="original_price"
              value={formData.original_price}
              onChange={handleChange}
              disabled={formData.is_free}
            />
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <Switch
              checked={formData.is_free}
              onCheckedChange={(checked) =>
                setFormData((p) => ({ ...p, is_free: checked }))
              }
            />
            <Label>Free Course</Label>
          </div>

          <div>
            <Label>Badge</Label>
            <Input
              name="badge"
              value={formData.badge}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — THUMBNAIL */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border shadow-sm">
          <Label>Thumbnail</Label>

          <div className="aspect-video rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center">
            {formData.thumbnail_url ? (
              <img
                src={formData.thumbnail_url}
                className="w-full h-full object-cover"
              />
            ) : formData._thumbnailFile ? (
              <img
                src={URL.createObjectURL(formData._thumbnailFile)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-gray-400">
                <ImageIcon className="w-10 h-10 mx-auto opacity-50" />
                <p className="text-xs">No thumbnail uploaded</p>
              </div>
            )}
          </div>

          <Input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="mt-4"
          />

          {uploadingThumb && (
            <p className="text-xs text-blue-500 mt-2">Uploading...</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-lg"
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Save className="mr-2" />
          )}
          Save Course Details
        </Button>
      </div>
    </form>
  );
};

export default BasicInfoForm;
