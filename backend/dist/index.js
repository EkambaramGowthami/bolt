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
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const db_2 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const axios_1 = __importDefault(require("axios"));
const redisClient_1 = __importDefault(require("./redisClient"));
(0, dotenv_1.config)();
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/api/auth/google/callback";
const SECRETE = (process.env.SECRETE || "defaultsecrete");
function extractExplanationAndRequirements(text) {
    const cleanedText = text.replace(/```[\s\S]*?```/g, "").trim();
    const installationIndex = cleanedText.indexOf("To run this application:");
    let explanationText = "";
    let requirementsText = "";
    if (installationIndex !== -1) {
        explanationText = cleanedText.slice(0, installationIndex).trim();
        requirementsText = cleanedText.slice(installationIndex).trim();
    }
    else {
        explanationText = cleanedText;
    }
    return {
        explanation: explanationText,
        requirements: requirementsText,
    };
}
function detectLanguageFromPromptOrFallback(prompt) {
    const knownTechs = ["react", "vue", "angular", "node.js", "express", "next.js", "python", "flask", "django", "java", "c++", "typescript", "javascript"];
    const lowerPrompt = prompt.toLowerCase();
    const foundTech = knownTechs.find(tech => lowerPrompt.includes(tech));
    if (foundTech)
        return foundTech;
    return "unknown";
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const apiKey = process.env.CLAUD_API_KEY;
if (!apiKey) {
    throw new Error("Missing Google API key in environment variables");
}
console.log(apiKey);
// @ts-ignore
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        console.log("template route is hit");
        let { prompt } = req.body;
        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({ error: "Prompt is required and must be a string." });
        }
        const cacheKey = `template:${prompt}`;
        const cacheResponse = yield redisClient_1.default.get(cacheKey);
        if (cacheResponse) {
            console.log("cache hit");
            return res.json(JSON.parse(cacheResponse));
        }
        let langauage = "";
        if (detectLanguageFromPromptOrFallback(prompt) == "unknown") {
            prompt += "html";
            langauage = "html";
        }
        else {
            langauage = detectLanguageFromPromptOrFallback(prompt);
        }
        const openrouterRes = yield fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.CLAUD_API_KEY}`,
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "MyProject",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1-0528:free",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });
        if (!openrouterRes.ok) {
            const errorBody = yield openrouterRes.text();
            console.error("OpenRouter API Error:", errorBody);
            return res.status(500).json({ error: "OpenRouter API call failed" });
        }
        const result = yield openrouterRes.json();
        const text = ((_b = (_a = result.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "";
        console.log(text);
        const codeBlocks = Array.from(text.matchAll(/```(\w+)?\n([\s\S]*?)```/g)).map((match, index) => {
            var _a;
            const groups = match;
            const lang = ((_a = groups[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "text";
            const code = groups[2].trim();
            const extensionMap = {
                vue: "vue",
                javascript: "js",
                typescript: "ts",
                tsx: "tsx",
                jsx: "jsx",
                html: "html",
                css: "css",
                json: "json",
                python: "py",
                text: "txt",
            };
            const extension = extensionMap[lang] || "txt";
            return {
                name: `file${index + 1}.${extension}`,
                lang,
                code,
            };
        });
        const { explanation, requirements } = extractExplanationAndRequirements(text);
        const responsePayload = { files: codeBlocks, explanation, requirements };
        yield redisClient_1.default.setEx(cacheKey, 3600, JSON.stringify(responsePayload));
        res.json(responsePayload);
    }
    catch (error) {
        console.error("Error generating template:", error);
        res.status(500).json({ error: "Failed to generate template" });
    }
}));
// @ts-ignore
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
app.get("/api/auth/google/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const code = req.query.code;
    try {
        const tokenResponse = yield axios_1.default.post("https://oauth2.googleapis.com/token", null, {
            params: {
                code,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                grant_type: "authorization_code"
            },
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        const accessToken = tokenResponse.data.access_token;
        const userResponse = yield axios_1.default.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { "Authorization": `Bearer ${accessToken}` },
        });
        const user = userResponse.data;
        console.log("user data:", user);
        res.redirect(`http://localhost:5173/dashboard?name=${encodeURIComponent(user.name)}`);
    }
    catch (err) {
        const error = err;
        console.error(((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
    }
}));
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
