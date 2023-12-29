import express from "express";
import mongoose from "mongoose";
import checkAuth from "./utils/checkAuth.js";
import * as userContoller from "./controllers/UserController.js";
import * as postController from "./controllers/PostController.js";
import * as todoController from "./controllers/TodoController.js";
import { registerValidator, postValidator } from "./vallidations/validators.js";
import handleValidationErrors from "./vallidations//handleValidationErrors.js";
import cors from "cors";

mongoose
  .connect("mongodb://127.0.0.1:27017/pages")
  .then(() => console.log("db is ok"))
  .catch((err) => console.log("error", err));

const app = express();

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hi!");
});

app.post("/auth/me", checkAuth, userContoller.getMe);

app.post(
  "/auth/register",
  registerValidator,
  handleValidationErrors,
  userContoller.register
);

app.post("/auth/login", userContoller.login);

app.get("/posts", checkAuth, postController.getAll);
app.get("/posts/:id", postController.getOne);
app.post("/posts", checkAuth, postValidator, postController.create);
app.delete("/posts/:id", checkAuth, postController.remove);
app.patch("/posts/:id", checkAuth, postController.update);

// app.get("/todos", checkAuth, todoController.getAll);
app.post("/todos", checkAuth, todoController.create);
app.get("/todos/:date", checkAuth, todoController.getByDay);
app.delete("/todos/:id", checkAuth, todoController.remove);
app.patch("/todos/:id", checkAuth, todoController.update);
app.patch("/todos", checkAuth, todoController.complete);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server is starting...");
});
