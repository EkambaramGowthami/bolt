import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { tokenModel, zodvalidationSchema } from "./db";
import { userModel } from "./db";
import jwt from "jsonwebtoken";
import { Response,Request } from "express";
import { authmeddleware } from "./middlewares/authmiddleware";
import axios from "axios";
import { Console } from "console";
import redisClient from "./redisClient";
config();
const CLIENT_ID=process.env.CLIENT_ID!;
const CLIENT_SECRET=process.env.CLIENT_SECRET!;
const REDIRECT_URI="https://bolt-backend-o1vr.onrender.com/api/auth/google/callback";
const SECRETE = (process.env.SECRETE || "defaultsecrete") as string;
function extractExplanationAndRequirements(text: string) {
  const cleanedText = text.replace(/```[\s\S]*?```/g, "").trim();
  const installationIndex = cleanedText.indexOf("To run this application:");
  let explanationText = "";
  let requirementsText = "";

  if (installationIndex !== -1) {
    explanationText = cleanedText.slice(0, installationIndex).trim();
    requirementsText = cleanedText.slice(installationIndex).trim();
  } else {
    explanationText = cleanedText;
  }

  return {
    explanation: explanationText,
    requirements: requirementsText,
  };
}
function detectLanguageFromPromptOrFallback(prompt: string): string {
  const knownTechs = ["react", "vue", "angular", "node.js", "express", "next.js", "python", "flask", "django", "java", "c++", "typescript", "javascript"];
  const lowerPrompt = prompt.toLowerCase();
  const foundTech = knownTechs.find(tech => lowerPrompt.includes(tech));
  if (foundTech) return foundTech;

  return "unknown";
}



const app = express();
app.use(express.json());
app.use(cors());
const apiKey = process.env.CLAUD_API_KEY;
if (!apiKey) {
  throw new Error("Missing Google API key in environment variables");
}
console.log(apiKey);

// @ts-ignore
app.post("/template", async (req: Request, res: Response) => {
  try {
    console.log("template route is hit");
    let { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required and must be a string." });
    }
    const cacheKey = `template:${prompt}`;
    const cacheResponse = await redisClient.get(cacheKey);
    if(cacheResponse){
      console.log("cache hit");
      return res.json(JSON.parse(cacheResponse));
    }

    let langauage = "";
    if(detectLanguageFromPromptOrFallback(prompt) == "unknown"){
      prompt += "html";
      langauage="html";

    }
    else{
      langauage=detectLanguageFromPromptOrFallback(prompt);
    }
    const openrouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
      const errorBody = await openrouterRes.text();
      console.error("OpenRouter API Error:", errorBody);
      return res.status(500).json({ error: "OpenRouter API call failed" });
    }

    const result = await openrouterRes.json();
    const text = result.choices[0]?.message?.content || "";
    console.log(text);
    
    
    const codeBlocks = Array.from(
      text.matchAll(/```(\w+)?\n([\s\S]*?)```/g)
    ).map((match,index) => {
      const groups = match as RegExpMatchArray;
      const lang = groups[1]?.toLowerCase() || "text";
      const code = groups[2].trim();

      const extensionMap: Record<string, string> = {
        vue:"vue",
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
        name: `file${index+1}.${extension}`,
        lang,
        code,
      };
    });
    const { explanation, requirements } = extractExplanationAndRequirements(text);
    const responsePayload = {files:codeBlocks,explanation,requirements};
    await redisClient.setEx(cacheKey,3600,JSON.stringify(responsePayload));
    res.json(responsePayload);
  } catch (error) {
    console.error("Error generating template:", error);
    res.status(500).json({ error: "Failed to generate template" });
  }
});

// @ts-ignore
app.post("/signup", async (req: Request, res: Response) => {
  try {
    const validation = zodvalidationSchema.parse(req.body);

    const existingData = await userModel.findOne({ email: validation.email });
    if (existingData) {
      return res.status(400).json({ message: "email already exists" });
    }

    const user = await userModel.create(validation);
    const token = jwt.sign({ email: validation.email }, SECRETE);
    const userId = user._id;
    res.status(201).json({ message: "Signup successful", token, userId });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ message: "Signup failed", error });
  }
});

app.post("/signin", async (req: Request, res: Response) => {

  const validateData = zodvalidationSchema.parse(req.body)
  const response = await userModel.findOne({ email: validateData.email });
  if (response) {
    const token = jwt.sign({ username: validateData.username, email: validateData.email }, SECRETE);
    res.send({
      message: "you have signin",
      token,
      username: response.username
    })
  }
  else {
    res.status(404).send({
      message: "invalide credentials"
    })
  }
})
app.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const user = await userModel.findById(req.params.userId);
    res.status(201).json({ user });
  }
  catch (err) {
    res.status(400).json({ error: "user not found" });
  }
})
app.get("/token/:userId", async (req, res) => {
  try {
    const tokens = await tokenModel.findById(req.params.userId);
    res.status(201).json({ tokens });
  }
  catch (e) {
    res.status(404).json({ error: "Token data not found" });
  }
})

app.get("/api/auth/google/callback",async (req: Request, res: Response)=>{
  const code=req.query.code;
  try{
    const tokenResponse = await axios.post("https://oauth2.googleapis.com/token",null,{
      params:{
        code,
        client_id:CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri:REDIRECT_URI,
        grant_type:"authorization_code"
      },
      headers:{"Content-Type":"application/x-www-form-urlencoded"},
    });
    const accessToken=tokenResponse.data.access_token;
    const userResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo",{
      headers:{"Authorization":`Bearer ${accessToken}`},
    });
    const user=userResponse.data;
    console.log("user data:",user);
    res.redirect(`http://localhost:5173/dashboard?name=${encodeURIComponent(user.name)}`);

  }
  catch(err){
    const error = err as any;
    console.error(error.response?.data || error.message);
    
    
  }
})

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
