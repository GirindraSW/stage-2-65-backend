import { Request, Response } from "express";
import { Product } from "../models/Product";

// Dummy Data
let products: Product[] = [
  { id: 1, name: "Laptop", price: 10000000, stock: 5 },
  { id: 2, name: "Mouse", price: 150000, stock: 20 },
];

// Helper parseId
const parseIdParam = (idParam: string | string[] | undefined): number => {
  const value = Array.isArray(idParam) ? idParam[0] : idParam;
  return Number(value); // diperlukan karena tidak selalu dalam bentuk string
};

// GET All Product
export const getAllProducts = (req: Request, res: Response) => {
  res.json(products);
};

// GET Product by Id
export const getProductById = (req: Request, res: Response) => {
  const id = parseIdParam(req.params.id); //parseInt(error) itu mengubah "123" menjadi 123
  const product = products.find((p) => p.id === id); //mengecek apaka p.id sama dengan id
  if (!product)
    return res.status(404).json({ error: "Produk tidak ditemukan" }); // 404 = not found
  res.json(product);
};

// POST Create Product
export const createProdcut = (req: Request, res: Response) => {
  const { name, price, stock } = req.body;
  if (!name || !price || !stock) {
    return res.status(400).json({ error: "Semua field wajib diisi" }); // 400 = bad request
  }
  const newProduct: Product = {
    id: products.length + 1,
    name,
    price,
    stock
  };
  products.push(newProduct);
  res.status(201).json(newProduct); // 201 = created
};

// PUT Update product
export const updateProduct= (req:Request, res: Response) => {
  const id = parseIdParam(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: "Produk tidak ditemukan"}); // 404 = not found

  const {name, price, stock} = req.body;
  products[index] = {...products[index], name, price, stock};
  res.json(products[index]);
};

// DELETE Product
export const deleteProduct = (req:Request, res: Response) => {
  const id = parseIdParam(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if(index === -1) return res.status(404).json({error:"Produk tidak ditemukan"}); // 404 = not found

  products.splice(index, 1);
  res.json({message:"Produk berhasi dihapus"});
};