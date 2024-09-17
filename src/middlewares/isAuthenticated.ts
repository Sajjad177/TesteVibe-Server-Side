import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request interface to include `id`
declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}

// Middleware for checking authentication
export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Verify token using JWT
    const decode = jwt.verify(
      token,
      process.env.SECRET_KEY!
    ) as jwt.JwtPayload & { userId: string };

    // Check if decoding was successful and userId exists
    if (!decode || !decode.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Assign userId from the token to `req.id`
    req.id = decode.userId;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
