import React from 'react';
import { GameProvider, useGameContext } from './context/GameContext';
import Chessgame from './components/Chessgame';
import ChessMenu from './components/ChessMenu';
import CustomChessgameSetup from './components/CustomChessgameSetup';
import './App.css'

const App: React.FC = () => {
    return (
        <GameProvider>
            <MainContent />
        </GameProvider>
    );
};

const MainContent: React.FC = () => {
    const { gameStatus } = useGameContext();

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center">
            <div className="my-4 chessboard-container">
                {gameStatus.gameMode === 'custom' ? (
                    <CustomChessgameSetup />
                ) : (
                    <Chessgame />
                )}
            </div>

            <div className="text-center">
                <ChessMenu />
            </div>
        </div>
    );
};

export default App;
