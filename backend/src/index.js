import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./lib/db.js"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import reactionRoutes from "./routes/reaction.route.js"
import cors from "cors"
import {app, server} from "./lib/socket.js"
import path from "path";

dotenv.config()

const PORT = process.env.PORT
const _dirname = path.resolve();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/reactions", reactionRoutes)


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname, "../frontend/dist")))

    app.get("*", (req,res)=>{
        res.sendFile(path.join(_dirname, "../frontend", "dist", "index.html"))
    })
}

server.listen(PORT, () => {
    console.log("Server running on port:" + PORT) ;
    connectDB()
});


