import { app } from "./app.js";
import connectDB from "./db/index.js";
import 'dotenv/config'


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5555, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });