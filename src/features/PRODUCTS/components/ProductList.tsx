import { useState, useEffect } from "react";
import { Product } from "@/features/PRODUCTS/types/product.type";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Package,
  Tag,
  Layers,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { deleteProducts, getAllProducts } from "../services/productService";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteProducts(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  // Filter Logic
  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <Package className="text-primary" /> Products & Resources
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage e-books, merchandise, and digital assets.
          </p>
        </div>
        <Button
          onClick={() => navigate("/products/create")}
          className="shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by title or category..."
          className="pl-10 bg-white dark:bg-gray-900/50 backdrop-blur-sm border-gray-200 dark:border-gray-800"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filtered.map((product, idx) => (
              <motion.div
                key={product.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-white dark:bg-[#1a1d26] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-900 relative">
                  <img
                    src={product.thumbnail_url || "/placeholder-product.jpg"}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {product.is_free && (
                      <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        FREE
                      </span>
                    )}
                    <span className="bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md">
                      {product.language}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3
                      className="font-bold text-gray-900 dark:text-gray-100 line-clamp-1"
                      title={product.title}
                    >
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Tag size={12} /> {product.category}
                      <span className="text-gray-300">•</span>
                      <Layers size={12} /> {product.sub_category}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="text-sm font-semibold">
                      {product.is_free ? (
                        "Free"
                      ) : (
                        <div className="flex flex-col leading-none">
                          <span
                            className={
                              product.discount_price
                                ? "text-red-400 line-through text-[10px]"
                                : "hidden"
                            }
                          >
                            ₹{product.price}
                          </span>
                          <span className="text-primary">
                            ₹{product.discount_price || product.price}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {/* Navigate to Edit Page with State (Passes current product object to avoid re-fetch) */}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() =>
                          navigate(`/products/edit/${product.id}`, {
                            state: { product },
                          })
                        }
                      >
                        <Edit3 size={16} />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. The product will be
                              permanently removed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => handleDelete(product.id!)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ProductList;
