import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductWithCategory } from "@shared/schema";

interface ProductGridProps {
  products?: ProductWithCategory[] | null; // Make products optional
  isLoading?: boolean;
}

export function ProductGrid({ products = [], isLoading = false }: ProductGridProps) {
  // Show loading skeletons
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        data-testid="product-grid-loading"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Show empty state if products is not an array or empty
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="text-center py-12" data-testid="product-grid-empty">
        <p className="text-gray-500 text-lg">No products found.</p>
        <p className="text-gray-400 text-sm mt-2">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  // Render product cards
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      data-testid="product-grid"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
