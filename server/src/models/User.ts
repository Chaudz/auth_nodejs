import { Schema, model } from "mongoose";

export type UserType = {
  userName: string;
  pass: string;
  firstName?: string;
  lastName?: string;
  token?: string;
};

const userSchema = new Schema<UserType>({
  userName: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  token: { type: String },
});

userSchema.index({ userName: 1 });

const User = model<UserType>("users", userSchema);

export default User;
