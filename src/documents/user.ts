import { genSalt, hash } from "bcrypt";
import { model, Schema } from "mongoose";

export interface IUserLocal {
  username: string;
  type: "basic" | "admin";
}

export interface IUser extends IUserLocal {
  hashedPassword: string;
}

const userSchema = new Schema<IUser>(
  {
    username: String,
    hashedPassword: String,
    type: String,
  },
  { collection: "users" }
);

export const User = model("user", userSchema);

export async function initializeAdmin() {
  User.updateOne(
    { username: "juhdanad" },
    {
      $set: {
        type: "admin",
        hashedPassword: await hashPassword(process.env.ADMIN_PASSWORD || "asd"),
      },
    },
    { upsert: true }
  ).exec();
}

async function hashPassword(password: string) {
  const salt = await genSalt(10);
  return hash(password, salt);
}
