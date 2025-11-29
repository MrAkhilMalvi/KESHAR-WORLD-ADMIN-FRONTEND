import { useState, useEffect } from "react";
import { Product } from "@/features/PRODUCTS/types/product.type";
import { X, Save, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: Product | null;
  onSave: (data: Product) => void;
}

const ProductModal = ({ isOpen, onClose, initialData, onSave }: Props) => {
  const [formData, setFormData] = useState<Product>({
    title: "", slug: "", description: "", category: "", sub_category: "",
    price: 0, discount_price: 0, is_free: false, thumbnail_url: "", language: "English"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData({
        title: "", slug: "", description: "", category: "", sub_category: "",
        price: 0, discount_price: 0, is_free: false, thumbnail_url: "", language: "English"
    });
  }, [initialData, isOpen]);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  // Auto-generate slug from title if slug is empty
  const handleTitleBlur = () => {
    if (!formData.slug && formData.title) {
      setFormData(prev => ({
        ...prev,
        slug: formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}
        />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-3xl bg-white dark:bg-[#15171e] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#1a1d26]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {initialData ? "Edit Product" : "Create New Product"}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}><X size={20}/></Button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* Section 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Product Title</Label>
                <Input name="title" value={formData.title} onChange={handleChange} onBlur={handleTitleBlur} placeholder="e.g. Advanced Physics E-Book" />
              </div>
              <div className="space-y-2 col-span-2 md:col-span-1">
                <Label>Slug (URL Friendly)</Label>
                <Input name="slug" value={formData.slug} onChange={handleChange} className="font-mono text-xs" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea name="description" value={formData.description} onChange={handleChange} rows={3} />
              </div>
            </div>

            {/* Section 2: Categorization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input name="category" value={formData.category} onChange={handleChange} placeholder="e.g. E-Books" />
              </div>
              <div className="space-y-2">
                <Label>Sub Category</Label>
                <Input name="sub_category" value={formData.sub_category} onChange={handleChange} placeholder="e.g. Physics" />
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <select 
                  name="language" 
                  value={formData.language} 
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Marathi">Marathi</option>
                </select>
              </div>
            </div>

            {/* Section 3: Pricing & Media */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <Label>Pricing Details</Label>
                     <div className="flex items-center gap-2">
                        <Switch checked={formData.is_free} onCheckedChange={(c) => setFormData(p => ({...p, is_free: c}))} />
                        <span className="text-sm font-medium">Is Free?</span>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                       <Label className="text-xs">Original Price</Label>
                       <Input type="number" name="price" value={formData.price} onChange={handleChange} disabled={formData.is_free} />
                     </div>
                     <div className="space-y-1">
                       <Label className="text-xs">Discount Price</Label>
                       <Input type="number" name="discount_price" value={formData.discount_price} onChange={handleChange} disabled={formData.is_free} />
                     </div>
                  </div>
               </div>

               <div className="space-y-2">
                 <Label>Thumbnail URL</Label>
                 <div className="flex gap-2">
                    <Input name="thumbnail_url" value={formData.thumbnail_url} onChange={handleChange} placeholder="https://..." />
                 </div>
                 {/* Preview */}
                 <div className="w-full h-20 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center border border-dashed border-gray-400">
                    {formData.thumbnail_url ? (
                      <img src={formData.thumbnail_url} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <ImageIcon className="text-gray-400" />
                    )}
                 </div>
               </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-[#1a1d26] border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
             <Button variant="outline" onClick={onClose}>Cancel</Button>
             <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[120px]">
               {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
               Save Product
             </Button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;