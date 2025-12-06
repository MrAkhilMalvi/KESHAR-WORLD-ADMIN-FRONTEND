import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { GalleryItem, Product } from "@/features/PRODUCTS/types/product.type";
// Make sure productImages is exported from your service
import {
  addProducts,
  updateProducts,
  productImagesUpload,
  productImagesDelete,
  getProductImages,
} from "../services/productService";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Switch } from "@/shared/components/ui/switch";
import {
  ArrowLeft,
  Save,
  Loader2,
  Image as ImageIcon,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { uploadDirect } from "@/features/COURSES/services/courseService";
import { uploadToSignedUrl } from "@/features/COURSES/services/videoService";
import { normalizeObjectKey, resolveImageUrl } from "@/lib/normalizeObjectKey";

// Interface for the payload expected by your new API
interface ProductImagesPayload {
  productId: string;
  images: string[];
}

interface ExtendedProduct extends Product {
  _thumbnailFile?: File;
  _thumbnailFileName?: string;
  _thumbnailContentType?: string;
}

const ProductManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [pendingKeys, setPendingKeys] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState<ExtendedProduct>({
    id: undefined,
    title: "",
    slug: "",
    description: "",
    category: "",
    sub_category: "",
    price: 0,
    discount_price: 0,
    is_free: false,
    qty: 1,
    contentType: "",
    fileName: "",
    thumbnail_url: "",
    language: "English",
  });

  useEffect(() => {
    if (!location.state?.product || !id) return;

    const product = location.state.product;

    setFormData({
      ...product,
      thumbnail_url: normalizeObjectKey(product.thumbnail_url),
    });

    if (Array.isArray(product.images)) {
      setGallery(
        product.images.map((img: string, idx: number) => ({
          product_id: id,
          objectKey: img,
          position: idx,
        }))
      );
    } else {
      setGallery([]);
    }
  }, [id, location.state]);

  useEffect(() => {
    if (!id || !isEditMode) return;

    const fetchGallery = async () => {
      try {
        const res = await getProductImages(id);

        if (res?.success && Array.isArray(res.result)) {
          setGallery(
            res.result.map((img: any, index: number) => ({
              product_id: img.product_id,
              objectKey: img.image_url,
              position: img.positions ?? index,
              id: img.id,
            }))
          );
        } else {
          setGallery([]);
        }
      } catch (error) {
        console.error("Failed to fetch gallery images", error);
        toast.error("Failed to load product gallery");
      }
    };

    fetchGallery();
  }, [id, isEditMode]);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleTitleBlur = () => {
    if (!formData.slug && formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug: formData.title
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, ""),
      }));
    }
  };

  // --- Thumbnail Handler ---
  const handleProductThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    if (!isEditMode) {
      setFormData((prev) => ({
        ...prev,
        _thumbnailFile: file,
        _thumbnailFileName: file.name,
        _thumbnailContentType: file.type,
      }));
      return;
    }

    // Direct Upload in Edit Mode
    try {
      toast.loading("Uploading thumbnail...", { id: "p-thumb" });
      const { uploadUrl, objectKey } = await uploadDirect({
        type: "product_thumbnail",
        product_id: id,
        file,
      });
      await uploadToSignedUrl(file, uploadUrl);
      setFormData((prev) => ({
        ...prev,
        thumbnail_url: objectKey,
        _thumbnailFile: undefined,
      }));
      toast.success("Thumbnail uploaded!", { id: "p-thumb" });
    } catch (err) {
      console.error(err);
      toast.error("Thumbnail upload failed", { id: "p-thumb" });
    }
  };

  // --- Gallery Handler (Multiple Images) ---
  const handleGallerySelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const productId = id || formData.id;
    console.log(productId);

    if (!productId) {
      toast.error("Please save the product first before adding images");
      e.target.value = "";
      return;
    }

    const toastId = toast.loading("Uploading image...");

    try {
      console.log("Calling uploadDirect with productId:", productId);

      const { uploadUrl, objectKey } = await uploadDirect({
        type: "product_images",
        product_id: productId,
        file: file,
      });

      await uploadToSignedUrl(file, uploadUrl);

      setGallery((prev) => [
        ...prev,
        {
          product_id: productId,
          objectKey,
          position: prev.length,
        },
      ]);

      setPendingKeys((prev) => new Set(prev).add(objectKey));

      toast.success("Image uploaded (pending save)", { id: toastId });
    } catch (err: any) {
      console.error("uploadDirect error:", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Upload failed",
        { id: toastId }
      );
    } finally {
      e.target.value = "";
    }
  };

  const handleRemoveGalleryImage = async (index: number) => {
  const img = gallery[index];
  if (!img?.id) return;

  const confirmDelete = window.confirm("Delete this image?");
  if (!confirmDelete) return;

  const toastId = toast.loading("Deleting image...");

  try {
    await productImagesDelete(img.id); 

    setGallery(prev => prev.filter((_, i) => i !== index));

    setPendingKeys(prev => {
      const next = new Set(prev);
      next.delete(img.objectKey);
      return next;
    });

    toast.success("Image deleted", { id: toastId });
  } catch (error: any) {
    toast.error(error?.message || "Delete failed", { id: toastId });
  }
};


  const handleSaveGallery = async () => {
    if (!id) return;

    const pendingImages = gallery.filter((g) => pendingKeys.has(g.objectKey));

    if (!pendingImages.length) return;

    const toastId = toast.loading("Saving gallery...");

    try {
      for (const img of pendingImages) {
        await productImagesUpload({
          product_id: img.product_id,
          position: img.position,
          objectKey: img.objectKey,
        });
      }

      setPendingKeys(new Set());
      toast.success("Gallery saved", { id: toastId });
    } catch (e) {
      console.error(e);
      toast.error("Failed to save gallery", { id: toastId });
    }
  };

  // --- Main Submit ---
  const handleSubmit = async () => {
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // =======================
      // UPDATE PRODUCT
      // =======================
      if (isEditMode && id) {
        await updateProducts({
          ...formData,
          id,
          thumbnail_url: formData.thumbnail_url,
        });

        toast.success("Product updated successfully");
        navigate("/products");
        return;
      }

      // =======================
      // CREATE PRODUCT
      // =======================
      const payload = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        category: formData.category,
        sub_category: formData.sub_category,
        price: formData.price,
        discount_price: formData.discount_price,
        is_free: formData.is_free,
        qty: formData.qty,
        language: formData.language,
        // Thumbnail metadata for signed URL
        contentType: formData._thumbnailContentType,
        fileName: formData._thumbnailFileName,
      };

      // 1️⃣ Create product
      const createResponse = await addProducts(payload);
      const newProductId = createResponse._id || createResponse.id;
      const thumbnailUploadUrl = createResponse.objectKey;

      // 2️⃣ Upload thumbnail (if selected)
      if (formData._thumbnailFile && thumbnailUploadUrl) {
        await uploadToSignedUrl(formData._thumbnailFile, thumbnailUploadUrl);
      }

      toast.success("Product created successfully");
      navigate("/products");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in slide-in-from-right-4 duration-500 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur py-4 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/products")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditMode ? "Edit Product" : "Create New Product"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isEditMode
                ? "Update details & gallery"
                : "Add a new resource to your library"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/products")}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isUploadingGallery}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEditMode ? "Update Changes" : "Publish Product"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <h3 className="font-semibold text-lg">Basic Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Product Title</Label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleTitleBlur}
                  placeholder="e.g. Master React Guide"
                  className="text-lg font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="font-mono text-xs bg-gray-50 dark:bg-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="resize-none"
                  placeholder="Describe your product..."
                />
              </div>
            </div>
          </div>

          {/* Categorization */}
          <div className="bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <h3 className="font-semibold text-lg">Categorization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. E-Book"
                />
              </div>
              <div className="space-y-2">
                <Label>Sub Category</Label>
                <Input
                  name="sub_category"
                  value={formData.sub_category}
                  onChange={handleChange}
                  placeholder="e.g. Programming"
                />
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm outline-none"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Marathi">Marathi</option>
                </select>
              </div>
            </div>
          </div>

          {/* PRODUCT GALLERY SECTION (New) */}
          <div className="bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Product Gallery</h3>
                <p className="text-xs text-muted-foreground">
                  Add multiple images for the product carousel.
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <label
                  className={`relative inline-block ${
                    !id ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleGallerySelect}
                    disabled={!id}
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={!id}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Images
                  </Button>
                </label>

                <Button
                  size="sm"
                  onClick={handleSaveGallery}
                  disabled={pendingKeys.size === 0}
                >
                  Save Gallery
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
              {/* 2. Pending Files (Create Mode) */}
              {gallery.map((img, idx) => {
                const isPending = pendingKeys.has(img.objectKey);

                return (
                  <div
                    key={img.objectKey}
                    className="relative group aspect-square rounded-lg border overflow-hidden"
                  >
                    <img
                      src={img.objectKey}
                      className="w-full h-full object-cover"
                    />

                    {isPending && (
                      <span className="absolute bottom-1 left-1 text-[10px] bg-yellow-600 text-white px-2 rounded">
                        Pending
                      </span>
                    )}

                    <button
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}

              {!gallery.length && (
                <div className="col-span-full py-8 text-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                  No additional images added.
                </div>
              )}

              {!gallery.length && (
                <div className="col-span-full py-8 text-center text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                  No additional images added.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Pricing & Thumbnail */}
        <div className="space-y-6">
          {/* Thumbnail Card */}
          <div className="bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <Label>Thumbnail Image</Label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="upload-thumb"
              onChange={handleProductThumbnailUpload}
            />
            <label
              htmlFor="upload-thumb"
              className="cursor-pointer aspect-video w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center relative group hover:border-primary/50 transition-colors"
            >
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
                  <ImageIcon className="h-8 w-8 mx-auto opacity-50" />
                  <p className="text-xs mt-2">Click to upload main thumbnail</p>
                </div>
              )}
            </label>
          </div>

          {/* Pricing Card */}
          <div className="bg-white dark:bg-[#1a1d26] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <Label className="text-base">Pricing</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_free}
                  onCheckedChange={(c) =>
                    setFormData((p) => ({ ...p, is_free: c }))
                  }
                />
                <span className="text-sm">Free Product</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Original Price (₹)</Label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  disabled={formData.is_free}
                />
              </div>
              <div className="space-y-2">
                <Label>Discounted Price (₹)</Label>
                <Input
                  type="number"
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleChange}
                  disabled={formData.is_free}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
