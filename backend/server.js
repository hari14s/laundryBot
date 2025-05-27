import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import dauthRoutes from './routes/dauthRoute.js';
import serviceRoutes from './routes/serviceRoute.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';


dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.set('trust proxy', 1);

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true
}));

app.use('/auth/dauth', dauthRoutes);
app.use('/services', serviceRoutes);
app.use('/user', userRoutes);
app.use('/order', orderRoutes); 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

