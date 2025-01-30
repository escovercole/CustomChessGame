import React from 'react';
import { Chessboard } from 'react-chessboard';
import { useGameContext } from '../context/GameContext';
import { Chess, Square } from 'chess.js';
import { updateSquareWithPiece } from '../utils/fenUtils';

//Render chessboard for custom game set up. allowing for unconventional starting position/piece numbers
const CustomChessgameSetup: React.FC = () => {
    const {
        game,
        setGame,
        selectedSquare,
        setSelectedSquare
    } = useGameContext();

    const handleCustomPieceChange = (piece : string) => {
        if (selectedSquare) {
          const newFen = updateSquareWithPiece(game.fen(), selectedSquare, piece);
          setGame(new Chess(newFen));
        }
      };
    
    //If selected square is not a king square, upodate selected square
    const onSquareClick = (square: Square): void => {
        if(square === 'e1' || square === 'e8'){
            setSelectedSquare(null);
        }else{
            setSelectedSquare(square);
        }
    };


    return (
        <>
            <Chessboard
                position={game.fen()} // Use the FEN from the game object directly
                arePiecesDraggable={false} // Disable during AI move
                onSquareClick={onSquareClick}
            />
            {selectedSquare &&
                <div className='row my-2'>
                    <div className='col-12 mb-2 d-flex gap-2 flex-wrap'>
                        {['q', 'r', 'b', 'n', 'p'].map((piece) => (
                        <button
                            key={piece}
                            className='btn btn-secondary'
                            onClick={() => handleCustomPieceChange(piece)}
                        >
                            {piece.toUpperCase()}
                        </button>
                        ))}
                    </div>

                    <div className='col-12 mb-2 d-flex gap-2 flex-wrap'>
                        {['Q', 'R', 'B', 'N', 'P'].map((piece) => (
                            <button
                            key={piece}
                            className='btn btn-light'
                            onClick={() => handleCustomPieceChange(piece)}
                            >
                            {piece}
                            </button>
                        ))}
                    </div>
                </div>  
            }
        </>
    );
};

export default CustomChessgameSetup;
