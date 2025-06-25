import { timeStamp } from "console";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
// const mongoUrl = (process.env.MONGOOSE_URL) as string;

// if (!mongoUrl) {
//   throw new Error("MONGODB connection string is missing in .env");
// }

mongoose.connect(process.env.MONGOOSE_URL as string);
import { z } from "zod";

export const zodvalidationSchema = z.object({
    username:z.string().min(3,"username must be atleast 3 characters"),
    email:z.string().email("Invalid email formate"),
    password:z.string().min(6,"password must be atleast 6 characters"),
})
const userSchema=new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
  });
export const userModel=mongoose.model("user",userSchema);

const tokenSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true,unique:true},
    free:{type:Number,default:0},
    paid:{type:Number,default:0},
    total:{type:Number,default:0},
    referralCode: { type: String, unique: true,sparse: true},
    referredBy: { type: String, default: null },
    
},{timestamps:true});

export const tokenModel= mongoose.model("token",tokenSchema);
const transactionSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user" , required:true},
    type:{type:String,enum:["purchase","referral","spend"],required:true},
    amount:{type:Number,required:true},
    date:{type:Date,default:Date.now}
},{timestamps:true});
export const transactionModel=mongoose.model("transaction",transactionSchema);