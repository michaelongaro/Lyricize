import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();
import * as path from "path";

import loginRoute from "./routes/login.js";

import { login } from "./controllers/login.js";
import { refresh } from "./controllers/refresh.js";
import { getLyrics } from "./controllers/getLyrics.js";
import { isUserInDatabase } from "./controllers/isUserInDatabase.js";

console.log("reached index.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// later on see if you can move these two below into /routes/login.ts
app.use("/login", login);
app.use("/refresh", refresh);

app.use("/user-songs", getLyrics);
app.use("/is-user-in-database", isUserInDatabase);

const CONNECTION_URL = process.env.MONGO_URI!;

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    app.listen(process.env.PORT || 5001, () =>
      console.log(`Server running on port ${process.env.PORT || 5001}`)
    );
  })
  .catch((error) => console.log(error.message));
