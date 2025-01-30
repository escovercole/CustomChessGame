import { Chess } from 'chess.js';

export interface ChessgameProps {
  game: Chess;
  gameStatus: GameStatus;
}

export interface ChessMenuProps {
  gameStatus: GameStatus;
  setGameStatus: (status: GameStatus) => void;
}

export interface GameStatus{
    gameMode: string;
    isStarted: boolean;
    isOver: boolean;
    winner: string | null;
}