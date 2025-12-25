import { Router } from 'express';
import { getLowStockAlerts } from '../controllers/alertController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// ทุก route ในนี้ต้องมี JWT token (ใช้ authenticateToken middleware)
// GET /api/alerts/low-stock - ดึงรายการสินค้าที่ใกล้หมด
router.get('/low-stock', authenticateToken, getLowStockAlerts);

export default router;

