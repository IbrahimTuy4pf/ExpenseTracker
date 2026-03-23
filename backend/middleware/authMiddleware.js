import JWT from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  let token = null;

  // Try to get token from cookie first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to Authorization header (Bearer token)
  else {
    const authHeader = req?.headers?.authorization;
    if (authHeader && authHeader?.startsWith("Bearer")) {
      token = authHeader?.split(" ")[1];
    }
  }

  // If no token found, check session
  if (!token && req.session && req.session.userId) {
    req.body.user = {
      userId: req.session.userId,
    };
    return next();
  }

  if (!token) {
    return res
      .status(401)
      .json({ status: "auth_failed", message: "Authentication failed" });
  }

  try {
    const userToken = JWT.verify(token, process.env.JWT_SECRET);

    req.body.user = {
      userId: userToken.userId,
    };

    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ status: "auth_failed", message: "Authentication failed" });
  }
};

export default authMiddleware;


