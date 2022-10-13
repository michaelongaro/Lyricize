import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";

import postRoutes from "./routes/posts.js";
import loginRoute from "./routes/login.js";

import { login } from "./controllers/login.js";
import { refresh } from "./controllers/refresh.js";
import { getLyrics } from "./controllers/getLyrics.js";

const app = express();

app.use(cors());
app.use(express.json()); // {limit: "30mb", extended: true }
app.use(express.urlencoded({ extended: true })); // limit: "30mb"

// app.use("/posts", postRoutes);

// later on see if you can move these two below into /routes/login.ts
app.use("/login", login);
app.use("/refresh", refresh);
app.use("/user-songs", getLyrics);

const CONNECTION_URL =
  "mongodb+srv://mongaro:LJxNYsUShm5p05gB@cluster0.tj1cbrr.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5001;

mongoose
  .connect(CONNECTION_URL) // , { useNewUrlParser: true, useUnifiedTopology: true } may not be necessary
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((error) => console.log(error.message));
