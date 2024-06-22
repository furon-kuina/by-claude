import React, { useState, useEffect } from 'react';
import { X, Circle, AlertCircle } from 'lucide-react';

type MoleType = 'circle' | 'cross' | 'golden' | null;

interface GameState {
  score: number;
  timeLeft: number;
  moles: MoleType[];
  gameOver: boolean;
  gameStarted: boolean;
}

const WhackAMole: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    timeLeft: 30,
    moles: Array(9).fill(null),
    gameOver: false,
    gameStarted: false
  });

  useEffect(() => {
    if (gameState.gameStarted && gameState.timeLeft > 0) {
      const timer = setTimeout(() => 
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 })), 
      1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0) {
      setGameState(prev => ({ ...prev, gameOver: true, gameStarted: false }));
    }
  }, [gameState.timeLeft, gameState.gameStarted]);

  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameOver) {
      const moleTimer = setInterval(() => {
        setGameState(prev => {
          const newMoles = [...prev.moles];
          const emptyHoles = newMoles.map((_, index) => index).filter(index => newMoles[index] === null);
          if (emptyHoles.length > 0) {
            const randomHole = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
            const moleType = Math.random() < 0.1 ? 'golden' : (Math.random() < 0.5 ? 'circle' : 'cross');
            newMoles[randomHole] = moleType;
          }
          return { ...prev, moles: newMoles };
        });
      }, 1000);

      const disappearTimer = setInterval(() => {
        setGameState(prev => {
          const newMoles = prev.moles.map(mole => 
            mole === 'golden' ? null : (Math.random() < 0.4 ? null : mole)
          );
          return { ...prev, moles: newMoles };
        });
      }, 200); // 通常のモグラの表示時間を短縮
      
      return () => {
        clearInterval(moleTimer);
        clearInterval(disappearTimer);
      };
    }
  }, [gameState.gameOver, gameState.gameStarted]);

  const whackMole = (index: number): void => {
    if (gameState.gameStarted && gameState.moles[index] !== null) {
      setGameState(prev => {
        let scoreChange = 0;
        switch (prev.moles[index]) {
          case 'circle':
            scoreChange = 1;
            break;
          case 'cross':
            scoreChange = -1;
            break;
          case 'golden':
            scoreChange = 3;
            break;
        }
        const newMoles = [...prev.moles];
        newMoles[index] = null;
        return {
          ...prev,
          score: Math.max(0, prev.score + scoreChange),
          moles: newMoles
        };
      });
    }
  };

  const startGame = (): void => {
    setGameState({
      score: 0,
      timeLeft: 30,
      moles: Array(9).fill(null),
      gameOver: false,
      gameStarted: true
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-4">
      <h1 className="text-4xl font-bold mb-4">モグラたたき</h1>
      {!gameState.gameStarted && !gameState.gameOver && (
        <div className="text-center">
          <p className="mb-4 text-lg">
            ルール説明:<br/>
            - 緑色の丸(○)のモグラ: +1点<br/>
            - 赤色のバツ(×)のモグラ: -1点<br/>
            - 金色のモグラ: +3点<br/>
            - 制限時間は30秒です
          </p>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xl font-bold"
            onClick={startGame}
          >
            ゲームスタート
          </button>
        </div>
      )}
      {gameState.gameStarted && (
        <>
          <div className="mb-4">
            <span className="text-xl font-semibold">スコア: {gameState.score}</span>
            <span className="text-xl font-semibold ml-4">残り時間: {gameState.timeLeft}秒</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {gameState.moles.map((mole, index) => (
              <div
                key={index}
                className={`w-16 h-16 md:w-24 md:h-24 bg-brown-500 rounded-full cursor-pointer flex items-center justify-center ${
                  mole ? 'bg-brown-700' : ''
                }`}
                onClick={() => whackMole(index)}
              >
                {mole && (
                  <div className={`w-12 h-12 md:w-16 md:h-16 ${
                    mole === 'golden' ? 'bg-yellow-300' : 'bg-gray-300'
                  } rounded-full flex items-center justify-center`}>
                    {mole === 'circle' && <Circle size={24} color="green" />}
                    {mole === 'cross' && <X size={24} color="red" />}
                    {mole === 'golden' && <AlertCircle size={24} color="gold" />}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {gameState.gameOver && (
        <div className="mt-8 flex flex-col items-center">
          <p className="text-2xl font-bold mb-4">ゲームオーバー！ 最終スコア: {gameState.score}</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
            onClick={startGame}
          >
            もう一度プレイ
          </button>
        </div>
      )}
    </div>
  );
};

export default WhackAMole;