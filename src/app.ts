import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import path from "path";
import router from "./routes/transferPointRoutes";
import stockRoute from "./routes/stockRoutes";
import authRoute from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import supplierRoutes from "./routes/supplierRoutes";
import uploadRoutes from "./routes/uploadRoutes";

const app = express()
const PORT = 3000

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || "http://localhost:5173")
      .split(",")
      .map((o) => o.trim()),
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, //15 menit
    max: 100, // max 100 req
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/", router);
app.use("/", stockRoute);
app.use("/products", productRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/auth/", authRoute);
app.use("/", uploadRoutes);

// global error handler (place after routes)
app.use((err:any, req:any, res:any, next:any)=>{
    const safeError = typeof err === "object" ? JSON.stringify(err) : String(err);
    console.error("Error detail:", safeError);
    res.status(err?.status || 500).json({error: err?.message || "internal server error"})
    // res.status(400).json({error:"datainternal server error"}) secara custom
});

app.listen(PORT, () =>{
    console.log("server is running")
})
