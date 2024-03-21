"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const useSchema = new mongoose_1.Schema({
    userName: { type: String, required: true },
    pass: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    token: { type: String },
});
const User = (0, mongoose_1.model)("users", useSchema);
exports.default = User;
