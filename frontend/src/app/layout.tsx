import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Smart Inventory & Environment Monitor',
  description: 'ระบบจัดการสินค้าคงคลังและตรวจสอบสภาพแวดล้อมอัจฉริยะ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}

