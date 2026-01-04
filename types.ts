
export enum Role {
  CIVIL = 'Petit Beurre',
  UNDERCOVER = 'Buttercover',
  MR_WHITE = 'La Crémière'
}

export interface Player {
  id: string;
  name: string;
  role: Role;
  word: string;
  isEliminated: boolean;
  color: string;
  turnPosition?: number;
}

export interface WordPair {
  civil: string;
  undercover: string;
}

export type GameState = 
  | 'SETUP' 
  | 'REVEAL' 
  | 'DISCUSSION' 
  | 'VOTING_COUNTDOWN' 
  | 'VOTING' 
  | 'ELIMINATION_RESULT' 
  | 'MR_WHITE_GUESS' 
  | 'GAME_OVER';

export interface GameSettings {
  civilsCount: number;
  undercoversCount: number;
  mrWhitesCount: number;
}
