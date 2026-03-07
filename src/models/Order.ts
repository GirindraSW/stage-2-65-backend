import { Product } from "./Product";

export interface Order {
    id: number;
    productId: number; // Relasi ke produknya
    quantity: number;
    totalPrice: number;
    status: 'pending' | 'completed' | 'cancelled'; //Update ??
}

// Relasi
export interface OrderWithProduct {
    id: number;
    product: Product;
    quantity: number;
    totalPrice: number;
    status: 'pending' | 'completed' | 'cancelled';
}