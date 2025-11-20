import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export async function jwtauthMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized. No token provided",
        err: true,
      });
    }

    const accessToken = authHeader.split(" ")[1];

    const decoded = jwt.verify(accessToken, process.env.SECRET_KEY_ACCESS_TOKEN);

    // Attach user to request
    const user = await userModel.findById(decoded.id).select("_id name email");
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        err: true,
      });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      err: true,
    });
  }
}
