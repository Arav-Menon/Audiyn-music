import express from "express";
import { userRouter } from "./routes/user/auth/auth";
import { createRoomRouter } from "./routes/room/controllers/room.create";
import { deleteRoomRouter } from "./routes/room/controllers/room.delete";
import { dashboardRouter } from "./routes/dashboard/controllers/dashboard";
import { updateUserRouter } from "./routes/user/auth/update.user";
import { userProfileRouter } from "./routes/user/auth/user";
import { recentRoomsRouter } from "./routes/user/controllers/recentRooms";
import cors from "cors";
import cookieParser from "cookie-parser";
import { getRoomRouter } from "./routes/room/controllers/room";

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
app.use(cookieParser());

// user
app.use("/user", userRouter);
 (app.use("/user", updateUserRouter),
  app.use("/user", deleteRoomRouter),
  app.use("/user", userProfileRouter),
  app.use("/user", recentRoomsRouter));

// room
app.use("/room", getRoomRouter);
app.use("/room", createRoomRouter);
app.use("/room", deleteRoomRouter);
app.use("/dashboard", dashboardRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
