import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

// ขยาย Request interface เพื่อเพิ่ม user property
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

/**
 * JWT Authentication Middleware
 * ตรวจสอบ JWT token จาก Authorization header
 * ถ้า token ถูกต้อง จะเพิ่ม user information ลงใน req.user
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // ดึง token จาก Authorization header
    // Format: "Bearer <token>"
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // แยก "Bearer" ออก

    // ตรวจสอบว่ามี token หรือไม่
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'ไม่พบ token กรุณา login ก่อน',
      });
    }

    // ตรวจสอบและ decode token
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Token ไม่ถูกต้องหรือหมดอายุ',
        });
      }

      // เพิ่ม user information ลงใน request object
      req.user = decoded as { userId: string; email: string };
      next(); // ไปต่อที่ route handler
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบ token',
    });
  }
};

