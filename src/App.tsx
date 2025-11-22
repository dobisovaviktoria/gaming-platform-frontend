import { useKeycloak } from './hooks/useKeycloak';
import LandingPage from './pages/LandingPage.tsx';
import Dashboard from './pages/Dashboard';
import './theme/global.scss';
import {AuthProvider} from "./contexts/AuthContext.tsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function AppContent() {
    const { isAuthenticated } = useKeycloak();

    return (
        <>
            {isAuthenticated ? <Dashboard /> : <LandingPage />}
        </>
    );
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