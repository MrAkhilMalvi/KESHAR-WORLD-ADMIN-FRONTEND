import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Product } from "@/features/PRODUCTS/types/product.type";
import { addProducts, updateProducts } from "../services/productService";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

const ProductManager = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const location = useLocation(); // To access passed state
  const isEditMode = Boolean(id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initial State
  const [formData, setFormData] = useState<Product>({
    title: "", slug: "", description: "", category: "", sub_category: "",
    price: 0, discount_price: 0, is_free: false, thumbnail_url: "", language: "English"
  });

  useEffect(() => {
    // 1. Check if we passed product data via navigation state (Fastest)
    if (location.state?.product) {
      setFormData(location.state.product);
    } 
    // 2. If valid ID but no state (user refreshed page), you should fetch data here
    // else if (id) { 
    //    fetchProductById(id).then(data => setFormData(data)); 
    // }
  }, [id, location.state]);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleTitleBlur = () => {
    if (!formData.slug && formData.title) {
      setFormData(prev => ({
        ...prev,
        slug: formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      }));
    }
  };

  const handleSubmit = async () => {
    if(!formData.title) return toast.error("Title is required");

    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        // Update
        await updateProducts({ ...formData, id }); 
        toast.success("Product updated successfully");
      } else {
        // Create
        await addProducts(formData);
        toast.success("Product created successfully");
      }
      navigate("/products"); // Go back to list
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-right-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? "Edit Product" : "Create New Product"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isEditMode ? "Update details for this resource" : "Add a new resource to your library"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={() => navigate("/products")}>Cancel</Button>
           <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[140px]">
             {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
             {isEditMode ? "Update Changes" : "Publish Product"}
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
             <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Product Title</Label>
                  <Input name="title" value={formData.title} onChange={handleChange} onBlur={handleTitleBlur} placeholder="e.g. Master React Guide" className="text-lg font-medium" />
                </div>
                <div className="space-y-2">
                  <Label>Slug (URL)</Label>
                  <Input name="slug" value={formData.slug} onChange={handleChange} className="font-mono text-xs bg-gray-50 dark:bg-gray-900" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea name="description" value={formData.description} onChange={handleChange} rows={6} className="resize-none" placeholder="Describe your product..." />
                </div>
             </div>
          </div>

          <div className="bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
             <h3 className="font-semibold text-lg">Categorization</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input name="category" value={formData.category} onChange={handleChange} placeholder="e.g. E-Book" />
                </div>
                <div className="space-y-2">
                  <Label>Sub Category</Label>
                  <Input name="sub_category" value={formData.sub_category} onChange={handleChange} placeholder="e.g. Programming" />
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <select 
                    name="language" 
                    value={formData.language} 
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Marathi">Marathi</option>
                  </select>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Pricing & Media */}
        <div className="space-y-6">
          
          {/* Media Card */}
          <div className="bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
             <Label>Thumbnail Image</Label>
             <div className="aspect-video w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center relative group">
                {formData.thumbnail_url ? (
                  <img src={formData.thumbnail_url} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <span className="text-xs">Preview</span>
                  </div>
                )}
             </div>
             <Input name="thumbnail_url" value={formData.thumbnail_url} onChange={handleChange} placeholder="https://image-url..." />
          </div>

          {/* Pricing Card */}
          <div className="bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
             <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                <Label className="text-base">Pricing</Label>
                <div className="flex items-center gap-2">
                   <Switch checked={formData.is_free} onCheckedChange={(c) => setFormData(p => ({...p, is_free: c}))} />
                   <span className="text-sm">Free Product</span>
                </div>
             </div>

             <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Original Price (₹)</Label>
                  <Input type="number" name="price" value={formData.price} onChange={handleChange} disabled={formData.is_free} />
                </div>
                <div className="space-y-2">
                  <Label>Discounted Price (₹)</Label>
                  <Input type="number" name="discount_price" value={formData.discount_price} onChange={handleChange} disabled={formData.is_free} />
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductManager;