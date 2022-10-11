import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import postRoutes from "./routes/posts.js";

const app = express();

app.use("/posts", postRoutes);

app.use(bodyParser.json()); // {limit: "30mb", extended: true }
app.use(bodyParser.urlencoded({ extended: true })); // limit: "30mb"
app.use(cors());

const CONNECTION_URL =
  "mongodb+srv://mongaro:LJxNYsUShm5p05gB@cluster0.tj1cbrr.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL) // , { useNewUrlParser: true, useUnifiedTopology: true } may not be necessary
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((error) => console.log(error.message));

// when you restart today focus on HOW this guy is structuring/connecting front + back end rather than exactly WHAT he is putting in there.

// again big change from before is that client and server side code are completely separate here, and only communicate through a very specific pattern
// we get to find out what that looks like today! :3 YOU GOT THIS MY FRIEND (ENJOY THE BELL BUT DON'T START THIS WITHOUT PMA FLOWING THROUGH YOU MY NIBBLITS)
