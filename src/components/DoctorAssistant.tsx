import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  HeartHandshake, 
  HelpCircle, 
  Sparkles, 
  Activity, 
  Flame, 
  Baby, 
  Stethoscope, 
  ShieldAlert, 
  Smile, 
  Zap, 
  ArrowRight,
  Info,
  Volume2,
  VolumeX
} from "lucide-react";

interface Doubt {
  id: string;
  question: string;
  shortLabel: string;
  icon: React.ReactNode;
  answer: {
    message: string;
    specialty: string;
    recomms: string[];
    isEmergency: boolean;
  };
}

const HEALTH_DOUBTS: Doubt[] = [
  {
    id: "fiebre",
    question: "¿Qué debo hacer si presento fiebre alta repentina?",
    shortLabel: "Fiebre Alta",
    icon: <Flame className="w-4 h-4 text-amber-500 animate-pulse" />,
    answer: {
      message: "La fiebre es una respuesta natural de defensa del cuerpo contra las infecciones. En adultos, se considera alta a partir de los 38.3 °C.",
      specialty: "Consulta con Medicina General o Urgencias si no cede.",
      recomms: [
        "Mantén una hidratación abundante con agua o sueros.",
        "Usa paños de agua templada en frente y axilas.",
        "Evita el exceso de ropa o cobijas pesadas.",
        "Monitorea la temperatura con termómetro cada 4 horas."
      ],
      isEmergency: false
    }
  },
  {
    id: "urgencias-vs-consulta",
    question: "¿Cómo saber si debo ir a Urgencias o agendar una consulta común?",
    shortLabel: "Urgencia vs Consulta",
    icon: <ShieldAlert className="w-4 h-4 text-rose-500" />,
    answer: {
      message: "Es una de las dudas más importantes. Las Urgencias son para situaciones que amenazan la vida o comprometen severamente un órgano.",
      specialty: "Urgencias Médicas (24/7) vs Consulta Externa.",
      recomms: [
        "🚨 VE A URGENCIAS: Si sientes dolor opresivo en el pecho, asfixia repentina, parálisis fácil o pérdida de conciencia.",
        "📅 AGENDA CONSULTA: Si son dolores leves de garganta, dolores de muela, sarpullidos leves o control prenatal rutinario."
      ],
      isEmergency: true
    }
  },
  {
    id: "digestivo",
    question: "¿Qué especialista trata el dolor de estómago crónico o acidez frecuente?",
    shortLabel: "Dolor de Estómago",
    icon: <Activity className="w-4 h-4 text-emerald-500" />,
    answer: {
      message: "La acidez y el reflujo constante pueden dañar el esófago. Si el dolor de estómago lleva semanas o viene acompañado de náuseas, requiere valoración especializada.",
      specialty: "Nutrición y Dietética o derivación a Gastroenterología.",
      recomms: [
        "Evita cenar alimentos grasosos o muy condimentados justo antes de dormir.",
        "Disminuye el consumo de cafeína, refrescos cítricos y alcohol.",
        "Come porciones pequeñas pero frecuentes, masticando lento."
      ],
      isEmergency: false
    }
  },
  {
    id: "embarazo",
    question: "¿Cuáles son las señales de alarma durante el embarazo?",
    shortLabel: "Embarazo Seguro",
    icon: <Baby className="w-4 h-4 text-sky-500" />,
    answer: {
      message: "Durante la gestación, es indispensable estar alerta ante cambios anormales para proteger tanto a la madre como al bebé.",
      specialty: "Ginecología y Obstetricia (Atención prioritaria)",
      recomms: [
        "🚨 ATENCIÓN INMEDIATA: Sangrado vaginal, dolor de cabeza muy fuerte que no quita, ver lucecitas o zumbido en oídos.",
        "🚨 OTROS SIGNOS: Hinchazón súbita de cara/manos, o si dejas de sentir los movimientos del bebé después de la semana 22."
      ],
      isEmergency: true
    }
  },
  {
    id: "deporte",
    question: "¿Cómo debo prepararme físicamente para iniciar una rutina deportiva sin lesionarme?",
    shortLabel: "Evitar Lesiones",
    icon: <Zap className="w-4 h-4 text-yellow-500" />,
    answer: {
      message: "Iniciar una actividad física es excelente, pero exigirse al 100% el primer día suele provocar desgarros, dolores óseos o esguinces dolorosos.",
      specialty: "Traumatología y Ortopedia / Nutrición Deportiva.",
      recomms: [
        "Realiza calentamiento articular dinámico obligatorio de 10 minutos previo.",
        "Incrementa la intensidad semanalmente de forma gradual.",
        "Mantén una ingesta hídrica óptima antes, durante y después del ejercicio."
      ],
      isEmergency: false
    }
  }
];

export default function DoctorAssistant() {
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(HEALTH_DOUBTS[0]);
  const [doctorGesture, setDoctorGesture] = useState<"breathing" | "explaining" | "waving" | "thinking">("breathing");
  const [customQuestion, setCustomQuestion] = useState("");
  const [customReply, setCustomReply] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Stop current speaking on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Always stop previous talking acts
    window.speechSynthesis.cancel();

    if (!isVoiceEnabled) {
      setIsSpeaking(false);
      return;
    }

    // Clean markdown characters from spoken speech
    const cleanSpeech = text
      .replace(/\*\*/g, "")
      .replace(/🚨/g, "Atención clínica:")
      .replace(/✓/g, "")
      .replace(/💡/g, "Consejo importante:")
      .replace(/🩺/g, "Doctor:")
      .replace(/🧠/g, "")
      .replace(/👾/g, "")
      .replace(/🎯/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = "es-ES";
    utterance.rate = 1.05; // Friendly pace
    utterance.pitch = 1.05; // Gentle medical tone

    utterance.onstart = () => {
      setIsSpeaking(true);
      setDoctorGesture("explaining");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setDoctorGesture("breathing");
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setDoctorGesture("breathing");
    };

    window.speechSynthesis.speak(utterance);
  };

  const toggleVoice = () => {
    const nextVal = !isVoiceEnabled;
    setIsVoiceEnabled(nextVal);
    if (!nextVal && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setDoctorGesture("breathing");
    }
  };

  const HEALTH_INTROS = [
    "Hola, un gusto saludarte. Con respecto a tu inquietud,",
    "Hola. Entiendo perfectamente tu preocupación sobre tu salud y te comento que",
    "Un saludo afectuoso. Analizando detenidamente los síntomas que describes,",
    "¡Hola! Qué buena consulta médica. Respecto a lo que mencionas,",
    "Hola, espero de corazón que te encuentres bien. Acerca de tu caso,",
    "Buen día. Como tu asesor clínico de confianza, te oriento indicando que"
  ];

  const HEALTH_OUTROS = [
    "¿Has estado descansando adecuadamente y bebiendo suficiente agua el día de hoy?",
    "¿Has notado si este dolor o malestar se intensifica a ciertas horas del día?",
    "¿Llevas un estilo de vida con suficiente descanso y alimentos saludables últimamente?",
    "Por favor, mantén reposo prudencial y monitorea tu estado. ¿Te asisto para agendar con un especialista?",
    "Recuerda que tu bienestar es lo primordial. ¿Te gustaría consultar directamente con nuestro staff?"
  ];

  const generateLocalFallbackResponse = (queryText: string): string => {
    const query = queryText.toLowerCase();
    const intro = HEALTH_INTROS[Math.floor(Math.random() * HEALTH_INTROS.length)];
    const outro = HEALTH_OUTROS[Math.floor(Math.random() * HEALTH_OUTROS.length)];
    let coreAdvice = "";

    if (query.includes("cabeza") || query.includes("migraña") || query.includes("cefalea")) {
      const headaches = [
        "los dolores de cabeza intensos o migrañas persistentes suelen desencadenarse por estrés extremo, deshidratación o tensiones musculares en las cervicales. Te recomiendo agendar una valoración en nuestro departamento de Neurología Avanzada para un diagnóstico certero.",
        "la presión constante en las sienes suele indicar fatiga visual o falta de descanso. Procura apagar pantallas, hidratarte bien y acudir preventivamente a Medicina General para un chequeo de presión arterial.",
        "las cefaleas recurrentes merecen un estudio minucioso de tus rutinas. Evita automedicarte con analgésicos fuertes y consulta a un especialista para evaluar tu salud de fondo."
      ];
      coreAdvice = headaches[Math.floor(Math.random() * headaches.length)];
    } else if (query.includes("ojo") || query.includes("vista") || query.includes("borroso") || query.includes("ocular")) {
      const eyes = [
        "el picor o visión borrosa ocasional se asocia de forma común a la fatiga ocular digital por pantallas. Procura reposar los ojos cada 20 minutos y agenda consulta en Oftalmología.",
        "la sequedad ocular o dolor focalizado en el globo de tu ojo requiere lubricantes recetados e higiene visual. Evita frotar el área afectada para no causar microlesiones o infecciones.",
        "disminuciones bruscas de nitidez ocular son señales que no debes dejar pasar. Asegúrate de programar un examen de agudeza visual con nuestro oftalmólogo prontamente."
      ];
      coreAdvice = eyes[Math.floor(Math.random() * eyes.length)];
    } else if (query.includes("grasa") || query.includes("dieta") || query.includes("kilo") || query.includes("peso") || query.includes("comer") || query.includes("nutric")) {
      const nutrition = [
        "una nutrición equilibrada y sostenible es fundamental para el metabolismo. Evita dietas milagro que causan descompensaciones y consulta con Nutrición y Dietética.",
        "variar tu peso corporal drásticamente altera tu vitalidad y defensas. Un plan de alimentación ajustado a tu ritmo de vida real te devolverá un balance metabólico prolongado.",
        "la ingesta ordenada de micronutrientes previene el envejecimiento celular. Te sugerimos diseñar un menú saludable junto a nuestros profesionales sanitarios."
      ];
      coreAdvice = nutrition[Math.floor(Math.random() * nutrition.length)];
    } else if (query.includes("hueso") || query.includes("fractura") || query.includes("golpe") || query.includes("esguince") || query.includes("rodilla") || query.includes("articul") || query.includes("tobillo")) {
      const trauma = [
        "los traumatismos directos con inflamación severa exigen una radiografía expedita para descartar fisuras. Coloca hielo indirecto y consulta a Traumatología y Ortopedia.",
        "las molestias en rodillas o tobillos suelen empeorar si ejerces presión sobre la articulación. Es muy prudente restringir movimientos y usar soporte ortopédico.",
        "un esguince que no cicatriza adecuadamente deja secuelas o inestabilidad crónica. Es crucial que un médico especialista supervise tu recuperación física."
      ];
      coreAdvice = trauma[Math.floor(Math.random() * trauma.length)];
    } else if (query.includes("embarazo") || query.includes("bebe") || query.includes("parto") || query.includes("ginec")) {
      const gyneco = [
        "el control prenatal sistematizado protege el embarazo paso a paso. En Ginecología y Obstetras poseemos la calidez y tecnología de punta para acompañar tu gestación.",
        "cualquier sangrado, dolor pélvico persistente o ver lucecitas en tu visión durante el embarazo es un signo de alerta crítico. Guarda reposo absoluto e infórmanos ya.",
        "mantener una hidratación excelente, suplementos vitamínicos adecuados y controles ecográficos habituales garantizan un desarrollo gestacional feliz y saludable."
      ];
      coreAdvice = gyneco[Math.floor(Math.random() * gyneco.length)];
    } else if (query.includes("fiebre") || query.includes("temperatura") || query.includes("calentura")) {
      const fever = [
        "la fiebre alta persistente es la defensa del organismo alertando de un proceso infeccioso activo. Toma duchas con agua tibia, mantente hidratado y consulta si no desciende.",
        "cuando hay incremento térmico brusco, hidrátate copiosamente con suero y evita mantas pesadas. Un control de temperatura regular cada tres horas es altamente recomendable.",
        "si la fiebre supera los 38.5 grados centígrados de manera constante u ocurre rigidez o confusión mental, se requiere asistencia inmediata en Urgencias."
      ];
      coreAdvice = fever[Math.floor(Math.random() * fever.length)];
    } else if (query.includes("estómago") || query.includes("estomago") || query.includes("acidez") || query.includes("reflujo") || query.includes("digest")) {
      const stomach = [
        "las agruras o acidez crónica irritan el tracto digestivo. Intenta comer menor cantidad de forma pausada y quédate erguido al menos una hora tras ingerir alimentos.",
        "la indigestión o pesadez frecuente suele responder a irritantes gástricos como salsas o alcohol. Un diagnóstico oportuno ayuda a descartar úlceras o gastritis aguda.",
        "dolores abdominales cólicos de varios días ameritan consejo experto. Considera agendar una valoración diagnóstica para modular tu bienestar digestivo."
      ];
      coreAdvice = stomach[Math.floor(Math.random() * stomach.length)];
    } else {
      const general = [
        "atender oportunamente los síntomas nos previene de males de mayor complejidad. Cuéntame un poco más de tus dolencias para orientarte con precisión clínica.",
        "las variaciones de vitalidad o el cansancio corporal tensional se benefician de chequeos anuales. La Medicina General del Hospital Vida Sana es el punto de partida idóneo.",
        "cualquier alteración física persistente en tu día a día amerita ser conversada. Te sugerimos realizarte exámenes generales preventivos para descartar anomalías."
      ];
      coreAdvice = general[Math.floor(Math.random() * general.length)];
    }

    return `${intro} ${coreAdvice} Recuerda de forma sumamente vital que si tienes dolor opresivo fuerte de pecho, falta de aire o asfixia, debes acudir de inmediato a Urgencias. ${outro}`;
  };

  const handleSelectDoubt = async (doubt: Doubt) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSelectedDoubt(doubt);
    setCustomReply(null);
    setIsThinking(true);
    setDoctorGesture("thinking");

    try {
      const response = await fetch("/api/doctor-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: doubt.question })
      });

      if (!response.ok) {
        throw new Error("Respuesta no satisfactoria del servidor médico.");
      }

      const data = await response.json();
      const replyText = data.text || generateLocalFallbackResponse(doubt.question);
      setCustomReply(replyText);
      setIsThinking(false);
      speakText(replyText);
    } catch (err) {
      console.warn("Utilizando generador artificial local para duda seleccionada:", err);
      const fallbackMsg = generateLocalFallbackResponse(doubt.question);
      setCustomReply(fallbackMsg);
      setIsThinking(false);
      speakText(fallbackMsg);
    }
  };

  const handleCustomQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsThinking(true);
    setDoctorGesture("thinking");
    setCustomReply(null);
    setSelectedDoubt(null);

    try {
      const response = await fetch("/api/doctor-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: customQuestion })
      });

      if (!response.ok) {
        throw new Error("Respuesta no satisfactoria.");
      }

      const data = await response.json();
      const replyText = data.text || generateLocalFallbackResponse(customQuestion);
      setCustomReply(replyText);
      setIsThinking(false);
      speakText(replyText);
    } catch (err) {
      console.warn("Utilizando generador artificial local para pregunta en tiempo real:", err);
      const fallbackMsg = generateLocalFallbackResponse(customQuestion);
      setCustomReply(fallbackMsg);
      setIsThinking(false);
      speakText(fallbackMsg);
    }
  };

  const handleWavingGreeting = () => {
    setDoctorGesture("waving");
    const greeting = "¡Hola! Qué gusto saludarte de nuevo. Soy el doctor Mateo. Estoy aquí para resolver tus dudas clínicas directamente con mi voz activa. Elige un tema rápido arriba o escríbeme lo que necesites.";
    speakText(greeting);
  };

  const doctorAnimations = {
    breathing: {
      y: [0, -6, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    },
    explaining: {
      y: [0, -8, 2, -8, 0],
      rotate: [0, -1, 1, -1, 0],
      transition: { duration: 1.8, ease: "easeInOut" }
    },
    waving: {
      rotate: [0, 6, -6, 6, 0],
      transition: { duration: 1.5 }
    },
    thinking: {
      scale: [1, 1.02, 0.98, 1.02, 1],
      rotate: [0, 0.5, -0.5, 0.5, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const handleGoToAppointments = () => {
    document.getElementById("citas")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="doctor-interactivo" className="py-20 relative overflow-hidden bg-gradient-to-b from-teal-500/10 via-white to-blue-500/10">
      {/* Decorative neon spots in the background to fulfill "más encendidos" */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '6s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-black tracking-widest uppercase rounded-full shadow-lg shadow-emerald-500/20 inline-block mb-3.5 animate-bounce">
            Interactive Assistant 🩺
          </span>
          <h2 className="text-3.5xl md:text-4xl font-black text-slate-800 tracking-tight">
            Consulta interactiva con el <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-600 bg-teal-500">Dr. Mateo</span>
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed text-sm">
            Interactúa con nuestro asesor médico virtual 3D caricaturizado. Resuelve dudas clínicas frecuentes al instante con explicaciones guiadas con voz artificial, consejos prácticos para el cuidado de tu familia y derivación directa.
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full mx-auto mt-6"></div>
        </div>

        {/* Dynamic Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-12">
          
          {/* Column 1: Animated Interactive Doctor Fig & Speech Bubble */}
          <div className="lg:col-span-5 bg-gradient-to-tr from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-2xl flex flex-col justify-between border-2 border-emerald-500/30 relative overflow-hidden">
            
            {/* Tech grid mesh in the background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>

            {/* Glowing Vital signs background curves */}
            <div className="absolute top-4 right-4 text-emerald-400 opacity-20">
              <svg className="w-24 h-8" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M0 15 h30 l5 -12 l5 24 l3 -18 l2 6 h55" strokeDasharray="100" strokeDashoffset="0"></path>
              </svg>
            </div>

            {/* Doctor State Badge */}
            <div className="flex items-center justify-between mb-8 relative z-10 gap-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-extrabold tracking-wider text-emerald-400 uppercase font-mono">Dr. Mateo (Asesor Activo)</span>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Voice Speaker Control Toggle Button */}
                <button
                  onClick={toggleVoice}
                  title={isVoiceEnabled ? "Silenciar Doctor" : "Activar Voz del Doctor"}
                  className={`p-1.5 rounded-full transition-all border cursor-pointer ${
                    isVoiceEnabled
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-400/30 hover:bg-emerald-500/30 font-bold"
                      : "bg-slate-700/80 text-rose-400 border-rose-400/20 hover:bg-slate-700 font-bold hover:text-rose-300"
                  }`}
                >
                  {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button 
                  onClick={handleWavingGreeting}
                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-[10px] uppercase rounded-full cursor-pointer transition-colors"
                >
                  👋 Saludar
                </button>
              </div>
            </div>

            {/* Main Interactive Dr Caricature Illustration */}
            <div className="flex flex-col items-center justify-center py-6 relative z-10">
              <motion.div
                variants={{
                  breathing: doctorAnimations.breathing,
                  explaining: doctorAnimations.explaining,
                  waving: doctorAnimations.waving,
                  thinking: doctorAnimations.thinking
                }}
                animate={doctorGesture}
                className="relative flex flex-col items-center justify-center cursor-pointer"
                onClick={() => {
                  setDoctorGesture("explaining");
                  speakText("¡Así es, estoy listo! Soy Mateo. Pregúntame sobre dolores físicos y te indicaré la gravedad o cuál de nuestras abundantes especialidades médicas elegir.");
                }}
              >
                {/* Halo glowing circle behind doctor */}
                <div className={`absolute w-44 h-44 rounded-full blur-xl transition-all ${isSpeaking ? "bg-emerald-400/30 animate-pulse" : "bg-emerald-500/20"}`}></div>
                
                {/* Speaks Audio rings dynamic visual feedback */}
                {isSpeaking && (
                  <>
                    <span className="absolute inline-flex h-44 w-44 rounded-full bg-emerald-400 opacity-20 animate-ping"></span>
                    <span className="absolute inline-flex h-40 w-40 rounded-full bg-cyan-400 opacity-10 animate-ping" style={{ animationDelay: '0.4s' }}></span>
                  </>
                )}

                {/* THE DOCTOR AVATAR BODY (High quality visual representation) */}
                <div className={`relative w-36 h-36 bg-gradient-to-b from-sky-450 to-sky-650 rounded-full border-4 flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 ${isSpeaking ? "border-emerald-400 shadow-emerald-500/40" : "border-slate-300 shadow-slate-900/40"}`}>
                  <span className="text-7.5xl select-none">
                    {doctorGesture === "thinking" ? "🤔" : isSpeaking ? "🗣️" : doctorGesture === "waving" ? "🙋‍♂️" : "👨‍⚕️"}
                  </span>

                  {/* Little stethoscope decoration absolute badge */}
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-900 p-2 rounded-full border-2 border-white shadow-md">
                    <Stethoscope className="w-5 h-5 animate-pulse" />
                  </div>
                </div>

                {/* Status Indicator text bubbles */}
                <div className="mt-4 bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-sky-300 font-mono flex items-center gap-1.5 shadow-sm">
                  <Smile className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                  <span>
                    {isThinking ? "Dr. Mateo está pensando..." : isSpeaking ? "¡Te estoy hablando directamente!  🔊" : "Esterilizado y listo."}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Digital Pulse Wave / Instructions */}
            <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10 relative z-10">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Consejo Clínico del Día</span>
              <p className="text-xs text-teal-100/90 leading-relaxed">
                "La prevención y la detección temprana salvan vidas. No ignores las alertas persistentes de tu propio cuerpo; agendar turnos preventivos regulares es la base de una vida duradera y sana."
              </p>
            </div>

          </div>

          {/* Column 2: Doubt List Selection & Resolution Output Portal */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white p-8 rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden">
            <div className="space-y-6">
              
              {/* Doubt Quick Badges list */}
              <div>
                <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-3 flex items-center gap-1.5 font-mono">
                  <HelpCircle className="w-4 h-4 text-emerald-500" />
                  Selecciona una Duda Clínica Frecuente (El Dr. Mateo te responderá con voz)
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {HEALTH_DOUBTS.map((doubt) => (
                    <button
                      key={doubt.id}
                      onClick={() => handleSelectDoubt(doubt)}
                      className={`px-3.5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 border transition-all cursor-pointer ${
                        selectedDoubt?.id === doubt.id
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-transparent shadow-md shadow-emerald-500/20 scale-102"
                          : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {doubt.icon}
                      <span>{doubt.shortLabel}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Doubts Form Input */}
              <div className="border-t border-b border-rose-100/10 py-5">
                <h4 className="text-xs font-black tracking-widest text-slate-400 uppercase mb-3 flex items-center gap-2 font-mono">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  O escribe tu consulta médica de manera personalizada
                </h4>
                <form onSubmit={handleCustomQuestionSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="Ej: ¿Qué hacer si me duele mucho la cabeza tras trabajar?"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 transition-all font-medium py-3"
                  />
                  <button
                    type="submit"
                    disabled={isThinking || !customQuestion.trim()}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-6 rounded-2xl text-xs flex items-center justify-center shadow-lg shadow-emerald-500/15 cursor-pointer active:scale-95 disabled:opacity-50 transition-all font-mono uppercase tracking-widest"
                  >
                    Consultar
                  </button>
                </form>
              </div>

              {/* Resolution Display Speech Bubble Board */}
              <div className="bg-gradient-to-b from-slate-50 to-slate-100/50 p-6 rounded-2xl border border-slate-100 min-h-[220px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {isThinking ? (
                    <motion.div
                      key="thinking-loader"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-10 text-center"
                    >
                      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-500 text-xs mt-3 font-semibold font-mono animate-pulse">
                        El Dr. Mateo está preparando un consejo médico...
                      </p>
                    </motion.div>
                  ) : selectedDoubt ? (
                    <motion.div
                      key={selectedDoubt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {/* Question label banner */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                          Pregunta Médica:
                        </span>
                        {isSpeaking && (
                          <span className="text-[10px] font-black text-emerald-600 animate-pulse flex items-center gap-1 font-mono">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                            Reproduciendo Voz...
                          </span>
                        )}
                      </div>
                      <h4 className="text-md sm:text-base font-black text-slate-800 leading-tight">
                        {selectedDoubt.question}
                      </h4>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        {selectedDoubt.answer.message}
                      </p>

                      {/* Doctor suggestions/recomms */}
                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 font-mono block">Instrucciones & Recomendaciones Rápidas:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedDoubt.answer.recomms.map((rec, idx) => (
                            <div key={idx} className="bg-white p-2.5 rounded-xl border border-slate-200/50 flex items-start gap-2 text-xs text-slate-600 shadow-sm leading-normal">
                              <span className="text-emerald-500 text-xs mt-0.5 select-none font-bold">✓</span>
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Targeted Department/Specialty */}
                      <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs gap-4">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Info className="w-4 h-4 text-sky-500 flex-shrink-0" />
                          <span>Especialidad relacionada: <strong className="text-slate-800 font-bold">{selectedDoubt.answer.specialty}</strong></span>
                        </div>
                        {selectedDoubt.answer.isEmergency && (
                          <span className="bg-rose-100 text-rose-800 text-[9px] uppercase tracking-wide font-black px-2 py-0.5 rounded-md animate-pulse">🚨 Requiere cuidado crítico</span>
                        )}
                      </div>
                    </motion.div>
                  ) : customReply ? (
                    <motion.div
                      key="custom-reply-data"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md inline-block">
                          Respuesta del Dr. Mateo:
                        </span>
                        {isSpeaking && (
                          <span className="text-[10px] font-black text-emerald-600 animate-pulse flex items-center gap-1 font-mono">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                            Reproduciendo Voz...
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
                        {customReply}
                      </p>
                      
                      <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-[10px] leading-relaxed text-teal-800 font-medium">
                        💡 Este consejo virtual es orientativo. Si tus dolores persisten por más de 48 horas, o si experimentas sarpullidos, desmayos u opresiones en el pecho, asegúrate de acudir de inmediato al hospital Vida Sana o llamar a emergencias locales.
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

            </div>

            {/* Quick Actions at Bottom of Portal */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="text-[9px] text-slate-400 font-medium leading-relaxed max-w-xs">
                *El Dr. Virtual Mateo prosee explicaciones clínicas basadas en protocolos orientativos del Hospital Vida Sana. No sustituye la consulta física presencial.
              </span>
              <button
                onClick={handleGoToAppointments}
                className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white shadow-md shadow-emerald-500/10 font-bold text-xs py-3 px-5 rounded-2xl flex items-center gap-1.5 transition-all text-right cursor-pointer"
              >
                Solicitar Turno Médico
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
