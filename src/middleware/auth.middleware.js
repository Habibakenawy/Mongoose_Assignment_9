import jwt from "jsonwebtoken";
import { UnauthorizedException } from "../common/utils/index.js";
import { config } from "dotenv";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      throw UnauthorizedException({ message: "Token is required" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; //
    next(); //
  } catch (err) {
    console.error("JWT Error:", err.name, err.message);
    return next(
      UnauthorizedException({
        message: err.message || "Invalid or expired token",
      }),
    );
  }
};
