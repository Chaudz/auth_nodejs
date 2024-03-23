import { Schema, model, Types } from "mongoose";
import TokenTypes from "../enums/tokenType.enum";
import User from "./User";

export type Token = {
  tokenType: TokenTypes;
  tokenValue: string;
  userId: Types.ObjectId;
};

const tokenSchema = new Schema<Token>({
  tokenType: { type: String, required: true, enum: Object.values(TokenTypes) },
  tokenValue: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: User },
});

const Token = model<Token>("tokens", tokenSchema);

export default Token;
