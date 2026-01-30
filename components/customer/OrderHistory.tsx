'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Eye, ShoppingBag, Trash2, Loader2 } from 'lucide-react';
import type { OrderWithRelations, OrderItemWithRelations } from '@/lib/types';
import { getOrderById, deleteOrder } from '@/actions/orders.actions';
import { toast } from 'sonner';

interface OrderHistoryProps {
  orders: OrderWithRelations[];
}

export function OrderHistory({ orders: initialOrders }: OrderHistoryProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithRelations[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithRelations | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update local orders when prop changes
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const handleViewDetails = async (order: OrderWithRelations) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
    
    // If items are not loaded, fetch full details
    if (!order.items || order.items.length === 0) {
      setIsLoadingDetails(true);
      try {
        const fullOrder = await getOrderById(order.$id);
        if (fullOrder) {
          setSelectedOrder(fullOrder);
          // Update the list too if we want to cache it
          setOrders(prev => prev.map(o => o.$id === order.$id ? fullOrder : o));
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to load order details');
      } finally {
        setIsLoadingDetails(false);
      }
    }
  };

  const handleResume = (orderId: string) => {
    router.push(`/dashboard/payment?orderId=${orderId}`);
  };

  const handleDelete = async () => {
    if (!orderToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteOrder(orderToDelete, orders.find(o => o.$id === orderToDelete)?.userId || '');
      if (result.success) {
        toast.success('Order deleted successfully');
        setOrders(prev => prev.filter(o => o.$id !== orderToDelete));
        if (selectedOrder?.$id === orderToDelete) {
          setIsDialogOpen(false);
          setSelectedOrder(null);
        }
      } else {
        toast.error(result.message || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
      setOrderToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700">Paid</Badge>;
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">Pending</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-muted-foreground">
          Your order history will appear here once you make a purchase
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-[150px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.$id}>
                <TableCell className="font-mono text-xs">
                  {order.$id.substring(0, 12)}...
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(order.$createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-sm">{order.branch?.name}</TableCell>
                <TableCell className="text-right font-medium">
                  KES {parseFloat(order.totalAmount).toFixed(2)}
                </TableCell>
                <TableCell className="text-center">{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="View Details"
                      onClick={() => handleViewDetails(order)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {(order.status === 'PENDING' || order.status === 'FAILED') && (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Resume Payment"
                        className="text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => handleResume(order.$id)}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </Button>
                    )}
                    {(order.status === 'PENDING' || order.status === 'FAILED' || order.status === 'CANCELLED') && (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete Order"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setOrderToDelete(order.$id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription className="font-mono text-xs">
              ID: {selectedOrder?.$id}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-6 text-sm border-b pb-4">
                <div>
                  <p className="text-muted-foreground mb-1">Date</p>
                  <p className="font-medium">{new Date(selectedOrder.$createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Branch</p>
                  <p className="font-medium">{selectedOrder.branch?.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                {selectedOrder.payment?.mpesaReceiptNumber && (
                  <div>
                    <p className="text-muted-foreground mb-1">M-Pesa Receipt</p>
                    <p className="font-mono font-medium">
                      {selectedOrder.payment.mpesaReceiptNumber}
                    </p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  Products
                  {isLoadingDetails && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
                </h4>
                {isLoadingDetails ? (
                   <div className="py-8 flex justify-center">
                     <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                   </div>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="h-9">Product</TableHead>
                          <TableHead className="h-9 text-center">Qty</TableHead>
                          <TableHead className="h-9 text-right">Price</TableHead>
                          <TableHead className="h-9 text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items?.map((item: any) => (
                          <TableRow key={item.$id} className="h-9">
                            <TableCell className="py-2">{item.product?.name || 'Unknown Product'}</TableCell>
                            <TableCell className="py-2 text-center">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="py-2 text-right text-xs">
                              KES {parseFloat(item.unitPrice).toFixed(2)}
                            </TableCell>
                            <TableCell className="py-2 text-right font-medium">
                              KES {parseFloat(item.subtotal).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {/* Total and Actions */}
              <div className="flex flex-col gap-4 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total Amount</span>
                  <span className="text-xl font-bold text-primary">
                    KES {parseFloat(selectedOrder.totalAmount).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-end gap-3 mt-2">
                  {(selectedOrder.status === 'PENDING' || selectedOrder.status === 'FAILED') && (
                    <Button 
                      className="flex-1 sm:flex-none" 
                      onClick={() => handleResume(selectedOrder.$id)}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Resume Payment
                    </Button>
                  )}
                  {(selectedOrder.status === 'PENDING' || selectedOrder.status === 'FAILED' || selectedOrder.status === 'CANCELLED') && (
                    <Button 
                      variant="outline" 
                      className="flex-1 sm:flex-none text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setOrderToDelete(selectedOrder.$id);
                        // Don't close details dialog yet, alert dialog will overlay
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Order
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this order and all associated records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : 'Delete Order'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

