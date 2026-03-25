import express from "express";
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';

const app = express()
const PORT = 3001 //cp2

// Middleware
app.use(express.json())

// Routes
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/posts', commentRoutes);

app.listen(PORT, () =>{
    console.log("server is running")
})
