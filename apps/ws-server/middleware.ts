import jwt from "jsonwebtoken";
import "dotenv/config";

export const wsAuthMiddleware = ({ socket, req, next }: any) => {
  const params = new URLSearchParams(req.url?.split("?"[1]));
  const token = params.get("token");

  if (!token) {
    socket.close(4001, "No token provided");
    return;
  }

  try {
    const decode = jwt.verify(token, process.env.AUTH_TOKEN!);
    socket.userId = (decode as any).id;
    next();
  } catch (err) {
    socket.close(4002, "invalid token");
  }
};
