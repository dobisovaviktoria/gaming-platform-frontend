import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useKeycloak = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useKeycloak must be used within AuthProvider');
    return context;
};