import { useKeycloak } from '../hooks/useKeycloak';

export default function Dashboard() {
    const { user, logout } = useKeycloak();

    return (
        <div className="dashboard">
            <h1>Welcome, {user?.preferred_username || 'Player'}!</h1>
            <p>This is your BanditGames dashboard</p>
            <button onClick={logout}>Logout</button>
            <h2>Under construction</h2>
        </div>
    );
}