import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Chess } from 'chess.js';


//Render Menu and handle associated calls
const ChessMenu: React.FC = () => {
    const { setGame, gameStatus, setGameStatus, selectedSquare, setSelectedSquare, setCustomSquareStyles, makeAIMove, undoMove } = useGameContext();

    const handleModeChange = (modeType: 'normal' | 'custom') => {
        setGameStatus({
            ...gameStatus,
            gameMode: modeType,
        });
    };

    //Handle AI movement on behalf of the player, make AI player move in response
    const handleAIMove = async() => {
        resetSelection();
        await makeAIMove();
        await makeAIMove();
    }

    //Reset selection of the selected square
    const resetSelection = () => {
        setSelectedSquare(null);
        setCustomSquareStyles({});
    };

    const resetGame = () => {
        const confirmReset = window.confirm("Are you sure you want to reset the game?");
        if (confirmReset) {
            setGame(new Chess());
            setGameStatus({
                gameMode: 'normal',
                isStarted: false,
                isOver: false,
                winner: null,
            });
            resetSelection();
        }
    };

    return (
        <div className="card fixed-card">
            <div className="card-header">
                <h3>Menu</h3>
            </div>

            <div className="card-body">
                {/* Each button gets its own row */}
                <div className="row mb-2">
                    <div className="col-12">
                        {gameStatus.gameMode !== 'custom' ? (
                            <button
                                className="btn btn-primary w-100" // Full-width button
                                disabled={gameStatus.isStarted}
                                onClick={() => handleModeChange('custom')}
                            >
                                Customize Game <i className="fa-solid fa-chess"></i>
                            </button>
                        ) : (
                            <button
                                className="btn btn-success w-100"
                                onClick={() => handleModeChange('normal')}
                            >
                                Play <i className="fa-solid fa-play"></i>
                            </button>
                        )}
                    </div>
                </div>

                {gameStatus.gameMode === 'normal' && (
                    <div className="row mb-2">
                        <div className="col-12">
                            <button
                                className="btn btn-success w-100"
                                onClick={() => handleAIMove()}
                            >
                                AI Move <i className="fa-solid fa-robot"></i>
                            </button>
                        </div>
                    </div>
                )}

                {gameStatus.isStarted && (
                    <div className="row mb-2">
                        <div className="col-12">
                            <button
                                className="btn btn-secondary w-100"
                                onClick={undoMove}
                            >
                                Undo Move <i className="fa-solid fa-backward"></i>
                            </button>
                        </div>
                    </div>
                )}

                {selectedSquare && (
                    <div className="row mb-2">
                        <div className="col-12">
                            <button
                                className="btn btn-danger w-100"
                                onClick={resetSelection}
                            >
                                Reset Selection <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>
                )}

                <div className="row mb-2">
                    <div className="col-12">
                        <button
                            className="btn btn-warning w-100"
                            onClick={resetGame}
                        >
                            Reset Game <i className="fa-solid fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChessMenu;
