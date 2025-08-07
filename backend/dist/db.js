"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionModel = exports.tokenModel = exports.userModel = exports.zodvalidationSchema = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(process.env.MONGOOSE_URL);
const zod_1 = require("zod");
exports.zodvalidationSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "username must be atleast 3 characters"),
    email: zod_1.z.string().email("Invalid email formate"),
    password: zod_1.z.string().min(6, "password must be atleast 6 characters"),
});
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true },
    googleId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
exports.userModel = mongoose_1.default.model("user", userSchema);
const tokenSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "user", required: true, unique: true },
    free: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: String, default: null },
}, { timestamps: true });
exports.tokenModel = mongoose_1.default.model("token", tokenSchema);
const transactionSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "user", required: true },
    type: { type: String, enum: ["purchase", "referral", "spend"], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });
exports.transactionModel = mongoose_1.default.model("transaction", transactionSchema);
