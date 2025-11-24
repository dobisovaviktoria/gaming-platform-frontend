export interface Game {
    gameId: string;
    maxPlayers: number;
    description: string;
    isAvailable: boolean;
}

export interface Player {
    playerId: string;
    username: string;
    favoriteGameIds: string[];
}
