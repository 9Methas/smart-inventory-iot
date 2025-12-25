import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';

/**
 * ตัวอย่าง Protected Route
 * ใช้ authenticateToken middleware เพื่อตรวจสอบ JWT token
 * Route นี้จะเข้าถึงได้เฉพาะผู้ที่ login แล้วเท่านั้น
 */
export const getProfile = (req: AuthRequest, res: Response) => {
  // req.user จะมีข้อมูลหลังจากผ่าน authenticateToken middleware แล้ว
  res.json({
    success: true,
    message: 'เข้าถึงข้อมูล profile สำเร็จ',
    data: {
      user: req.user,
    },
  });
};

