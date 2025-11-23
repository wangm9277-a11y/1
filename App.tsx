import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { generateTcmCase } from './services/geminiService';
import { TcmCase, GameState, GameStats } from './types';
import { PatientView } from './components/PatientView';
import { DialogueBox } from './components/DialogueBox';
import { OptionsPanel } from './components/OptionsPanel';
import { PixelCard } from './components/PixelCard';
import { INITIAL_LIVES, POINTS_PER_QUESTION, THEME_COLORS } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [currentCase, setCurrentCase] = useState<TcmCase | null>(null);
  const [stats, setStats] = useState<GameStats>({ score: 0, lives: INITIAL_LIVES, streak: 0 });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load a new case
  const loadNewCase = useCallback(async () => {
    setLoading(true);
    setGameState('LOADING');
    setSelectedOption(null);
    try {
      const newCase = await generateTcmCase();
      setCurrentCase(newCase);
      setGameState('PLAYING');
    } catch (e) {
      console.error(e);
      // Basic error handling - could go back to menu
      setGameState('MENU');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStartGame = () => {
    setStats({ score: 0, lives: INITIAL_LIVES, streak: 0 });
    loadNewCase();
  };

  const handleAnswer = (answer: string) => {
    setSelectedOption(answer);
    setGameState('FEEDBACK');
    
    const isCorrect = answer === currentCase?.correctDiagnosis;
    
    if (isCorrect) {
      setStats(prev => ({
        ...prev,
        score: prev.score + POINTS_PER_QUESTION + (prev.streak * 10),
        streak: prev.streak + 1
      }));
    } else {
      setStats(prev => ({
        ...prev,
        lives: prev.lives - 1,
        streak: 0
      }));
    }
  };

  const handleNext = () => {
    if (stats.lives <= 0) {
      setGameState('GAME_OVER');
    } else {
      loadNewCase();
    }
  };

  // --- RENDER HELPERS ---

  if (gameState === 'MENU') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#2d2a2e] bg-[radial-gradient(circle,rgba(45,42,46,1)_0%,rgba(20,20,20,1)_100%)]">
        <div className="max-w-md w-full text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-[#e0e0e0] mb-2 font-serif tracking-tighter drop-shadow-[4px_4px_0_rgba(180,50,50,1)]">
            中医诊室
          </h1>
          <h2 className="text-xl md:text-2xl text-amber-500 mb-12 font-mono tracking-widest">TCM DIAGNOSIS SIM</h2>
          
          <PixelCard className="bg-amber-100">
            <p className="mb-6 text-gray-800 text-lg pixel-font-zh">
              欢迎来到模拟诊所。<br/>
              请根据病人的<span className="font-bold text-red-700">面色</span>、<span className="font-bold text-red-700">舌象</span>、<span className="font-bold text-blue-700">脉象</span>及<span className="font-bold text-green-700">主诉</span>进行辨证。
            </p>
            <button 
              onClick={handleStartGame}
              className="w-full bg-red-700 text-white text-2xl font-bold py-4 px-8 border-4 border-black shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-none active:bg-red-800 transition-all pixel-font-zh"
            >
              开始接诊 (START)
            </button>
          </PixelCard>
          
          <div className="mt-8 text-gray-500 text-sm font-mono">
             POWERED BY GEMINI 2.5 FLASH
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'GAME_OVER') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-red-950 text-white">
        <h1 className="text-6xl font-bold mb-8 font-mono text-red-500 drop-shadow-[4px_4px_0_#000]">GAME OVER</h1>
        <PixelCard className="bg-white text-black text-center w-full max-w-md">
          <div className="mb-4">
            <div className="text-2xl font-bold pixel-font-zh mb-2">最终得分</div>
            <div className="text-5xl font-mono text-blue-800">{stats.score}</div>
          </div>
          <button 
            onClick={handleStartGame}
            className="mt-6 bg-blue-600 text-white px-8 py-3 font-bold border-4 border-black shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-none"
          >
            再次挑战 (RETRY)
          </button>
        </PixelCard>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${THEME_COLORS.bg} p-4 md:p-8 flex flex-col font-sans transition-colors duration-500`}>
      {/* Header Stats */}
      <div className="max-w-4xl mx-auto w-full flex justify-between items-center mb-6 bg-gray-900 text-white p-3 border-b-4 border-black shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">SCORE</span>
            <span className="text-xl md:text-2xl font-mono text-yellow-400 leading-none">{stats.score.toString().padStart(5, '0')}</span>
          </div>
        </div>
        <div className="flex space-x-2">
           {Array.from({ length: Math.max(0, stats.lives) }).map((_, i) => (
             <div key={i} className="w-6 h-6 bg-red-500 border-2 border-white shadow-[2px_2px_0_0_#000]"></div>
           ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-8 border-gray-800 border-t-red-600 rounded-none animate-spin mb-4"></div>
          <p className="font-mono text-xl animate-pulse">病人正在入场...</p>
        </div>
      )}

      {/* Main Game Area */}
      {!loading && currentCase && (
        <div className="flex-1 flex flex-col">
          <PatientView patientData={currentCase} />
          
          <DialogueBox text={currentCase.complaint} />
          
          {gameState === 'PLAYING' && (
            <OptionsPanel 
              tcmCase={currentCase} 
              onSelect={handleAnswer} 
              disabled={false}
            />
          )}

          {gameState === 'FEEDBACK' && (
            <div className="w-full max-w-4xl mx-auto mt-6 animate-[fadeIn_0.3s_ease-out]">
              <PixelCard 
                title={selectedOption === currentCase.correctDiagnosis ? "诊断正确 (CORRECT)" : "诊断错误 (WRONG)"} 
                variant={selectedOption === currentCase.correctDiagnosis ? "success" : "danger"}
              >
                <div className="flex flex-col gap-4">
                  <div className="text-lg pixel-font-zh font-bold">
                    {selectedOption === currentCase.correctDiagnosis 
                      ? "太棒了！辨证准确。" 
                      : `很遗憾。正确诊断应为：${currentCase.correctDiagnosis}`}
                  </div>
                  <div className="bg-white/50 p-3 border-l-4 border-black/20 text-gray-900 text-sm md:text-base leading-relaxed">
                    <span className="font-bold block mb-1">【解析 Explaination】</span>
                    {currentCase.explanation}
                  </div>
                  <div className="flex justify-end mt-2">
                    <button 
                      onClick={handleNext}
                      className="bg-gray-900 text-white px-6 py-2 border-2 border-black shadow-[3px_3px_0_0_#fff] hover:translate-y-1 hover:shadow-none font-mono"
                    >
                      {stats.lives > 0 ? "下一位病人 (NEXT) ->" : "查看结果 (FINISH)"}
                    </button>
                  </div>
                </div>
              </PixelCard>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;