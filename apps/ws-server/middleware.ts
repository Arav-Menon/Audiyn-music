import jwt from "jsonwebtoken";

export const wsAuthMiddleware = (socket: any, req: any, next: any) => {
  const token = req.headers["token"];
  console.log(token);

  if (!token) {
    socket.close(4001, "No token provided");
    return;
  }

  try {
    const decode = jwt.verify(token, process.env.AUTH_TOKEN!);
    socket.userId = (decode as any).id;
    next();
  } catch {
    socket.close(4002, "Invalid token");
  }
};
