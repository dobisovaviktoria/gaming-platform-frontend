import { useKeycloak } from './hooks/useKeycloak';
import LandingPage from './pages/LandingPage.tsx';
import Dashboard from './pages/Dashboard';
import './theme/global.scss';
import {AuthProvider} from "./contexts/AuthContext.tsx";

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
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;