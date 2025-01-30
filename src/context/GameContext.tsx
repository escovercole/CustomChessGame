import React, { createContext, useContext, useState } from 'react';
import { Chess, Square } from 'chess.js';
import { GameStatus } from '../types/chessTypes';
import { getStockfishMove } from '../services/stockfishService';

interface GameContextProps {
    game: Chess;
    setGame: (game: Chess) => void;
    gameStatus: GameStatus;
    setGameStatus: (status: GameStatus) => void;
    selectedSquare: string | null;
    setSelectedSquare: (square: string | null) => void;
    customSquareStyles: Record<string, React.CSSProperties>;
    setCustomSquareStyles: (styles: Record<string, React.CSSProperties>) => void;
    makeMove: (from: string, to: string) => boolean;
    makeAIMove: () => Promise<boolean>;
    colorSelectedSquare: (square: Square) => boolean;
    undoMove: () => boolean;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [game, setGame] = useState(new Chess());

    const initialGameStatus: GameStatus = {
        gameMode: 'normal',
        isStarted: false,
        isOver: false,
        winner: null,
    };

    const [gameStatus, setGameStatus] = useState<GameStatus>(initialGameStatus);
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [customSquareStyles, setCustomSquareStyles] = useState<Record<string, React.CSSProperties>>({});

    const checkGameEnded = (): boolean => {
        if(game.isCheckmate()){
            setGameStatus({
                ...gameStatus,
                isOver: true,
                winner: game.turn() === 'w' ? 'Black' : 'White'
            });
            return true;
        }else if(game.isThreefoldRepetition() || game.isStalemate() || game.isDrawByFiftyMoves() || game.isInsufficientMaterial()){
            setGameStatus({
                ...gameStatus,
                isOver: true
            })
            return true;
        }
        return false;
    };

    const makeMove = (from: string, to: string, promotion: string = 'q'): boolean => {
        if (!from || !to) return false;
    
        try {
            const move = game.move({ from, to, promotion });  
    
            if(move){
                const gameEnded = checkGameEnded();
                if (!gameEnded) {
                    setGameStatus(prevStatus => ({
                        ...prevStatus,
                        isStarted: true,
                    }));
                }
                return true; // Move was successful
            }
            
            return false; // Move failed
        } catch {
            return false; // Invalid move
        }
    };
    
    const makeAIMove = async (): Promise<boolean> => {
        const move = await getStockfishMove(game.fen());
        console.log("stockfish move " + move);
      
        const from = move.slice(0, 2);
        const to = move.slice(2, 4);
        const promotion = move.length === 5 ? move[4] : '';
      
        const aiMoveSuccessful = makeMove(from, to, promotion);
    
        return aiMoveSuccessful;
    };
    

    const undoMove = (): boolean => {
        game.undo();
        const move = game.undo(); 
        if (move) {
            setGameStatus((prev) => ({ ...prev, winner: null, isOver: false }));
            return true;
        }
        return false;
    };
    

    const colorSelectedSquare = (square : Square): boolean => {
        const moves = game.moves({ square });
        if(moves.length <= 0){
            return false;
        }

        const newStyles: Record<string, React.CSSProperties> = {
            [square]: { backgroundColor: 'rgba(255, 215, 0, 0.6)' }, // Highlight selected square
        };

        // Add styles for possible moves
        moves.forEach(move => {
            const squareColor = move.indexOf("+") === -1 ? 'rgba(245, 133, 133, 0.8)' : 'rgba(197, 255, 158, 1)' ;
            const targetSquare = move.replace(/[\+#]*$/, '').slice(-2);
            newStyles[targetSquare] = { backgroundColor: squareColor }; // Highlight possible move squares
        });

        setCustomSquareStyles(prevStyles => ({
            ...prevStyles,
            ...newStyles,
        }));
        return true;
    }

    return (
        <GameContext.Provider
            value={{
                game,
                setGame,
                gameStatus,
                setGameStatus,
                selectedSquare,
                setSelectedSquare,
                customSquareStyles,
                setCustomSquareStyles,
                makeMove,
                makeAIMove,
                colorSelectedSquare,
                undoMove,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = (): GameContextProps => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
};
