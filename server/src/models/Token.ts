import { Schema, model, Types } from "mongoose";
import TokenTypes from "../enums/tokenType.enum";
import User from "./User";

export type Token = {
  token_type: TokenTypes;
  token_value: string;
  user_id: Types.ObjectId;
};

const tokenSchema = new Schema<Token>({
  token_type: { type: String, required: true, enum: Object.values(TokenTypes) },
  token_value: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, required: true, ref: User },
});

const Token = model<Token>("tokens", tokenSchema);

export default Token;
