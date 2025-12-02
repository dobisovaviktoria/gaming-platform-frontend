export interface Game {
    id: string;
    name: string;
    url: string;
    pictureUrl: string;
    description: string;
    rules: string;
    maxPlayers: number;
}

export interface NewGame {
    name: string;
    url: string;
    pictureUrl: string;
    description: string;
    rules: string;
    maxPlayers: number;
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
