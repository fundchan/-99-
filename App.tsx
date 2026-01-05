import React, { useState, useEffect, useCallback } from 'react';
import { PixelButton } from './components/PixelButton';
import { PixelCard } from './components/PixelCard';
import { PixelCharacter } from './components/PixelCharacter';
import { Question, GameState } from './types';
import { ArrowRight } from 'lucide-react';
import { playCorrect, playWrong } from './utils/audio';

// Helper to convert numbers to Chinese characters (0-9)
// Correct mapping: 0->〇, 1->一, 2->二 ...
const toChineseNum = (n: number) => "〇一二三四五六七八九"[n];

const getKouJue = (n1: number, n2: number, product: number): string => {
  // Standard Chinese Multiplication Table Rules (九九乘法表)
  
  // Part 1: Operands (e.g. 2, 5 -> 二五)
  const prefix = `${toChineseNum(n1)}${toChineseNum(n2)}`;
  
  // Part 2: Result
  let suffix = "";
  
  if (product < 10) {
    // Single digit results get "得" (e.g., 一一得一, 二四得八)
    suffix = `得${toChineseNum(product)}`;
  } else if (product === 10) {
    // Exactly 10 is "一十" (e.g., 二五一十)
    suffix = "一十";
  } else if (product < 20) {
    // Teens (11-19) omit the leading 'one' for tens place in the table usually?
    // Actually standard table: 三四十二 (3x4=12), 二九十八 (2x9=18). 
    // Just "Ten" + "Unit".
    suffix = `十${toChineseNum(product % 10)}`;
  } else {
    // >= 20
    const tens = Math.floor(product / 10);
    const units = product % 10;
    
    // e.g. 20 -> 二十 (四五二十)
    // e.g. 21 -> 二十一 (三七二十一)
    suffix = `${toChineseNum(tens)}十${units === 0 ? "" : toChineseNum(units)}`;
  }
  
  return `${prefix}${suffix}`;
};

// Shuffle array
const shuffle = <T,>(array: T[]): T[] => {
  return array.sort(() => Math.random() - 0.5);
};

const App: React.FC = () => {
  const [question, setQuestion] = useState<Question>({ num1: 2, num2: 2, product: 4 });
  const [options, setOptions] = useState<number[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.THINKING);
  const [wrongSelection, setWrongSelection] = useState<number | null>(null);
  const [stats, setStats] = useState({ correct: 0, attempts: 0 });

  // Generate options (1 correct, 3 wrong, all sharing the same tens digit where possible)
  const generateOptions = (product: number) => {
    const opts = new Set<number>();
    opts.add(product);
    
    // Determine the tens range (e.g., for 24, range is 20-29)
    const tensStart = Math.floor(product / 10) * 10;
    const tensEnd = tensStart + 9;

    // Create a pool of potential candidates within the same tens range
    const candidates: number[] = [];
    for (let i = tensStart; i <= tensEnd; i++) {
      // Exclude the product itself and 0
      if (i !== product && i > 0) {
        candidates.push(i);
      }
    }

    const shuffledCandidates = shuffle(candidates);

    // Try to fill with same tens digit numbers first
    while (opts.size < 4 && shuffledCandidates.length > 0) {
      opts.add(shuffledCandidates.pop()!);
    }

    // Fallback: If we somehow ran out of numbers in that tens range, pick nearby numbers.
    while (opts.size < 4) {
      const randomOffset = Math.floor(Math.random() * 10) + 1;
      const val = Math.random() > 0.5 ? product + randomOffset : product - randomOffset;
      if (val > 0 && val !== product) {
        opts.add(val);
      }
    }

    return shuffle(Array.from(opts));
  };

  const nextQuestion = useCallback(() => {
    let n1 = Math.floor(Math.random() * 9) + 1;
    let n2 = Math.floor(Math.random() * 9) + 1;
    
    // Standard order (small x large)
    if (n1 > n2) [n1, n2] = [n2, n1];
    
    const product = n1 * n2;
    setQuestion({ num1: n1, num2: n2, product });
    setOptions(generateOptions(product));
    setGameState(GameState.THINKING);
    setWrongSelection(null);
  }, []);

  const handleOptionClick = (value: number) => {
    if (gameState === GameState.REVEALED) return;

    // Increment total attempts for every click
    setStats(prev => ({ ...prev, attempts: prev.attempts + 1 }));

    if (value === question.product) {
      playCorrect();
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      setGameState(GameState.REVEALED);
      setWrongSelection(null);
    } else {
      playWrong();
      setWrongSelection(value);
    }
  };

  useEffect(() => {
    nextQuestion();
  }, [nextQuestion]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4 select-none">
      
      <header className="text-center transform hover:scale-105 transition-transform mb-2">
        <h1 className="text-4xl md:text-6xl text-yellow-400 pixel-text-shadow tracking-widest">
          像素九九乘法
        </h1>
      </header>

      {/* Stats Dashboard */}
      <div className="flex justify-center gap-6 mb-2 font-[DotGothic16]">
         <div className="flex flex-col items-center group">
            <span className="text-xs text-gray-500 font-bold mb-1 group-hover:text-green-600 transition-colors">答对</span>
            <div className="bg-green-100 border-[3px] border-black px-4 py-1 text-2xl min-w-[80px] text-center shadow-[3px_3px_0_0_rgba(0,0,0,1)] text-green-800">
               {stats.correct}
            </div>
         </div>
         <div className="flex flex-col items-center group">
            <span className="text-xs text-gray-500 font-bold mb-1 group-hover:text-blue-600 transition-colors">尝试</span>
            <div className="bg-blue-100 border-[3px] border-black px-4 py-1 text-2xl min-w-[80px] text-center shadow-[3px_3px_0_0_rgba(0,0,0,1)] text-blue-800">
               {stats.attempts}
            </div>
         </div>
      </div>

      <main className="w-full max-w-lg relative">
        
        {/* Main Game Card */}
        <PixelCard className="text-center z-10" color="bg-white">
          <div className="flex justify-center mb-6">
             <div className="transform scale-125">
                <PixelCharacter mood={gameState === GameState.THINKING ? 'thinking' : 'happy'} />
             </div>
          </div>

          {/* Equation Display */}
          <div className="flex items-center justify-center gap-4 text-5xl md:text-7xl my-8 font-black font-sans">
            <div className="text-blue-600 drop-shadow-md">{question.num1}</div>
            <div className="text-gray-400">×</div>
            <div className="text-red-600 drop-shadow-md">{question.num2}</div>
            <div className="text-gray-400">=</div>
            <div className={`${gameState === GameState.REVEALED ? 'text-green-600 scale-110 drop-shadow-md' : 'text-gray-300'} transition-all duration-300`}>
              {gameState === GameState.REVEALED ? question.product : '?'}
            </div>
          </div>

          {/* Result / Options Area */}
          <div className="mt-8 min-h-[160px] flex flex-col justify-center">
            {gameState === GameState.REVEALED ? (
              <div className="animate-pop-in">
                 <div className="bg-yellow-100 border-[4px] border-black p-4 rotate-1 inline-block mb-6 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]">
                    <h3 className="text-3xl md:text-5xl text-purple-700 font-black tracking-widest font-[DotGothic16]">
                      {getKouJue(question.num1, question.num2, question.product)}
                    </h3>
                </div>
                <div>
                  <PixelButton onClick={nextQuestion} variant="primary" className="w-full">
                     <span className="flex items-center justify-center gap-3">
                       下一题 <ArrowRight size={24} strokeWidth={3} />
                    </span>
                  </PixelButton>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {options.map((opt, idx) => (
                  <PixelButton 
                    key={idx} 
                    onClick={() => handleOptionClick(opt)}
                    variant={wrongSelection === opt ? 'danger' : 'secondary'}
                    disabled={wrongSelection === opt}
                    className="text-3xl md:text-4xl h-full"
                  >
                    {opt}
                  </PixelButton>
                ))}
              </div>
            )}
          </div>
        </PixelCard>
      </main>

      <footer className="mt-4 text-center text-gray-500 font-bold opacity-70">
        <p>选出正确的答案!</p>
      </footer>
    </div>
  );
};

export default App;