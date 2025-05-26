import express from "express";
import session from 'express-session';
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import dauthRoutes from './routes/dauthRoute.js';

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

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // set to true only if HTTPS (production)
    httpOnly: true,
    maxAge: 1000 * 60 * 15,
  }
}));

app.use('/auth/dauth', dauthRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

