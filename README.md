# Smart Inventory & Environment Monitor

ระบบจัดการสินค้าคงคลังและตรวจสอบสภาพแวดล้อมอัจฉริยะ

## 📁 โครงสร้างโปรเจค (Mono-repo)

```
smart-inventory/
├── frontend/              # Next.js Frontend Application
├── backend/               # Node.js + Express Backend API
├── shared/                # Shared code, types, utilities
├── iot/                   # IoT integration modules
├── docs/                  # Documentation
├── scripts/               # Build & deployment scripts
├── .gitignore
├── package.json           # Root package.json (workspaces)
└── README.md
```

## 🚀 Quick Start

### ติดตั้ง dependencies
```bash
npm install
```

### รัน development mode
```bash
npm run dev
```

### Build production
```bash
npm run build
```

## 📦 Workspaces

- **frontend**: Next.js application
- **backend**: Express API server
- **shared**: Shared TypeScript types and utilities

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB / PostgreSQL
- **IoT**: MQTT, WebSocket support

## 📝 License

MIT

