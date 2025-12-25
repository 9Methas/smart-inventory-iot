import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/productController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// ทุก route ในนี้ต้องมี JWT token (ใช้ authenticateToken middleware)
// GET /api/products - ดึงรายการสินค้าทั้งหมด
router.get('/', authenticateToken, getProducts);

// POST /api/products - สร้างสินค้าใหม่
router.post('/', authenticateToken, createProduct);

export default router;

