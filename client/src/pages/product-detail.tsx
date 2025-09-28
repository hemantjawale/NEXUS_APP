import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Heart, Star, ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import type { ProductWithCategory } from "@shared/schema";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery<ProductWithCategory>({
    queryKey: ["/api/products", params?.id],
    enabled: !!params?.id,
  });

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setIsAddingToCart(true);
      await addToCart(product.id, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = () => {
    toast({
      title: "Wishlist",
      description: "Wishlist functionality coming soon!",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/products">
              <Button data-testid="button-back-to-products">
                Back to Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const rating = parseFloat(product.rating || "0");
  const isOutOfStock = product.stock === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="p-0" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          {product.category && (
            <>
              <span className="text-gray-400">/</span>
              <Link href={`/products?category=${product.category.slug}`}>
                <Button variant="ghost" size="sm" className="p-0 text-gray-600" data-testid={`link-category-${product.category.slug}`}>
                  {product.category.name}
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full aspect-square object-cover rounded-lg"
              data-testid="product-image"
            />
            {hasDiscount && (
              <Badge className="absolute top-4 left-4 bg-nexus-secondary text-white">
                {discountPercent}% OFF
              </Badge>
            )}
            {product.isFeatured && !hasDiscount && (
              <Badge className="absolute top-4 left-4 bg-nexus-accent text-white">
                Featured
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="product-name">
                {product.name}
              </h1>
              
              {/* Rating */}
              {rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${star <= rating ? 'fill-current' : ''}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600" data-testid="product-rating">
                    {rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-gray-900" data-testid="product-price">
                  ${price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-gray-500 line-through" data-testid="product-original-price">
                    ${originalPrice!.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {isOutOfStock ? (
                  <Badge variant="destructive" data-testid="stock-status">
                    Out of Stock
                  </Badge>
                ) : product.stock <= 10 ? (
                  <Badge variant="secondary" data-testid="stock-status">
                    Only {product.stock} left in stock
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-green-600 border-green-600" data-testid="stock-status">
                    In Stock
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600" data-testid="product-description">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Quantity:
                </label>
                <div className="flex items-center border rounded-md">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    data-testid="button-decrease-quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center" data-testid="product-quantity">
                    {quantity}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    data-testid="button-increase-quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 bg-nexus-primary hover:bg-blue-800"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart}
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isAddingToCart ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleWishlist}
                  data-testid="button-add-to-wishlist"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Category */}
            {product.category && (
              <>
                <Separator />
                <div>
                  <span className="text-sm text-gray-600">Category: </span>
                  <Link href={`/products?category=${product.category.slug}`}>
                    <Button variant="link" className="p-0 h-auto" data-testid={`link-product-category-${product.category.slug}`}>
                      {product.category.name}
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
