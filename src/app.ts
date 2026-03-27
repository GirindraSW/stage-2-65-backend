import express from "express";
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import prisma from "../prisma/client";
import router from "./routes/transferPointRoutes";
import stockRoute from "./routes/stockRoutes";
import { updateOrder } from "./controllers/orderControllers";

const app = express()
const PORT = 3001

// Middleware
app.use(express.json())

// Routes
// app.use("/api/products", productRoutes)
// app.use("/api/orders", orderRoutes)
app.use("/api/v1", router);
app.use("/api/v1", stockRoute);

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
