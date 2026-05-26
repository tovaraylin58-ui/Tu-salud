import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, ShieldCheck, HeartPulse, Trophy, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Bacteria {
  id: number;
  x: number;
  y: number;
  size: number;
  emoji: string;
}

export default function RelaxGame() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("vidasana_game_highscore") || "0", 10);
  });
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameActive, setGameActive] = useState(false);
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "expert">("normal");
  const [bacterias, setBacterias] = useState<Bacteria[]>([]);
  const [gameFinished, setGameFinished] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const bacteriaIdCounter = useRef(0);

  // Load high score
  useEffect(() => {
    localStorage.setItem("vidasana_game_highscore", highScore.toString());
  }, [highScore]);

  // Clean-up on unmount
  useEffect(() => {
    return () => {
      stopGameIntervals();
    };
  }, []);

  const stopGameIntervals = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
  };

  const getDifficultySettings = () => {
    switch (difficulty) {
      case "easy":
        return { spawnRate: 900, duration: 1100, size: 48 };
      case "expert":
        return { spawnRate: 450, duration: 700, size: 36 };
      case "normal":
      default:
        return { spawnRate: 650, duration: 900, size: 40 };
    }
  };

  const startGame = () => {
    stopGameIntervals();
    setScore(0);
    setTimeLeft(15);
    setBacterias([]);
    setGameFinished(false);
    setGameActive(true);

    const { spawnRate, duration, size } = getDifficultySettings();

    // Game Timer Interval
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Bacteria Spawns Interval
    spawnIntervalRef.current = setInterval(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const margin = 50;
      const x = Math.random() * (rect.width - margin * 2) + margin;
      const y = Math.random() * (rect.height - margin * 2) + margin;

      const randomEmojis = ["🦠", "👾", "🧫", "🧬"];
      const emoji = randomEmojis[Math.floor(Math.random() * randomEmojis.length)];
      const id = bacteriaIdCounter.current++;

      setBacterias((prev) => [...prev, { id, x, y, size, emoji }]);

      // Remove after lifetime duration
      setTimeout(() => {
        setBacterias((prev) => prev.filter((b) => b.id !== id));
      }, duration);

    }, spawnRate);
  };

  const stopGame = () => {
    stopGameIntervals();
    setGameActive(false);
    setGameFinished(true);
    setBacterias([]);
    setHighScore((prev) => {
      const currentScore = score; // capture current
      return currentScore > prev ? currentScore : prev;
    });
  };

  // Re-evaluation for high score trigger on end of game
  useEffect(() => {
    if (gameFinished && score > highScore) {
      setHighScore(score);
    }
  }, [gameFinished, score, highScore]);

  const handleEliminateBacteria = (id: number) => {
    setScore((prev) => prev + 1);
    setBacterias((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <section id="juego" className="py-20 bg-emerald-50/20 border-t border-b border-emerald-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Content */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider rounded-full inline-block mb-3">
            Zona de Pausa Activa
          </span>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Pausa Saludable: ¡Desinfecta tu pantalla!
          </h2>
          <p className="mt-3 text-slate-600 text-sm leading-relaxed">
            Relaja la mente eliminando las bacterias dañinas surgidas en el laboratorio del hospital. Selecciona tu grado de dificultad y obtén el máximo récord en 15 segundos.
          </p>
          <div className="w-12 h-1 bg-emerald-500 rounded-full mx-auto mt-5"></div>
        </div>

        {/* Game Area Container Console */}
        <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-emerald-100/40 shadow-xl shadow-emerald-950/5">
          
          {/* Dashboard Header Stats */}
          <div className="grid grid-cols-3 gap-4 mb-5 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Puntos</span>
              <span className="text-xl font-black text-slate-800">{score}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col justify-center items-center">
              <span className="text-[10px] text-emerald-600 font-extrabold uppercase block leading-none">Tiempo</span>
              <div className="flex items-center gap-1 mt-1 text-emerald-800">
                <HeartPulse className={`w-4 h-4 text-emerald-600 ${gameActive ? "animate-pulse" : ""}`} />
                <span className="text-xl font-black">{timeLeft}s</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/80 flex flex-col justify-center items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Récord</span>
              <div className="flex items-center gap-1 mt-1 text-amber-600 font-extrabold">
                <Trophy className="w-4.5 h-4.5" />
                <span className="text-lg font-black">{highScore}</span>
              </div>
            </div>
          </div>

          difficulty select panel
          {!gameActive && (
            <div className="flex items-center justify-center gap-2 mb-5">
              <span className="text-xs text-slate-400 font-bold uppercase">Dificultad:</span>
              <button
                onClick={() => setDifficulty("easy")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  difficulty === "easy" ? "bg-emerald-600 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                }`}
              >
                Fácil
              </button>
              <button
                onClick={() => setDifficulty("normal")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  difficulty === "normal" ? "bg-emerald-600 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                }`}
              >
                Medio
              </button>
              <button
                onClick={() => setDifficulty("expert")}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  difficulty === "expert" ? "bg-emerald-600 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                }`}
              >
                Experto
              </button>
            </div>
          )}

          {/* Interactive Game Stage */}
          <div
            ref={containerRef}
            className="w-full h-80 bg-slate-50 rounded-2xl border border-dashed border-emerald-200 relative overflow-hidden flex flex-col items-center justify-center shadow-inner"
          >
            {/* Bacteria Items Spawning */}
            <AnimatePresence>
              {bacterias.map((b) => (
                <motion.button
                  key={b.id}
                  onClick={() => handleEliminateBacteria(b.id)}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0, filter: "blur(4px)" }}
                  style={{
                    position: "absolute",
                    left: `${b.x}px`,
                    top: `${b.y}px`,
                    width: `${b.size}px`,
                    height: `${b.size}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="rounded-full bg-emerald-100/30 border border-emerald-300 hover:border-emerald-500 shadow-md flex items-center justify-center p-0 text-3xl select-none cursor-pointer active:scale-95 transition-shadow"
                >
                  <span className="transform hover:scale-110 active:rotate-45 transition-transform">
                    {b.emoji}
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>

            {/* Waiting Initial State Window */}
            {!gameActive && !gameFinished && (
              <div className="text-center p-8 z-10">
                <HeartPulse className="w-14 h-14 text-emerald-600 mx-auto mb-4 animate-bounce" />
                <h4 className="text-lg font-black text-slate-800">¿Listo para la desinfección?</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Elimina la mayor cantidad de gérmenes posible antes de que expire el tiempo.
                </p>
                <button
                  onClick={startGame}
                  className="mt-6 inline-flex items-center gap-1.5 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-full shadow-lg hover:shadow-emerald-500/15 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Iniciar Laboratorio
                </button>
              </div>
            )}

            {/* Ingame Running overlay */}
            {gameActive && bacterias.length === 0 && (
              <div className="text-center text-slate-300 select-none">
                <span className="text-xs font-bold uppercase tracking-wider">¡Apareciendo objetivos...!</span>
              </div>
            )}

            {/* End of Game Report Card Screen */}
            {!gameActive && gameFinished && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 mb-4">
                  <ShieldCheck className="w-9 h-9 text-emerald-600" />
                </div>
                <h4 className="text-xl font-black text-slate-800">¡Limpieza de Pantalla Terminada!</h4>
                <p className="text-sm text-slate-500 mt-2 max-w-sm">
                  Lograste erradicar un total de <strong className="text-emerald-700 font-black text-base">{score}</strong> bacterias infecciosas en este turno.
                </p>

                {score >= highScore && score > 0 && (
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-700 font-extrabold bg-amber-50 px-3 py-1 border border-amber-200 rounded-full">
                    <Award className="w-4 h-4 text-amber-500" />
                    ¡Nuevo récord hospitalario establecido!
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={startGame}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Jugar de nuevo
                  </button>
                </div>
              </motion.div>
            )}

          </div>

          <div className="mt-4 text-[10px] text-center text-slate-400">
            * Haz clic o pulsa con tu dedo sobre cada germen para combatirlo. Pausa mental recomendada de 1 minuto.
          </div>
        </div>

      </div>
    </section>
  );
}
