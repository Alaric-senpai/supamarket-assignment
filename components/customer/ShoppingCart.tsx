'use client';

import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart-store';
import { toast } from 'sonner';

export function ShoppingCart() {
  const router = useRouter();
  const { items, branchName, updateQuantity, removeItem, clearCart, getTotal, getItemCount } =
    useCartStore();

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId);
    toast.success(`Removed ${productName} from cart`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    router.push('/dashboard/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-4">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground" />
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground">
            Add some products to your cart to get started
          </p>
          <Button onClick={() => router.push('/products')}>
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  const total = getTotal();
  const itemCount = getItemCount();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
        <p className="text-muted-foreground">
          Branch: {branchName} • {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items Table */}
        <div className="lg:col-span-2">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell className="font-medium">
                      {item.productName}
                      <div className="text-xs text-muted-foreground">
                        {item.availableStock} available
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(item.productId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>

                        <Input
                          type="number"
                          min="1"
                          max={item.availableStock}
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(
                              item.productId,
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-16 text-center h-8"
                        />

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(item.productId, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.availableStock}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      KES {item.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      KES {(item.price * item.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleRemoveItem(item.productId, item.productName)
                        }
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => router.push('/products')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            <Button variant="destructive" onClick={handleClearCart}>
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 space-y-4 sticky top-4">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>KES {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>KES 0.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">KES {total.toFixed(2)}</span>
              </div>
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                Payment will be processed via M-Pesa at checkout
              </AlertDescription>
            </Alert>

            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
