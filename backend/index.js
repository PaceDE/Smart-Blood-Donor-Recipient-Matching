import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { conn } from "./db.js"; 
import { router } from "./routes/routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


conn()
  .then(()=>{
    console.log("Connected to MongoDB");
    
    app.use("/api", router);

    app.get("/",(req,res)=>{
      res.send('Hello World!')
    });

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

  })
  .catch((err)=>{
    console.error("DB connection failed:", err.message);
  });