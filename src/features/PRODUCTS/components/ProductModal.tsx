import { useState, useEffect } from "react";
// Assuming you will update your types file to include 'images: string[]'
import { Product } from "@/features/PRODUCTS/types/product.type";
import { 
  X, 
  Save, 
  Image as ImageIcon, 
  Loader2, 
  Plus, 
  Trash2, 
  Link as LinkIcon 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";

// extending the type locally if not yet updated in your schema
interface ExtendedProduct extends Product {
  images?: string[]; 
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: ExtendedProduct | null;
  onSave: (data: ExtendedProduct) => void;
}

const ProductModal = ({ isOpen, onClose, initialData, onSave }: Props) => {
  // Added 'images' array to initial state
  const [formData, setFormData] = useState<ExtendedProduct>({
    title: "", 
    slug: "", 
    description: "", 
    category: "", 
    sub_category: "",
    price: 0, 
    discount_price: 0, 
    is_free: false, 
    thumbnail_url: "", 
    language: "English",
    images: [] 
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState(""); // State for the gallery input

  useEffect(() => {
    if (initialData) {
      // Ensure images array exists even if null in DB
      setFormData({
        ...initialData,
        images: initialData.images || []
      });
    } else {
      setFormData({
        title: "", slug: "", description: "", category: "", sub_category: "",
        price: 0, discount_price: 0, is_free: false, thumbnail_url: "", language: "English",
        images: []
      });
    }
    setNewImageUrl(""); // Reset image input on open
  }, [initialData, isOpen]);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  // --- Gallery Handlers ---
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), newImageUrl]
    }));
    setNewImageUrl("");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, index) => index !== indexToRemove) || []
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddImage();
    }
  };
  // ------------------------

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

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
          className="relative w-full max-w-4xl bg-white dark:bg-[#15171e] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#1a1d26]">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {initialData ? "Edit Product" : "Create New Product"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Fill in the details to manage your product catalogue</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}><X size={20}/></Button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
            
            {/* Section 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Product Title</Label>
                  <Input name="title" value={formData.title} onChange={handleChange} onBlur={handleTitleBlur} placeholder="e.g. Advanced Physics E-Book" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Slug</Label>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-md border border-input px-3 py-1">
                    <span className="text-xs text-gray-400">domain.com/product/</span>
                    <input 
                      name="slug" 
                      value={formData.slug} 
                      onChange={handleChange} 
                      className="bg-transparent border-none outline-none text-sm w-full font-mono text-gray-700 dark:text-gray-300 h-8"
                    />
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Description</Label>
                  <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="resize-none" />
                </div>
              </div>

              {/* Sidebar: Thumbnail & Category */}
              <div className="md:col-span-4 space-y-4">
                 <div className="space-y-2">
                   <Label>Thumbnail Image</Label>
                   <div className="relative group w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center">
                      {formData.thumbnail_url ? (
                        <>
                          <img src={formData.thumbnail_url} className="w-full h-full object-cover" alt="Thumbnail" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Button variant="destructive" size="sm" onClick={() => setFormData(p => ({...p, thumbnail_url: ""}))}>Remove</Button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4">
                           <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                           <p className="text-xs text-gray-500">Enter URL below</p>
                        </div>
                      )}
                   </div>
                   <Input 
                      name="thumbnail_url" 
                      value={formData.thumbnail_url} 
                      onChange={handleChange} 
                      placeholder="https://example.com/image.jpg" 
                      className="text-xs"
                   />
                 </div>

                 <div className="space-y-2">
                    <Label>Category</Label>
                    <Input name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
                 </div>
                 <div className="space-y-2">
                    <Label>Sub Category</Label>
                    <Input name="sub_category" value={formData.sub_category} onChange={handleChange} placeholder="Sub Category" />
                 </div>
              </div>
            </div>

            {/* Section 2: Product Gallery (Multiple Images) */}
            <div className="space-y-3">
               <div className="flex items-center justify-between">
                 <Label className="text-base font-semibold">Product Gallery</Label>
                 <span className="text-xs text-gray-500">{formData.images?.length || 0} images added</span>
               </div>
               
               <div className="bg-gray-50 dark:bg-gray-900/40 p-5 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
                  {/* Input Area */}
                  <div className="flex gap-2">
                     <div className="relative flex-1">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                           value={newImageUrl}
                           onChange={(e) => setNewImageUrl(e.target.value)}
                           onKeyDown={handleKeyDown}
                           placeholder="Paste additional image URL here..." 
                           className="pl-9"
                        />
                     </div>
                     <Button onClick={handleAddImage} type="button" variant="secondary">
                        <Plus className="w-4 h-4 mr-2" /> Add
                     </Button>
                  </div>

                  {/* Images Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    <AnimatePresence>
                      {formData.images?.map((img, idx) => (
                        <motion.div
                          key={`${img}-${idx}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          layout
                          className="group relative aspect-square bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
                        >
                          <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                          
                          {/* Hover Actions */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 backdrop-blur-[2px]">
                             <Button 
                                type="button" 
                                variant="destructive" 
                                size="icon" 
                                className="h-8 w-8 rounded-full"
                                onClick={() => handleRemoveImage(idx)}
                             >
                               <Trash2 className="w-4 h-4" />
                             </Button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {/* Placeholder if empty */}
                    {(!formData.images || formData.images.length === 0) && (
                      <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg text-gray-400 text-sm">
                         No additional images added yet.
                      </div>
                    )}
                  </div>
               </div>
            </div>

            {/* Section 3: Pricing & Language */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-gray-100 dark:border-gray-800">
               <div className="md:col-span-2 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                  <div className="flex items-center justify-between mb-4">
                     <Label className="text-blue-900 dark:text-blue-100">Pricing Configuration</Label>
                     <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full border shadow-sm">
                        <Switch id="free-switch" checked={formData.is_free} onCheckedChange={(c) => setFormData(p => ({...p, is_free: c}))} />
                        <Label htmlFor="free-switch" className="cursor-pointer text-xs font-medium">Mark as Free</Label>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                       <Label className="text-xs text-gray-500">Original Price (₹)</Label>
                       <Input type="number" className="bg-white dark:bg-gray-800" name="price" value={formData.price} onChange={handleChange} disabled={formData.is_free} />
                     </div>
                     <div className="space-y-1">
                       <Label className="text-xs text-gray-500">Discounted Price (₹)</Label>
                       <Input type="number" className="bg-white dark:bg-gray-800" name="discount_price" value={formData.discount_price} onChange={handleChange} disabled={formData.is_free} />
                     </div>
                  </div>
               </div>

               <div className="space-y-2">
                  <Label>Language</Label>
                  <div className="relative">
                    <select 
                      name="language" 
                      value={formData.language} 
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm appearance-none cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Marathi">Marathi</option>
                    </select>
                    {/* Custom Arrow */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <path d="m1 1 4 4 4-4"/>
                      </svg>
                    </div>
                  </div>
               </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-[#1a1d26] border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 z-10">
             <Button variant="outline" onClick={onClose} className="border-gray-200 dark:border-gray-700">Cancel</Button>
             <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[140px] shadow-lg shadow-blue-500/20">
               {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
               Save Changes
             </Button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;