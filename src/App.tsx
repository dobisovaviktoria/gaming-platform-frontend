import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useKeycloak } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import './theme/global.scss';
import {BrowserRouter, Route, Routes} from "react-router";
import NotificationsPage from "./pages/NotificationsPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import FriendsPage from "./pages/FriendsPage.tsx";
import AddGamePage from "./pages/AddGamePage.tsx";
import AchievementsPage from "./pages/AchievementsPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import ChatbotTestPage from "./pages/temp/ChatbotTestPage.tsx";
import GameAchievementsPage from "./pages/GameAchievementsPage.tsx";
import GameStatsPage from "./pages/GameStatsPage.tsx";
import AddFriendsPage from "./pages/AddFriendsPage.tsx";
import AddingGamePage from "./pages/AddingGamePage.tsx";
import Dashboard2 from "./pages/Dashboard2.tsx";
import GameTestPage from "./pages/temp/GameTestPage.tsx";
import GameDetailsPage from "./pages/temp/GameDetailsPage.tsx";
import GamePlayPage from "./pages/GamePlayPage.tsx";

const queryClient = new QueryClient();

function AuthenticatedRouting() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/notifications" element={<NotificationsPage/>} />
                <Route path="/" element={<Dashboard2/>} />
                <Route path="/search" element={<SearchPage/>} />
                <Route path="/friends" element={<FriendsPage/>} />
                <Route path="/friends/add" element={<AddFriendsPage />} />
                <Route path="/add-game" element={<AddGamePage/>} />
                <Route path="/add-game/new" element={<AddingGamePage />} />
                <Route path="/achievements" element={<AchievementsPage/>} />
                <Route path="/profile" element={<ProfilePage/>} />
                <Route path="/game/:id" element={<GameDetailsPage />} />
                <Route path="/game/:gameId/achievements" element={<GameAchievementsPage />} />
                <Route path="/game/:gameId/statistics" element={<GameStatsPage />} />
                <Route path="/game/:gameId/play" element={<GamePlayPage />} />

                <Route path="/chatbottest" element={<ChatbotTestPage/>} />
                <Route path="/gametest" element={<GameTestPage/>} />
            </Routes>
        </BrowserRouter>
    )
}

function AppContent() {
    const { isAuthenticated } = useKeycloak();
    return <>{isAuthenticated ? (
        <AuthenticatedRouting />
    ) : (
        <LandingPage />
    )}</>;
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;