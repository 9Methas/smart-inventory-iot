# Backend API - Smart Inventory & Environment Monitor

Backend API server built with Node.js and Express.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Server startup
│   ├── config/             # Configuration files
│   ├── routes/             # API routes
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── models/             # Database models (future)
│   └── middleware/         # Express middleware
├── package.json
└── tsconfig.json
```

## 🔗 API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3001
NODE_ENV=development
API_PREFIX=/api
```

