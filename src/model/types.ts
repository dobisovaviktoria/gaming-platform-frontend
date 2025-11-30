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

export interface Achievement {
    id: string;
    name: string;
    description: string;
    criteria: string;
    unlocked: boolean;
    unlockedAt: string | null;
}

export interface PlayerAchievementsResponse {
    playerId: string;
    gameId: string;
    achievements: Achievement[];
    unlockedCount: number;
    totalCount: number;
}

export interface PlayerGameStats {
    playerId: string;
    gameId: string;
    wins: number;
    losses: number;
    gamesPlayed: number;
    totalScore: number;
    totalKills: number;
    currentWinStreak: number;
    perfectGames: number;
}

export interface GameWithAchievements {
    gameId: string;
    gameName: string;
    achievements: Achievement[];
}
