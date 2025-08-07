import express from "express";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import imageRoutes from "./routes/image.routes";

import likeRoutes from "./routes/like.routes";
import commentRoutes from "./routes/comment.routes";
import path from "path/win32";

const app = express();

app.use(express.json());


app.use("/", (req, res) => {

    res.sendFile(path.join(__dirname, "../page/index.html"));
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/images", imageRoutes);

app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);

export default app;
