import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';

// Mock data สำหรับสินค้า (ยังไม่เชื่อมฐานข้อมูล)
// ในอนาคตจะแทนที่ด้วยข้อมูลจาก database
let products = [
  {
    id: '1',
    name: 'สินค้า A',
    description: 'รายละเอียดสินค้า A',
    price: 1000,
    quantity: 50,
    category: 'Electronics',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'สินค้า B',
    description: 'รายละเอียดสินค้า B',
    price: 2000,
    quantity: 30,
    category: 'Clothing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * GET /api/products
 * ดึงรายการสินค้าทั้งหมด
 * ต้องมี JWT token (ผ่าน authenticateToken middleware)
 */
export const getProducts = (req: AuthRequest, res: Response) => {
  try {
    res.json({
      success: true,
      message: 'ดึงข้อมูลสินค้าสำเร็จ',
      data: {
        products,
        total: products.length,
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า',
    });
  }
};

/**
 * POST /api/products
 * สร้างสินค้าใหม่
 * ต้องมี JWT token (ผ่าน authenticateToken middleware)
 */
export const createProduct = (req: AuthRequest, res: Response) => {
  try {
    const { name, description, price, quantity, category } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!name || !price || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลที่จำเป็น: name, price, quantity',
      });
    }

    // ตรวจสอบว่า price และ quantity เป็นตัวเลข
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'price ต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0',
      });
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'quantity ต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0',
      });
    }

    // สร้างสินค้าใหม่
    const newProduct = {
      id: String(products.length + 1), // สร้าง ID แบบง่าย (ในอนาคตจะใช้ database auto-increment)
      name,
      description: description || '',
      price,
      quantity,
      category: category || 'Uncategorized',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // เพิ่มสินค้าเข้าไปใน array
    products.push(newProduct);

    res.status(201).json({
      success: true,
      message: 'สร้างสินค้าสำเร็จ',
      data: {
        product: newProduct,
      },
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสร้างสินค้า',
    });
  }
};

