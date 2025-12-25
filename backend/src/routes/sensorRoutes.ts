import { Router } from 'express';
import {
  receiveSensorData,
  getLatestSensorData,
  getSensorHistory,
} from '../controllers/sensorController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// ทุก route ในนี้ต้องมี JWT token (ใช้ authenticateToken middleware)
// POST /api/sensors/data - รับข้อมูล Sensor (Temperature, Humidity)
router.post('/data', authenticateToken, receiveSensorData);

// GET /api/sensors/latest - ดึงข้อมูล Sensor ล่าสุด
router.get('/latest', authenticateToken, getLatestSensorData);

// GET /api/sensors/history - ดึงประวัติข้อมูล Sensor
router.get('/history', authenticateToken, getSensorHistory);

export default router;

