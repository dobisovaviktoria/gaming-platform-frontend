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

export interface PythonGameState {
  gameId: string;
  boardCells: string[];
  currentTurn: 'X' | 'O';
  winner: 'X' | 'O' | null;
  isDraw: boolean;
  status: 'in_progress' | 'win' | 'draw' | 'waiting_for_opponent';
  player_x_id: string;
  player_o_id: string | null;
  currentPlayerWinProbability: number | null;

}

export interface DataGenerationConfig {
    game: string;
    plays: number;
}

export interface DataGenerationResponse {
    file: string;
    game: string;
    wins: number;
    draws: number;
    losses: number;
}

export interface Level {
    level: number;
    name: string;
    description: string
    requirements: {
        games: number;
        achievements: number;
        friends: number;
    };
}

export const LEVELS: Level[] = [
    {level: 1, name: 'Novice', description: 'Just starting your gaming journey', requirements: {games: 1, achievements: 0, friends: 0}},
    {level: 2, name: 'Explorer', description: 'Venturing into new territories', requirements: {games: 10, achievements: 1, friends: 0}},
    {level: 3, name: 'Adventurer', description: 'Growing confidence in gaming', requirements: {games: 30, achievements: 5, friends: 0}},
    {level: 4, name: 'Challenger', description: 'Embracing new challenges', requirements: {games: 50, achievements: 10, friends: 0}},
    {level: 5, name: 'Master', description: 'Mastering the fundamentals', requirements: {games: 100, achievements: 20, friends: 1}},
    {level: 6, name: 'Elite', description: 'Standing among the best', requirements: {games: 150, achievements: 25, friends: 5}},
    {level: 7, name: 'Legend', description: 'Your name echoes through the games', requirements: {games: 200, achievements: 30, friends: 10}},
    {level: 8, name: 'Mythic', description: 'Nearly unstoppable force', requirements: {games: 250, achievements: 50, friends: 20}},
    {level: 9, name: 'Ascendant', description: 'Transcending normal limits', requirements: {games: 500, achievements: 100, friends: 30}},
    {level: 10, name: 'Eternal', description: 'The pinnacle of gaming mastery', requirements: {games: 1000, achievements: 100, friends: 50}},
];
