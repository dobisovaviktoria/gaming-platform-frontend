import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useKeycloak } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import './theme/global.scss';
import PythonGamesSection from "./components/PythonGamesSection.tsx";

const queryClient = new QueryClient();

function AppContent() {
    const { isAuthenticated } = useKeycloak();
    return <>{isAuthenticated ? (
        <>
            <Dashboard />
            <PythonGamesSection />
        </>
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