import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useKeycloak } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import './theme/global.scss';
import {BrowserRouter, Route, Routes} from "react-router";
import NotificationsPage from "./pages/player/NotificationsPage.tsx";
import SearchPage from "./pages/player/SearchPage.tsx";
import FriendsPage from "./pages/player/FriendsPage.tsx";
import AddGamePage from "./pages/player/AddGamePage.tsx";
import AchievementsPage from "./pages/player/AchievementsPage.tsx";
import ProfilePage from "./pages/player/ProfilePage.tsx";
import ChatbotTestPage from "./pages/temp/ChatbotTestPage.tsx";
import GameAchievementsPage from "./pages/player/GameAchievementsPage.tsx";
import GameStatsPage from "./pages/player/GameStatsPage.tsx";
import AddFriendsPage from "./pages/player/AddFriendsPage.tsx";
import AddingGamePage from "./pages/player/AddingGamePage.tsx";
import Dashboard2 from "./pages/player/Dashboard.tsx";
import GameDetailsPage from "./pages/player/GameDetailsPage.tsx";
import TicTacToeGame from "../premade-games/tictactoe/src/original/TicTacToeGame.tsx";
import KeycloakTestPage from "./pages/temp/KeycloakTestPage.tsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.tsx";
import AdminGamesPage from "./pages/admin/AdminGamesPage.tsx";
// import ChatbotOverlay from "./components/overlays/ChatbotOverlay.tsx";
// import {useState} from "react";

const queryClient = new QueryClient();

function AuthenticatedRouting() {
    // const [isChatOpen, setIsChatOpen] = useState(false);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/notifications" element={<NotificationsPage/>} />
                <Route index element={<Dashboard2/>} />
                <Route path="/search" element={<SearchPage/>} />
                <Route path="/friends">
                    <Route path="" element={<FriendsPage/>} />
                    <Route path="add" element={<AddFriendsPage />} />
                </Route>
                <Route path="/add-game">
                    <Route path="" element={<AddGamePage/>} />
                    <Route path="new" element={<AddingGamePage />} />
                </Route>
                <Route path="/achievements" element={<AchievementsPage/>} />
                <Route path="/profile" element={<ProfilePage/>} />
                <Route path="/game/:gameId">
                    <Route path="" element={<GameDetailsPage />} />
                    <Route path="end" element={<GameDetailsPage isEnd={true} />} />
                    <Route path="achievements" element={<GameAchievementsPage />} />
                    <Route path="statistics" element={<GameStatsPage />} />
                    <Route path="play" element={<TicTacToeGame />} />
                </Route>
                <Route path="/admin">
                    <Route path="" element={<AdminDashboardPage/>} />
                    <Route path="games" element={<AdminGamesPage/>} />

                    <Route path="test" element={<KeycloakTestPage />} />
                </Route>

                <Route path="/chatbottest" element={<ChatbotTestPage/>} />
                <Route path="/keycloaktest" element={<KeycloakTestPage/>} />
            </Routes>
            {/*<button*/}
            {/*    className="floating-chat-btn"*/}
            {/*    onClick={() => setIsChatOpen(true)}*/}
            {/*    aria-label="Open chat"*/}
            {/*>*/}
            {/*    💬*/}
            {/*</button>*/}
            {/*<ChatbotOverlay isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />*/}
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