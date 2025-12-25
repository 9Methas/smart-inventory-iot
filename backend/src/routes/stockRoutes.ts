import { Router } from 'express';
import {
  stockIn,
  stockOut,
  getStockHistory,
} from '../controllers/stockController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// ทุก route ในนี้ต้องมี JWT token (ใช้ authenticateToken middleware)
// POST /api/stock/in - เพิ่มสินค้าเข้า Stock
router.post('/in', authenticateToken, stockIn);

// POST /api/stock/out - ลดสินค้าออกจาก Stock
router.post('/out', authenticateToken, stockOut);

// GET /api/stock/history - ดึงประวัติการเคลื่อนไหวสินค้า
router.get('/history', authenticateToken, getStockHistory);

export default router;

