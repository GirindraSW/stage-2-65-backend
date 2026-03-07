import express from "express";
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';

const app = express()
const PORT = 3001

// Middleware
app.use(express.json())

// Routes
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)

app.listen(PORT, () =>{
    console.log("server is running")
})