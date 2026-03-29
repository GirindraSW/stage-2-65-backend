import express from "express";
import router from "./routes/transferPointRoutes";
import stockRoute from "./routes/stockRoutes";
import authRoute from "./routes/authRoutes";

const app = express()
const PORT = 3000

// Middleware
app.use(express.json())

// Routes
app.use("/", router);
app.use("/", stockRoute);
app.use("/auth/", authRoute);

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
