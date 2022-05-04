import { model, Schema } from "mongoose";

export interface IUser {
  username: string;
  hashedPassword: string;
}

const userSchema = new Schema<IUser>(
  {
    username: String,
    hashedPassword: String,
  },
  { collection: "users" }
);

export const User = model("user", userSchema);
