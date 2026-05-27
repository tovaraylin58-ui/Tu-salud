import React, { useState, useEffect } from "react";
import { Plus, Phone, AlertTriangle, ShieldCheck, Check, HeartPulse, Sparkles, HelpCircle, ArrowRight, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types ---
interface FirstAidProtocol {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  urgency: "extrema" | "alta" | "media";
  symptoms: string[];
  steps: string[];
  warnings: string[];
}

interface KitItem {
  id: string;
  name: string;
  purpose: string;
}

interface SimuladorPregunta {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// --- Static Data ---
const firstAidProtocols: FirstAidProtocol[] = [
  {
    id: "rcp",
    title: "RCP (Reanimación Cardiopulmonar)",
    subtitle: "Para personas inconscientes que no respiran con normalidad.",
    emoji: "🫁",
    urgency: "extrema",
    symptoms: [
      "No responde cuando se le llama o sacude suavemente",
      "No respira o solo realiza jadeos/boqueos ineficaces",
      "Ausencia de movimientos corporales"
    ],
    steps: [
      "Asegura el entorno: Verifica que el lugar sea completamente seguro para ti y para la víctima.",
      "Valora la consciencia: Pregunta en voz alta '¿Me escucha?' y agita suavemente sus hombros.",
      "Pide ayuda inmediata: Llama a emergencias (911) o pide a alguien que consiga un DEA.",
      "Inicia compresiones cardíacas: Coloca el talón de una mano en el centro del pecho y la otra encima entrelazando los dedos. Presiona con fuerza (5-6 cm) y rapidez a una tasa de 100 a 120 compresiones por minuto.",
      "Insuflaciones (Opcional): Si estás entrenado, realiza 2 respiraciones boca a boca por cada 30 compresiones hermetizando su nariz.",
      "Mantén el ritmo constante: No interrumpas el flujo de reanimación hasta que llegue personal calificado o el paciente muestre señales claras de respiración espontánea."
    ],
    warnings: [
      "NO realices maniobras de RCP si la persona está consciente y respira con normalidad.",
      "NO presiones sobre las costillas inferiores o la boca del estómago para no provocar hemorragias internas.",
      "NO detengas las compresiones por más de 10 segundos continuos."
    ]
  },
  {
    id: "atragantamiento",
    title: "Maniobra de Heimlich",
    subtitle: "Para asfixia de vías respiratorias por objetos o alimentos.",
    emoji: "🗣️",
    urgency: "extrema",
    symptoms: [
      "Imposibilidad de hablar, toser o emitir cualquier sonido",
      "Llevarse las manos al cuello de forma desesperada (señal universal)",
      "Piel o labios con tonalidad azulada (cianosis extrema)"
    ],
    steps: [
      "Anima al afectado a toser: Si la persona puede toser con fuerza, déjala hacerlo libremente de forma autónoma.",
      "Colócate de pie detrás: Pasa tus brazos alrededor de su cintura inclinando su cuerpo levemente hacia adelante.",
      "Ubica la zona correcta: Haz un puño con tu mano hábil y sitúalo ligeramente encima de su ombligo, muy por debajo de la caja torácica.",
      "Realiza compresiones en 'J': Sujeta firmemente tu puño con la otra mano y efectúa una presión rápida, seca y enérgica hacia adentro y hacia arriba de manera repetida.",
      "Inspecciona la boca física: Si la persona pierde el conocimiento, colócala suavemente en el suelo, llama a emergencias e inicia maniobras de RCP (inspecciona la boca antes de dar aire para retirar la obstrucción visible)."
    ],
    warnings: [
      "NO realices golpes en la espalda si la persona está tosiendo de forma eficaz, podría encajar aún más el objeto.",
      "NO intentes meter los dedos en la garganta a ciegas, podrías empujar la obstrucción hacia la tráquea.",
      "Ajusta la fuerza al tratar con infantes o mujeres embarazadas (realizar flexiones en el esternón en su lugar)."
    ]
  },
  {
    id: "hemorragias",
    title: "Tratamiento de Hemorragias",
    subtitle: "Pérdida abundante de sangre por vasos rotos o heridas profundas.",
    emoji: "🩸",
    urgency: "alta",
    symptoms: [
      "Flujo constante de sangre de color oscuro o salpicaduras intermitentes de color rojo brillante (sangrado arterial)",
      "Signos de shock (palidez, sudoración fría, pulso rápido e inestable)"
    ],
    steps: [
      "Protección básica: Usa guantes estériles o una bolsa limpia si dispones de ellos para evitar el contacto directo.",
      "Presión firme sobre la herida: Coloca una gasa estéril, compresa o toalla limpia sobre la zona y ejerce una presión manual firme sin cesar de forma directa.",
      "Elevación: Si la lesión está en el brazo o pierna, levántala por encima del nivel de su corazón sin interrumpir la compresión.",
      "Agrega soporte: Si la primera gasa se empapa de sangre nueva, NO la retires. Añade otra encima y sigue presionando intensamente.",
      "Vendaje compresivo: Amarra una tira de tela o venda elástica para mantener la presión de forma constante cuidando de no detener el pulso normal de la extremidad."
    ],
    warnings: [
      "NO retires gasas ya empapadas de sangre; esto arrancaría el coágulo regenerado que el cuerpo ha comenzado a consolidar de forma natural.",
      "NO utilices torniquetes improvisados a menos que el sangrado sea masivo y ponga en riesgo la supervivencia (como una amputación severa).",
      "NO limpies la herida profunda restregando fuerte, ya que reactivarías el sangrado arterial."
    ]
  },
  {
    id: "quemaduras",
    title: "Quemaduras Térmicas",
    subtitle: "Lesiones en la piel por calor corporal o agentes químicos.",
    emoji: "🔥",
    urgency: "alta",
    symptoms: [
      "Piel enrojecida e inflamada con ardor severo (primer grado)",
      "Aparición de ampollas con líquido claro dolorosas (segundo grado)",
      "Piel carbonizada, blanquecina o textura acartonada sin dolor por destrucción nerviosa (tercer grado)"
    ],
    steps: [
      "Detén la fuente del calor: Aleja a la víctima de las llamas, vapores calientes o el torrente eléctrico de riesgo.",
      "Enfría con agua limpia: Deja correr abundante agua corriente fría o templada sobre la lesión entre 10 y 20 minutos completos. No uses agua helada.",
      "Retira accesorios con cuidado: Quita anillos, pulseras o prendas de vestir antes de que comience el proceso de inflamación, solo si no están pegados al tejido quemado.",
      "Cubre holgadamente: Protege la ampolla o tejido vivo con una venda o gasa estéril (humedecida si es factible) sin apretar o provocar presión.",
      "Hidratación: Estimula la ingesta de agua pura y traslada al hospital si la superficie excede el tamaño de la palma de la mano."
    ],
    warnings: [
      "NO apliques remedios caseros como pasta dental, mantequilla, aceites vegetales, cebolla o clara de huevo ya que atrapan bacterias y el calor.",
      "NO rompas nunca las ampollas; la piel externa de la ampolla actúa como un blindaje estéril para eludir infecciones severas.",
      "NO apliques hielo directo sobre la herida térmica para no añadir una quemadura por congelación celular extrema."
    ]
  },
  {
    id: "fracturas",
    title: "Fracturas o Esguinces",
    subtitle: "Ruptura del hueso o lesión articular aguda.",
    emoji: "🦴",
    urgency: "media",
    symptoms: [
      "Dolor intenso al tacto o al intentar mover la extremidad afectada",
      "Hinchazón evidente, deformidado o hematoma morado en la articulación",
      "Incapacidad funcional para apoyar el miembro o dolor incapacitante"
    ],
    steps: [
      "Inmovilización absoluta: Deja la extremidad en la misma posición en la que la hallaste. No intentes reacomodar el hueso bajo ningún concepto.",
      "Cubre lesiones abiertas: Si el hueso rompió la piel y está expuesto al aire, coloca una compresa limpia ejerciendo presión lateral suave para aminorar pérdidas de sangre.",
      "Improvisa un entablillado: Fija la articulación superior e inferior utilizando tablas, piezas de cartón rígidas o periódicos enrollados sujetos con vendas sin apretar en demasía.",
      "Aplica frío localizado: Pon una bolsa de hielo envuelta en un lienzo o paño suave sobre la zona inflamada (por lapsos de 15 minutos continuos).",
      "Traslado cauteloso: Mantén al paciente quieto y llévalo a un centro médico de urgencias radiológicas."
    ],
    warnings: [
      "NO jales ni intentes acomodar el hueso desviado; podrías cortar vasos sanguíneos críticos u ocasionar daños neurológicos temporales o permanentes.",
      "NO des masajes directos ni apliques cremas analgésicas o calientes sobre posibles fracturas óseas.",
      "NO permitas que el paciente apoye peso o camine si se sospecha de fracturas en columna o miembros inferiores."
    ]
  }
];

const kitItems: KitItem[] = [
  { id: "gasas", name: "Gasas Estériles individuales", purpose: "Limpiar heridas y cubrir quemaduras sin dejar pelusa en el tejido." },
  { id: "vendas", name: "Vendas Elásticas de varios calibres", purpose: "Fijar apósitos, entablillados temporales o ejercer compresión ligera en esguinces." },
  { id: "cinta", name: "Cinta Adhesiva Hipoalergénica (esparadrapo)", purpose: "Sujetar extremos de vendajes o apósitos sin irritar pieles ultra sensibles." },
  { id: "antiseptico", name: "Antiséptico de amplio espectro (Alcohol al yodo/Clorhexidina)", purpose: "Desinfectar bordes externos de heridas abiertas." },
  { id: "suero", name: "Suero Fisiológico estéril (solución salina)", purpose: "Lavar de forma constante impurezas de los ojos o retirar suciedad interna de raspones." },
  { id: "tijeras", name: "Tijeras de Botiquín con punta redondeada", purpose: "Cortar ropa o vendas de forma veloz sin arriesgarse a dar cortes a la piel." },
  { id: "guantes", name: "Guantes de Nitrilo o Látex estériles", purpose: "Garantizar una barrera biológica higiénica absoluta entre el socorrista y el paciente." },
  { id: "termometro", name: "Termómetro digital de precisión", purpose: "Monitorear estados febriles e identificar infecciones sistémicas oportunistas." },
  { id: "pinzas", name: "Pinzas finas de acero inoxidable", purpose: "Extraer astillas de madera, agujas o espinas alojadas en la superficie de la piel." },
  { id: "manta", name: "Manta Térmica de Emergencia (aluminizada)", purpose: "Evitar estados de hipotermia grave en pacientes traumatizados o en estado de shock." }
];

const simulatorQuestions: SimuladorPregunta[] = [
  {
    question: "Un compañero de trabajo se quema con café hirviendo en el brazo y tiene la piel muy roja. ¿Qué debes hacer primero?",
    options: [
      "Aplicarle pasta de dientes blanca o mantequilla fría inmediatamente para calmar el ardor.",
      "Colocar hielo directo del congelador sobre las quemaduras durante 15 minutos para frenar la hinchazón.",
      "Dejar correr abundante agua corriente limpia y templada por el brazo durante 10 a 20 minutos."
    ],
    correctIndex: 2,
    explanation: "El agua corriente limpia a temperatura ambiente o templada es lo único indicado para enfriar el tejido de forma segura, reduciendo la temperatura sin dañar las células (como lo haría el hielo extremo) y sin bloquear el calor o infectar la zona (como ocurre con la pasta dental o alimentos)."
  },
  {
    question: "Estás cenando y alguien comienza a asfixiarse, no puede toser ni hablar y se lleva ambas manos al cuello con desesperación. ¿Cuál es el paso indicado?",
    options: [
      "Darle golpes secos en la espalda con él sentado derecho.",
      "Darle un vaso con agua para que intente tragar la comida con fuerza.",
      "Ubicarse detrás de él y realizar la maniobra de Heimlich con compresiones vigorosas hacia adentro y arriba en el vientre."
    ],
    correctIndex: 2,
    explanation: "La maniobra de Heimlich es la intervención estandarizada para expulsar el objeto atascado al comprimir el diafragma. Intentar tragar agua puede ahogar por completo la vía de aire, y golpear la espalda con el paciente erguido puede hacer caer la obstrucción aún más profundo."
  },
  {
    question: "Alguien sufre un fuerte raspon clínico en la rodilla izquierda que comienza a sangrar cuantiosamente empapando la primera compresa colocada. ¿Cómo procedes?",
    options: [
      "Retirar la compresa empapada de prisa para no infectar y colocar una nueva limpia frotando enérgicamente.",
      "Dejar la compresa empapada allí para proteger el coágulo inicial, colocar más tela limpia encima y mantener la presión manual con firmeza.",
      "Colocar un torniquete flojo justo arriba del muslo durante 45 minutos."
    ],
    correctIndex: 1,
    explanation: "El coágulo biológico que detiene el sangrado se forma fijándose sobre el primer apósito colocado. Si lo retiras bruscamente, desgarrarás las plaquetas formadas reiniciando la pérdida sanguínea. Añade material encima sin quitar la base."
  },
  {
    question: "Si encuentras a una persona desplomada en el suelo del salón, inmóvil, que no responde al hablarle fuerte ni se le observa respiración en el pecho, ¿qué debes iniciar?",
    options: [
      "Buscar un vaso de agua para mojar su frente, sacudirla agresivamente y sentarla en una silla alta.",
      "Pedir a alguien que llame a emergencias (911) para reportar la situación e iniciar de inmediato las compresiones torácicas rítmicas de RCP.",
      "Esperar 15 minutos con calma para verificar si es una simple fatiga pasajera."
    ],
    correctIndex: 1,
    explanation: "Un colapso con falta de consciencia y ausencia de respiración requiere maniobras inmediatas de RCP junto a una llamada rápida a los servicios de rescate. El cerebro solo resiste de 4 a 6 minutos sin flujo circulatorio antes de sufrir daños irreparables."
  }
];

export default function FirstAid() {
  const [activeTab, setActiveTab] = useState<"protocolos" | "simulador" | "botiquin">("protocolos");
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>("rcp");

  // Botiquín checklist persistence state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("vidasana_firstaid_kit");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("vidasana_firstaid_kit", JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleItem = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const countChecked = () => {
    return Object.values(checkedItems).filter(Boolean).length;
  };

  // Simulator State
  const [simScore, setSimScore] = useState(0);
  const [currentSimIndex, setCurrentSimIndex] = useState(0);
  const [selectedSimAnswer, setSelectedSimAnswer] = useState<number | null>(null);
  const [showSimExplanation, setShowSimExplanation] = useState(false);
  const [simComplete, setSimComplete] = useState(false);

  // Call Emergency State
  const [isCalling, setIsCalling] = useState(false);
  const [callScenario, setCallScenario] = useState("");
  const [showCallGuide, setShowCallGuide] = useState(false);

  const selectedProtocol = firstAidProtocols.find((p) => p.id === selectedProtocolId);

  const handleSimAnswer = (optIndex: number) => {
    if (selectedSimAnswer !== null) return;
    setSelectedSimAnswer(optIndex);
    if (optIndex === simulatorQuestions[currentSimIndex].correctIndex) {
      setSimScore((prev) => prev + 1);
    }
    setShowSimExplanation(true);
  };

  const nextSimQuestion = () => {
    setSelectedSimAnswer(null);
    setShowSimExplanation(false);
    if (currentSimIndex < simulatorQuestions.length - 1) {
      setCurrentSimIndex((prev) => prev + 1);
    } else {
      setSimComplete(true);
    }
  };

  const restartSim = () => {
    setSimScore(0);
    setCurrentSimIndex(0);
    setSelectedSimAnswer(null);
    setShowSimExplanation(false);
    setSimComplete(false);
  };

  const triggerCallSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callScenario.trim()) return;
    setIsCalling(true);
    setTimeout(() => {
      setIsCalling(false);
      setShowCallGuide(true);
    }, 1500);
  };

  return (
    <section id="primeros-auxilios" className="py-20 bg-red-600 text-white border-t border-b border-red-700 relative overflow-hidden">
      
      {/* Decorative Red Cross Watermarks in Background */}
      <div className="absolute right-[-10%] top-[-5%] w-96 h-96 opacity-5 pointer-events-none text-white select-none">
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>
        </svg>
      </div>
      <div className="absolute left-[-10%] bottom-[-5%] w-96 h-96 opacity-5 pointer-events-none text-white select-none">
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
          <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title Content - Classic Red Cross Branding (Rojo y Blanco) */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          
          {/* Main SVG Red Cross Logo Graphic (Rojo y Blanco de alta precisión) */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg relative">
              <div className="absolute w-10 h-3.5 bg-red-600 rounded"></div>
              <div className="absolute w-3.5 h-10 bg-red-600 rounded"></div>
            </div>
          </div>

          <h2 className="text-3.5xl font-black tracking-tight text-white mb-3">
            Manual de Urgencias y Primeros Auxilios
          </h2>
          <p className="text-red-100 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Saber cómo reaccionar durante los primeros minutos de un accidente puede salvar una vida. Explora pautas clínicas, pon a prueba tus reflejos en el simulador o arma tu botiquín.
          </p>

          {/* Navigation Subtabs (Total Red and White contrast) */}
          <div className="mt-8 flex justify-center p-1 bg-red-700/50 rounded-full max-w-md mx-auto border border-red-500/35">
            <button
              onClick={() => setActiveTab("protocolos")}
              className={`flex-1 py-2 px-3 rounded-full text-xs font-black transition-all cursor-pointer ${
                activeTab === "protocolos"
                  ? "bg-white text-red-600 shadow-md"
                  : "text-red-100 hover:text-white"
              }`}
            >
              📖 Guías S.O.S
            </button>
            <button
              onClick={() => setActiveTab("simulador")}
              className={`flex-1 py-2 px-3 rounded-full text-xs font-black transition-all cursor-pointer ${
                activeTab === "simulador"
                  ? "bg-white text-red-600 shadow-md"
                  : "text-red-100 hover:text-white"
              }`}
            >
              🩺 Simulador Directo
            </button>
            <button
              onClick={() => setActiveTab("botiquin")}
              className={`flex-1 py-2 px-3 rounded-full text-xs font-black transition-all cursor-pointer ${
                activeTab === "botiquin"
                  ? "bg-white text-red-600 shadow-md"
                  : "text-red-100 hover:text-white"
              }`}
            >
              🎒 Botiquín Casero
            </button>
          </div>
        </div>

        {/* --- Content Area render --- */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: MANUAL DE PROTOCOLOS S.O.S */}
            {activeTab === "protocolos" && (
              <motion.div
                key="firstaid-protocols"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Left quick panel list selector */}
                <div className="lg:col-span-4 space-y-3">
                  <span className="text-xs font-black text-red-100 uppercase tracking-widest block mb-1">
                    Selecciona una Urgencia:
                  </span>
                  <div className="flex flex-col gap-2">
                    {firstAidProtocols.map((p) => {
                      const isSelected = selectedProtocolId === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => setSelectedProtocolId(p.id)}
                          className={`w-full text-left p-4 rounded-xl border transition-all text-xs font-black flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? "bg-white text-red-600 border-white shadow-lg"
                              : "bg-red-700/40 border-red-500/40 text-white hover:bg-red-700/70"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="text-xl bg-white p-1 rounded-lg text-red-600">{p.emoji}</span>
                            <span>{p.title}</span>
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-tight ${
                            p.urgency === "extrema" ? "bg-red-500 text-white border border-red-350" : "bg-white/10 text-white"
                          }`}>
                            {p.urgency}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* SOS Call Simulador Quick widget inside tab */}
                  <form onSubmit={triggerCallSimulation} className="bg-red-700/30 border border-red-500/30 p-5 rounded-2xl space-y-3 mt-4">
                    <h4 className="text-xs font-black flex items-center gap-1.5 tracking-wider uppercase">
                      <Phone className="w-4 h-4 fill-current text-white" />
                      Simular Llamada Emergencias
                    </h4>
                    <p className="text-[10px] text-red-100 leading-relaxed">
                      Escribe rápido qué sucede y simula un entrenamiento de reporte.
                    </p>
                    <input
                      type="text"
                      value={callScenario}
                      onChange={(e) => setCallScenario(e.target.value)}
                      placeholder="Ej: Accidente de trayecto con corte profundo"
                      className="w-full p-2.5 bg-red-800 text-white rounded-lg text-xs placeholder-red-100 placeholder:opacity-50 border border-red-500/40 focus:outline-none focus:ring-1 focus:ring-white outline-none"
                      required
                    />
                    <button
                      type="submit"
                      disabled={isCalling}
                      className="w-full bg-white text-red-600 hover:bg-red-50 font-black py-2 px-3 rounded-lg text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isCalling ? "Marcando 911..." : "Simular Llamada 911"}
                    </button>
                  </form>
                </div>

                {/* Right details card */}
                <div className="lg:col-span-8 bg-white text-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl border border-red-100">
                  <AnimatePresence mode="wait">
                    {selectedProtocol && (
                      <motion.div
                        key={selectedProtocol.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        {/* Title of specific emergency */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-red-100 pb-4 gap-3">
                          <div className="flex items-center gap-3">
                            <span className="text-4xl bg-red-50 p-2.5 rounded-2xl border border-red-100/50 block select-none">
                              {selectedProtocol.emoji}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${
                                  selectedProtocol.urgency === "extrema"
                                    ? "bg-red-650 text-white"
                                    : selectedProtocol.urgency === "alta"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-orange-50 text-orange-950"
                                }`}>
                                  Prioridad {selectedProtocol.urgency}
                                </span>
                              </div>
                              <h3 className="text-xl font-black text-red-900 mt-1 leading-none">{selectedProtocol.title}</h3>
                            </div>
                          </div>
                        </div>

                        {/* Description block */}
                        <div>
                          <p className="text-slate-600 text-sm leading-relaxed font-semibold italic">
                            &ldquo;{selectedProtocol.subtitle}&rdquo;
                          </p>
                        </div>

                        {/* Critical Symptoms */}
                        <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/30">
                          <h4 className="text-xs font-black text-red-800 uppercase tracking-widest block mb-2.5">
                            ¿Cómo Identificar la Situación?
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {selectedProtocol.symptoms.map((sym, index) => (
                              <li key={index} className="text-slate-700 text-xs flex items-start gap-2">
                                <span className="text-red-600 font-extrabold">•</span>
                                <span className="font-medium">{sym}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Sequential Action Steps (1, 2, 3...) */}
                        <div>
                          <h4 className="text-xs font-black text-red-800 uppercase tracking-widest block mb-3">
                            Plan de Acción Paso a Paso:
                          </h4>
                          <div className="space-y-3">
                            {selectedProtocol.steps.map((step, index) => (
                              <div key={index} className="flex gap-3 bg-red-50/20 p-3 rounded-xl border border-red-100/20">
                                <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                                  {index + 1}
                                </span>
                                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                                  <strong>{step.split(":")[0]}:</strong>
                                  {step.split(":")[1]}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Crucial Contraindications Warnings (Always styled in clean red/white highlight) */}
                        <div className="p-4 bg-red-600 text-white rounded-xl">
                          <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                            <AlertTriangle className="w-4 h-4 text-white" />
                            Lo que NUNCA debes hacer (Errores Fatales)
                          </h4>
                          <ul className="space-y-2">
                            {selectedProtocol.warnings.map((warn, index) => (
                              <li key={index} className="text-xs flex items-start gap-2 text-white">
                                <span className="text-amber-200 font-black">•</span>
                                <span className="font-semibold">{warn}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Disclaimer note */}
                        <div className="text-[10px] text-center text-slate-505 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                          ⚠️ <strong>Aviso Clínico de Autodespacho:</strong> Estas directrices son orientativas y de atención básica primaria. Ninguna maniobra sustituye el rescate del cuerpo de paramédicos especializado. Llama de inmediato al 911 en situaciones críticas.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* VIEW 2: INTERACTIVE PRACTICE SIMULATOR (QUIZ DE ACCIÓN DE EMERGENCIA) */}
            {activeTab === "simulador" && (
              <motion.div
                key="firstaid-simulator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white text-slate-800 p-6 md:p-8 rounded-3xl shadow-xl max-w-3xl mx-auto border border-red-100"
              >
                {!simComplete ? (
                  <div className="space-y-6">
                    {/* Header bar progress info */}
                    <div className="flex items-center justify-between border-b border-red-50 pb-4">
                      <div>
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-2.5 py-1 rounded-full border border-red-100 inline-block">
                          Simulador de Toma de Decisiones
                        </span>
                        <h3 className="text-lg font-black text-slate-900 mt-2">Prueba de Primeros Auxilios</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-bold uppercase">Premisa:</span>
                        <span className="text-sm font-black text-red-600">{currentSimIndex + 1} de {simulatorQuestions.length}</span>
                      </div>
                    </div>

                    {/* Question layout inside big block */}
                    <div className="bg-red-600 text-white p-6 rounded-2xl shadow-md">
                      <span className="text-xs uppercase font-extrabold text-red-100 tracking-wider">Escenario Clínico</span>
                      <h4 className="text-md sm:text-lg font-bold mt-1.5 leading-snug">
                        {simulatorQuestions[currentSimIndex].question}
                      </h4>
                    </div>

                    {/* Checkbox choice lists */}
                    <div className="grid grid-cols-1 gap-3">
                      {simulatorQuestions[currentSimIndex].options.map((option, index) => {
                        const isSelected = selectedSimAnswer === index;
                        const isCorrect = index === simulatorQuestions[currentSimIndex].correctIndex;
                        const answered = selectedSimAnswer !== null;

                        let btnStyle = "bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-700";
                        if (answered) {
                          if (isCorrect) {
                            btnStyle = "bg-red-50 border-red-400 text-red-900 font-bold";
                          } else if (isSelected) {
                            btnStyle = "bg-red-100/50 border-red-300 text-red-800";
                          } else {
                            btnStyle = "bg-slate-50/50 border-slate-100 text-slate-400 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={index}
                            disabled={answered}
                            onClick={() => handleSimAnswer(index)}
                            className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <span className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                isSelected ? "bg-red-600 text-white" : "bg-slate-200/90 text-slate-600"
                              }`}>
                                {index + 1}
                              </span>
                              <span>{option}</span>
                            </span>
                            {answered && isCorrect && (
                              <span className="text-xs text-red-600 font-extrabold">✓ Correcto</span>
                            )}
                            {answered && isSelected && !isCorrect && (
                              <span className="text-xs text-red-700 font-extrabold">✕ Incorrecto</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Scientific Explanation Block */}
                    {showSimExplanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="bg-red-50/45 border border-red-100/50 p-5 rounded-2xl space-y-2 mt-4"
                      >
                        <h5 className="text-xs font-black text-red-800 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                          <ShieldCheck className="w-4 h-4 text-red-600" />
                          Explicación Médica Científica:
                        </h5>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-semibold">
                          {simulatorQuestions[currentSimIndex].explanation}
                        </p>
                        
                        <div className="pt-3 border-t border-red-100/40 flex justify-end">
                          <button
                            onClick={nextSimQuestion}
                            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl transition-all shadow cursor-pointer active:scale-95 text-center"
                          >
                            {currentSimIndex < simulatorQuestions.length - 1 ? "Siguiente Desafío →" : "Ver Calificación Final"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  // QUIZ COMPLETED RESULTS CARD
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center p-8 space-y-5"
                  >
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto border border-red-100">
                      <HeartPulse className="w-10 h-10 text-red-600 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">¡Simulación Completada!</h3>
                      <p className="text-xs text-slate-400 mt-1">Conoce de qué forma responderías durante emergencias sanitarias.</p>
                    </div>

                    <div className="bg-red-50/40 p-6 rounded-2xl border border-red-100 max-w-sm mx-auto">
                      <span className="text-red-600 text-xs font-black uppercase tracking-widest block">Tu Puntuación en Socorro</span>
                      <div className="text-4xl font-black text-red-600 mt-2">
                        {simScore} <span className="text-slate-400 text-xl font-normal">/ {simulatorQuestions.length}</span>
                      </div>
                      <p className="text-slate-650 text-xs font-semibold mt-3 leading-relaxed">
                        {simScore === simulatorQuestions.length
                          ? "¡Excelente trabajo! Tienes una preparación absoluta de socorrista voluntario."
                          : simScore >= 2
                          ? "¡Buen esfuerzo! Sabes reaccionar pero aún posees áreas de error admisibles."
                          : "Te sugerimos repasar detalladamente el dossier de protocolos para salvar vidas."}
                      </p>
                    </div>

                    <button
                      onClick={restartSim}
                      className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition-all active:scale-95 uppercase tracking-wider"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reintentar Simulador de Urgencias
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* VIEW 3: BOTIQUÍN CASERO CHECKLIST */}
            {activeTab === "botiquin" && (
              <motion.div
                key="firstaid-kit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white text-slate-800 p-6 md:p-8 rounded-3xl shadow-xl border border-red-100"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-red-50 pb-5 mb-6 gap-4">
                  <div>
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-2.5 py-1 rounded-full border border-red-100 inline-block">
                      Preparación de Botiquín
                    </span>
                    <h3 className="text-lg font-black text-slate-900 mt-2">Checklist del Gabinete Clínico de Emergencias</h3>
                    <p className="text-xs text-slate-400 mt-1">Arma un botiquín seguro en tu hogar marcando los insumos que ya posees.</p>
                  </div>
                  <div className="px-5 py-2.5 bg-red-600 text-white text-center rounded-2xl shrink-0 self-stretch md:self-auto flex flex-col justify-center border border-red-550 shadow-md">
                    <span className="text-[10px] font-bold text-red-100 uppercase tracking-widest block leading-none">Completado</span>
                    <span className="text-lg font-black mt-1 leading-none">{countChecked()} / {kitItems.length}</span>
                  </div>
                </div>

                {/* Grid checklist structure */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kitItems.map((item) => {
                    const isChecked = !!checkedItems[item.id];
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`text-left p-4 rounded-2xl border transition-all flex gap-3.5 items-start cursor-pointer group ${
                          isChecked
                            ? "bg-red-50/30 border-red-400 text-slate-800"
                            : "bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                          isChecked
                            ? "bg-red-600 border-red-600 text-white"
                            : "border-slate-300 group-hover:border-red-400 bg-white"
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <h4 className={`text-xs font-black transition-colors ${
                            isChecked ? "text-red-900" : "text-slate-800"
                          }`}>
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                            {item.purpose}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Botiquín completion feedback banner */}
                {countChecked() === kitItems.length ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-red-600 text-white rounded-2xl flex items-center gap-3 mt-6 border border-red-550"
                  >
                    <span className="text-2xl">🎒</span>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider">¡Botiquín de Seguridad al 100%!</h4>
                      <p className="text-[11px] text-red-100 leading-relaxed mt-0.5 font-semibold">
                        ¡Felicitaciones! Cuentas con todos los elementos recomendados de primeros auxilios listos para reaccionar ante contingencias en tu hogar.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="mt-6 text-[11px] text-center text-slate-400 font-mono italic">
                    * Tu botiquín se guarda automáticamente en tu navegador. Completa la lista para asegurar la paz familiar.
                  </div>
                )}
              </motion.div>
            )}

            {/* CALL SIMULATION INTERACTIVE POPUP / EMERGENCY DISPATCHER REPORT (Red & White) */}
            {showCallGuide && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
              >
                <div className="bg-white text-slate-800 max-w-lg w-full rounded-2xl shadow-2xl border-2 border-red-600 overflow-hidden transform transition-all">
                  
                  {/* Header bar simulated call */}
                  <div className="bg-red-600 text-white p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                      <span className="text-xs font-black tracking-widest uppercase">Canal S.O.S Activo (Simulado)</span>
                    </div>
                    <button
                      onClick={() => { setShowCallGuide(false); setCallScenario(""); }}
                      className="text-white hover:text-red-150 font-black text-xs cursor-pointer bg-red-700/50 px-2 py-1 rounded"
                    >
                      Cerrar Simulación
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                        📞
                      </div>
                      <h4 className="text-md font-black text-slate-900 leading-tight">Simulador de Reporte ante Despachador 911</h4>
                      <p className="text-xs text-slate-500 leading-normal">
                        Para el caso escrito: &ldquo;<strong className="text-red-600">{callScenario}</strong>&rdquo;, el despachador necesita que le informes de inmediato lo siguiente sin dudar:
                      </p>
                    </div>

                    <div className="space-y-3 bg-red-50/40 p-4 rounded-2xl border border-red-100">
                      <div className="text-xs text-slate-700 flex gap-2 font-semibold">
                        <span className="text-red-600 font-extrabold font-mono">1. Ubicación exacta:</span>
                        <span>Menciona calle, intersecciones, número de interior o referencias visibles.</span>
                      </div>
                      <div className="text-xs text-slate-700 flex gap-2 font-semibold border-t border-red-100/40 pt-2">
                        <span className="text-red-600 font-extrabold font-mono">2. Detalla el suceso:</span>
                        <span>Explica de forma concisa qué accidente o molestia sufre la persona afectada.</span>
                      </div>
                      <div className="text-xs text-slate-700 flex gap-2 font-semibold border-t border-red-100/40 pt-2">
                        <span className="text-red-600 font-extrabold font-mono">3. Consciencia y respiración:</span>
                        <span>Define explícitamente si responde a llamados o si respira rápido/lento.</span>
                      </div>
                      <div className="text-xs text-slate-700 flex gap-2 font-semibold border-t border-red-100/40 pt-2">
                        <span className="text-red-600 font-extrabold font-mono">4. Medidas en curso:</span>
                        <span>Especifica si ya estás aplicando RCP o compresión para frenar el sangrado.</span>
                      </div>
                    </div>

                    <button
                      onClick={() => { setShowCallGuide(false); setCallScenario(""); }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl text-xs tracking-wider uppercase transition-all shadow-md active:scale-98 cursor-pointer"
                    >
                      Entendido, Finalizar Ejercicio S.O.S
                    </button>
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
