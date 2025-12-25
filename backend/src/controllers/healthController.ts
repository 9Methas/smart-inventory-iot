import { Request, Response } from 'express';

export const getHealth = (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Smart Inventory API is running',
    timestamp: new Date().toISOString(),
  });
};

