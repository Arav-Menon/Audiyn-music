const jwt = require("jsonwebtoken");

const verifySocketConnection = (req: any) => {
  try {
    let protocols = req.headers["sec-websocket-protocol"];

    // WS may send this as an array or a string
    if (!protocols) {
      throw new Error("Missing or invalid authorization header");
    }

    if (Array.isArray(protocols)) {
      protocols = protocols.join(",");
    }

    const parts = protocols.split(",").map((p: any) => p.trim());

    // parts[0] = "token"
    // parts[1] = actual JWT
    const token = parts[1];

    if (!token || token === "null" || token === "undefined") {
      throw new Error("Missing or invalid authorization header");
    }

    // verify JWT
    const decoded = jwt.verify(token, process.env.AUTH_TOKEN!);

    return decoded;
  } catch (err) {
    console.log("WS auth error:", err);
    throw new Error("Invalid token");
  }
};

export = verifySocketConnection;
