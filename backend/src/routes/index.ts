import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import productRoutes from './productRoutes.js';

const router = Router();

// Health check route
router.use('/health', healthRoutes);

// Authentication routes
router.use('/auth', authRoutes);

// Profile route (ตัวอย่าง protected route ที่ต้องใช้ JWT)
router.use('/profile', profileRoutes);

// Product routes (ต้องมี JWT token)
router.use('/products', productRoutes);

export default router;

