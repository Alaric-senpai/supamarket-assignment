// Shopping Cart Store using Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem } from '../types';

interface CartStore extends Cart {
    // Actions
    setBranch: (branchId: string, branchName: string) => void;
    addItem: (item: CartItem) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            // Initial state
            branchId: null,
            branchName: null,
            items: [],

            // Set selected branch
            setBranch: (branchId, branchName) =>
                set({
                    branchId,
                    branchName,
                    items: [], // Clear cart when changing branches
                }),

            // Add item to cart or update quantity if exists
            addItem: (item) =>
                set((state) => {
                    const existingItemIndex = state.items.findIndex(
                        (i) => i.productId === item.productId
                    );

                    if (existingItemIndex >= 0) {
                        // Item exists, update quantity
                        const newItems = [...state.items];
                        const currentQty = newItems[existingItemIndex].quantity;
                        const newQty = currentQty + item.quantity;

                        // Check if new quantity exceeds available stock
                        if (newQty > item.availableStock) {
                            console.warn(
                                `Cannot add more ${item.productName}. Only ${item.availableStock} available.`
                            );
                            return state; // Don't update if exceeds stock
                        }

                        newItems[existingItemIndex] = {
                            ...newItems[existingItemIndex],
                            quantity: newQty,
                        };

                        return { items: newItems };
                    } else {
                        // New item, add to cart
                        if (item.quantity > item.availableStock) {
                            console.warn(
                                `Cannot add ${item.productName}. Only ${item.availableStock} available.`
                            );
                            return state;
                        }

                        return {
                            items: [...state.items, item],
                        };
                    }
                }),

            // Remove item from cart
            removeItem: (productId) =>
                set((state) => ({
                    items: state.items.filter((item) => item.productId !== productId),
                })),

            // Update item quantity
            updateQuantity: (productId, quantity) =>
                set((state) => {
                    if (quantity <= 0) {
                        // Remove item if quantity is 0 or negative
                        return {
                            items: state.items.filter((item) => item.productId !== productId),
                        };
                    }

                    const item = state.items.find((i) => i.productId === productId);
                    if (!item) return state;

                    // Check if quantity exceeds available stock
                    if (quantity > item.availableStock) {
                        console.warn(
                            `Cannot set quantity to ${quantity}. Only ${item.availableStock} available.`
                        );
                        return state;
                    }

                    return {
                        items: state.items.map((item) =>
                            item.productId === productId ? { ...item, quantity } : item
                        ),
                    };
                }),

            // Clear entire cart
            clearCart: () =>
                set({
                    branchId: null,
                    branchName: null,
                    items: [],
                }),

            // Calculate total amount
            getTotal: () => {
                const state = get();
                return state.items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },

            // Get total item count
            getItemCount: () => {
                const state = get();
                return state.items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'supermarket-cart', // localStorage key
            partialize: (state) => ({
                branchId: state.branchId,
                branchName: state.branchName,
                items: state.items,
            }),
        }
    )
);
