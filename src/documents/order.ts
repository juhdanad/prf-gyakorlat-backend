import { model, Schema, Types } from "mongoose";

export interface IOrder {
  username: string;
  products: { name: string; quantity: number; productId: Types.ObjectId }[];
  date: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    username: String,
    products: [
      new Schema({
        name: String,
        quantity: Number,
        productId: Schema.Types.ObjectId,
      }),
    ],
    date: Date,
  },
  { collection: "orders" }
);

export const Order = model("order", orderSchema);
