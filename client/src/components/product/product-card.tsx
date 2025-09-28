import { useState } from "react";
import { Link } from "wouter";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { ProductWithCategory } from "@shared/schema";

interface ProductCardProps {
  product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsLoading(true);
      await addToCart(product.id);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement wishlist functionality
    toast({
      title: "Wishlist",
      description: "Wishlist functionality coming soon!",
    });
  };

  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const hasDiscount = originalPrice && originalPrice > price;
  const rating = parseFloat(product.rating || "0");

  return (
    <Link href={`/products/${product.id}`} data-testid={`link-product-${product.id}`}>
      <Card className="product-card bg-white rounded-xl shadow-sm border hover:shadow-lg cursor-pointer transition-all duration-200 hover:transform hover:-translate-y-1">
        <div className="relative">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <div className="absolute top-3 right-3">
            <Button 
              variant="secondary" 
              size="icon" 
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
              onClick={handleWishlist}
              data-testid={`button-wishlist-${product.id}`}
            >
              <Heart className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
          {hasDiscount && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-nexus-secondary text-white">Sale</Badge>
            </div>
          )}
          {product.isFeatured && !hasDiscount && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-nexus-accent text-white">Featured</Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2" data-testid={`text-product-description-${product.id}`}>
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900" data-testid={`text-product-price-${product.id}`}>
                ${price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through" data-testid={`text-product-original-price-${product.id}`}>
                  ${originalPrice!.toFixed(2)}
                </span>
              )}
            </div>
            <Button 
              className="bg-nexus-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
              onClick={handleAddToCart}
              disabled={isLoading || product.stock === 0}
              data-testid={`button-add-to-cart-${product.id}`}
            >
              {isLoading ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
          
          {rating > 0 && (
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-3 w-3 ${star <= rating ? 'fill-current' : ''}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2" data-testid={`text-product-reviews-${product.id}`}>
                ({product.reviewCount})
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
