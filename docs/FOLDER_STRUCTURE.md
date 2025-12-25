# 📁 โครงสร้างโฟลเดอร์ (Folder Structure)

## โครงสร้างแบบ Tree

```
smart-inventory/
├── frontend/                    # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                # Next.js App Router (pages & layouts)
│   │   ├── components/         # React components (reusable UI)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Utility functions, API clients
│   │   └── types/              # TypeScript types (frontend-specific)
│   ├── public/                 # Static assets (images, icons)
│   ├── package.json
│   ├── next.config.js          # Next.js configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── tailwind.config.js      # Tailwind CSS configuration
│
├── backend/                     # Node.js + Express Backend API
│   ├── src/
│   │   ├── routes/             # API route definitions
│   │   ├── controllers/        # Request handlers (business logic)
│   │   ├── models/             # Database models/schemas
│   │   ├── services/           # Business logic services
│   │   ├── middleware/         # Express middleware (auth, validation)
│   │   ├── config/             # Configuration files (DB, env)
│   │   └── index.ts            # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                      # Shared Code (Types & Utilities)
│   ├── src/
│   │   ├── types/              # Shared TypeScript interfaces/types
│   │   ├── utils/              # Shared utility functions
│   │   └── index.ts            # Main export file
│   ├── package.json
│   └── tsconfig.json
│
├── iot/                         # IoT Integration Module
│   ├── src/
│   │   ├── connectors/         # MQTT, WebSocket connectors
│   │   ├── handlers/           # IoT data handlers
│   │   └── index.ts            # Main entry point
│   ├── package.json
│   └── README.md
│
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md         # System architecture
│   └── FOLDER_STRUCTURE.md     # This file
│
├── scripts/                     # Build & Deployment Scripts
│   └── setup.sh                # Setup script
│
├── .gitignore                  # Git ignore rules
├── package.json                # Root package.json (workspaces)
└── README.md                   # Main documentation
```

---

## 📋 อธิบายหน้าที่ของแต่ละโฟลเดอร์

### 🎨 **frontend/** - Frontend Application
**เทคโนโลยี**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS

- **`src/app/`** - Next.js App Router สำหรับ pages, layouts, และ route handlers
- **`src/components/`** - React components ที่ใช้ซ้ำได้ (UI components)
- **`src/hooks/`** - Custom React hooks สำหรับ logic ที่ใช้ซ้ำ
- **`src/lib/`** - Utility functions, API clients, helper functions
- **`src/types/`** - TypeScript types เฉพาะของ frontend
- **`public/`** - Static files (images, icons, fonts)

---

### ⚙️ **backend/** - Backend API Server
**เทคโนโลยี**: Node.js, Express, TypeScript

- **`src/routes/`** - กำหนด API endpoints และ route paths
- **`src/controllers/`** - จัดการ request/response และเรียกใช้ services
- **`src/models/`** - Database models/schemas (MongoDB, PostgreSQL)
- **`src/services/`** - Business logic layer (แยกจาก controllers)
- **`src/middleware/`** - Express middleware (authentication, validation, error handling)
- **`src/config/`** - Configuration files (database, environment variables)
- **`src/index.ts`** - Entry point ของ backend server

---

### 🔄 **shared/** - Shared Code
**เทคโนโลยี**: TypeScript

- **`src/types/`** - Shared TypeScript interfaces/types ที่ใช้ทั้ง frontend และ backend
- **`src/utils/`** - Shared utility functions ที่ใช้ร่วมกัน
- ช่วยให้ frontend และ backend ใช้ types เดียวกันได้ (type safety)

---

### 🌐 **iot/** - IoT Integration Module
**เทคโนโลยี**: MQTT, WebSocket, TypeScript

- **`src/connectors/`** - เชื่อมต่อกับ IoT devices (MQTT client, WebSocket server)
- **`src/handlers/`** - จัดการข้อมูลจาก sensors และส่งคำสั่งไปยัง actuators
- รองรับการขยายสำหรับเชื่อมต่อกับอุปกรณ์ IoT ในอนาคต

---

### 📚 **docs/** - Documentation
- เอกสารเกี่ยวกับ architecture, API documentation, และ guides

---

### 🛠️ **scripts/** - Scripts
- Scripts สำหรับ setup, build, และ deployment

---

### 📦 **Root Level Files**
- **`package.json`** - Root package.json ที่ใช้ npm workspaces จัดการ dependencies
- **`.gitignore`** - Git ignore rules
- **`README.md`** - เอกสารหลักของโปรเจค

---

## 🎯 ข้อดีของโครงสร้างนี้

1. **แยก Frontend/Backend ชัดเจน** - แต่ละส่วนมีโครงสร้างเป็นของตัวเอง
2. **Shared Code** - ลด code duplication และเพิ่ม type safety
3. **IoT Ready** - มีโมดูลสำหรับเชื่อมต่อ IoT แยกออกมา
4. **Scalable** - โครงสร้างรองรับการขยายในอนาคต
5. **Portfolio Ready** - โครงสร้างเป็นมืออาชีพ เหมาะสำหรับโปรเจคมหาวิทยาลัย

---

## 🚀 การใช้งาน

```bash
# ติดตั้ง dependencies ทั้งหมด
npm install

# รัน development mode (frontend + backend)
npm run dev

# รันเฉพาะ frontend
npm run dev:frontend

# รันเฉพาะ backend
npm run dev:backend

# Build production
npm run build
```

