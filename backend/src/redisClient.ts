import { createClient } from "redis";
const redisClient = createClient({
    url:process.env.REDIS_URL || "redis://localhost:6379"
});

redisClient.on("error",(err)=>console.log("Redis Client Error",err));
redisClient.on("connect",()=>console.log("Redis Client Connected"));
(async ()=>{
    await redisClient.connect();
})();
export default redisClient;
// testRedis.ts
// import { createClient } from "redis";
// import { config } from "dotenv";
// config();

// const redisClient = createClient({ url: process.env.REDIS_URL });
// redisClient.on("connect", () => console.log("✅ Connected to Redis Cloud"));
// redisClient.on("error", (err) => console.error("❌ Redis Error:", err));

// (async () => {
//   await redisClient.connect();
//   await redisClient.set("testkey", "HelloRedis");
//   const val = await redisClient.get("testkey");
//   console.log("Fetched:", val);
//   await redisClient.quit();
// })();
// export default redisClient;