import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, ShieldCheck, HeartPulse, Trophy, Award, Brain, BookOpen, Film, HelpCircle, Activity, User, Eye, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types ---
interface Bacteria {
  id: number;
  x: number;
  y: number;
  size: number;
  emoji: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface AnatomyPart {
  id: string;
  name: string;
  description: string;
  function: string;
  careTip: string;
  emoji: string;
  color: string;
}

interface InteractiveBodySystem {
  id: string;
  name: string;
  description: string;
  parts: AnatomyPart[];
}

interface AnatomyGameChallenge {
  question: string;
  correctAnswer: string;
  options: string[];
  system: string;
}

interface EducationalVideo {
  id: string;
  title: string;
  duration: string;
  category: string;
  youtubeId: string;
  summary: string;
  tips: string[];
  thumbnail: string;
}

// --- Static Data ---
const quizQuestions: QuizQuestion[] = [
  {
    question: "¿Cuál es el órgano más grande del cuerpo humano?",
    options: ["El hígado", "La piel", "Los pulmones", "El intestino grueso"],
    correctIndex: 1,
    explanation: "La piel es el órgano más grande del cuerpo humano, cubriendo un área promedio de 2 metros cuadrados y actuando como barrera de defensa biológica primaria contra gérmenes externos."
  },
  {
    question: "¿Cuántos huesos forman el esqueleto de un ser humano adulto?",
    options: ["206 huesos", "300 huesos", "180 huesos", "212 huesos"],
    correctIndex: 0,
    explanation: "El esqueleto humano de un adulto consta exactamente de 206 huesos rígidos. Al nacer, poseemos cerca de 270 estructuras pero muchas se fusionan mecánicamente al crecer."
  },
  {
    question: "¿Qué tipo de sangre se conoce como el donante universal?",
    options: ["A positivo (A+)", "AB negativo (AB-)", "O negativo (O-)", "O positivo (O+)"],
    correctIndex: 2,
    explanation: "El grupo O negativo (O-) no posee antígenos A, B ni factor Rh en sus glóbulos rojos, de modo que es el único tipo que puede transfundirse sin rechazos a cualquier paciente en urgencias extremas."
  },
  {
    question: "¿Cuál es la función principal de los glóbulos rojos (eritrocitos)?",
    options: ["Combatir infecciones virales", "Transportar oxígeno a los tejidos", "Causar la coagulación de heridas", "Filtrar lípidos hepáticos"],
    correctIndex: 1,
    explanation: "Los glóbulos rojos contienen hemoglobina, proteína que atrapa las moléculas de oxígeno gaseoso en los alvéolos pulmonares y las distribuye bombeadas por todo el organismo."
  },
  {
    question: "¿En qué parte del cuerpo humano se encuentra el hueso más pequeño del esqueleto?",
    options: ["En el dedo meñique del pie", "En el oído interno (el estribo)", "En el tabique nasal de la cara", "En la articulación de la muñeca"],
    correctIndex: 1,
    explanation: "El estribo es el hueso más diminuto del cuerpo humano, mide apenas entre 2.5 y 3 milímetros y radica en el oído medio, transmitiendo vibraciones sonoras."
  }
];

const bodySystems: InteractiveBodySystem[] = [
  {
    id: "esqueleto",
    name: "Sistema Óseo / Esqueleto",
    description: "Soporte estructural rígido que protege órganos sensibles y permite la locomoción biológica articulada.",
    parts: [
      {
        id: "craneo",
        name: "Cráneo (Osteocráneo)",
        description: "Bóveda rígida ósea formada por 8 huesos perfectamente soldados.",
        function: "Proteger el encéfalo y estructuras neuronales del sistema nervioso central contra impactos físicos externos.",
        careTip: "Usa casco reglamentario en actividades de riesgo para prevenir conmociones severas.",
        emoji: "💀",
        color: "border-sky-300 bg-sky-50 text-sky-800"
      },
      {
        id: "columna",
        name: "Columna Vertebral",
        description: "Eje osteofibroso articulado compuesto por 33 vértebras superpuestas.",
        function: "Sostener el cuerpo erguido, distribuir cargas mecánicas y blindar el interior de la médula espinal.",
        careTip: "Mantén una higiene postural erguida y haz estiramientos para relajar la zona lumbar.",
        emoji: "🦴",
        color: "border-emerald-300 bg-emerald-50 text-emerald-800"
      },
      {
        id: "femur",
        name: "Fémur (Hueso del Muslo)",
        description: "El hueso más largo, pesado, rígido y resistente de la estructura locomotor.",
        function: "Facilitar el soporte del peso total del tronco e impulsar la zancada y el salto en conjunto con el muslo.",
        careTip: "Asegura alimentos ricos en calcio y vitamina D para consolidar la matriz del hueso.",
        emoji: "🦵",
        color: "border-indigo-300 bg-indigo-50 text-indigo-800"
      }
    ]
  },
  {
    id: "musculos",
    name: "Sistema Muscular Autónomo",
    description: "Agrupación de más de 650 músculos que ejercen fuerza mediante contracción para asegurar movimiento.",
    parts: [
      {
        id: "brazo",
        name: "Bíceps Braquial",
        description: "Músculo potente de dos cabezas localizado en la región anterior del brazo.",
        function: "Ejercer la flexión del codo y potenciar la supinación del antebrazo al levantar objetos.",
        careTip: "Calienta los músculos por 5 minutos antes de entrenar con peso para eludir desgarros.",
        emoji: "💪",
        color: "border-rose-300 bg-rose-50 text-rose-800"
      },
      {
        id: "abdominales",
        name: "Recto Mayor del Abdomen",
        description: "Pared muscular plana y simétrica que compone la faja metabólica y postural central (Core).",
        function: "Flexionar la columna vertebral, comprimir las vísceras abdominales y cooperar en la espiración forzada.",
        careTip: "Fortalecer el abdomen ayuda a prevenir el 70% de las dolencias de espalda crónicas.",
        emoji: "🏋️",
        color: "border-amber-300 bg-amber-50 text-amber-800"
      }
    ]
  },
  {
    id: "organos",
    name: "Órganos Vitales Internos",
    description: "Centros glandulares y musculares blandos encargados del metabolismo y soporte fisiológico de la vida.",
    parts: [
      {
        id: "cerebro",
        name: "Cerebro Humano (Encéfalo)",
        description: "El centro cibernético de control de señales que contiene unas 86,000 millones de neuronas.",
        function: "Codificar sensaciones, memorias, regular emociones y emitir instrucciones motrices autónomas.",
        careTip: "Estimula tu reserva cognitiva resolviendo acertijos y durmiendo de 7 a 8 horas diarias de forma regular.",
        emoji: "🧠",
        color: "border-purple-300 bg-purple-50 text-purple-800"
      },
      {
        id: "corazon",
        name: "El Corazón",
        description: "Bomba muscular hueca del tamaño aproximado de un puño cerrado de un adulto.",
        function: "Bombear continuamente unos 5 litros de sangre oxigenada por minuto a todo el árbol circulatorio.",
        careTip: "Evita las grasas trans y reduce el consumo de sodio para cuidar tus válvulas y arterias cardíacas.",
        emoji: "❤️",
        color: "border-pink-300 bg-pink-50 text-pink-800"
      },
      {
        id: "pulmon",
        name: "Pulmones Lobulados",
        description: "Par de estructuras esponjosas de consistencia blanda situadas a ambos lados del mediastino.",
        function: "Efectuar el intercambio de gases (hematosis) capturando oxígeno de la atmósfera e inhalando.",
        careTip: "¡Abstente de fumar y vapear! Los humos abrasivos inflaman los bronquios.",
        emoji: "🫁",
        color: "border-teal-300 bg-teal-50 text-teal-800"
      },
      {
        id: "higado",
        name: "Hígado Hepático",
        description: "Glándula metabólica de mayor tamaño del cuerpo que pesa alrededor de 1.5 kg.",
        function: "Desintoxicar la sangre de agentes nocivos, procesar nutrientes insolubles y segregar la bilis digestiva.",
        careTip: "Bebe abundante agua destilada o purificada y evita el consumo excesivo de azúcares y fármacos.",
        emoji: "🩸",
        color: "border-orange-300 bg-orange-50 text-orange-800"
      }
    ]
  }
];

const anatomyChallenges: AnatomyGameChallenge[] = [
  {
    question: "¿A qué sistema principal pertenecen el 'fémur, cráneo y costillas'?",
    correctAnswer: "Sistema Óseo / Esqueleto",
    options: ["Sistema Muscular Autónomo", "Sistema Óseo / Esqueleto", "Órganos Vitales Internos", "Sistema Linfático"],
    system: "esqueleto"
  },
  {
    question: "¿Qué órgano tiene como rol el bombear sangre rica en oxígeno a la aorta?",
    correctAnswer: "El Corazón",
    options: ["Cerebro Humano (Encéfalo)", "Hígado Hepático", "El Corazón", "Pulmones Lobulados"],
    system: "organos"
  },
  {
    question: "¿Qué músculo es el principal encargado de la flexión del brazo y codo?",
    correctAnswer: "Bíceps Braquial",
    options: ["Bíceps Braquial", "Recto Mayor del Abdomen", "Columna Vertebral", "Estribo del Oído"],
    system: "musculos"
  },
  {
    question: "¿Qué órgano es apodado el 'laboratorio' bioquímico del cuerpo por filtrar fármacos?",
    correctAnswer: "Hígado Hepático",
    options: ["Pulmones Lobulados", "El Corazón", "Hígado Hepático", "Cerebro Humano (Encéfalo)"],
    system: "organos"
  },
  {
    question: "¿Qué estructura aloja la médula espinal y es el pilar central de nuestra postura?",
    correctAnswer: "Columna Vertebral",
    options: ["Fémur (Hueso del Muslo)", "Cráneo (Osteocráneo)", "Recto Mayor del Abdomen", "Columna Vertebral"],
    system: "esqueleto"
  }
];

const learningVideos: EducationalVideo[] = [
  {
    id: "vid-corazon",
    title: "¿Cómo Funciona el Corazón Humano realmente?",
    duration: "4:15 min",
    category: "Cardiología",
    youtubeId: "v=X90-Le00_uY", // simulate / instructional
    thumbnail: "❤️",
    summary: "Aprende de forma intuitiva las características mecánicas del ciclo de bombeo del corazón. Comprende la sístole y la diástole, además de la interacción del nódulo sinusal (marcapasos biológico) y la corriente sanguínea pulmonar de retorno.",
    tips: [
      "La sístole es la contracción del músculo cardíaco para expulsar la sangre arterial.",
      "La diástole es la relajación que permite el llenado óptimo de las cuatro cavidades.",
      "Mantener actividad aeróbica moderada mejora el gasto cardíaco y la longevidad del corazón."
    ]
  },
  {
    id: "vid-inmune",
    title: "El Sistema Inmunitario en Acción Directa",
    duration: "5:30 min",
    category: "Inmunología",
    youtubeId: "v=z3M0vU3Dv8s",
    thumbnail: "🛡️",
    summary: "Visualiza de qué manera nuestro sistema inmunitario combate bacterias y virus dañinos día tras día. El papel de los macrófagos devorando patógenos infiltrados, los linfocitos T neutralizando células infectadas y el diseño de anticuerpos precisos.",
    tips: [
      "Los glóbulos blancos patrullan el caudal sanguíneo para aislar invasores potencialmente fatales.",
      "Las vacunas entrenan al sistema linfático creando anticuerpos de memoria proactivos.",
      "Una dieta balanceada alta en antioxidantes estimula una óptima respuesta defensiva del organismo."
    ]
  },
  {
    id: "vid-metabolismo",
    title: "Nutrición Celular y Obesidad Preventiva",
    duration: "6:10 min",
    category: "Endocrinología",
    youtubeId: "v=eG-5LszMszA",
    thumbnail: "🥦",
    summary: "Descubre cómo las mitocondrias de tus células convierten los carbohidratos, grasas saludables y proteínas en ATP (energía bioactiva pura). Aprende por qué evitar el azúcar refinado protege tus órganos internos de la esteatosis hepática no alcohólica (hígado graso).",
    tips: [
      "Las mitocondrias son los reactores de energía que alimentan cada una de tus acciones físicas.",
      "El consumo alto de azúcares saturados genera sobreesfuerzo de insulina y resistencia hepática.",
      "La fibra soluble protege las paredes intestinales y mejora significativamente la microbiota."
    ]
  },
  {
    id: "vid-postural",
    title: "Ergonomía Correcta e Higiene Postural en Oficina",
    duration: "3:45 min",
    category: "Fisioterapia",
    youtubeId: "v=86e0S8JmGTM",
    thumbnail: "🪑",
    summary: "Un compendio práctico de postura laboral para quienes pasan horas frente a pantallas de ordenador. Cómo alinear correctamente el cuello para eludir el 'síndrome del cuello de texto', colocar el soporte lumbar de la silla de estudio y organizar pausas activas.",
    tips: [
      "La pantalla del ordenador debe situarse exactamente al nivel horizontal de tus pupilas.",
      "Mantén las articulaciones de la cadera, rodillas y codos doblados en ángulo recto de 90 grados.",
      "Levántate y camina por un promedio de 2 minutos por cada hora de concentración continua."
    ]
  }
];

export default function RelaxGame() {
  const [activeTab, setActiveTab] = useState<"bacteria" | "quiz" | "anatomy" | "anatomy_game" | "videos">("bacteria");

  // --- Bacteria Game state ---
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

  // --- Quiz state ---
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  // --- Anatomy Explorer state ---
  const [activeAnatomySystemId, setActiveAnatomySystemId] = useState<string>("esqueleto");
  const [selectedAnatomyPartId, setSelectedAnatomyPartId] = useState<string | null>("craneo");

  // --- Anatomy Match Game state ---
  const [anatomyGameScore, setAnatomyGameScore] = useState(0);
  const [currentGameChallengeIdx, setCurrentGameChallengeIdx] = useState(0);
  const [anatomySelectedAnswer, setAnatomySelectedAnswer] = useState<string | null>(null);
  const [anatomyGameFeedback, setAnatomyGameFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [anatomyGameComplete, setAnatomyGameComplete] = useState(false);

  // --- Educational Videos state ---
  const [selectedVideo, setSelectedVideo] = useState<EducationalVideo>(learningVideos[0]);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoQuizAnswered, setVideoQuizAnswered] = useState(false);
  const [videoUserAnswer, setVideoUserAnswer] = useState<boolean | null>(null);

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
      const currentScore = score;
      return currentScore > prev ? currentScore : prev;
    });
  };

  useEffect(() => {
    if (gameFinished && score > highScore) {
      setHighScore(score);
    }
  }, [gameFinished, score, highScore]);

  const handleEliminateBacteria = (id: number) => {
    setScore((prev) => prev + 1);
    setBacterias((prev) => prev.filter((b) => b.id !== id));
  };

  // --- Quiz actions ---
  const handleAnswerQuiz = (optionIndex: number) => {
    if (selectedAnswerIndex !== null) return;
    setSelectedAnswerIndex(optionIndex);
    const correctIdx = quizQuestions[currentQuizIndex].correctIndex;
    if (optionIndex === correctIdx) {
      setQuizScore((prev) => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNextQuizQuestion = () => {
    setSelectedAnswerIndex(null);
    setShowExplanation(false);
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setQuizScore(0);
    setCurrentQuizIndex(0);
    setSelectedAnswerIndex(null);
    setShowExplanation(false);
    setQuizComplete(false);
  };

  // --- Anatomy Game actions ---
  const handleAnswerAnatomyChallenge = (selectedAns: string) => {
    if (anatomySelectedAnswer !== null) return;
    setAnatomySelectedAnswer(selectedAns);
    const correctStr = anatomyChallenges[currentGameChallengeIdx].correctAnswer;
    if (selectedAns === correctStr) {
      setAnatomyGameScore((prev) => prev + 1);
      setAnatomyGameFeedback("correct");
    } else {
      setAnatomyGameFeedback("incorrect");
    }
  };

  const handleNextAnatomyChallenge = () => {
    setAnatomySelectedAnswer(null);
    setAnatomyGameFeedback(null);
    if (currentGameChallengeIdx < anatomyChallenges.length - 1) {
      setCurrentGameChallengeIdx((prev) => prev + 1);
    } else {
      setAnatomyGameComplete(true);
    }
  };

  const restartAnatomyGame = () => {
    setAnatomyGameScore(0);
    setCurrentGameChallengeIdx(0);
    setAnatomySelectedAnswer(null);
    setAnatomyGameFeedback(null);
    setAnatomyGameComplete(false);
  };

  // --- Selected active tab setup ---
  const subSystemsData = bodySystems.find((s) => s.id === activeAnatomySystemId);
  const activePart = subSystemsData?.parts.find((p) => p.id === selectedAnatomyPartId);

  return (
    <section id="juego" className="py-20 bg-slate-50 border-t border-b border-blue-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Content */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-100 inline-block mb-3">
            Pausa Saludable Interactiva
          </span>
          <h2 className="text-3.5xl font-extrabold text-slate-800 tracking-tight">
            Gimnasio Clínico y Juegos Médicos
          </h2>
          <p className="mt-3 text-slate-600 text-sm leading-relaxed max-w-2xl mx-auto">
            Estimula tu mente, pon a prueba tus conocimientos sobre la salud humana o diviértete con nuestros visualizadores de anatomía interactivos y simuladores educativos.
          </p>
          
          {/* Wellness Center Horizontal Navigation */}
          <div className="mt-8 flex flex-wrap gap-2 justify-center items-center p-1.5 bg-slate-100 rounded-2xl max-w-4xl mx-auto border border-slate-200">
            <button
              onClick={() => { setActiveTab("bacteria"); stopGameIntervals(); setGameActive(false); }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "bacteria" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              🔬 Juego Antivirus
            </button>
            <button
              onClick={() => { setActiveTab("quiz"); stopGameIntervals(); setGameActive(false); }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "quiz" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <Brain className="w-4 h-4 text-purple-400" />
              🧠 Quiz Médico
            </button>
            <button
              onClick={() => { setActiveTab("anatomy"); stopGameIntervals(); setGameActive(false); }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "anatomy" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <User className="w-4 h-4 text-sky-400" />
              🦴 Modelos del Cuerpo
            </button>
            <button
              onClick={() => { setActiveTab("anatomy_game"); stopGameIntervals(); setGameActive(false); }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "anatomy_game" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <HelpCircle className="w-4 h-4 text-amber-500" />
              🏆 Juegos de Anatomía
            </button>
            <button
              onClick={() => { setActiveTab("videos"); stopGameIntervals(); setGameActive(false); }}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "videos" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <Film className="w-4 h-4 text-rose-400" />
              📺 Videos Educativos
            </button>
          </div>
          <div className="w-16 h-1 bg-emerald-500 rounded-full mx-auto mt-6"></div>
        </div>

        {/* --- Render Areas --- */}
        <div className="max-w-4xl mx-auto">
          
          <AnimatePresence mode="wait">
            {/* AREA 1: ANTIMICROBIAL CLICKER GAME */}
            {activeTab === "bacteria" && (
              <motion.div
                key="tab-bacteria"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-6 rounded-3xl border border-emerald-150 shadow-xl overflow-hidden"
              >
                <div className="text-center max-w-xl mx-auto mb-6">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full">Actividad Antibacteriana</span>
                  <h3 className="text-lg font-black text-slate-800 mt-2">Pausa Activa: ¡Laboratorio Hospitalario!</h3>
                  <p className="text-xs text-slate-500 mt-1">Estimula tus reflejos y descansa de la lectura clínica atrapando gérmenes malignos surgidos en las muestras.</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-5 text-center max-w-md mx-auto">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Puntos</span>
                    <span className="text-xl font-black text-slate-800">{score}</span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100/50 flex flex-col justify-center items-center">
                    <span className="text-[10px] text-emerald-600 font-extrabold uppercase block leading-none">Tiempo</span>
                    <div className="flex items-center gap-1 mt-1 text-emerald-800 font-black">
                      <HeartPulse className={`w-4 h-4 text-emerald-600 ${gameActive ? "animate-pulse" : ""}`} />
                      <span className="text-xl">{timeLeft}s</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block leading-none">Récord</span>
                    <div className="flex items-center gap-1 mt-1 text-amber-600 font-black">
                      <Trophy className="w-4 h-4" />
                      <span className="text-lg">{highScore}</span>
                    </div>
                  </div>
                </div>

                {!gameActive && (
                  <div className="flex items-center justify-center gap-2 mb-5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Rigor de Velocidad:</span>
                    {[
                      { id: "easy", label: "Fácil" },
                      { id: "normal", label: "Medio" },
                      { id: "expert", label: "Rápido" }
                    ].map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setDifficulty(d.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          difficulty === d.id ? "bg-slate-900 text-white" : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-150"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  ref={containerRef}
                  className="w-full h-80 bg-slate-50 rounded-2xl border border-dashed border-slate-200 relative overflow-hidden flex flex-col items-center justify-center shadow-inner"
                >
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
                        className="rounded-full bg-emerald-100/35 border border-emerald-300 hover:border-emerald-500 shadow-md flex items-center justify-center p-0 text-3.5xl select-none cursor-pointer active:scale-95 transition-shadow"
                      >
                        <span className="transform hover:scale-110 transition-transform">
                          {b.emoji}
                        </span>
                      </motion.button>
                    ))}
                  </AnimatePresence>

                  {!gameActive && !gameFinished && (
                    <div className="text-center p-8 z-10">
                      <HeartPulse className="w-14 h-14 text-emerald-600 mx-auto mb-4 animate-bounce" />
                      <h4 className="text-md font-extrabold text-slate-800">¿Listo para desinfectar la pantalla?</h4>
                      <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                        Entrena el cerebro eliminando los patógenos rápidamente antes de que se acabe el tiempo.
                      </p>
                      <button
                        onClick={startGame}
                        className="mt-6 inline-flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-full shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-current text-white" />
                        Comenzar Pausa Activa
                      </button>
                    </div>
                  )}

                  {!gameActive && gameFinished && (
                    <div className="absolute inset-x-0 inset-y-0 bg-white/95 z-20 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 mb-3">
                        <ShieldCheck className="w-8 h-8 text-emerald-600" />
                      </div>
                      <h4 className="text-lg font-black text-slate-800">¡Laboratorio sanitizado!</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                        Has logrado erradicar <strong className="text-emerald-700 font-black text-sm">{score}</strong> bacterias infecciosas en este ejercicio.
                      </p>

                      {score >= highScore && score > 0 && (
                        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-amber-700 font-extrabold bg-amber-50 px-3 py-1 border border-amber-200 rounded-full uppercase tracking-wider">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          ¡Nuevo récord clínico establecido!
                        </div>
                      )}

                      <button
                        onClick={startGame}
                        className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Volver a Empezar
                      </button>
                    </div>
                  )}

                  {gameActive && bacterias.length === 0 && (
                    <div className="text-center text-slate-300 font-mono text-[10px] select-none tracking-widest uppercase">
                      Buscando gérmenes...
                    </div>
                  )}
                </div>

                <div className="mt-4 text-[10px] text-center text-slate-400 font-mono">
                  * Haz clic o toca rápido cada emoji de germen. Aliviarás la fatiga visual de la jornada laboral.
                </div>
              </motion.div>
            )}

            {/* AREA 2: MEDICAL QUIZ */}
            {activeTab === "quiz" && (
              <motion.div
                key="tab-quiz"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xl"
              >
                {!quizComplete ? (
                  <div className="space-y-6">
                    {/* Header bar progress info */}
                    <div className="flex items-center justify-between border-b border-purple-50 pb-4">
                      <div>
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded-full">Examen de Conocimiento Médico</span>
                        <h3 className="text-lg font-black text-slate-800 mt-1">Quiz Médico Preventivo</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-semibold">Pregunta:</span>
                        <span className="text-sm font-black text-purple-700">{currentQuizIndex + 1} de {quizQuestions.length}</span>
                      </div>
                    </div>

                    {/* Question text box */}
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-2xl shadow-md">
                      <span className="text-xs uppercase font-extrabold text-indigo-100 tracking-wider">Premisa Clínica</span>
                      <h4 className="text-md sm:text-lg font-bold mt-1 leading-snug">
                        {quizQuestions[currentQuizIndex].question}
                      </h4>
                    </div>

                    {/* Options checkboxes list */}
                    <div className="grid grid-cols-1 gap-3">
                      {quizQuestions[currentQuizIndex].options.map((option, idx) => {
                        const isSelected = selectedAnswerIndex === idx;
                        const correctId = quizQuestions[currentQuizIndex].correctIndex;
                        const isCorrectAnswerOption = idx === correctId;
                        const answered = selectedAnswerIndex !== null;

                        let btnColors = "bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-700";
                        if (answered) {
                          if (isCorrectAnswerOption) {
                            btnColors = "bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold";
                          } else if (isSelected) {
                            btnColors = "bg-rose-50 border-rose-300 text-rose-900";
                          } else {
                            btnColors = "bg-slate-50/50 border-slate-100 text-slate-400 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={answered}
                            onClick={() => handleAnswerQuiz(idx)}
                            className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnColors}`}
                          >
                            <span className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold leading-none ${
                                isSelected ? "bg-purple-600 text-white" : "bg-slate-200/80 text-slate-600"
                              }`}>
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span>{option}</span>
                            </span>
                            {answered && isCorrectAnswerOption && (
                              <span className="text-xs text-emerald-600 font-extrabold">✓ Correcto</span>
                            )}
                            {answered && isSelected && !isCorrectAnswerOption && (
                              <span className="text-xs text-rose-500 font-extrabold">✕ Incorrecto</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation block */}
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-purple-50/70 border border-purple-100 p-5 rounded-2xl space-y-2 mt-4"
                      >
                        <h5 className="text-xs font-extrabold text-purple-800 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                          <CheckCircle2 className="w-4 h-4 text-purple-600" />
                          Explicación Científica:
                        </h5>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                          {quizQuestions[currentQuizIndex].explanation}
                        </p>
                        
                        <div className="pt-3 border-t border-purple-100/60 flex justify-end">
                          <button
                            onClick={handleNextQuizQuestion}
                            className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer active:scale-95"
                          >
                            {currentQuizIndex < quizQuestions.length - 1 ? "Siguiente Pregunta →" : "Ver Resultados Finales"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  // QUIZ END RESULT FANCY CARD
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center p-8 space-y-5"
                  >
                    <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto border border-purple-100">
                      <Trophy className="w-10 h-10 text-purple-600 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">¡Evaluación Médica Completada!</h3>
                      <p className="text-xs text-slate-400 mt-1">Conoce de qué forma reacciona tu cuerpo a distintas patologías diarias.</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 max-w-sm mx-auto">
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest block">Tu Calificación</span>
                      <div className="text-4xl font-black text-purple-700 mt-2">
                        {quizScore} <span className="text-slate-400 text-xl font-normal">/ {quizQuestions.length}</span>
                      </div>
                      <p className="text-slate-650 text-xs font-medium mt-3 leading-relaxed">
                        {quizScore === quizQuestions.length
                          ? "¡Excelente! Eres todo un erudito de la medicina y prevención."
                          : quizScore >= 3
                          ? "¡Buen trabajo! Tienes bases sólidas sobre el cuidado anatómico preventivo."
                          : "Consolida tus bases leyendo nuestro espacio de enfermedades y síntomas."}
                      </p>
                    </div>

                    <button
                      onClick={restartQuiz}
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Intentar el Quiz de nuevo
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* AREA 3: HUMAN BODY SYSTEMS VISUAL EXPLORER */}
            {activeTab === "anatomy" && (
              <motion.div
                key="tab-anatomy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-6 rounded-3xl border border-sky-100 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8"
              >
                {/* Visual systems panel selector */}
                <div className="md:col-span-4 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-2 py-0.5 rounded-full">Anatomía Interactiva</span>
                    <h3 className="font-black text-slate-800 mt-1">Sistemas Corporales</h3>
                  </div>

                  <div className="flex flex-col gap-2">
                    {bodySystems.map((sys) => (
                      <button
                        key={sys.id}
                        onClick={() => {
                          setActiveAnatomySystemId(sys.id);
                          setSelectedAnatomyPartId(sys.parts[0]?.id || null);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs font-extrabold flex justify-between items-center cursor-pointer ${
                          activeAnatomySystemId === sys.id
                            ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                            : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <span>{sys.name}</span>
                        <ArrowRight className="w-4 h-4 opacity-70" />
                      </button>
                    ))}
                  </div>

                  <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-150 text-[11px] text-slate-500 leading-relaxed">
                    ⚙️ <strong>Modo de Uso:</strong> Selecciona el sistema corporal y pulsa sobre cualquiera de las estructuras clínicas para desglosar sus funciones, descripciones anatómicas y pautas de autocuidado.
                  </div>
                </div>

                {/* Subparts selection grid and details file */}
                <div className="md:col-span-8 space-y-6">
                  {/* Active system description header */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-150/45">
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Sistema seleccionado</span>
                    <h4 className="text-sm font-black text-slate-800 mt-0.5">{subSystemsData?.name}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed mt-1">{subSystemsData?.description}</p>
                  </div>

                  {/* Body Part Interactive Buttons Grid */}
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2.5">Estructuras Óseas / Órganos:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {subSystemsData?.parts.map((p) => {
                        const isPartSelected = p.id === selectedAnatomyPartId;
                        return (
                          <button
                            key={p.id}
                            onClick={() => setSelectedAnatomyPartId(p.id)}
                            className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 text-xs font-bold cursor-pointer ${
                              isPartSelected
                                ? "bg-sky-50 border-sky-400 text-sky-900 font-extrabold shadow-sm"
                                : "bg-white border-slate-150 hover:bg-slate-50 text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            <span className="text-xl leading-none">{p.emoji}</span>
                            <span>{p.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expanded anatomy detail file widget */}
                  <AnimatePresence mode="wait">
                    {activeAnatomySystemId && activePart ? (
                      <motion.div
                        key={activePart.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`p-5 rounded-2xl border-2 ${activePart.color} space-y-4 shadow-sm`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl bg-white p-2 rounded-xl border border-slate-200/40 select-none">{activePart.emoji}</span>
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Ficha Anatómica</span>
                            <h4 className="text-md sm:text-lg font-black leading-none">{activePart.name}</h4>
                          </div>
                        </div>

                        {/* Def and Role list */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-white/60 p-3.5 rounded-xl border border-white/50 space-y-1">
                            <span className="text-[10px] font-bold uppercase opacity-60 tracking-wider">¿Qué es?</span>
                            <p className="text-slate-700 text-xs leading-relaxed font-semibold">
                              {activePart.description}
                            </p>
                          </div>
                          <div className="bg-white/60 p-3.5 rounded-xl border border-white/50 space-y-1">
                            <span className="text-[10px] font-bold uppercase opacity-60 tracking-wider">Rol Fisiológico Principal</span>
                            <p className="text-slate-700 text-xs leading-relaxed font-semibold">
                              {activePart.function}
                            </p>
                          </div>
                        </div>

                        {/* Practical care tip alert banner */}
                        <div className="p-3 bg-white/40 border border-white/50 rounded-xl flex items-start gap-2">
                          <span className="text-sm">💡</span>
                          <div>
                            <span className="text-[10px] font-extrabold uppercase opacity-65 block">Recomendación Médica de Autocuidado:</span>
                            <p className="text-xs text-slate-800 leading-relaxed font-medium mt-0.5">
                              {activePart.careTip}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="p-10 text-center border border-dashed border-slate-250 rounded-2xl text-slate-400 text-xs">
                        Selecciona un órgano o estructura arriba para desplegar el modelado clínico de salud.
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* AREA 4: ANATOMY LEARNING GAME CHALLENGE */}
            {activeTab === "anatomy_game" && (
              <motion.div
                key="tab-anatomy-game"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xl"
              >
                {!anatomyGameComplete ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-amber-50 pb-4">
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">Desafío Anatómico Veloz</span>
                        <h3 className="text-lg font-black text-slate-800 mt-2">Juego: Combina tu Cuerpo</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-semibold">Desafío:</span>
                        <span className="text-sm font-black text-amber-750">{currentGameChallengeIdx + 1} de {anatomyChallenges.length}</span>
                      </div>
                    </div>

                    {/* Active Question Panel */}
                    <div className="bg-amber-500 text-white p-5 rounded-2xl shadow">
                      <span className="text-[10px] bg-amber-400 text-white font-extrabold px-1.5 py-0.5 rounded uppercase font-mono">Término de Estudio</span>
                      <h4 className="text-sm sm:text-md font-bold mt-1.5">{anatomyChallenges[currentGameChallengeIdx].question}</h4>
                    </div>

                    {/* Option grids */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {anatomyChallenges[currentGameChallengeIdx].options.map((opt, oIdx) => {
                        const isAnsSelected = anatomySelectedAnswer === opt;
                        const correctStrStr = anatomyChallenges[currentGameChallengeIdx].correctAnswer;
                        const isOptionCorrect = opt === correctStrStr;
                        const gameAnswered = anatomySelectedAnswer !== null;

                        let styleProps = "bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-700";
                        if (gameAnswered) {
                          if (isOptionCorrect) {
                            styleProps = "bg-emerald-50 border-emerald-400 text-emerald-800 font-extrabold shadow-sm";
                          } else if (isAnsSelected) {
                            styleProps = "bg-rose-50 border-rose-300 text-rose-800";
                          } else {
                            styleProps = "bg-slate-50 opacity-40 text-slate-400 blur-[0.3px]";
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={gameAnswered}
                            onClick={() => handleAnswerAnatomyChallenge(opt)}
                            className={`p-4 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex justify-between items-center ${styleProps}`}
                          >
                            <span>{opt}</span>
                            {gameAnswered && isOptionCorrect && (
                              <span className="text-[10px] text-emerald-600 uppercase font-bold bg-white/80 px-1 rounded">Correcto</span>
                            )}
                            {gameAnswered && isAnsSelected && !isOptionCorrect && (
                              <span className="text-[10px] text-rose-600 uppercase font-bold bg-white/80 px-1 rounded">Incorrecto</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback result info banner */}
                    {anatomyGameFeedback && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className={`p-4 rounded-xl flex items-center gap-3 border ${
                          anatomyGameFeedback === "correct"
                            ? "bg-emerald-50 text-emerald-850 border-emerald-200"
                            : "bg-amber-50 text-amber-850 border-amber-200"
                        }`}
                      >
                        {anatomyGameFeedback === "correct" ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <p className="text-xs leading-relaxed font-semibold">
                              <strong>¡Felicidades, acierto absoluto!</strong> Tu raciocinio anatómico te ayudó a descifrar perfectamente el sistema orgánico del componente.
                            </p>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                            <p className="text-xs leading-relaxed font-semibold">
                              <strong>¡Casi lo logras!</strong> El término pertenece a: <strong className="underline">{anatomyChallenges[currentGameChallengeIdx].correctAnswer}</strong>. Sigue intentando para mejorar.
                            </p>
                          </>
                        )}

                        <button
                          onClick={handleNextAnatomyChallenge}
                          className="ml-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black rounded-lg shrink-0 cursor-pointer"
                        >
                          {currentGameChallengeIdx < anatomyChallenges.length - 1 ? "Siguiente" : "Resultados"}
                        </button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  // ANATOMY CHALLENGE FINISHED REPORT CARD
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center p-8 space-y-4"
                  >
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto border border-amber-100">
                      <Award className="w-10 h-10 text-amber-500 animate-bounce" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800">Has finalizado el Torneo de Anatomía</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">Tus conocimientos del motor biomecánico de la piel, huesos y músculos están mejorando.</p>

                    <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 max-w-xs mx-auto">
                      <span className="text-[10px] text-amber-700 font-bold uppercase tracking-widest block">Aciertos Clínicos</span>
                      <div className="text-4xl font-extrabold text-amber-600 mt-2">
                        {anatomyGameScore} <span className="text-slate-400 text-lg font-normal">/ {anatomyChallenges.length}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-2 leading-relaxed">
                        {anatomyGameScore === anatomyChallenges.length
                          ? "¡Récord absoluto anatómico! Estás listo para cursar el grado de enfermería preventiva."
                          : "¡Buen esfuerzo! Continúa revisando los sistemas para retar de nuevo tu puntaje."}
                      </p>
                    </div>

                    <button
                      onClick={restartAnatomyGame}
                      className="inline-flex items-center gap-1 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reintentar el Desafío
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* AREA 5: EDUCATIONAL VIDEOS PORTAL */}
            {activeTab === "videos" && (
              <motion.div
                key="tab-videos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Videos list left menu */}
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-2.5 py-1 rounded-full">Canal de Educación Vida Sana</span>
                    <h3 className="text-lg font-black text-slate-800 mt-2">Hospital TV: Clases Sanitarias</h3>
                  </div>

                  <div className="flex flex-col gap-2">
                    {learningVideos.map((vid) => {
                      const isSelectedVid = vid.id === selectedVideo.id;
                      return (
                        <button
                          key={vid.id}
                          onClick={() => {
                            setSelectedVideo(vid);
                            setVideoPlaying(false);
                            setVideoQuizAnswered(false);
                            setVideoUserAnswer(null);
                          }}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3.5 items-start ${
                            isSelectedVid
                              ? "bg-rose-50/50 border-rose-400 text-rose-950 font-semibold"
                              : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          <span className="text-2xl bg-white p-2 rounded-lg border border-slate-200/50 block select-none shrink-0">
                            {vid.thumbnail}
                          </span>
                          <div className="min-w-0">
                            <span className="text-[9px] uppercase font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                              {vid.category}
                            </span>
                            <h4 className="text-xs font-bold text-slate-800 mt-1 truncate">{vid.title}</h4>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Duración: {vid.duration}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated interactive video player and details transcript right pane */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Simulated player screen */}
                  <div className="w-full h-52 sm:h-64 bg-slate-900 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-3 shadow-inner">
                    <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur text-[10px] font-extrabold text-white px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                      REPRODUCTOR SIMULADO: CLASE DE SALUD
                    </div>

                    {!videoPlaying ? (
                      <div className="text-center z-10 space-y-3">
                        <span className="text-5xl select-none block drop-shadow">{selectedVideo.thumbnail}</span>
                        <h4 className="text-white text-sm font-bold max-w-sm mx-auto leading-snug px-4">{selectedVideo.title}</h4>
                        <button
                          onClick={() => setVideoPlaying(true)}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-full shadow-lg hover:shadow-rose-600/15 cursor-pointer transition-all active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5 fill-current text-white" />
                          Reproducir Lección Virtual
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4 text-white p-6 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-rose-950 to-slate-950 opacity-40"></div>
                        <HeartPulse className="w-12 h-12 text-rose-500 animate-pulse z-10" />
                        <div className="z-10">
                          <h4 className="text-sm font-black tracking-tight">{selectedVideo.title}</h4>
                          <span className="text-[10px] text-teal-300 font-mono tracking-widest block mt-1 uppercase">Reproduciendo audio y guías de anatomía del ciclo de salud...</span>
                        </div>
                        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden relative z-10">
                          <div className="h-full bg-rose-500 rounded-full animate-[progress_15s_linear_infinite]" style={{ width: "65%" }}></div>
                        </div>
                        <button
                          onClick={() => setVideoPlaying(false)}
                          className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded-lg border border-white/20 z-10 cursor-pointer"
                        >
                          Detener Video
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Summary & Transcript tips list */}
                  <div className="space-y-4">
                    <div className="bg-neutral-50 p-4 rounded-xl border border-slate-150">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Resumen de la Clase:</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold mt-1">
                        {selectedVideo.summary}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Consejos Médicos del Conferencista:</span>
                      <ul className="space-y-2">
                        {selectedVideo.tips.map((tip, index) => (
                          <li key={index} className="text-xs text-slate-700 font-medium flex items-start gap-2.5 bg-rose-50/20 border border-rose-100/40 p-3 rounded-xl">
                            <span className="text-rose-500 font-bold">✓</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Quick video comprehension simulation check */}
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                      <h4 className="text-xs font-bold text-slate-750 flex items-center gap-1">
                        🔬 ¿Has comprendido la temática?
                      </h4>
                      <p className="text-xs text-slate-550 leading-relaxed">
                        Pregunta: ¿Es la <strong>Sístole</strong> el ciclo por el cual el corazón se contrae e impulsa sangre arterial oxigenada potente?
                      </p>
                      
                      {!videoQuizAnswered ? (
                        <div className="flex gap-2 pt-1.5">
                          <button
                            onClick={() => { setVideoQuizAnswered(true); setVideoUserAnswer(true); }}
                            className="bg-emerald-600 hover:bg-emerald-750 text-white font-black text-[10px] px-4 py-1.5 rounded-lg cursor-pointer transition-all uppercase"
                          >
                            Verdadero (Sí)
                          </button>
                          <button
                            onClick={() => { setVideoQuizAnswered(true); setVideoUserAnswer(false); }}
                            className="bg-rose-600 hover:bg-rose-750 text-white font-black text-[10px] px-4 py-1.5 rounded-lg cursor-pointer transition-all uppercase"
                          >
                            Falso (No)
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 bg-white border border-slate-150 rounded-lg text-xs leading-relaxed">
                          {videoUserAnswer === true ? (
                            <span className="text-emerald-700 font-extrabold block">✓ ¡Correcto! Exactamente. La sístole contrae los ventrículos cardíacos empujando con brío el caudal sanguíneo.</span>
                          ) : (
                            <span className="text-rose-500 font-extrabold block">✕ Incorrecto. Recuerda que la sístole ejerce contracción, mientras que la diástole es llenado y relajaciones pasivas.</span>
                          )}
                          <button
                            onClick={() => setVideoQuizAnswered(false)}
                            className="text-[10px] text-slate-400 font-bold underline hover:text-slate-650 block mt-2 cursor-pointer"
                          >
                            Intentar de nuevo
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
