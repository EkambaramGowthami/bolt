"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const db_2 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nanoid_1 = require("nanoid");
const authmiddleware_1 = require("./middlewares/authmiddleware");
const SECRETE = (process.env.SECRETE || "defaultsecrete");
function extractExplanationAndRequirements(text) {
    const explanationEnd = text.indexOf("```");
    const explanationText = explanationEnd !== -1 ? text.slice(0, explanationEnd).trim() : text.trim();
    const requirements = [];
    const lines = explanationText.split("\n");
    for (const line of lines) {
        if (line.trim().startsWith("-") ||
            line.trim().startsWith("*") ||
            line.trim().startsWith("•") ||
            line.trim().startsWith("Install") ||
            line.trim().startsWith("Run") ||
            line.trim().startsWith("npm") ||
            line.trim().startsWith("yarn") ||
            line.trim().startsWith("python") ||
            line.trim().startsWith("java")) {
            requirements.push(line.trim());
        }
    }
    const filteredExplanation = lines
        .filter((line) => !requirements.includes(line.trim()))
        .join("\n")
        .trim();
    return {
        explanation: filteredExplanation,
        requirements,
    };
}
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const apiKey = process.env.CLAUD_API_KEY;
if (!apiKey) {
    throw new Error("Missing Google API key in environment variables");
}
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prompt, language } = req.body;
        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({ error: "Prompt is required and must be a string." });
        }
        if (!language || typeof language !== "string") {
            return res.status(400).json({ error: "Language is required and must be a string." });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = yield model.generateContent(prompt);
        const response = yield result.response;
        const text = yield response.text();
        console.log("Generated Text:\n", text);
        const { explanation, requirements } = extractExplanationAndRequirements(text);
        const extensionMap = {
            javascript: "js",
            js: "js",
            jsx: "jsx",
            tsx: "tsx",
            typescript: "ts",
            html: "html",
            css: "css",
            json: "json",
            java: "java",
            python: "py",
            text: "txt",
            react: "jsx",
            vue: "vue",
        };
        const codeBlocks = Array.from(text.matchAll(/```(?:(\w+)\n)?([\s\S]*?)```/g)).map((match, index) => {
            const rawLang = match[1];
            const code = match[2].trim();
            const lang = rawLang ? rawLang.toLowerCase() : "text";
            const extension = extensionMap[lang.toLowerCase()] || "txt";
            return {
                name: `file${index + 1}.${extension}`,
                lang,
                code,
            };
        });
        res.json({ files: codeBlocks, explanation, requirements });
    }
    catch (error) {
        console.error("Error generating template:", error);
        res.status(500).json({ error: "Failed to generate template" });
    }
}));
app.post("/referral/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { referredBy } = req.body;
        const userId = req.params.userId;
        const tokens = yield db_1.tokenModel.findOne({ userId });
        if (!tokens)
            return res.status(404).json({ error: "User token not found" });
        if (!tokens.referralCode) {
            let uniqueCode;
            do {
                uniqueCode = (0, nanoid_1.nanoid)(6);
            } while (yield db_1.tokenModel.findOne({ referralCode: uniqueCode }));
            tokens.referralCode = uniqueCode;
        }
        if (referredBy &&
            referredBy !== tokens.referralCode &&
            referredBy !== tokens.referredBy) {
            const referrerToken = yield db_1.tokenModel.findOne({ referralCode: referredBy });
            if (!referrerToken) {
                return res.status(400).json({ error: "Invalid referral code" });
            }
            tokens.referredBy = referredBy;
            const bonus = 20;
            referrerToken.free += bonus;
            referrerToken.total += bonus;
            yield referrerToken.save();
            yield db_1.transactionModel.create({
                userId: referrerToken.userId,
                type: "referral",
                amount: bonus,
            });
        }
        yield tokens.save();
        return res.status(200).json({
            message: "Referral applied successfully",
            referralCode: tokens.referralCode,
        });
    }
    catch (err) {
        console.error("Referral error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}));
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = db_1.zodvalidationSchema.parse(req.body);
        const existingData = yield db_2.userModel.findOne({ email: validation.email });
        if (existingData) {
            return res.status(400).json({ message: "email already exists" });
        }
        const user = yield db_2.userModel.create(validation);
        const token = jsonwebtoken_1.default.sign({ email: validation.email }, SECRETE);
        const userId = user._id;
        res.status(201).json({ message: "Signup successful", token, userId });
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(400).json({ message: "Signup failed", error });
    }
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validateData = db_1.zodvalidationSchema.parse(req.body);
    const response = yield db_2.userModel.findOne({ email: validateData.email });
    if (response) {
        const token = jsonwebtoken_1.default.sign({ username: validateData.username, email: validateData.email }, SECRETE);
        res.send({
            message: "you have signin",
            token,
            username: response.username
        });
    }
    else {
        res.status(404).send({
            message: "invalide credentials"
        });
    }
}));
app.delete("/signout", authmiddleware_1.authmeddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    yield db_2.userModel.deleteOne({ email: user.email });
    return res.status(200).json({
        message: `User ${user.email} signed out successfully`,
    });
}));
// app.post("/token/init", async (req: any, res: any) => {
//   const { userId } = req.body;
//   if (!userId) {
//     return res.status(400).json({ error: "userId is required" });
//   }
//   try {
//     const existing = await tokenModel.findOne({ userId });
//     if (!existing) {
//       const newModel = new tokenModel({
//         userId,
//         free: 10,
//         total: 10,
//         // referralCode not set here unless you want to assign a unique one
//       });
//       await newModel.save();
//     }
//     res.status(200).json({ message: "Token initialized" });
//   } catch (err: any) {
//     console.error("Error in /token/init:", err);
//     res.status(500).json({ error: "Internal server error", details: err.message });
//   }
// });
app.get("/user/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_2.userModel.findById(req.params.userId);
        res.status(201).json({ user });
    }
    catch (err) {
        res.status(400).json({ error: "user not found" });
    }
}));
app.get("/token/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tokens = yield db_1.tokenModel.findById(req.params.userId);
        res.status(201).json({ tokens });
    }
    catch (e) {
        res.status(404).json({ error: "Token data not found" });
    }
}));
app.get("/transactions/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const txs = yield db_1.transactionModel.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(txs);
    }
    catch (err) {
        res.status(400).json({ error: "error message" });
    }
}));
app.post("/buy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, amount } = req.body;
        const tokens = yield db_1.tokenModel.findOne({ userId });
        if (!tokens) {
            return res.status(404).json({ error: "Token record not found for this user" });
        }
        tokens.paid += amount;
        tokens.total += amount;
        yield tokens.save();
        yield db_1.transactionModel.create({
            userId,
            type: "purchase",
            amount,
        });
        res.status(200).json({ message: "Tokens purchased", tokens });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        }
        else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
}));
app.post("/spend", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, amount } = req.body;
        const tokens = yield db_1.tokenModel.findOne({ userId });
        if (!tokens) {
            return res.status(404).json({ error: "Token record not found" });
        }
        if (tokens.total < amount) {
            return res.status(400).json({ error: "Not enough tokens" });
        }
        let remaining = amount;
        if (tokens.paid >= remaining) {
            tokens.paid -= remaining;
        }
        else {
            remaining -= tokens.paid;
            tokens.paid = 0;
            tokens.free -= remaining;
        }
        tokens.total -= amount;
        yield tokens.save();
        yield db_1.transactionModel.create({
            userId,
            type: "spend",
            amount
        });
        res.status(200).json({ message: "Tokens spent", tokens });
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        }
        else {
            res.status(400).json({ error: "Unknown error occurred" });
        }
    }
}));
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
