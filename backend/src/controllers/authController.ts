import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

// Mock user data (สำหรับทดสอบ - ยังไม่เชื่อมฐานข้อมูล)
const MOCK_USER = {
  email: 'admin@example.com',
  password: 'password123',
  id: '1',
  name: 'Admin User',
};

/**
 * Login endpoint handler
 * ตรวจสอบ email และ password จาก mock user
 * สร้าง JWT token เมื่อ login สำเร็จ
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // ตรวจสอบว่ามี email และ password หรือไม่
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอก email และ password',
      });
    }

    // ตรวจสอบ email และ password กับ mock user
    if (email !== MOCK_USER.email || password !== MOCK_USER.password) {
      return res.status(401).json({
        success: false,
        message: 'Email หรือ password ไม่ถูกต้อง',
      });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      {
        userId: MOCK_USER.id,
        email: MOCK_USER.email,
      },
      config.jwtSecret,
      {
        expiresIn: '24h', // Token หมดอายุใน 24 ชั่วโมง
      }
    );

    // ส่ง token กลับไป
    res.json({
      success: true,
      message: 'Login สำเร็จ',
      data: {
        token,
        user: {
          id: MOCK_USER.id,
          email: MOCK_USER.email,
          name: MOCK_USER.name,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการ login',
    });
  }
};

