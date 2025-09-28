import { Link } from "wouter";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart, clearCart, isLoading } = useCart();
  const { toast } = useToast();

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "Checkout functionality coming soon!",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4" data-testid="empty-cart-title">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8" data-testid="empty-cart-description">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link href="/products">
              <Button size="lg" data-testid="button-continue-shopping">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products">
            <Button variant="ghost" size="sm" data-testid="button-back-to-products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="cart-title">
            Shopping Cart ({items.length} items)
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Items in your cart</h2>
              <Button variant="ghost" size="sm" onClick={handleClearCart} data-testid="button-clear-cart">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </div>

            {items.map((item) => {
              if (!item.product) return null;
              
              const price = parseFloat(item.product.price);
              const itemTotal = price * item.quantity;

              return (
                <Card key={item.id} data-testid={`cart-item-${item.productId}`}>
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <img 
                          className="w-20 h-20 object-cover rounded-lg" 
                          src={item.product.imageUrl}
                          alt={item.product.name}
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900" data-testid={`cart-item-name-${item.productId}`}>
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1" data-testid={`cart-item-description-${item.productId}`}>
                              {item.product.description}
                            </p>
                            <p className="text-lg font-semibold text-gray-900 mt-2" data-testid={`cart-item-price-${item.productId}`}>
                              ${price.toFixed(2)} each
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900" data-testid={`cart-item-total-${item.productId}`}>
                              ${itemTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.productId!, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              data-testid={`button-decrease-${item.productId}`}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-12 text-center" data-testid={`cart-item-quantity-${item.productId}`}>
                              {item.quantity}
                            </span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.productId!, item.quantity + 1)}
                              data-testid={`button-increase-${item.productId}`}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveItem(item.productId!)}
                            data-testid={`button-remove-${item.productId}`}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span data-testid="cart-subtotal">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span data-testid="cart-total">${total.toFixed(2)}</span>
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full bg-nexus-primary hover:bg-blue-800"
                  onClick={handleCheckout}
                  data-testid="button-checkout"
                >
                  Proceed to Checkout
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  Shipping and taxes calculated at checkout
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
