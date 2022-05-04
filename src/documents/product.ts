import { model, Schema } from "mongoose";

export interface IProduct {
  displayName: string;
  name: string;
  description: string;
  imageURL: string;
  quantityLeft: number;
  price: number;
}

const productSchema = new Schema<IProduct>(
  {
    displayName: String,
    name: String,
    description: String,
    imageURL: String,
    quantityLeft: Number,
    price: Number,
  },
  { collection: "products" }
);

export const Product = model("product", productSchema);
