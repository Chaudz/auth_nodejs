import { Schema, model } from "mongoose";

export type UserType = {
  userName: string;
  password: string;
  firstName?: string;
  lastName?: string;
  token?: string;
};

const userSchema = new Schema<UserType>({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  token: { type: String },
});

userSchema.index({ userName: 1 });

const User = model<UserType>("users", userSchema);

export default User;
