import { Schema, model } from "mongoose";

export type UserType = {
  userName: string;
  pass: string;
  firstName?: string;
  lastName?: string;
  token?: string;
};

const useSchema = new Schema<UserType>({
  userName: { type: String, required: true },
  pass: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  token: { type: String },
});

const User = model<UserType>("users", useSchema);

export default User;
