import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryGrid } from "@/components/category/category-grid";
import { ProductGrid } from "@/components/product/product-grid";
import type { Category, ProductWithCategory } from "@shared/schema";

export default function Home() {
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: featuredProducts = [], isLoading: productsLoading } = useQuery<ProductWithCategory[]>({
    queryKey: ["/api/products", "featured"],
    queryFn: async () => {
      const response = await fetch("/api/products?featured=true&limit=8");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Modern shopping experience hero banner"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl" data-testid="hero-title">
              Discover Amazing Products
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto" data-testid="hero-description">
              Shop the latest trends and find everything you need at unbeatable prices. 
              Join millions of satisfied customers worldwide.
            </p>
            <div className="mt-10">
              <Link href="/products">
                <Button size="lg" className="bg-nexus-accent hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold" data-testid="button-shop-now">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="categories-title">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" data-testid="categories-description">
              Explore our carefully curated collections
            </p>
          </div>
          
          <CategoryGrid categories={categories} isLoading={categoriesLoading} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-testid="featured-title">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" data-testid="featured-description">
              Discover our most popular and trending items
            </p>
          </div>
          
          <ProductGrid products={featuredProducts} isLoading={productsLoading} />
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg" className="border-nexus-primary text-nexus-primary hover:bg-nexus-primary hover:text-white px-8 py-3" data-testid="button-view-all">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-nexus-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4" data-testid="newsletter-title">
              Stay in the Loop
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto" data-testid="newsletter-description">
              Get the latest updates on new products, special offers, and exclusive deals
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-white"
                data-testid="input-newsletter-email"
              />
              <Button className="bg-nexus-accent hover:bg-orange-600 text-white font-medium" data-testid="button-subscribe">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
