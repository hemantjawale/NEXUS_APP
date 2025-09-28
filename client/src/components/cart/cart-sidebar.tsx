import { Minus, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, total, updateQuantity, removeFromCart, isLoading } = useCart();
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

  const handleCheckout = () => {
    // TODO: Implement checkout functionality
    toast({
      title: "Checkout",
      description: "Checkout functionality coming soon!",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Shopping Cart
            <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-cart">
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-6">
            {isLoading ? (
              <div className="text-center py-8" data-testid="cart-loading">
                <p className="text-gray-500">Loading cart...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-8" data-testid="cart-empty">
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-2">Add some products to get started!</p>
              </div>
            ) : (
              <div className="space-y-6" data-testid="cart-items">
                {items.map((item) => {
                  if (!item.product) return null;
                  
                  const price = parseFloat(item.product.price);
                  const itemTotal = price * item.quantity;

                  return (
                    <div key={item.id} className="flex space-x-4" data-testid={`cart-item-${item.productId}`}>
                      <div className="flex-shrink-0">
                        <img 
                          className="w-16 h-16 object-cover rounded-lg" 
                          src={item.product.imageUrl}
                          alt={item.product.name}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900" data-testid={`cart-item-name-${item.productId}`}>
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1" data-testid={`cart-item-price-${item.productId}`}>
                          ${price.toFixed(2)} each
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => handleUpdateQuantity(item.productId!, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              data-testid={`button-decrease-${item.productId}`}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center" data-testid={`cart-item-quantity-${item.productId}`}>
                              {item.quantity}
                            </span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => handleUpdateQuantity(item.productId!, item.quantity + 1)}
                              data-testid={`button-increase-${item.productId}`}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium" data-testid={`cart-item-total-${item.productId}`}>
                              ${itemTotal.toFixed(2)}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveItem(item.productId!)}
                              data-testid={`button-remove-${item.productId}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t pt-6">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Subtotal</p>
                <p data-testid="cart-subtotal">${total.toFixed(2)}</p>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="space-y-4">
                <Button 
                  className="w-full bg-nexus-primary text-white hover:bg-blue-800"
                  onClick={handleCheckout}
                  data-testid="button-checkout"
                >
                  Checkout
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onClose}
                  data-testid="button-continue-shopping"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
