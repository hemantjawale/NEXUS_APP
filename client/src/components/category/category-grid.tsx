import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@shared/schema";

interface CategoryGridProps {
  categories: Category[];
  isLoading?: boolean;
}

export function CategoryGrid({ categories, isLoading = false }: CategoryGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6" data-testid="category-grid-loading">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12" data-testid="category-grid-empty">
        <p className="text-gray-500 text-lg">No categories found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6" data-testid="category-grid">
      {categories.map((category) => (
        <Link 
          key={category.id} 
          href={`/products?category=${category.slug}`}
          data-testid={`link-category-${category.slug}`}
        >
          <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200">
            <div className="relative overflow-hidden rounded-t-xl bg-gray-100 aspect-square">
              {category.imageUrl ? (
                <img 
                  src={category.imageUrl} 
                  alt={`${category.name} category`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-2xl font-bold">
                    {category.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <CardContent className="p-3">
              <h3 className="text-sm font-medium text-gray-900 text-center" data-testid={`text-category-name-${category.slug}`}>
                {category.name}
              </h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
