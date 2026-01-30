'use client';

import { useState } from 'react';
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
} from '@/components/ui/dialog';
import { Eye, ShoppingBag } from 'lucide-react';
import type { Order, OrderItem } from '@/lib/types';

interface OrderHistoryProps {
  orders: Order[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="default">Paid</Badge>;
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>;
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
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.$id}>
                <TableCell className="font-mono text-sm">
                  {order.$id.substring(0, 12)}...
                </TableCell>
                <TableCell>
                  {new Date(order.$createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.branch?.name}</TableCell>
                <TableCell className="text-right font-medium">
                  KES {parseFloat(order.totalAmount).toFixed(2)}
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order ID: {selectedOrder?.$id}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p>{new Date(selectedOrder.$createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Branch</p>
                  <p>{selectedOrder.branch?.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                </div>
                {selectedOrder.payment?.mpesaReceiptNumber && (
                  <div>
                    <p className="text-muted-foreground">M-Pesa Receipt</p>
                    <p className="font-mono">
                      {selectedOrder.payment.mpesaReceiptNumber}
                    </p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold mb-2">Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items?.map((item: OrderItem) => (
                      <TableRow key={item.$id}>
                        <TableCell>{item.product?.name}</TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          KES {parseFloat(item.unitPrice).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          KES {parseFloat(item.subtotal).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center border-t pt-4">
                <span className="font-bold">Total</span>
                <span className="text-lg font-bold text-primary">
                  KES {parseFloat(selectedOrder.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
