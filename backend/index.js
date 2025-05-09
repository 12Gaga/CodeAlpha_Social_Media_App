import express from "express";
// import userRoute from "./routes/users.js";
import postRoute from "./routes/posts.js";
import commentRoute from "./routes/comments.js";
import likeRoute from "./routes/likes.js";
import authRoute from "./routes/auth.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});
// app.use("/users", userRoute);
app.use("/comment", commentRoute);
app.use("/like", likeRoute);
app.use("/auth", authRoute);
app.use("/post", postRoute);

app.listen(3000, () => {
  console.log("server is running....");
});
