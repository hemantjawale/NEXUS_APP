import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/product/product-grid";
import type { ProductWithCategory, Category } from "@shared/schema";

export default function Products() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    const search = urlParams.get("search");
    
    if (category) {
      setSelectedCategory(category);
    }
    if (search) {
      setSearchQuery(search);
    }
  }, [location]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const buildProductsQuery = () => {
    const params = new URLSearchParams();
    params.set("limit", "20");
    params.set("offset", "0");
    
    if (selectedCategory) {
      const category = categories.find(cat => cat.slug === selectedCategory);
      if (category) {
        params.set("categoryId", category.id);
      }
    }
    
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    
    return `/api/products?${params.toString()}`;
  };

  const { data: products = [], isLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products", selectedCategory, searchQuery],
    queryFn: async () => {
      const response = await fetch(buildProductsQuery());
      return response.json();
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL without page reload
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory) params.set("category", selectedCategory);
    
    const newUrl = `/products${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.pushState({}, "", newUrl);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    window.history.pushState({}, "", "/products");
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "rating":
        return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
      case "newest":
      default:
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  const pageTitle = selectedCategory 
    ? `${categories.find(cat => cat.slug === selectedCategory)?.name || "Category"} Products`
    : searchQuery 
    ? `Search Results for "${searchQuery}"`
    : "All Products";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4" data-testid="page-title">
            {pageTitle}
          </h1>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-product-search"
                />
              </div>
            </form>
            
            <div className="flex gap-4">
              <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}>
                <SelectTrigger className="w-48" data-testid="select-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48" data-testid="select-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Active Filters */}
          {(selectedCategory || searchQuery) && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {selectedCategory && (
                <Badge variant="secondary" data-testid={`badge-filter-category-${selectedCategory}`}>
                  Category: {categories.find(cat => cat.slug === selectedCategory)?.name}
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" data-testid="badge-filter-search">
                  Search: {searchQuery}
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                Clear all
              </Button>
            </div>
          )}
          
          {/* Results Count */}
          <p className="text-sm text-gray-600" data-testid="text-results-count">
            {isLoading ? "Loading..." : `${sortedProducts.length} products found`}
          </p>
        </div>

        {/* Products Grid */}
        <ProductGrid products={sortedProducts} isLoading={isLoading} />
      </div>
    </div>
  );
}
