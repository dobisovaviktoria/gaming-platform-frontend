import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import keycloak from '../config/keycloak';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    login: () => void;
    register: () => void;
    logout: () => void;
    token: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        keycloak
            .init({
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                pkceMethod: 'S256',
                checkLoginIframe: false,
            })
            .then((authenticated) => {
                if (authenticated) {
                    setIsAuthenticated(true);
                    setUser(keycloak.tokenParsed);
                    setToken(keycloak.token || null);

                    const refreshInterval = setInterval(() => {
                        keycloak.updateToken(30).catch(() => {
                            console.warn('Token refresh failed');
                        });
                    }, 10000);

                    return () => clearInterval(refreshInterval);
                }
            })
            .catch((err) => {
                console.error('Keycloak init failed:', err);
            });
    }, []);

    const login = () => keycloak.login();
    const register = () => keycloak.login({ action: 'register' });
    const logout = () => keycloak.logout({ redirectUri: window.location.origin });

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useKeycloak = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useKeycloak must be used within AuthProvider');
    }
    return context;
};