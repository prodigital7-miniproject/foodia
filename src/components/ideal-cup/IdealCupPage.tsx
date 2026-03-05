"use client";

import React, { useState, useEffect } from "react";
import {
  CATEGORIES,
  mapDBtoFoods,
  getBracketSize,
  type DBFood,
} from "./constants";
import { useRouter } from "next/navigation";

// 개별 카드 컴포넌트
const CategoryCard = ({ cat, delay, onClick, disabled }: any) => {
  const Icon = cat.icon;
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`group flex flex-col items-center justify-center cursor-pointer relative overflow-hidden transition-all duration-300 bg-[#1c1c1c] border border-white/5 rounded-[22px] shadow-2xl aspect-square
        ${
          disabled
            ? "opacity-30 cursor-not-allowed"
            : "hover:-translate-y-2 hover:scale-105"
        }`}
      style={{
        animation: `popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay} both`,
      }}
    >
      {!disabled && (
        <div className="absolute top-2 left-2 bg-[#ff6b35] text-white text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0 z-10">
          PICK!
        </div>
      )}
      {disabled && (
        <div className="absolute top-2 left-2 bg-white/20 text-white text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full z-10">
          준비중
        </div>
      )}
      <div className="text-[8px] sm:text-[9.5px] text-white/30 font-medium mb-1">
        {cat.sub}
      </div>
      <div className="w-12 h-12 sm:w-20 sm:h-20 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
        <Icon />
      </div>
      <div className="text-[11px] sm:text-sm font-bold text-white/90 mt-1">
        {cat.id}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff6b35] to-transparent opacity-0 group-hover:opacity-40 transition-opacity" />
    </div>
  );
};

// 라운드 이름 반환
const getRoundName = (bracketSize: number) => {
  if (bracketSize === 8) return "8강";
  if (bracketSize === 4) return "4강";
  if (bracketSize === 2) return "결승";
  return `${bracketSize}강`;
};

export default function FoodWorldCup() {
  const [screen, setScreen] = useState<"select" | "battle" | "result">(
    "select"
  );
  const [currentCategory, setCurrentCategory] = useState("");
  const [bracket, setBracket] = useState<any[]>([]);
  const [initialBracketSize, setInitialBracketSize] = useState(0); // 최초 대진표 크기 (8/4/2)
  const [matchIndex, setMatchIndex] = useState(0);
  const [winners, setWinners] = useState<any[]>([]);
  const [winner, setWinner] = useState<any>(null);
  const [animating, setAnimating] = useState(false);
  const [selectedSide, setSelectedSide] = useState<number | null>(null);

  // DB 데이터
  const [foods, setFoods] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const goHome = () => router.push("/");

  // DB에서 음식 데이터 fetch
  useEffect(() => {
    fetch("/api/ideal-cup")
      .then((r) => r.json())
      .then((res: { success: boolean; data: DBFood[] }) => {
        setFoods(mapDBtoFoods(res.data)); 
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 무작위 셔플
  const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

  // 게임 시작: 데이터 수에 따라 8강/4강/결승 자동 결정
  const startGame = (catId: string) => {
    const allFoods = foods[catId] || [];
    const bracketSize = getBracketSize(allFoods.length);

    if (bracketSize === 0) {
      alert(`${catId} 카테고리의 음식 데이터가 부족합니다. (최소 2개 필요)`);
      return;
    }

    const pool = shuffle(allFoods).slice(0, bracketSize);

    setCurrentCategory(catId);
    setBracket(pool);
    setInitialBracketSize(bracketSize);
    setMatchIndex(0);
    setWinners([]);
    setWinner(null);
    setScreen("battle");
  };

  const handlePick = (side: number) => {
    if (animating) return;
    setAnimating(true);
    setSelectedSide(side);

    const pair = [bracket[matchIndex * 2], bracket[matchIndex * 2 + 1]];
    const nextWinners = [...winners, pair[side]];

    setTimeout(() => {
      setAnimating(false);
      setSelectedSide(null);

      const isRoundOver = (matchIndex + 1) * 2 >= bracket.length;

      if (isRoundOver) {
        if (nextWinners.length === 1) {
          setWinner(nextWinners[0]);
          setScreen("result");
        } else {
          setBracket(shuffle(nextWinners));
          setWinners([]);
          setMatchIndex(0);
        }
      } else {
        setWinners(nextWinners);
        setMatchIndex(matchIndex + 1);
      }
    }, 500);
  };

  // 현재 몇 강인지 계산
  const currentRoundSize = bracket.length;
  const roundName = getRoundName(currentRoundSize);

  return (
    <div className="min-h-screen bg-[#0d0d0d] w-full flex flex-col items-center justify-center">
      <div className="min-h-[700px] max-w-[600px] mx-auto w-full bg-[#0d0d0d] font-['Noto_Sans_KR'] text-white overflow-hidden relative select-none rounded-3xl my-4 flex flex-col justify-center">
        {(screen === "select" || screen === "result") && (
          <button
            onClick={goHome}
            className="absolute top-6 left-6 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-110 active:scale-95 transition-all text-white/60"
          >
            <span className="text-xl">←</span>
          </button>
        )}

        {/* ── SCREEN 1: SELECT ── */}
        {screen === "select" && (
          <div className="flex flex-col items-center justify-center h-full p-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#ff6b35]/10 blur-[100px] pointer-events-none" />

            {loading ? (
              <div className="text-white/40 text-sm animate-pulse">
                데이터 불러오는 중...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3 relative z-10 w-full max-w-[520px]">
                  {CATEGORIES.slice(0, 4).map((cat, idx) => {
                    const count = (foods[cat.id] || []).length;
                    const size = getBracketSize(count);
                    return (
                      <CategoryCard
                        key={cat.id}
                        cat={{
                          ...cat,
                          sub: size > 0 ? `${size}강 · ${cat.sub}` : cat.sub,
                        }}
                        delay={`${idx * 0.05}s`}
                        onClick={() => startGame(cat.id)}
                        disabled={size === 0}
                      />
                    );
                  })}

                  <div className="flex flex-col items-center justify-center p-2 bg-gradient-to-br from-[#1f1f1f] to-[#141414] border border-[#ff6b35]/60 rounded-[22px] shadow-[0_0_40px_rgba(255,107,53,0.18)] text-center relative overflow-hidden aspect-square">
                    <h2 className="text-[13px] sm:text-[15px] font-black text-white leading-tight">
                      음식
                      <br />
                      이상형 월드컵
                    </h2>
                  </div>

                  {CATEGORIES.slice(4, 8).map((cat, idx) => {
                    const count = (foods[cat.id] || []).length;
                    const size = getBracketSize(count);
                    return (
                      <CategoryCard
                        key={cat.id}
                        cat={{
                          ...cat,
                          sub: size > 0 ? `${size}강 · ${cat.sub}` : cat.sub,
                        }}
                        delay={`${(idx + 5) * 0.05}s`}
                        onClick={() => startGame(cat.id)}
                        disabled={size === 0}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SCREEN 2: BATTLE ── */}
        {screen === "battle" && bracket.length > 0 && (
          <div className="h-full flex flex-col relative p-6 animate-[fadeIn_0.4s_ease_both]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#ff6b35]/10 blur-[100px] pointer-events-none" />

            <header className="flex flex-col items-center mb-10 z-10">
              <div className="text-[#ff6b35] text-[13px] font-bold mb-1 uppercase tracking-widest">
                {bracket.length === 2 ? "Final" : roundName}
              </div>
              <h1 className="text-2xl font-black">{currentCategory} 월드컵</h1>
              <div className="mt-1 text-[10px] text-white/30">
                {initialBracketSize}강 토너먼트
              </div>
              <div className="mt-4 w-full max-w-xs bg-white/10 h-1 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff6b35] to-[#ff4500] transition-all duration-500"
                  style={{
                    width: `${(matchIndex / (bracket.length / 2)) * 100}%`,
                  }}
                />
              </div>
              <div className="text-[10px] text-white/40 mt-2 font-mono">
                MATCH {matchIndex + 1} / {bracket.length / 2}
              </div>
            </header>

            <main className="flex-1 flex items-center justify-center gap-4 sm:gap-8 z-10">
              {[bracket[matchIndex * 2], bracket[matchIndex * 2 + 1]].map(
                (food, idx) => (
                  <React.Fragment key={idx}>
                    <div
                      onClick={() => handlePick(idx)}
                      className={`flex-1 flex flex-col items-center justify-center p-6 bg-[#1c1c1c] border-2 rounded-[32px] cursor-pointer transition-all duration-300 min-h-[280px] shadow-2xl
                      ${
                        selectedSide === idx
                          ? "border-[#ff6b35] scale-105 bg-[#252525] shadow-[0_0_30px_rgba(255,107,53,0.3)]"
                          : "border-white/5 hover:border-[#ff6b35]/70"
                      }
                      ${
                        selectedSide !== null && selectedSide !== idx
                          ? "opacity-20 scale-95 blur-[2px]"
                          : ""
                      }
                    `}
                    >
                      <img
                        src={food?.icon}
                        alt={food.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] mb-6"
                      />
                      <div className="text-xl sm:text-2xl font-black tracking-tighter text-center uppercase">
                        {food.name}
                      </div>
                    </div>
                    {idx === 0 && (
                      <div className="text-2xl font-black text-white/10 italic">
                        VS
                      </div>
                    )}
                  </React.Fragment>
                )
              )}
            </main>

            <footer className="text-center mt-8 text-white/20 text-[10px] tracking-[4px] uppercase z-10">
              Select your craving
            </footer>
          </div>
        )}

        {/* ── SCREEN 3: RESULT ── */}
        {screen === "result" && winner && (
          <div className="h-full flex flex-col items-center justify-center p-6 relative animate-[fadeIn_0.6s_ease_both]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#ff6b35]/20 blur-[120px] pointer-events-none" />

            <div className="z-10 flex flex-col items-center">
              <div className="text-6xl mb-4 animate-[float_3s_ease-in-out_infinite]">
                🏆
              </div>
              <div className="text-[#ff6b35] font-bold tracking-[5px] uppercase text-xs mb-2">
                The Winner
              </div>
              <h1 className="text-5xl font-black mb-10 tracking-tighter text-center uppercase bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                {winner.name}
              </h1>

              <div className="relative group">
                <div className="absolute inset-0 bg-[#ff6b35]/30 rounded-full blur-3xl" />
                <img
                  src={winner.icon}
                  className="w-48 h-48 sm:w-56 sm:h-56 relative z-10 drop-shadow-[0_20px_60px_rgba(255,107,53,0.5)]"
                  alt="winner"
                />
              </div>

              <div className="flex gap-4 mt-16">
                <button
                  onClick={() => startGame(currentCategory)}
                  className="px-10 py-4 bg-gradient-to-r from-[#ff6b35] to-[#ff4500] rounded-full font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
                >
                  Retry
                </button>
                <button
                  onClick={() => setScreen("select")}
                  className="px-10 py-4 bg-white/5 border border-white/10 rounded-full font-bold text-sm hover:bg-white/10 active:scale-95 transition-all uppercase tracking-widest"
                >
                  Category
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx global>{`
          @keyframes fadeDown {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 0.75;
              transform: translateY(0);
            }
          }
          @keyframes popIn {
            from {
              opacity: 0;
              transform: scale(0.65);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes float {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
