
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

const PORT = 8000;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });

    server.on("error", (err) => {
      console.error("Express server error:", err);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });


















/*
const app=express()
( async()=>{

    try {
      await  mongoose.connect(`${process.env.MONGODB_URL} ${DB_NAME}`)
      app.on("error",(error)=>{
        console.log("error",error);
        throw error
      })
      app.listen(process.env.PORT,()=>{
        console.log(`App is running ${process.env.PORT}`);
        
      })
    } catch (error) {
        console.log("error",error);
        throw(error);
    }
})()
*/