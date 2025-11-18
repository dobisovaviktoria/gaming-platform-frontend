import { useKeycloak } from '../hooks/useKeycloak';
import './LandingPage.scss';

export default function LandingPage() {
    const { login, register } = useKeycloak();

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>BanditGames</h1>
                <p className="subtitle">The AI-powered board game platform</p>

                <button onClick={login} className="btn primary">
                    Login
                </button>
                <button onClick={register} className="btn secondary">
                    Create Account
                </button>

                <footer>
                    Integration 5 • Applied Computer Science
                </footer>
            </div>
        </div>
    );
}