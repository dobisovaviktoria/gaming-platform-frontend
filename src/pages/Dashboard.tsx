import { useQuery } from '@tanstack/react-query';
import { useKeycloak } from '../hooks/useKeycloak';
import { getCurrentPlayer, getGames } from '../services/api';
import './Dashboard.scss';

export default function Dashboard() {
    const { logout } = useKeycloak();

    const { data: player, isLoading: isLoadingPlayer } = useQuery({
        queryKey: ['player'],
        queryFn: getCurrentPlayer
    });

    const { data: games, isLoading: isLoadingGames } = useQuery({
        queryKey: ['games'],
        queryFn: getGames
    });

    if (isLoadingPlayer || isLoadingGames) {
        return <div className="dashboard">Loading...</div>;
    }

    const favoriteGames = games?.filter(game => player?.favoriteGameIds.includes(game.gameId)) || [];

    return (
        <div className="dashboard">
            <header>
                <h1>Welcome, {player?.username}!</h1>
                <button onClick={logout} className="btn-logout">Logout</button>
            </header>

            <section>
                <h2>Your Favorite Games</h2>
                {favoriteGames.length > 0 ? (
                    <div className="game-grid">
                        {favoriteGames.map(game => (
                            <div key={game.gameId} className="game-card">
                                <h3>{game.description}</h3>
                                <p>Max Players: {game.maxPlayers}</p>
                                <span className={`status ${game.isAvailable ? 'available' : 'unavailable'}`}>
                                    {game.isAvailable ? 'Available' : 'Unavailable'}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)' }}>You haven't marked any games as favorites yet.</p>
                )}
            </section>

            <section>
                <h2>All Games</h2>
                <div className="game-grid">
                    {games?.map(game => (
                        <div key={game.gameId} className="game-card">
                            <h3>{game.description}</h3>
                            <p>Max Players: {game.maxPlayers}</p>
                            <span className={`status ${game.isAvailable ? 'available' : 'unavailable'}`}>
                                {game.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}