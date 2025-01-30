import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { useGameContext } from '../context/GameContext';
import { Square } from 'chess.js';


//Render the chessboard
//Handle movement inputs and AI response
const Chessgame: React.FC = () => {
    const {
        game,
        gameStatus,
        selectedSquare,
        setSelectedSquare,
        customSquareStyles,
        setCustomSquareStyles,
        makeMove,
        makeAIMove,
        colorSelectedSquare
    } = useGameContext();

    const [isAIMoving, setIsAIMoving] = useState<boolean>(false);
    const [showGameOverModal, setShowGameOverModal] = useState<boolean>(gameStatus.isOver);

    useEffect(() => {
        if (gameStatus.isOver) {
            setShowGameOverModal(true);
        } else {
            setShowGameOverModal(false);
        }
    }, [gameStatus]);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    //Handle move by clicking the from square and then the to square
    //  If selectedSquare is not set, update it to square
    //  If selectedSquare is already set, check if from-to is valid. if not update selected square
    //  If move is valid, make move and await AI move
    const onSquareClick = async (square: Square): Promise<void> => {
        if (selectedSquare) {
            const moveSuccessful = makeMove(selectedSquare, square);
            setCustomSquareStyles({});
            if (moveSuccessful) {
                setSelectedSquare(null);
                await handleAIMove();
            } else {
                handleInvalidMove(square);
            }
        } else {
            handleInvalidMove(square);
        }
    };

    //Update isAIMoving to disable user inputs while awaiting
    //delay for a period and then make AI move
    const handleAIMove = async (): Promise<void> => {
        setIsAIMoving(true);
        await delay(1000); 
        await makeAIMove();
        setIsAIMoving(false);
    }

    //If the selected square is eligible to move, update selectedSquare value
    const handleInvalidMove = (square: Square): void => {
        if (colorSelectedSquare(square)) setSelectedSquare(square);
    };

    const handleCloseModal = () => {
        setShowGameOverModal(false);
    };

    return (
        <>
            <Chessboard
                position={game.fen()} // Use the FEN from the game object directly
                arePiecesDraggable={false}
                onSquareClick={isAIMoving ? () => {} : onSquareClick} // Disable click during AI move
                customSquareStyles={customSquareStyles}
            />
            {showGameOverModal && (
                <div className="modal show d-block" tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Game Over</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    {gameStatus.winner ? `${gameStatus.winner} wins!` : "It's a draw!"}
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chessgame;
