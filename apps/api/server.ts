import express from "express";
import { userRouter } from "./routes/user/auth/auth";
import { createRoomRouter } from "./routes/room/controllers/room.create";
import { deleteRoomRouter } from "./routes/room/controllers/room.delete";
import { updateUserRouter } from "./routes/user/auth/update.user";
import { userProfileRouter } from "./routes/user/auth/user";
import cors from "cors";

const PORT = process.env.PORT;
console.log(PORT);
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// user
app.use("/user", userRouter);
(app.use("/user", updateUserRouter),
  app.use("/user", deleteRoomRouter),
  app.use("/user", userProfileRouter));

// room
app.use("/room", createRoomRouter);
app.use("/room", deleteRoomRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
