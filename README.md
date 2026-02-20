# ScoreForge 🏆

A comprehensive, offline-capable React application for managing math competitions, participants, scoring, and certificate generation. Built with a clean, premium, and intentional UI.

## Features

- **Competition Management**: Create and configure competitions with dynamic categories and custom weighted rounds.
- **Participant Handling**: Add participants individually or bulk import from Excel/Google Sheets using robust tab-separated text parsing.
- **Real-time Score Entry**: Fast, spreadsheet-like data entry grid with calculated totals and automatic sorting. Saves automatically as you type.
- **Advanced Ranking Engine**: Fully client-side ranking algorithms that handle ties and generate complex medal distributions based on percentages (e.g., Top 10% Gold) or fixed counts.
- **Results & Statistics**: Visual distribution charts and live, sortable leaderboards.
- **Batch Certificate Generation**: Securely merge participant names, ranks, and dynamic background templates into high-quality, landscape A4 PDFs in bulk using client-side rendering.
- **Security & Access**: Draft mode for hiding ongoing events, Firebase authentication for administrators, and robust Firestore security rules.

## Tech Stack

- **Frontend Framework**: React 18, Vite
- **Routing**: React Router DOM
- **Backend / Database**: Firebase (Auth & Firestore)
- **Styling**: Tailwind CSS, HeroIcons
- **Utilities**: 
  - `papaparse` for CSV/TSV bulk imports and exports
  - `jspdf` & `jszip` for batch PDF generation and packaging
  - `recharts` for statistical data visualization

## Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scoreforge.git
   cd scoreforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable **Firestore Database** and **Authentication** (Email/Password or Google).
   - Create a `.env.local` file in the root directory and add your Firebase config variables:
     ```env
     VITE_FIREBASE_API_KEY="your-api-key"
     VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
     VITE_FIREBASE_PROJECT_ID="your-project-id"
     VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
     VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
     VITE_FIREBASE_APP_ID="your-app-id"
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Firestore Security Rules**
   For production deployments, apply the `firestore.rules` file found in the root of the project to your Firebase console to ensure data is protected and access is restricted to authenticated competition creators.

## Design Philosophy

ScoreForge was engineered with a strict adherence to premium, mature UI design principles:
- **Consistent Rhythm**: Built entirely on standard 4-point/8-point spacing scales.
- **Data Clarity**: Empty states, grids, and dashboards heavily utilize strict typography hierarchies, muted structural borders (`slate-200`), and dedicated highlighting for computed data fields. 
- **Predictable Interactions**: Loading skeletons, pessimistic/optimistic UI saving indicators, and fully functional interactive elements. No filler animations or superficial gradients.

## Deployment

To create a production build for hosting services (like Firebase Hosting, Vercel, or Netlify):
```bash
npm run build
```
The output will be placed in the `dist` folder.
