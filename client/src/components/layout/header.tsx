import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Heart, ShoppingBag, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import type { Category } from "@shared/schema";

export function Header() {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();

  const { data: dbCategories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Create navigation categories from database categories
  const categories = [
    { name: "All Products", href: "/products" },
    ...dbCategories.map(cat => ({
      name: cat.name,
      href: `/products?category=${cat.slug}`
    }))
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" data-testid="link-home">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-nexus-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">N</span>
                  </div>
                  <span className="text-2xl font-bold nexus-primary">NEXUS</span>
                </div>
              </Link>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                  data-testid="input-search"
                />
              </form>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-4">
              {/* Login/Signup - Hidden on mobile */}
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" data-testid="button-login">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-nexus-accent hover:bg-orange-600 text-white" data-testid="button-signup">
                    Sign Up
                  </Button>
                </Link>
              </div>

              {/* Mobile Search */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-search">
                    <Search className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="h-24">
                  <form onSubmit={handleSearch} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full"
                      data-testid="input-mobile-search"
                    />
                  </form>
                </SheetContent>
              </Sheet>

              <Button variant="ghost" size="icon" data-testid="button-wishlist">
                <Heart className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative" 
                onClick={() => setIsCartOpen(true)}
                data-testid="button-cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-nexus-accent hover:bg-nexus-accent"
                    data-testid="badge-cart-count"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="flex flex-col space-y-4 mt-6">
                    {/* Mobile Login/Signup */}
                    <div className="border-b pb-4 mb-4">
                      <Link href="/login">
                        <Button variant="ghost" className="w-full justify-start" data-testid="button-mobile-login">
                          <User className="h-4 w-4 mr-2" />
                          Login
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button className="w-full mt-2 bg-nexus-accent hover:bg-orange-600 text-white" data-testid="button-mobile-signup">
                          Sign Up
                        </Button>
                      </Link>
                    </div>

                    {/* Navigation Categories */}
                    {categories.map((category) => (
                      <Link 
                        key={category.href} 
                        href={category.href}
                        className="text-gray-600 hover:text-nexus-primary font-medium py-2"
                        data-testid={`link-mobile-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Main Navigation - Hidden on mobile */}
        <nav className="hidden md:block bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto py-2">
              {categories.map((category) => {
                const isActive = location === category.href || 
                  (category.href.includes('category=') && location.includes(category.href.split('?')[1]));
                
                return (
                  <Link 
                    key={category.href} 
                    href={category.href}
                    className={`font-medium whitespace-nowrap py-2 ${
                      isActive 
                        ? "text-nexus-primary border-b-2 border-nexus-primary" 
                        : "text-gray-600 hover:text-nexus-primary"
                    }`}
                    data-testid={`link-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
