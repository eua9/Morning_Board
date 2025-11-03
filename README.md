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

**Documentation:**

All project documentation is organized in the [README/](README/) folder:
- **Widget Documentation:** [README/widgets/](README/widgets/)
- **Backend Documentation:** [README/backend/](README/backend/)
- **Frontend Documentation:** [README/frontend/](README/frontend/)
- **Testing Documentation:** [README/testing/](README/testing/)
- **Verification Reports:** [README/verification/](README/verification/)
- **Guides:** [README/guides/](README/guides/)

Quick links:
- Widget Schema: [README/widgets/WIDGET_SCHEMA.md](README/widgets/WIDGET_SCHEMA.md)
- Adding New Widget: [README/widgets/ADDING_NEW_WIDGET.md](README/widgets/ADDING_NEW_WIDGET.md)
- Widget Architecture: [README/widgets/WIDGET_ARCHITECTURE.md](README/widgets/WIDGET_ARCHITECTURE.md)
- Backend Widget Reference: [README/backend/WIDGET_SCHEMA_REFERENCE.md](README/backend/WIDGET_SCHEMA_REFERENCE.md)
- Frontend Widget Reference: [README/frontend/WIDGET_SCHEMA_REFERENCE.md](README/frontend/WIDGET_SCHEMA_REFERENCE.md)

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
