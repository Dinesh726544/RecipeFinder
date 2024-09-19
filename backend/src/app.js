import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

const corsOptions = {
  origin: ["http://localhost:5173", "https://recipefinder-frontend.onrender.com"],
  methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"], // Add necessary headers
  exposedHeaders: ["Authorization"], // Expose headers if needed
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));


app.use(express.json({limit : "10mb"}))
app.use(express.urlencoded({extended : true, limit : "10mb"}))
app.use(express.static("public"))
app.use(cookieParser())


app.get('/hello', (req, res) => {
  res.send('hello world')
})

//api for user
import userRouter from "./routes/user.route.js"
app.use("/api/v1/users",userRouter)

//api for user
import promptRouter from "./routes/prompt.route.js"
app.use("/api/v1/prompt",promptRouter)


export {app}