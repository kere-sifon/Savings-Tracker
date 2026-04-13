import { Schema, type Model, type Types } from "mongoose";
import { getSavingsConnection } from "@/lib/db-savings";

export type UserRole = "admin" | "user";

export type UserDoc = {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  name?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserDoc>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    name: { type: String, trim: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true },
);

const conn = getSavingsConnection();
export const User: Model<UserDoc> =
  (conn.models.User as Model<UserDoc>) ||
  conn.model<UserDoc>("User", userSchema);

export async function countAdmins(): Promise<number> {
  return User.countDocuments({ role: "admin" });
}
