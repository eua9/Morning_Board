# Morning_Board

The application will pull data from many platforms and present it into one dashboards. The platforms include Slack, School Canvas sites, Bank information, weather information, and CRM information.

## Project Structure

This repository contains both the frontend (iOS/React Native) and backend (Express.js API) code:

- **`ios/`** - Native iOS application (Swift/SwiftUI)
- **`backend/`** - Backend API server (Express.js + TypeScript)
- Frontend (React Native) - Will be initialized using `setup-react-native.sh`

## Project Setup

### Frontend (React Native)

This is a React Native mobile application. Follow these steps to set up the development environment:

### Prerequisites

1. **Node.js** (v16 or higher)

   - Download from [nodejs.org](https://nodejs.org/) (LTS version recommended)
   - Or use nvm:
     ```bash
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
     nvm install 18
     nvm use 18
     ```

2. **npm** (comes with Node.js)

3. **For iOS Development:**

   - macOS required
   - Xcode (from App Store)
   - CocoaPods: `sudo gem install cocoapods`

4. **For Android Development:**
   - Android Studio
   - Android SDK
   - Java Development Kit (JDK)

### Installation

Run the setup script:

```bash
./setup-react-native.sh
```

The script will:

- Check Node.js installation
- Initialize the React Native project (Expo or React Native CLI)
- Install dependencies
- Configure ESLint and Prettier

### Development

**Expo:**

```bash
npm start
```

**React Native CLI:**

- iOS: `npm run ios`
- Android: `npm run android`

### VS Code Setup

1. Open the project in VS Code
2. Install recommended extensions (prompt should appear automatically)
3. The workspace is pre-configured with:
   - ESLint for code linting
   - Prettier for code formatting
   - TypeScript support
   - Expo tools

### Backend API

The backend API is located in the `backend/` directory. See [backend/README.md](backend/README.md) for detailed setup instructions.

**Widget Schema Documentation:**

- See [WIDGET_SCHEMA.md](WIDGET_SCHEMA.md) for complete widget response schema specifications
- Backend developers: See [backend/WIDGET_SCHEMA_REFERENCE.md](backend/WIDGET_SCHEMA_REFERENCE.md)
- Frontend developers: See [src/WIDGET_SCHEMA_REFERENCE.md](src/WIDGET_SCHEMA_REFERENCE.md)

**Developer Guides:**

- Adding a new widget type: See [docs/ADDING_NEW_WIDGET.md](docs/ADDING_NEW_WIDGET.md)

Quick start:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend includes:

- Express.js server with TypeScript
- User authentication (AuthController)
- Dashboard management (DashboardController)
- User model and data structures

## Development Branches

There will be 3 development branches:

- Frontend_Dev
- Backend_Dev
- QA_Dev

**Important:** Do not make pull requests to any other branch besides one of these 3.

Each Jira ticket will have its own branch that will be branched off of one of the Dev branches (Which dev branch depends on what is being implemented).
