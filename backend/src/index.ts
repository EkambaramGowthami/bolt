import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { tokenModel, transactionModel, zodvalidationSchema } from "./db";
import { userModel } from "./db";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

import { authmeddleware } from "./middlewares/authmiddleware";

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
function detectLanguageFromPromptOrFallback(prompt: string, deepseekCode: string): string {
  const knownTechs = ["react", "vue", "angular", "node.js", "express", "next.js", "python", "flask", "django", "java", "c++", "typescript", "javascript"];
  const lowerPrompt = prompt.toLowerCase();
  const foundTech = knownTechs.find(tech => lowerPrompt.includes(tech));
  if (foundTech) return foundTech;
  if (deepseekCode.includes("import React")) return "react";
  if (deepseekCode.includes("from flask import") || deepseekCode.includes("def") && deepseekCode.includes("app.route")) return "flask";
  if (deepseekCode.includes("class") && deepseekCode.includes("public static void main")) return "java";
  if (deepseekCode.includes("#include") || deepseekCode.includes("int main()")) return "c++";
  if (deepseekCode.includes("def") && deepseekCode.includes("print")) return "python";
  if (deepseekCode.includes("const express = require") || deepseekCode.includes("app.listen")) return "node.js";
  if (deepseekCode.includes("function") || deepseekCode.includes("console.log")) return "javascript";

  return "unknown";
}



config();

const app = express();
app.use(express.json());
app.use(cors());



const apiKey = process.env.CLAUD_API_KEY;
if (!apiKey) {
  throw new Error("Missing Google API key in environment variables");
}


app.post("/template", async (req: any, res: any) => {
  try {
    console.log("template route is hit");
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required and must be a string." });
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
    const lang = detectLanguageFromPromptOrFallback(prompt, text);
    const codeBlocks = Array.from(
      text.matchAll(/```(\w+)?\n([\s\S]*?)```/g)
    ).map((match) => {
      const groups = match as RegExpMatchArray;
      const lang = groups[1]?.toLowerCase() || "text";
      const code = groups[2].trim();

      const extensionMap: Record<string, string> = {
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
      const matching = code.match(/function\s+(\w+)\s*\(|const\s+(\w+)\s*=\s*\(/);
      const componentName = matching?.[1] || matching?.[2];

      return {
        name: `${componentName}.${extension}`,
        lang,
        code,
      };
    });
    const { explanation, requirements } = extractExplanationAndRequirements(text);
    res.json({ files: codeBlocks, explanation, requirements });
  } catch (error) {
    console.error("Error generating template:", error);
    res.status(500).json({ error: "Failed to generate template" });
  }
});




app.post("/referral/:userId", async (req: any, res: any) => {
  try {
    const { referredBy } = req.body;
    const userId = req.params.userId;

    const tokens = await tokenModel.findOne({ userId });
    if (!tokens) return res.status(404).json({ error: "User token not found" });


    if (!tokens.referralCode) {
      let uniqueCode;
      do {
        uniqueCode = nanoid(6);
      } while (await tokenModel.findOne({ referralCode: uniqueCode }));
      tokens.referralCode = uniqueCode;
    }


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

app.post("/signup", async (req: any, res: any) => {
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

app.post("/signin", async (req, res) => {

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
app.delete("/signout", authmeddleware, async (req: any, res: any) => {
  const user = (req as any).user;
  await userModel.deleteOne({ email: user.email });
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

app.get("/user/:userId", async (req, res) => {
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
app.get("/transactions/:userId", async (req, res) => {
  try {
    const txs = await transactionModel.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(txs);
  } catch (err) {
    res.status(400).json({ error: "error message" });
  }
});
app.post("/buy", async (req: any, res: any) => {
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
