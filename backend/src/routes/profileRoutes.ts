import { Router } from 'express';
import { getProfile } from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// GET /api/profile
// ตัวอย่างการใช้ authenticateToken middleware
// Route นี้จะต้องมี JWT token ใน Authorization header ถึงจะเข้าถึงได้
router.get('/', authenticateToken, getProfile);

export default router;

