import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { conn } from "./db.js"; 
import { router } from "./routes/routes.js";
import {createServer} from 'http';
import { WebSocketServer } from "ws";
import { setupWebSocket } from "./websocket/socket.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


const server= createServer(app);
setupWebSocket(server);
conn()
  .then(()=>{
    console.log("Connected to MongoDB");
    
    app.use("/api", router);

    app.get("/",(req,res)=>{
      res.send('Hello World!')
    });

    server.listen(PORT, () => {
      console.log(`HTTP + WebSocket Server running at http://localhost:${PORT}`);
    });

  })
  .catch((err)=>{
    console.error("DB connection failed:", err.message);
  });