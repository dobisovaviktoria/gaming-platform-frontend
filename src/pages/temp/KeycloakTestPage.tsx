import { useKeycloak } from '../../hooks/useKeycloak';
import '../LandingPage.scss';

export default function KeycloakTestPage() {
    const { user: { realm_access: { roles } } } = useKeycloak();

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>BanditGames</h1>
                <p className="subtitle">The AI-powered board game platform</p>

                <button className="btn primary">
                    Login
                </button>
                <button className="btn secondary">
                    Create Account
                </button>

                <footer>
                    Integration 5 • Applied Computer Science
                </footer>
            </div>

            {!roles.includes('admin') && (<p className="subtitle">
                you are an admin :)
            </p>)
            }
        </div>
    );
}