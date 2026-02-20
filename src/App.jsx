import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import CompetitionPage from './pages/CompetitionPage';
import ParticipantPage from './pages/ParticipantPage';
import ScoreEntryPage from './pages/ScoreEntryPage';
import ResultsPage from './pages/ResultsPage';
import PublicLeaderboard from './pages/PublicLeaderboard';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/layout/ProtectedRoute';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/public/:id/leaderboard" element={<PublicLeaderboard />} />

        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/competition/new" element={<CompetitionPage isNew />} />
            <Route path="/competition/:id" element={<CompetitionPage />} />
            <Route path="/competition/:id/participants" element={<ParticipantPage />} />
            <Route path="/competition/:id/scores" element={<ScoreEntryPage />} />
            <Route path="/competition/:id/results" element={<ResultsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
