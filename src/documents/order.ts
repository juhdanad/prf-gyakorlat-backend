import { model, Schema, Types } from "mongoose";

export interface IOrder {
  username: string;
  products: {
    name: string;
    quantity: number;
    subtotal: number;
    productId: Types.ObjectId;
  }[];
  total: number;
  date: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    username: String,
    products: [
      new Schema({
        name: String,
        quantity: Number,
        subtotal: Number,
        productId: Schema.Types.ObjectId,
      }),
    ],
    total: Number,
    date: Date,
  },
  { collection: "orders" }
);

export const Order = model("order", orderSchema);
