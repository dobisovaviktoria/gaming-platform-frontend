import { useKeycloak } from './hooks/useKeycloak';
import LandingPage from './pages/LandingPage.tsx';
import Dashboard from './pages/Dashboard';
import './theme/global.scss';

function App() {
    const { isAuthenticated } = useKeycloak();

    return (
        <>
            {isAuthenticated ? <Dashboard /> : <LandingPage />}
        </>
    );
}

export default App;