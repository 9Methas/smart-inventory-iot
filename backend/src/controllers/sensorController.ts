import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';

// ประเภทข้อมูล Sensor
export interface SensorData {
  id: string;
  temperature: number; // อุณหภูมิ (องศาเซลเซียส)
  humidity: number; // ความชื้น (%)
  timestamp: string; // เวลาที่บันทึกข้อมูล
  deviceId?: string; // ID ของอุปกรณ์ (optional สำหรับอนาคต)
}

// Time-series data สำหรับเก็บข้อมูล Sensor
// ในอนาคตจะแทนที่ด้วย database (เช่น InfluxDB, TimescaleDB)
let sensorDataHistory: SensorData[] = [];

/**
 * POST /api/sensors/data
 * รับข้อมูล Sensor (Temperature และ Humidity)
 * ต้องมี JWT token (ผ่าน authenticateToken middleware)
 */
export const receiveSensorData = (req: AuthRequest, res: Response) => {
  try {
    const { temperature, humidity, deviceId } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (temperature === undefined || humidity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลที่จำเป็น: temperature, humidity',
      });
    }

    // ตรวจสอบว่า temperature และ humidity เป็นตัวเลข
    if (typeof temperature !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'temperature ต้องเป็นตัวเลข',
      });
    }

    if (typeof humidity !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'humidity ต้องเป็นตัวเลข',
      });
    }

    // ตรวจสอบช่วงค่าที่สมเหตุสมผล (optional validation)
    if (temperature < -50 || temperature > 100) {
      return res.status(400).json({
        success: false,
        message: 'temperature ควรอยู่ในช่วง -50 ถึง 100 องศาเซลเซียส',
      });
    }

    if (humidity < 0 || humidity > 100) {
      return res.status(400).json({
        success: false,
        message: 'humidity ควรอยู่ในช่วง 0 ถึง 100%',
      });
    }

    // สร้างข้อมูล Sensor ใหม่
    const sensorData: SensorData = {
      id: String(sensorDataHistory.length + 1),
      temperature,
      humidity,
      timestamp: new Date().toISOString(),
      deviceId: deviceId || 'mock-device-1', // ถ้าไม่ระบุให้ใช้ mock device
    };

    // เพิ่มข้อมูลเข้าไปใน history
    sensorDataHistory.push(sensorData);

    // จำกัดจำนวนข้อมูลใน memory (เก็บแค่ 1000 รายการล่าสุด)
    // เพื่อป้องกัน memory overflow
    if (sensorDataHistory.length > 1000) {
      sensorDataHistory = sensorDataHistory.slice(-1000);
    }

    res.status(201).json({
      success: true,
      message: 'บันทึกข้อมูล Sensor สำเร็จ',
      data: {
        sensorData,
      },
    });
  } catch (error) {
    console.error('Receive sensor data error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล Sensor',
    });
  }
};

/**
 * GET /api/sensors/latest
 * ดึงข้อมูล Sensor ล่าสุด
 * ต้องมี JWT token (ผ่าน authenticateToken middleware)
 */
export const getLatestSensorData = (req: AuthRequest, res: Response) => {
  try {
    const { deviceId } = req.query;

    let latestData: SensorData | null = null;

    if (deviceId) {
      // ถ้ามี deviceId ให้หาค่าล่าสุดของ device นั้น
      const deviceData = sensorDataHistory
        .filter((data) => data.deviceId === deviceId)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      latestData = deviceData.length > 0 ? deviceData[0] : null;
    } else {
      // ถ้าไม่มี deviceId ให้หาค่าล่าสุดทั้งหมด
      if (sensorDataHistory.length > 0) {
        latestData = sensorDataHistory[sensorDataHistory.length - 1];
      }
    }

    if (!latestData) {
      return res.status(404).json({
        success: false,
        message: deviceId
          ? `ไม่พบข้อมูล Sensor ของ device: ${deviceId}`
          : 'ไม่พบข้อมูล Sensor',
      });
    }

    res.json({
      success: true,
      message: 'ดึงข้อมูล Sensor ล่าสุดสำเร็จ',
      data: {
        sensorData: latestData,
      },
    });
  } catch (error) {
    console.error('Get latest sensor data error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูล Sensor',
    });
  }
};

/**
 * GET /api/sensors/history
 * ดึงประวัติข้อมูล Sensor (Time-series)
 * ต้องมี JWT token (ผ่าน authenticateToken middleware)
 */
export const getSensorHistory = (req: AuthRequest, res: Response) => {
  try {
    const { deviceId, limit, startTime, endTime } = req.query;

    let filteredData = [...sensorDataHistory];

    // กรองตาม deviceId ถ้ามี
    if (deviceId) {
      filteredData = filteredData.filter((data) => data.deviceId === deviceId);
    }

    // กรองตามช่วงเวลา ถ้ามี
    if (startTime) {
      const start = new Date(startTime as string).getTime();
      filteredData = filteredData.filter(
        (data) => new Date(data.timestamp).getTime() >= start
      );
    }

    if (endTime) {
      const end = new Date(endTime as string).getTime();
      filteredData = filteredData.filter(
        (data) => new Date(data.timestamp).getTime() <= end
      );
    }

    // เรียงลำดับตามเวลา (เก่าที่สุดก่อน)
    filteredData.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // จำกัดจำนวนผลลัพธ์ถ้ามี limit
    if (limit && typeof limit === 'string') {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        // ถ้ามี limit ให้ดึงข้อมูลล่าสุด (slice จากท้าย)
        filteredData = filteredData.slice(-limitNum);
      }
    }

    // คำนวณสถิติ
    const stats = {
      total: filteredData.length,
      avgTemperature:
        filteredData.length > 0
          ? filteredData.reduce((sum, d) => sum + d.temperature, 0) /
            filteredData.length
          : 0,
      avgHumidity:
        filteredData.length > 0
          ? filteredData.reduce((sum, d) => sum + d.humidity, 0) /
            filteredData.length
          : 0,
      minTemperature:
        filteredData.length > 0
          ? Math.min(...filteredData.map((d) => d.temperature))
          : null,
      maxTemperature:
        filteredData.length > 0
          ? Math.max(...filteredData.map((d) => d.temperature))
          : null,
      minHumidity:
        filteredData.length > 0
          ? Math.min(...filteredData.map((d) => d.humidity))
          : null,
      maxHumidity:
        filteredData.length > 0
          ? Math.max(...filteredData.map((d) => d.humidity))
          : null,
    };

    res.json({
      success: true,
      message: 'ดึงประวัติข้อมูล Sensor สำเร็จ',
      data: {
        history: filteredData,
        stats,
      },
    });
  } catch (error) {
    console.error('Get sensor history error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงประวัติข้อมูล Sensor',
    });
  }
};

