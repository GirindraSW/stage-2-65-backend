import cors from "cors";

const corsMiddleware = cors({
  origin: (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",") //["http://localhost:5173", "https://contoh.com"] multi domain support
    .map((o) => o.trim()),
  credentials: true,
});

export default corsMiddleware;