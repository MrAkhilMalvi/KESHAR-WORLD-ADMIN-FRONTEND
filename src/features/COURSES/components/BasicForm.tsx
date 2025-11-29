import { useState, useEffect } from "react";
import { Course } from "@/features/COURSES/types/course.types";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { Save, Loader2, Image as ImageIcon } from "lucide-react";
import { addCourse, updateCourse } from "../services/courseService";

interface Props {
  initialData: Course | null;
  onSave: (data: Course) => void;
}

const BasicInfoForm = ({ initialData, onSave }: Props) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Course>({
    title: "",
    price: 0,
    description: "",
    is_free: false,
    instructor: "",
    original_price: 0,
    badge: "",
    category: "",
    thumbnail_url: "",
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (initialData?.id) {
        // Update
        res = await updateCourse({ ...formData, id: initialData.id });
      } else {
        // Create
        res = await addCourse(formData);
      }
      // Combine response ID with form data
      onSave({ ...formData, id: res.id || initialData?.id });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Form Fields */}
      <div className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        
        <div className="space-y-2">
          <Label>Course Title</Label>
          <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Master React in 30 Days" required className="text-lg font-medium" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label>Category</Label>
             <Input name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Development" />
           </div>
           <div className="space-y-2">
             <Label>Instructor Name</Label>
             <Input name="instructor" value={formData.instructor} onChange={handleChange} />
           </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="What will students learn?" />
        </div>

        <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
           <div className="space-y-2">
             <Label>Price ($)</Label>
             <Input type="number" name="price" value={formData.price} onChange={handleChange} disabled={formData.is_free} />
           </div>
           <div className="space-y-2">
             <Label>Original Price ($)</Label>
             <Input type="number" name="original_price" value={formData.original_price} onChange={handleChange} disabled={formData.is_free} />
           </div>
           <div className="flex items-center space-x-2 pt-4">
              <Switch 
                checked={formData.is_free} 
                onCheckedChange={(checked) => setFormData(prev => ({...prev, is_free: checked}))} 
              />
              <Label>This is a Free Course</Label>
           </div>
           <div className="space-y-2">
             <Label>Badge (Optional)</Label>
             <Input name="badge" value={formData.badge} onChange={handleChange} placeholder="e.g. Bestseller" />
           </div>
        </div>
      </div>

      {/* Right Column: Thumbnail & Actions */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
           <Label className="mb-4 block">Thumbnail Preview</Label>
           <div className="aspect-video w-full rounded-xl bg-gray-100 dark:bg-gray-900 overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center relative group">
              {formData.thumbnail_url ? (
                <img src={formData.thumbnail_url} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4 text-muted-foreground">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <span className="text-xs">No image provided</span>
                </div>
              )}
           </div>
           <div className="mt-4 space-y-2">
             <Label>Thumbnail URL</Label>
             <Input name="thumbnail_url" value={formData.thumbnail_url} onChange={handleChange} placeholder="https://..." />
           </div>
        </div>

        <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
          {loading ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 w-5 h-5"/>}
          Save Course Details
        </Button>
      </div>
    </form>
  );
};

export default BasicInfoForm;