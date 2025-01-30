import { PieceSymbol } from 'chess.js';
import { Chess, Square } from 'chess.js';

const validPieces = ['p', 'r', 'n', 'b', 'q', 'k', 'P', 'R', 'N', 'B', 'Q', 'K'];
const validSquares = /^[a-h][1-8]$/;


//update fen to have piece at location square
export const updateSquareWithPiece = (fen : string, square : string, piece : string) => {
  if (!validSquares.test(square)) {
    throw new Error(`Invalid square: ${square}. Must be a valid chess square (e.g., 'e4').`);
  }

  if (piece !== null && !validPieces.includes(piece)) {
    throw new Error(`Invalid piece: ${piece}. Must be one of ${validPieces.join(', ')} or null.`);
  }

  const game = new Chess(fen);

  if (piece === null) {
    game.remove(square as Square);
  } else {
    const color = piece === piece.toLowerCase() ? 'b' : 'w';
    const type = piece.toLowerCase() as PieceSymbol;
    game.put({ type, color }, square as Square);
  }

  return game.fen();
};
