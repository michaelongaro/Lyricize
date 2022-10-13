import express from "express";
// import bodyParser from "body-parser";

import { getPosts, createPost } from "../controllers/posts.js";
// import { login } from "../controllers/login.js";

const app = express();
// app.use(bodyParser.json());

// gotta test whether you need app + bodyparser here or inside login function
const router = express.Router();
// const app2 = express();

router.get("/", getPosts);
router.post("/", createPost);

// router.post("/login", login);
// app2.post("/login", login);

export default router;
