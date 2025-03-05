import { UUID } from "crypto";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  owner_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateProduct {
    name: string;
    description?: string;
    price: number;
    stock_quantity: number;
    owner_id: UUID;
} 