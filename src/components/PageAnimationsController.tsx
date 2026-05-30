import React, { useState, useEffect, useRef } from "react";
import { 
  Zap, 
  Settings, 
  Sparkles, 
  Sliders, 
  ArrowUp, 
  Check, 
  MousePointer, 
  Compass, 
  RefreshCw, 
  ChevronRight, 
  Info,
  MonitorPlay
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types ---
interface PointerParticle {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  speedX: number;
  speedY: number;
  alpha: number;
}

export default function PageAnimationsController() {
  // Page Animation Settings State
  const [isOpen, setIsOpen] = useState(false);
  const [animationStyle, setAnimationStyle] = useState<"bounce" | "slide" | "rotate" | "opacity">("bounce");
  const [animationDuration, setAnimationDuration] = useState(0.65);
  const [magneticEffect, setMagneticEffect] = useState(true);
  const [clickParticlesEnabled, setClickParticlesEnabled] = useState(true);
  
  // Real-time telemetry metrics updated via JS Scroll Listeners
  const [scrollDepth, setScrollDepth] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [activeSection, setActiveSection] = useState("inicio");
  const [scrollVelocity, setScrollVelocity] = useState(0);

  // Particles container for cursor ripples
  const [particles, setParticles] = useState<PointerParticle[]>([]);
  
  // Internal refs for telemetry computations
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const particleIdCounter = useRef(0);

  // --- 1. Real-time Scroll Telemetry & Interaction Analytics ---
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentTime = Date.now();
      
      // Calculate depth percentage
      if (docHeight > 0) {
        setScrollDepth(Math.round((currentY / docHeight) * 100));
      }

      // Calculate direction
      if (currentY > lastScrollY.current) {
        setScrollDirection("down");
      } else if (currentY < lastScrollY.current) {
        setScrollDirection("up");
      }

      // Calculate velocity (pixels scrolled per millisecond)
      const dy = Math.abs(currentY - lastScrollY.current);
      const dt = currentTime - lastScrollTime.current;
      if (dt > 0) {
        const speed = Math.round((dy / dt) * 100); // normalized speed
        setScrollVelocity(Math.min(speed, 100)); // clamp to 100 limit
      }

      lastScrollY.current = currentY;
      lastScrollTime.current = currentTime;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- 2. JS Intersection Observer for Active Section Highlighter ---
  useEffect(() => {
    const sections = ["inicio", "sintomas", "primeros-auxilios", "cardiograma", "citas", "juego"];
    
    const observerOptions = {
      root: null, // Viewport
      rootMargin: "-25% 0px -25% 0px", // Detect when in active zone
      threshold: 0.15,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // --- 3. Dynamic Styles Injector (Altering entire page animation curves dynamically) ---
  useEffect(() => {
    // We dynamically inject an global CSS style block into document head representing our custom JS defined animation curves!
    // This allows real-time manipulation of CSS transitions across the whole page using our React controls.
    const styleId = "js-dynamic-curves-api";
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    let transitionTiming = "cubic-bezier(0.16, 1, 0.3, 1)"; // default
    let transformStart = "translateY(40px) scale(0.96)";

    if (animationStyle === "bounce") {
      transitionTiming = "cubic-bezier(0.34, 1.56, 0.64, 1)"; // Bouncy spring curve
      transformStart = "translateY(55px) scale(0.92)";
    } else if (animationStyle === "slide") {
      transitionTiming = "cubic-bezier(0.25, 1, 0.5, 1)"; // Fast linear output
      transformStart = "translateY(70px)";
    } else if (animationStyle === "rotate") {
      transitionTiming = "cubic-bezier(0.175, 0.885, 0.32, 1.275)"; // 3D rotate spring back
      transformStart = "translateY(50px) rotate(-3deg) scale(0.95)";
    } else if (animationStyle === "opacity") {
      transitionTiming = "ease-in-out";
      transformStart = "translateY(0) scale(1)";
    }

    // Output raw CSS code that will affect all elements tagged with class 'js-reveal-animate'
    styleElement.innerHTML = `
      .js-reveal-active {
        opacity: 1 !important;
        transform: none !important;
        transition: opacity ${animationDuration}s ${transitionTiming}, transform ${animationDuration}s ${transitionTiming} !important;
      }
      .js-reveal-animate {
        opacity: 0;
        transform: ${transformStart};
        will-change: opacity, transform;
      }
    `;

    return () => {
      // styles auto clean context if unmounted
    };
  }, [animationStyle, animationDuration]);

  // --- 4. JavaScript Intersection Observer logic mapping classes to elements automatically ---
  useEffect(() => {
    // Select all sections and core interactive layouts to inject JS-reveal
    const targetClasses = [
      "#inicio",
      "#sintomas",
      "#primeros-auxilios",
      "#cardiograma",
      "#consultorio",
      "#citas",
      "#juego"
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("js-reveal-active");
          } else {
            // Keep animations fluid by removing on top-exit to allow re-entry effects
            const boundingRect = entry.boundingClientRect;
            if (boundingRect.top > window.innerHeight) {
              entry.target.classList.remove("js-reveal-active");
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.05,
        rootMargin: "0px 0px -60px 0px" // animate earlier for better user feeling
      }
    );

    targetClasses.forEach((selector) => {
      const el = document.querySelector(selector);
      if (el) {
        el.classList.add("js-reveal-animate");
        observer.observe(el);
      }
    });

    return () => {
      targetClasses.forEach((selector) => {
        const el = document.querySelector(selector);
        if (el) {
          observer.unobserve(el);
        }
      });
    };
  }, [animationStyle]); // Re-register on style change to re-trigger transition computation

  // --- 5. High Performance Floating Cursor Particle Effects ---
  useEffect(() => {
    if (!clickParticlesEnabled) return;

    const handleWindowClick = (e: MouseEvent) => {
      // Do not spawn particles if click targets the control panel to avoid visual noise
      const target = e.target as HTMLElement;
      if (target.closest("#js-animation-panel")) return;

      const colors = ["#10b981", "#3b82f6", "#ef4444", "#f59e0b", "#ec4899", "#8b5cf6"];
      
      const newParticles: PointerParticle[] = [];
      const count = 10;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        
        newParticles.push({
          id: particleIdCounter.current++,
          x: e.clientX,
          y: e.clientY + window.scrollY, // Map relative to global page coordinates
          radius: Math.random() * 4.5 + 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          alpha: 1.0
        });
      }

      setParticles((prev) => [...prev, ...newParticles].slice(-40)); // keep limited size
    };

    window.addEventListener("click", handleWindowClick);
    return () => window.removeEventListener("click", handleWindowClick);
  }, [clickParticlesEnabled]);

  // Main high performance tick routine for floating click particles fading
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) => 
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            alpha: p.alpha - 0.05 // fade out
          }))
          .filter((p) => p.alpha > 0)
      );
    }, 16); // ~60fps ticks

    return () => clearInterval(interval);
  }, [particles]);

  // --- 6. JS Magnetic hover effect helper hook for major CTAs ---
  useEffect(() => {
    if (!magneticEffect) return;

    const applyMagneticBehavior = () => {
      const items = document.querySelectorAll("button:not(#js-animation-panel *), .js-magnetic-target");
      
      items.forEach((item) => {
        const el = item as HTMLElement;

        const onMouseMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          
          // Pull with reasonable physical boundaries (max 12px)
          el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
          el.style.transition = "transform 0.1s ease-out";
        };

        const onMouseLeave = () => {
          el.style.transform = "none";
          el.style.transition = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
        };

        el.addEventListener("mousemove", onMouseMove);
        el.addEventListener("mouseleave", onMouseLeave);

        // Store bindings for cleaning
        (el as any)._magneticCleanup = () => {
          el.removeEventListener("mousemove", onMouseMove);
          el.removeEventListener("mouseleave", onMouseLeave);
        };
      });

      return items;
    };

    // Run magnet attachment
    const items = applyMagneticBehavior();

    return () => {
      items.forEach((item) => {
        const el = item as HTMLElement;
        if ((el as any)._magneticCleanup) {
          (el as any)._magneticCleanup();
        }
      });
    };
  }, [magneticEffect]);

  // Scroll to absolute page top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* 1. Global Particles DOM portal */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none select-none transition-none shadow-sm"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.radius * 2}px`,
              height: `${p.radius * 2}px`,
              backgroundColor: p.color,
              opacity: p.alpha,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {/* 2. Floating Quick Bottom Indicators & Progress Ring to Scroll Up */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        {/* Progress circular button scroll status */}
        {scrollDepth > 10 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="relative w-12 h-12 rounded-full bg-white text-slate-800 shadow-xl border border-slate-100 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all cursor-pointer group"
            title="Ir arriba con animación scroll"
          >
            {/* SVG Ring Progress */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="21"
                className="stroke-slate-100"
                strokeWidth="3.5"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="21"
                className="stroke-emerald-500 transition-all"
                strokeWidth="3.5"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 21}`}
                strokeDashoffset={`${2 * Math.PI * 21 * (1 - scrollDepth / 100)}`}
              />
            </svg>
            <ArrowUp className="w-5 h-5 relative z-10 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}

        {/* Animation Dashboard floating TOGGLE launcher button */}
        <button
          id="js-panel-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl relative transition-all cursor-pointer border border-emerald-400/20 ${
            isOpen 
              ? "bg-slate-900 text-red-400 rotate-90" 
              : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-105 active:scale-95"
          }`}
          title="Consola de Animación JS"
        >
          {isOpen ? (
            <span className="text-xl font-bold font-mono">✕</span>
          ) : (
            <span className="relative flex items-center justify-center">
              <Settings className="w-6 h-6 animate-spin" style={{ animationDuration: "12s" }} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-bounce"></span>
            </span>
          )}
        </button>
      </div>

      {/* 3. Sliding Animation Control Panel Sidebar Layout (JS Playgrounds Console) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="js-animation-panel"
            initial={{ opacity: 0, x: 380 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 380 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed top-20 right-4 w-88 max-w-full bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-45 text-white flex flex-col max-h-[80vh]"
          >
            {/* Panel Brand Title Header Area */}
            <div className="bg-slate-900 p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MonitorPlay className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white leading-none">Motor de Animaciones</h4>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Configurador JS Interactivo</span>
                </div>
              </div>
              <span className="text-[9px] bg-emerald-400/10 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Motor Activo
              </span>
            </div>

            {/* Content area scrollable */}
            <div className="p-5 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              
              {/* Telemetry section panel */}
              <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-3">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-cyan-500" />
                  Telemetría de Scroll en Tiempo Real
                </span>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-850/60">
                    <span className="text-[9px] text-slate-500 font-bold block">Profundidad</span>
                    <span className="text-sm font-black text-cyan-400">{scrollDepth}%</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-850/60">
                    <span className="text-[9px] text-slate-500 font-bold block">Dirección</span>
                    <span className="text-sm font-black text-amber-400">
                      {scrollDirection === "down" ? "⬇️ Descendiendo" : "⬆️ Ascendiendo"}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-850/60">
                    <span className="text-[9px] text-slate-500 font-bold block">Fuerza / Velocidad</span>
                    <span className="text-sm font-black text-emerald-450">{scrollVelocity} px/ms</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-850/60">
                    <span className="text-[9px] text-slate-500 font-bold block">Sección Activa</span>
                    <span className="text-[10px] font-black text-rose-400 truncate block">
                      #{activeSection.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                {/* Scroll track progress loader bar */}
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500 transition-all duration-100"
                    style={{ width: `${scrollDepth}%` }}
                  />
                </div>
              </div>

              {/* Transition Settings selection  */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                    Preset de Transición de Secciones
                  </span>
                  <span className="text-[10px] text-cyan-400 font-bold">Observer-Class: ON</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "bounce", label: "🤸 Rebote Spring", desc: "Elástico y vivo" },
                    { id: "slide", label: "🚀 Deslizamiento", desc: "Slide hacia arriba" },
                    { id: "rotate", label: "💫 Giro 3D", desc: "Fantasía inclinada" },
                    { id: "opacity", label: "🌬️ Fusión Ligera", desc: "Fade clásico limpio" }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setAnimationStyle(preset.id as any)}
                      className={`p-2.5 text-left rounded-xl border text-xs transition-all cursor-pointer flex flex-col justify-between ${
                        animationStyle === preset.id
                          ? "bg-white text-slate-950 border-white font-extrabold"
                          : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-white"
                      }`}
                    >
                      <span className="font-extrabold flex items-center gap-1">
                        {animationStyle === preset.id && <Check className="w-3 h-3 text-emerald-600" />}
                        {preset.label}
                      </span>
                      <span className={`text-[9px] mt-1 font-semibold ${
                        animationStyle === preset.id ? "text-slate-500" : "text-slate-500"
                      }`}>
                        {preset.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Animation Speed Modifiers Sliders */}
              <div className="space-y-3">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">
                  Velocidad de Renderizado JS (Duration Multiplier)
                </span>
                
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-850/80 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-[10px] text-slate-400">
                    <span>Instantáneo (0.2s)</span>
                    <span className="text-emerald-400">Seleccionado: {animationDuration}s</span>
                    <span>Cineasta (2.0s)</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.0"
                    step="0.05"
                    value={animationDuration}
                    onChange={(e) => setAnimationDuration(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>

              {/* Extra micro interaction Toggles */}
              <div className="space-y-3">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">
                  Micro-Interacciones de Página Adicionales
                </span>

                <div className="space-y-2">
                  {/* Particle click switch */}
                  <label className="flex items-center justify-between p-3 bg-slate-900/50 hover:bg-slate-900 rounded-xl border border-slate-850/60 cursor-pointer select-none">
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-4 h-4 text-pink-400" />
                      <div>
                        <span className="text-xs font-bold block">Partículas flotantes cursor</span>
                        <span className="text-[9px] text-slate-500 block">Emite burbujas al hacer click en la web</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={clickParticlesEnabled}
                      onChange={(e) => setClickParticlesEnabled(e.target.checked)}
                      className="w-4.5 h-4.5 accent-pink-500 rounded cursor-pointer"
                    />
                  </label>

                  {/* Magnetic effect switch */}
                  <label className="flex items-center justify-between p-3 bg-slate-900/50 hover:bg-slate-900 rounded-xl border border-slate-850/60 cursor-pointer select-none">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-xs font-bold block">Efectos Magnéticos Hover</span>
                        <span className="text-[9px] text-slate-500 block">Atrae botones de forma elástica</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={magneticEffect}
                      onChange={(e) => setMagneticEffect(e.target.checked)}
                      className="w-4.5 h-4.5 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Section Active tracker status checklist */}
              <div className="space-y-2">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">
                  Estado de Secciones Detectadas
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300 font-semibold">
                  {[
                    { id: "inicio", label: "Inicio" },
                    { id: "sintomas", label: "Síntomas" },
                    { id: "primeros-auxilios", label: "Prim. Auxilios" },
                    { id: "cardiograma", label: "Cardiograma" },
                    { id: "citas", label: "Citas/Turnos" },
                    { id: "juego", label: "Pausa Relax" },
                  ].map((sec) => (
                    <div
                      key={sec.id}
                      className={`p-2 rounded-lg flex items-center justify-between border ${
                        activeSection === sec.id
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-slate-900/40 text-slate-400 border-transparent"
                      }`}
                    >
                      <span>{sec.label}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        activeSection === sec.id ? "bg-emerald-400 animate-pulse" : "bg-slate-700"
                      }`} />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer console */}
            <div className="bg-slate-900 p-4 border-t border-slate-800 text-[10px] text-slate-500 leading-normal font-medium flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                Este sistema utiliza un <strong>Intersection Observer api</strong> y re-cálculos de variables CSS para inyectar transiciones fluidas de renderizado sin saturar de carga a la CPU.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
