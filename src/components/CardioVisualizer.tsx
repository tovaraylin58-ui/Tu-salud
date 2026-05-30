import React, { useState, useEffect, useRef } from "react";
import { Heart, Zap, Volume2, VolumeX, Activity, Sliders, AlertCircle, HeartPulse, Sparkles, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types ---
interface Particle {
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  radius: number;
  alpha: number;
  color: string;
}

export default function CardioVisualizer() {
  const [bpm, setBpm] = useState(72);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [physiologicalState, setPhysiologicalState] = useState<"rep" | "nor" | "eje" | "arr" | "par">("nor");
  const [pulseCount, setPulseCount] = useState(0);
  const [showShockEffect, setShowShockEffect] = useState(false);
  const [isDesfibrilando, setIsDesfibrilando] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Storing canvas trace coordinates & state variables using refs for the high-performance JS render loop
  const bpmRef = useRef(72);
  const stateRef = useRef<"rep" | "nor" | "eje" | "arr" | "par">("nor");
  const xPosRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const lastPeakRef = useRef(false);

  // Sync state changes with mutable refs
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    stateRef.current = physiologicalState;
    if (physiologicalState === "rep") setBpm(50);
    else if (physiologicalState === "nor") setBpm(72);
    else if (physiologicalState === "eje") setBpm(135);
    else if (physiologicalState === "par") setBpm(0);
    // Arrhythmia stays editable or fluctuates
  }, [physiologicalState]);

  // Handle synthesized sound beep for the cardiogram peak
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      // Lazy init AudioContext safely due to browser policies
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // High short clinical beep
      osc.type = "sine";
      osc.frequency.setValueAtTime(950, ctx.currentTime);
      
      // Control volume curve cleanly (Attack, Decay, Release)
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
      
      setPulseCount((prev) => prev + 1);
    } catch (err) {
      console.warn("La API de Web Audio no pudo inicializarse:", err);
    }
  };

  // Trigger Desfibrilador high-voltage high performance discharge animation
  const handleShock = () => {
    if (isDesfibrilando) return;
    setIsDesfibrilando(true);
    setShowShockEffect(true);
    
    // Play a dual-tone capacitor discharge sound
    if (soundEnabled) {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioContextRef.current;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(100, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);

        osc2.type = "square";
        osc2.frequency.setValueAtTime(150, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.61);
        osc2.stop(ctx.currentTime + 0.61);
      } catch (e) {}
    }

    // Spawn a large ring of brilliant golden & red particles
    if (canvasRef.current) {
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      for (let i = 0; i < 90; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 4;
        particlesRef.current.push({
          x: width / 2,
          y: height / 2,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          radius: Math.random() * 4 + 2,
          alpha: 1.0,
          color: i % 2 === 0 ? "#ef4444" : "#fbbf24"
        });
      }
    }

    // Hold visual flashing shock background briefly, then revive patient
    setTimeout(() => {
      setShowShockEffect(false);
      setPhysiologicalState("nor");
      setBpm(72);
      setIsDesfibrilando(false);
    }, 1200);
  };

  // Pure JavaScript HTML Canvas loop for medical simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI rendering resolution
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth * window.devicePixelRatio;
        canvas.height = 240 * window.devicePixelRatio;
        canvas.style.width = "100%";
        canvas.style.height = "240px";
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initial setup of particles representing oxygen and bioelectrical impulses
    particlesRef.current = [];
    for (let i = 0; i < 35; i++) {
      particlesRef.current.push({
        x: Math.random() * (canvas.width / window.devicePixelRatio),
        y: Math.random() * 240,
        speedX: Math.random() * 0.8 + 0.2,
        speedY: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.6 + 0.2,
        color: i % 3 === 0 ? "rgba(239, 68, 68, 0.55)" : "rgba(255, 255, 255, 0.45)"
      });
    }

    let points: number[] = [];
    const maxPoints = 400; // Trail length
    for (let i = 0; i < maxPoints; i++) {
      points.push(120); // standard dead center line coordinates
    }

    let cycleProgress = 0; // tracking mathematical waves

    // High performance animation frame
    const render = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = 240;

      // 1. Clear background
      ctx.fillStyle = "#1e293b"; // Dark deep slate medical panel
      ctx.fillRect(0, 0, width, height);

      // 2. Draw standard grid lines (ECG millimeter grid)
      ctx.strokeStyle = "rgba(239, 68, 68, 0.08)"; // Subtle reddish grid lines
      ctx.lineWidth = 1;
      
      const gridSize = 20;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Strong heavy accent axis line
      ctx.strokeStyle = "rgba(239, 68, 68, 0.16)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // 3. Compute active ECG math formulas
      let currentBpm = bpmRef.current;
      let currentState = stateRef.current;

      let yValue = height / 2; // baseline

      if (currentState !== "par") {
        // Adjust formula frequency based on BPM
        const cycleSpeed = (currentBpm / 60) * 0.055;
        cycleProgress += cycleSpeed;
        if (cycleProgress >= Math.PI * 2) {
          cycleProgress -= Math.PI * 2;
        }

        const angle = cycleProgress;

        // Electrocardiogram standard pattern (P wave, PR interval, QRS complex, T wave)
        // Mathematically construct the clinical pulse components based on angles
        const pWave = Math.sin(angle * 5) * 4 * Math.max(0, Math.sin(angle - 0.2));
        
        // QRS complex is constructed with sharp peaks
        let qrsWave = 0;
        const qrsCenter = Math.PI * 0.6; // peak center locus
        const qrsWidth = 0.095;       // width of the spike
        const diff = angle - qrsCenter;
        
        if (Math.abs(diff) < qrsWidth) {
          const ratio = diff / qrsWidth;
          // Sine combinations to make QRS peaks (down, high up, down)
          qrsWave = -Math.sin(ratio * Math.PI) * 48; // Peak height
        }

        // T wave is the final muscular repolarization
        const tWave = Math.sin(angle * 1.5) * 11 * Math.max(0, Math.sin(angle - 1.2));

        // Add background respiratory noise/drift to keep it lively
        const drift = Math.sin(Date.now() * 0.001) * 2.5;

        // Base wave output
        yValue = (height / 2) + qrsWave + pWave + tWave + drift;

        // Custom tweaks for physiological states
        if (currentState === "arr") {
          // Add chaotic electrical noise to the pulse representing extrasystoles
          const noise = (Math.random() - 0.5) * 10;
          yValue += noise;
        }

        // Sound beat trigger detect - rising pulse peak trigger threshold
        const peakThreshold = height / 2 - 25;
        const isCurrentlyPeaked = yValue < peakThreshold;
        if (isCurrentlyPeaked && !lastPeakRef.current) {
          playBeep();
          lastPeakRef.current = true;
          
          // Emit rapid burst of particle energy matching the pulse locus
          for (let i = 0; i < 8; i++) {
            particlesRef.current.push({
              x: width - 80,
              y: yValue,
              speedX: (Math.random() - 0.5) * 3,
              speedY: (Math.random() - 0.5) * 3,
              radius: Math.random() * 3 + 1,
              alpha: 1.0,
              color: "#fb2c36"
            });
          }
        } else if (!isCurrentlyPeaked) {
          lastPeakRef.current = false;
        }

      } else {
        // Flatline logic - flat heart with organic decay noise
        const noise = (Math.random() - 0.5) * 0.7;
        yValue = height / 2 + noise;
      }

      // 4. Shift coordinate queue to animate scrolling left to right
      points.push(yValue);
      if (points.length > maxPoints) {
        points.shift();
      }

      // 5. Draw real-time tracing line
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // Glow design path using shadow options
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#f43f5e";

      for (let i = 0; i < points.length; i++) {
        const xPos = (width / maxPoints) * i;
        if (i === 0) {
          ctx.moveTo(xPos, points[i]);
        } else {
          ctx.lineTo(xPos, points[i]);
        }
      }

      // Gradient color mapping for tracing
      const lineGradient = ctx.createLinearGradient(0, 0, width, 0);
      lineGradient.addColorStop(0, "rgba(239, 68, 68, 0.15)");
      lineGradient.addColorStop(0.5, "rgba(244, 63, 94, 0.75)");
      lineGradient.addColorStop(1, "#ef4444");

      ctx.strokeStyle = lineGradient;
      ctx.stroke();

      // Reset shadows for solid rendering of text and secondary assets
      ctx.shadowBlur = 0;

      // Draw current signal monitor cursor header
      const lastX = width - 1;
      const lastY = points[points.length - 1];
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(lastX, lastY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // 6. Draw floating oxygen bio-particles systems
      particlesRef.current.forEach((p, idx) => {
        // Move particle
        p.x += p.speedX * (currentBpm > 0 ? (currentBpm / 72) * 1.5 : 0.08);
        p.y += p.speedY;

        // Wrap particles boundaries horizontally to loop beautifully
        if (p.x > width) {
          p.x = 0;
          p.y = Math.random() * height;
          p.alpha = Math.random() * 0.6 + 0.2;
        }

        // Apply friction to high shock discharge explosions
        if (Math.abs(p.speedX) > 2.5) {
          p.speedX *= 0.95;
          p.speedY *= 0.95;
          p.alpha -= 0.015; // fade out shock particles
        }

        // Only draw alive active particles
        if (p.alpha > 0) {
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1.0; // Reset alpha state safely

      // Remove alpha faded particles
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);

      // Keep particles count robust
      if (particlesRef.current.length < 35 && currentState !== "par") {
        particlesRef.current.push({
          x: 0,
          y: Math.random() * height,
          speedX: Math.random() * 0.8 + 0.2,
          speedY: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1,
          alpha: Math.random() * 0.6 + 0.2,
          color: Math.random() > 0.5 ? "rgba(239, 68, 68, 0.55)" : "rgba(255, 255, 255, 0.45)"
        });
      }

      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [soundEnabled]);

  return (
    <section id="cardiograma" className="py-20 bg-slate-950 text-white relative overflow-hidden">
      
      {/* Dynamic Background visual highlights */}
      <div className="absolute inset-x-0 inset-y-0 opacity-20 pointer-events-none select-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-red-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500 rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading with Red / White branding theme */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 text-xs font-black uppercase tracking-widest rounded-full border border-red-500/20 mb-3 animate-pulse">
            <HeartPulse className="w-4 h-4 text-red-500" />
            <span>Laboratorio Bioelectrónico</span>
          </div>
          <h2 className="text-3xl sm:text-4.5xl font-black text-white tracking-tight">
            Monitor de Ritmos Cardíacos
          </h2>
          <p className="mt-2 text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            Explora de qué manera actúan los impulsos de tu corazón. Ajusta la velocidad, estimula estados metabólicos en tiempo real o inicia una desfibrilación por JS de alta energía.
          </p>
        </div>

        {/* Outer Canvas Container Frame  */}
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
          
          {/* Header Bar of the Clinical Monitor UI */}
          <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  physiologicalState === "par" ? "bg-red-500" : "bg-emerald-400"
                }`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${
                  physiologicalState === "par" ? "bg-red-600" : "bg-emerald-500"
                }`}></span>
              </span>
              <div>
                <h3 className="font-extrabold text-xs uppercase tracking-widest text-slate-200">Electrocardiógrafo Digital</h3>
                <p className="text-[10px] text-slate-500">Trace de conductividad miocárdica continuo</p>
              </div>
            </div>

            {/* Quick Vital Stats Displays */}
            <div className="flex items-center gap-4">
              <div className="text-right px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">BPM</span>
                <span className={`text-xl font-black tracking-tight ${
                  physiologicalState === "par" ? "text-red-500 animate-pulse" : "text-emerald-400"
                }`}>
                  {physiologicalState === "par" ? "00" : bpm}
                </span>
              </div>
              <div className="text-right px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Latidos totales</span>
                <span className="text-xl font-black text-slate-200">{pulseCount}</span>
              </div>
            </div>
          </div>

          {/* Interactive HTML Canvas Element inside animated wrap */}
          <div className="relative bg-slate-950 overflow-hidden">
            
            {/* High Performance Shock Effect Overlay */}
            <AnimatePresence>
              {showShockEffect && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [1, 0.4, 0.9, 0, 0.8, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9 }}
                  className="absolute inset-0 bg-white/90 z-20 flex items-center justify-center text-slate-900"
                >
                  <div className="text-center font-black flex flex-col items-center">
                    <Zap className="w-16 h-16 text-red-600 animate-bounce" />
                    <span className="text-xl tracking-widest uppercase text-red-900">¡DESCARGA DE VOLTAJE COMPLETA!</span>
                    <span className="text-xs text-red-700 mt-1">Estabilizando marcapasos de miocardio...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <canvas
              ref={canvasRef}
              className="block cursor-crosshair"
              title="Cardiograma Interactivo"
            />

            {/* Sound Signal State alert indicator */}
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  soundEnabled
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
                title={soundEnabled ? "Silenciar" : "Activar bip audible"}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="text-[10px] uppercase font-bold tracking-widest hidden sm:inline">
                  {soundEnabled ? "Audio Encendido" : "Audio Apagado"}
                </span>
              </button>
            </div>

            {/* Overlay warning when flatlined */}
            {physiologicalState === "par" && !showShockEffect && (
              <div className="absolute inset-x-0 inset-y-0 bg-red-950/20 backdrop-blur-[2px] transition-all flex items-center justify-center p-6 text-center animate-fade-in pointer-events-none">
                <div className="bg-red-950/90 border border-red-500/30 p-5 rounded-2xl max-w-sm pointer-events-auto space-y-3">
                  <div className="flex justify-center">
                    <div className="w-10 h-10 bg-red-900 text-white rounded-full flex items-center justify-center animate-spin">
                      🚨
                    </div>
                  </div>
                  <h4 className="text-sm font-black uppercase text-white tracking-widest leading-none">PARO CARDÍACO REGISTRADO</h4>
                  <p className="text-red-200 text-xs leading-relaxed font-semibold">
                    Simulación de línea plana. El flujo sanguíneo del paciente está comprometido de forma absoluta.
                  </p>
                  <button
                    onClick={handleShock}
                    disabled={isDesfibrilando}
                    className="w-full py-2.5 px-4 bg-white text-red-900 border border-red-100 hover:bg-neutral-100 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 animate-bounce text-red-600" />
                    Aplicar Desfibrilador
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Interactive controls panel (Filtro y mandos JS) */}
          <div className="p-6 sm:p-8 bg-slate-900 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left controls: State presets */}
            <div className="md:col-span-6 space-y-4">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-red-500" />
                  Selector Fisiológico de Animación
                </span>
                <span className="text-xs text-slate-400">Escenarios automatizados por funciones de JavaScript:</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  { id: "rep", label: "🛌 Reposo (50)" },
                  { id: "nor", label: "🚶 Normal (72)" },
                  { id: "eje", label: "🏃 Ejercicio (135)" },
                  { id: "arr", label: "⚡ Arritmia" },
                  { id: "par", label: "🚨 Flatline" }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setPhysiologicalState(s.id as any)}
                    className={`py-2 px-3 text-left rounded-xl border text-xs font-black transition-all cursor-pointer ${
                      physiologicalState === s.id
                        ? "bg-white text-slate-950 border-white shadow-md font-extrabold"
                        : "bg-slate-800 text-slate-350 border-slate-750 hover:bg-slate-750 hover:text-white"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right controls: sliders */}
            <div className="md:col-span-6 space-y-4">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold block">
                  Ajuste de Frecuencia Cardiaca Manual (BPM Slider)
                </span>
                <span className="text-xs text-slate-400">Varía la dinámica matemática del cardiograma en tiempo real:</span>
              </div>

              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">Lento (40 BPM)</span>
                  <span className="px-2 py-0.5 bg-red-650 text-white rounded text-[10px] font-black uppercase">
                    BPM Actual: {bpm}
                  </span>
                  <span className="text-slate-500 font-bold">Rápido (180 BPM)</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="180"
                  value={bpm}
                  disabled={physiologicalState === "par"}
                  onChange={(e) => {
                    setBpm(parseInt(e.target.value));
                    if (physiologicalState !== "arr") {
                      // Customise preset if manual modifications are applied
                      setPhysiologicalState("arr");
                    }
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600 disabled:opacity-45"
                />
              </div>
            </div>

          </div>

          {/* Educational tips alert */}
          <div className="bg-slate-950 px-6 py-4 border-t border-slate-850 flex items-start gap-2.5">
            <span className="text-base text-red-500 selection:bg-slate-900">💡</span>
            <div>
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">Inteligencia Cardiorrespiratoria</span>
              <p className="text-[11px] text-slate-500 leading-normal font-medium mt-0.5">
                La frecuencia cardíaca en reposo idónea para un adulto saludable fluctúa entre 60 y 100 pulsaciones. Los deportistas de alto rendimiento registran de 40 a 50 debido a una mayor eficiencia ventricular. Experimenta con diferentes frecuencias arriba para ver el cambio de fase en el electrocardiograma.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
