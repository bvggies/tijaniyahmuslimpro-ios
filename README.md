# 🕌 Tijaniyah Muslim Pro - Web App

A Progressive Web App (PWA) version of the Tijaniyah Muslim Pro mobile application, built with React and TypeScript.

## 🌟 Features

- **Prayer Times**: Accurate prayer times based on your location
- **Qibla Compass**: Find the direction to Mecca
- **Quran Reader**: Read and listen to the Holy Quran
- **Duas & Supplications**: Collection of Islamic prayers
- **Digital Tasbih**: Count your dhikr
- **Wazifa Tracker**: Daily Islamic practices management
- **Community**: Connect with fellow Muslims
- **Islamic Journal**: Reflect on your spiritual journey
- **Admin Dashboard**: Manage app content (for admins)
- **And much more...**

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd tijaniyah-muslim-pro-web
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, uses default API URL):
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 📦 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🌐 Deployment to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will automatically detect the Create React App configuration
4. The app will be deployed and accessible via a Vercel URL

### Environment Variables

Set the following in Vercel dashboard:
- `REACT_APP_API_URL`: Your backend API URL (default: Railway backend)

## 🗄️ Database

This web app uses the **same database** as the mobile app:
- **Backend API**: Railway PostgreSQL
- **API URL**: `https://tijaniyahmuslimproappreact-production-1e25.up.railway.app`
- All user data, authentication, and app state are shared between mobile and web

## 📱 PWA Features

- **Installable**: Users can install the app on their devices
- **Offline Support**: Service worker caches resources for offline use
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Fast Loading**: Optimized for performance

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **React Router** for navigation
- **Create React App** for tooling
- **Axios** for API calls
- **Service Worker** for PWA functionality
- **CSS3** for styling

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts (Auth, Language, etc.)
├── screens/        # Page components
├── services/       # API services
├── utils/          # Helper functions and theme
├── types/          # TypeScript type definitions
└── hooks/          # Custom React hooks
```

## 🔐 Authentication

### Demo Accounts

- **User**: `demo@tijaniyah.com` / `demo123`
- **Admin**: `admin@tijaniyahpro.com` / `admin123`
- **Moderator**: `moderator@tijaniyahpro.com` / `moderator123`

## 🎨 Theme

The app uses a dark teal color scheme inspired by Muslim Pro:
- Background: `#052F2A`
- Surface: `#0B3F39`
- Accent: `#11C48D`
- Primary: `#2E7D32`

## 📝 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🔗 Links

- **Mobile App**: [React Native App Repository]
- **Backend API**: [Railway Deployment]
- **Web App**: [Vercel Deployment]

## 📞 Support

For issues or questions, please contact the development team.

---

Made with ❤️ for the Tijaniyah Muslim community
