import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { products } from './productController.js';

// ประวัติการเคลื่อนไหวสินค้า (Stock History)
// บันทึกทุกการทำ Stock In และ Stock Out
export let stockHistory: Array<{
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  note?: string;
  userId: string;
  createdAt: string;
}> = [];

/**
 * POST /api/stock/in
 * เพิ่มสินค้าเข้า Stock (Stock In)
 * ต้องมี JWT token (ผ่าน authenticateToken middleware)
 */
export const stockIn = (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity, note } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลที่จำเป็น: productId, quantity',
      });
    }

    // ตรวจสอบว่า quantity เป็นตัวเลขและมากกว่า 0
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'quantity ต้องเป็นตัวเลขที่มากกว่า 0',
      });
    }

    // หาสินค้าจาก productId
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบสินค้าที่ระบุ',
      });
    }

    // บันทึกจำนวนเดิมก่อนอัปเดต
    const previousQuantity = product.quantity;

    // เพิ่มจำนวนสินค้า
    product.quantity += quantity;
    product.updatedAt = new Date().toISOString();

    // บันทึกประวัติการเคลื่อนไหว
    const historyEntry = {
      id: String(stockHistory.length + 1),
      productId: product.id,
      productName: product.name,
      type: 'in' as const,
      quantity,
      previousQuantity,
      newQuantity: product.quantity,
      note: note || '',
      userId: req.user?.userId || 'unknown',
      createdAt: new Date().toISOString(),
    };

    stockHistory.push(historyEntry);

    res.status(200).json({
      success: true,
      message: 'เพิ่มสินค้าเข้า Stock สำเร็จ',
      data: {
        product: {
          id: product.id,
          name: product.name,
          previousQuantity,
          quantityAdded: quantity,
          newQuantity: product.quantity,
        },
        history: historyEntry,
      },
    });
  } catch (error) {
    console.error('Stock in error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเพิ่มสินค้าเข้า Stock',
    });
  }
};

/**
 * POST /api/stock/out
 * ลดสินค้าออกจาก Stock (Stock Out)
 * ต้องมี JWT token (ผ่าน authenticateToken middleware)
 * ตรวจสอบว่าไม่ให้ quantity ติดลบ
 */
export const stockOut = (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity, note } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลที่จำเป็น: productId, quantity',
      });
    }

    // ตรวจสอบว่า quantity เป็นตัวเลขและมากกว่า 0
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'quantity ต้องเป็นตัวเลขที่มากกว่า 0',
      });
    }

    // หาสินค้าจาก productId
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบสินค้าที่ระบุ',
      });
    }

    // บันทึกจำนวนเดิมก่อนอัปเดต
    const previousQuantity = product.quantity;

    // ตรวจสอบว่า Stock Out จะไม่ทำให้ quantity ติดลบ
    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Stock ไม่พอ: มีสินค้าอยู่ ${product.quantity} ชิ้น แต่ต้องการ ${quantity} ชิ้น`,
        data: {
          productId: product.id,
          productName: product.name,
          availableQuantity: product.quantity,
          requestedQuantity: quantity,
          shortage: quantity - product.quantity,
        },
      });
    }

    // ลดจำนวนสินค้า
    product.quantity -= quantity;
    product.updatedAt = new Date().toISOString();

    // บันทึกประวัติการเคลื่อนไหว
    const historyEntry = {
      id: String(stockHistory.length + 1),
      productId: product.id,
      productName: product.name,
      type: 'out' as const,
      quantity,
      previousQuantity,
      newQuantity: product.quantity,
      note: note || '',
      userId: req.user?.userId || 'unknown',
      createdAt: new Date().toISOString(),
    };

    stockHistory.push(historyEntry);

    res.status(200).json({
      success: true,
      message: 'ลดสินค้าออกจาก Stock สำเร็จ',
      data: {
        product: {
          id: product.id,
          name: product.name,
          previousQuantity,
          quantityRemoved: quantity,
          newQuantity: product.quantity,
        },
        history: historyEntry,
      },
    });
  } catch (error) {
    console.error('Stock out error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการลดสินค้าออกจาก Stock',
    });
  }
};

/**
 * GET /api/stock/history
 * ดึงประวัติการเคลื่อนไหวสินค้า
 * ต้องมี JWT token (ผ่าน authenticateToken middleware)
 */
export const getStockHistory = (req: AuthRequest, res: Response) => {
  try {
    const { productId, type, limit } = req.query;

    let filteredHistory = [...stockHistory];

    // กรองตาม productId ถ้ามี
    if (productId) {
      filteredHistory = filteredHistory.filter(
        (h) => h.productId === productId
      );
    }

    // กรองตาม type (in/out) ถ้ามี
    if (type && (type === 'in' || type === 'out')) {
      filteredHistory = filteredHistory.filter((h) => h.type === type);
    }

    // เรียงลำดับตามวันที่ล่าสุดก่อน
    filteredHistory.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // จำกัดจำนวนผลลัพธ์ถ้ามี limit
    if (limit && typeof limit === 'string') {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredHistory = filteredHistory.slice(0, limitNum);
      }
    }

    res.json({
      success: true,
      message: 'ดึงประวัติการเคลื่อนไหวสินค้าสำเร็จ',
      data: {
        history: filteredHistory,
        total: filteredHistory.length,
      },
    });
  } catch (error) {
    console.error('Get stock history error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงประวัติการเคลื่อนไหวสินค้า',
    });
  }
};

