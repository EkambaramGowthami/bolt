import jwt from "jsonwebtoken";
const SECRETE = (process.env.SECRETE || "defaultsecrete") as string;



export const authmeddleware = async (req:any,res:any,next:any) => {
    const authHeader=req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token missing or invalid" });
      }
      const token = authHeader.split(" ")[1];
      try{
        const decode = jwt.verify(token,SECRETE);
        (req as any).user = decode;
        next();
      }
      catch(error){
        return res.status(403).json({ message: "Token is invalid or expired" });
      }

}