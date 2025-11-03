# Morning Board Backend API

Backend API server for the Morning Board mobile application. Built with Express.js and TypeScript.

## Features

- 🚀 Express.js with TypeScript
- 🔒 Security middleware (Helmet)
- 🌐 CORS enabled
- 📝 Request logging (Morgan)
- ✅ ESLint for code quality
- 🎨 Prettier for code formatting
- 🔄 Hot reload with Nodemon

## Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Development

### Run in development mode (with hot reload):
```bash
npm run dev
```

### Build the project:
```bash
npm run build
```

### Run production build:
```bash
npm start
```

### Linting:
```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Auto-fix linting errors
npm run type-check    # TypeScript type checking
```

### Testing:
```bash
npm test              # Run tests
```

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── AuthController.ts
│   │   └── DashboardController.ts
│   ├── models/
│   │   └── User.ts
│   ├── __tests__/
│   └── index.ts          # Main application entry point
├── dist/                 # Compiled JavaScript (generated)
├── .env.example          # Environment variables template
├── .eslintrc.json        # ESLint configuration
├── .prettierrc.json      # Prettier configuration
├── tsconfig.json         # TypeScript configuration
├── nodemon.json          # Nodemon configuration
├── package.json          # Project dependencies
└── README.md             # This file
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Root
- `GET /` - API information

## Controllers

### AuthController
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/reset-password` - Request password reset
- `POST /api/auth/reset` - Reset password with token
- `GET /api/auth/verify` - Verify authentication token
- `POST /api/auth/refresh` - Refresh access token

### DashboardController
- `GET /api/dashboard` - Get dashboard data
- `GET /api/dashboard/widget/:type` - Get widget data
- `PUT /api/dashboard/layout` - Update widget layout
- `POST /api/dashboard/widget` - Add widget
- `DELETE /api/dashboard/widget/:id` - Remove widget
- `POST /api/dashboard/sync` - Sync all widgets
- `GET /api/dashboard/widget/:id/config` - Get widget config
- `PUT /api/dashboard/widget/:id/config` - Update widget config

## Environment Variables

See `.env.example` for available environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

## License

MIT

