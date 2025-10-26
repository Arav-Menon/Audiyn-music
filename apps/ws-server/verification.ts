const jwt = require("jsonwebtoken");

const verifySocketConnection = (req: any) => {
  const token = req.headers["authorization"];

  console.log(token);

  if (!token) {
    throw new Error("Missing or invalid authorization header");
  }

  const decoded = jwt.verify(token, process.env.AUTH_TOKEN!);

  return decoded;
};

export = verifySocketConnection;
