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

export async function initializeUsers() {
  const users = JSON.parse(process.env.USERS_TO_CREATE || "[]");
  if (!Array.isArray(users)) return;
  for (const user of users) {
    User.updateOne(
      { username: user.username },
      {
        $set: {
          type: user.type,
          hashedPassword: await hashPassword(user.password),
        },
      },
      { upsert: true }
    ).exec();
  }
}

async function hashPassword(password: string) {
  const salt = await genSalt(10);
  return hash(password, salt);
}
