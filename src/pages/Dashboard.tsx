import { useQuery } from '@tanstack/react-query';
import { getCurrentPlayer } from '../services/player';
import { getGames } from '../services/game';
import { useKeycloak } from '../contexts/AuthContext';
import GameCard from '../components/GameCard';
import type {Game, Player} from '../model/types.ts';
import './Dashboard.scss';

export default function Dashboard() {
    const { logout } = useKeycloak();

    const { data: player, isLoading: isLoadingPlayer } = useQuery<Player, Error>({
        queryKey: ['player'],
        queryFn: getCurrentPlayer
    });

    const { data: games, isLoading: isLoadingGames } = useQuery<Game[], Error>({
        queryKey: ['games'],
        queryFn: getGames
    });

    if (isLoadingPlayer || isLoadingGames) return <div className="dashboard">Loading...</div>;

    const favoriteGames = games?.filter((g) => player?.favoriteGameIds.includes(g.gameId)) || [];

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
                        {favoriteGames.map((game) => (
                            <GameCard key={game.gameId} game={game} />
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)' }}>You haven't marked any games as favorites yet.</p>
                )}
            </section>

            <section>
                <h2>All Games</h2>
                <div className="game-grid">
                    {games?.map((game) => (
                        <GameCard key={game.gameId} game={game} />
                    ))}
                </div>
            </section>
        </div>
    );
}