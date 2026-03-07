import { Request, Response } from "express";
import { Order, OrderWithProduct } from "../models/Order";
import { Product } from "../models/Product";

// Dummy data
let orders: Order[] = [];
let products: Product[] = [
  { id: 1, name: "Laptop", price: 10000000, stock: 5 },
  { id: 2, name: "Mouse", price: 150000, stock: 20 },
];

// Helper parseId
const parseIdParam = (idParam: string | string[] | undefined): number => {
  const value = Array.isArray(idParam) ? idParam[0] : idParam;
  return Number(value); // diperlukan karena tidak selalu dalam bentuk string
};

// GET All Orders (dengan info produk)
export const getAllOrders = (req: Request, res: Response) => {
  const ordersWithProduct: OrderWithProduct[] = orders.map(order => {
    const product = products.find(p => p.id === order.productId);
    if (!product) return { ...order, product: { id: 0, name: "Unknown", price: 0, stock: 0 } };
    return { ...order, product };
  });
  res.json(ordersWithProduct);
};

// Get Order by ID
export const getOrderById = (req:Request, res:Response) => {
    const id = parseIdParam(req.params.id);
    const order = orders.find(o => o.id === id);
    if (!order) return res.status(404).json({error:"Order tidak ditemukan"});

    const product = products.find(p => p.id === order.productId);
    const orderWithProduct = {...order, product: product || {id:0, name: "Unknown", price:0, stock:0}};
    res.json(orderWithProduct);
};

// POST Create Order
export const createOrder = (req: Request, res: Response) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res.status(400).json({ error: "Product ID dan quantity wajib diisi" });
  }

  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: "Produk tidak ditemukan" });

  if (product.stock < quantity) {
    return res.status(400).json({ error: "Stok tidak mencukupi" });
  }

  const totalPrice = product.price * quantity;
  const newOrder: Order = {
    id: orders.length + 1,
    productId,
    quantity,
    totalPrice,
    status: 'pending'
  };

  // Kurangi stok produk
  product.stock -= quantity;

  orders.push(newOrder);
  res.status(201).json(newOrder);
};

// PUT Update Order (misalnya ubah status)
export const updateOrder = (req: Request, res: Response) => {
  const id = parseIdParam(req.params.id);
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return res.status(404).json({ error: "Order tidak ditemukan" });

  const { status } = req.body;
  if (!status || !['pending', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: "Status tidak valid" });
  }

  orders[index].status = status;
  res.json(orders[index]);
};

// DELETE Order
export const deleteOrder = (req: Request, res: Response) => {
  const id = parseIdParam(req.params.id);
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return res.status(404).json({ error: "Order tidak ditemukan" });

  // Kembalikan stok ke produk
  const order = orders[index];
  const product = products.find(p => p.id === order.productId);
  if (product) product.stock += order.quantity;

  orders.splice(index, 1);
  res.json({ message: "Order berhasil dihapus" });
};