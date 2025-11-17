const jwt = require("jsonwebtoken");

const verifySocketConnection = (req: any) => {
  try {
    let token = req.headers["authorization"];

    console.log(token);
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new Error("Missing or invalid authorization header");
    }

    const decoded = jwt.verify(token, process.env.AUTH_TOKEN!);

    return decoded;
  } catch (err) {
    console.log(err);
  }
};

export = verifySocketConnection;
