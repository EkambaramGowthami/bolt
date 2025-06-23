import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
import cors from "cors";
import { tokenModel, transactionModel, zodvalidationSchema } from "./db";
import { userModel } from "./db";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

import { authmeddleware } from "./middlewares/authmiddleware";
import { error } from "console";
const SECRETE = (process.env.SECRETE || "defaultsecrete") as string;
function extractExplanationAndRequirements(text: string) {
  const explanationEnd = text.indexOf("```"); // start of first code block
  const explanationText = explanationEnd !== -1 ? text.slice(0, explanationEnd).trim() : text.trim();

  const requirements: string[] = [];

  // Try to find lines that look like requirements
  const lines = explanationText.split("\n");
  for (const line of lines) {
    if (
      line.trim().startsWith("-") ||
      line.trim().startsWith("*") ||
      line.trim().startsWith("•") ||
      line.trim().startsWith("Install") ||
      line.trim().startsWith("Run") ||
      line.trim().startsWith("npm") ||
      line.trim().startsWith("yarn") ||
      line.trim().startsWith("python") ||
      line.trim().startsWith("java")
    ) {
      requirements.push(line.trim());
    }
  }

  // Remove requirement lines from explanation
  const filteredExplanation = lines
    .filter((line) => !requirements.includes(line.trim()))
    .join("\n")
    .trim();

  return {
    explanation: filteredExplanation,
    requirements,
  };
}


config();

const app = express();
app.use(express.json());
app.use(cors());



const apiKey = process.env.CLAUD_API_KEY;
if (!apiKey) {
  throw new Error("Missing Google API key in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

app.post("/template", async (req:any, res:any) => {
  try {
    const { prompt, language } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required and must be a string." });
    }

    if (!language || typeof language !== "string") {
      return res.status(400).json({ error: "Language is required and must be a string." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    console.log("Generated Text:\n", text);
    const { explanation, requirements } = extractExplanationAndRequirements(text);
    const codeBlocks = Array.from(
      text.matchAll(/```(?:(\w+)\n)?([\s\S]*?)```/g)
    ).map(([, lang, code], index) => ({
      name: `file${index + 1}.${lang || "txt"}`,
      lang: lang || "text",
      code: code.trim(),
    }));

    

    res.json({ files: codeBlocks,explanation,requirements});
  } catch (error) {
    console.error("Error generating template:", error);
    res.status(500).json({ error: "Failed to generate template" });
  }
});




app.post("/referral/:userId", async (req:any, res:any) => {
  try {
    const { referredBy } = req.body;
    const userId = req.params.userId;

    const tokens = await tokenModel.findOne({ userId });
    if (!tokens) return res.status(404).json({ error: "User token not found" });

    // 1. Assign unique referral code if not already assigned
    if (!tokens.referralCode) {
      let uniqueCode;
      do {
        uniqueCode = nanoid(6);
      } while (await tokenModel.findOne({ referralCode: uniqueCode }));
      tokens.referralCode = uniqueCode;
    }

    // 2. Avoid self-referral or duplicate referral
    if (
      referredBy &&
      referredBy !== tokens.referralCode &&
      referredBy !== tokens.referredBy
    ) {
      const referrerToken = await tokenModel.findOne({ referralCode: referredBy });

      if (!referrerToken) {
        return res.status(400).json({ error: "Invalid referral code" });
      }

      tokens.referredBy = referredBy;

      const bonus = 20;
      referrerToken.free += bonus;
      referrerToken.total += bonus;
      await referrerToken.save();

      await transactionModel.create({
        userId: referrerToken.userId,
        type: "referral",
        amount: bonus,
      });
    }

    await tokens.save();

    return res.status(200).json({
      message: "Referral applied successfully",
      referralCode: tokens.referralCode,
    });
  } catch (err) {
    console.error("Referral error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/signup", async (req:any, res:any) => {
  try {
    const validation = zodvalidationSchema.parse(req.body);

    const existingData = await userModel.findOne({ email: validation.email });
    if (existingData) {
      return res.status(400).json({ message: "email already exists" });
    }

    const user = await userModel.create(validation);
    const token = jwt.sign({ email: validation.email }, SECRETE);
    const userId=user._id;
    res.status(201).json({ message: "Signup successful", token, userId });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ message: "Signup failed", error });
  }
});

app.post("/signin",async (req,res)=>{
 
  const validateData=zodvalidationSchema.parse(req.body)
  const response=await userModel.findOne({email:validateData.email});
  if(response){
    const token=jwt.sign({username:validateData.username,email:validateData.email},SECRETE);
    res.send({
      message:"you have signin",
      token,
      username:response.username
    })
  }
  else{
    res.status(404).send({
      message:"invalide credentials"
    })
  }
})
app.delete("/signout",authmeddleware,async (req:any,res:any) =>{
  const user=(req as any).user;
  await userModel.deleteOne({email:user.email});
  return res.status(200).json({
    message: `User ${user.email} signed out successfully`,
  });
})
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

app.get("/user/:userId",async (req,res) =>{
  try{
    const user=await userModel.findById(req.params.userId);
    res.status(201).json({user});
  }
  catch(err){
    res.status(400).json({error:"user not found"});
  }
})
app.get("/token/:userId",async (req,res)=>{
  try{
    const tokens=await tokenModel.findById(req.params.userId);
    res.status(201).json({tokens});
  }
  catch(e){
    res.status(404).json({ error: "Token data not found" });
  }
})
app.get("/transactions/:userId", async (req, res) => {
  try {
    const txs = await transactionModel.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(txs);
  } catch (err) {
    res.status(400).json({ error:"error message"});
  }
});
app.post("/buy", async (req:any, res:any) => {
  try {
    const { userId, amount } = req.body;

    const tokens = await tokenModel.findOne({ userId });

    if (!tokens) {
      return res.status(404).json({ error: "Token record not found for this user" });
    }

    tokens.paid += amount;
    tokens.total += amount;
    await tokens.save();

    await transactionModel.create({
      userId,
      type: "purchase",
      amount,
    });

    res.status(200).json({ message: "Tokens purchased", tokens });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
});

app.post("/spend", async (req: any, res: any) => {
  try {
    const { userId, amount } = req.body;

    const tokens = await tokenModel.findOne({ userId });

    if (!tokens) {
      return res.status(404).json({ error: "Token record not found" });
    }

    
    if (tokens.total < amount) {
      return res.status(400).json({ error: "Not enough tokens" });
    }

    let remaining = amount;

   
    if (tokens.paid >= remaining) {
      tokens.paid -= remaining;
    } else {
      remaining -= tokens.paid;
      tokens.paid = 0;
      tokens.free -= remaining;
    }

    tokens.total -= amount;
    await tokens.save();

    await transactionModel.create({
      userId,
      type: "spend",
      amount
    });

    res.status(200).json({ message: "Tokens spent", tokens });

  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Unknown error occurred" });
    }
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
