import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { products } from './productController.js';

/**
 * GET /api/alerts/low-stock
 * ดึงรายการสินค้าที่ใกล้หมด (quantity <= minStock)
 * ต้องมี JWT token (ผ่าน authenticateToken middleware)
 */
export const getLowStockAlerts = (req: AuthRequest, res: Response) => {
  try {
    // กรองสินค้าที่ quantity <= minStock
    const lowStockProducts = products.filter(
      (product) => product.quantity <= product.minStock
    );

    // จัดเรียงตาม urgency (สินค้าที่ใกล้หมดมากที่สุดก่อน)
    const sortedLowStockProducts = lowStockProducts.sort((a, b) => {
      // คำนวณเปอร์เซ็นต์ที่เหลือ (quantity / minStock)
      const percentageA = a.minStock > 0 ? (a.quantity / a.minStock) * 100 : 0;
      const percentageB = b.minStock > 0 ? (b.quantity / b.minStock) * 100 : 0;
      return percentageA - percentageB; // เรียงจากน้อยไปมาก (ใกล้หมดมากที่สุดก่อน)
    });

    // แปลงเป็นรูปแบบที่พร้อมใช้งาน พร้อมข้อมูลเพิ่มเติม
    const alerts = sortedLowStockProducts.map((product) => {
      const shortage = product.minStock - product.quantity; // จำนวนที่ขาด
      const percentage = product.minStock > 0 
        ? Math.round((product.quantity / product.minStock) * 100) 
        : 0;
      
      // กำหนดระดับความเร่งด่วน
      let urgency: 'critical' | 'warning' | 'low' = 'low';
      if (product.quantity === 0) {
        urgency = 'critical'; // หมดแล้ว
      } else if (percentage <= 25) {
        urgency = 'critical'; // เหลือน้อยกว่า 25%
      } else if (percentage <= 50) {
        urgency = 'warning'; // เหลือ 25-50%
      } else {
        urgency = 'low'; // เหลือมากกว่า 50%
      }

      return {
        productId: product.id,
        productName: product.name,
        category: product.category,
        currentQuantity: product.quantity,
        minStock: product.minStock,
        shortage: shortage > 0 ? shortage : 0, // จำนวนที่ขาด (ถ้าไม่ขาดจะเป็น 0)
        percentage: percentage, // เปอร์เซ็นต์ที่เหลือ
        urgency, // ระดับความเร่งด่วน
        message: product.quantity === 0
          ? 'สินค้าหมดแล้ว'
          : shortage > 0
          ? `สินค้าใกล้หมด: ขาด ${shortage} ชิ้น`
          : `สินค้าใกล้หมด: เหลือ ${product.quantity} ชิ้น (ขั้นต่ำ ${product.minStock} ชิ้น)`,
      };
    });

    res.json({
      success: true,
      message: 'ดึงข้อมูลแจ้งเตือนสินค้าใกล้หมดสำเร็จ',
      data: {
        alerts,
        total: alerts.length,
        summary: {
          critical: alerts.filter((a) => a.urgency === 'critical').length,
          warning: alerts.filter((a) => a.urgency === 'warning').length,
          low: alerts.filter((a) => a.urgency === 'low').length,
        },
      },
    });
  } catch (error) {
    console.error('Get low stock alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลแจ้งเตือน',
    });
  }
};

