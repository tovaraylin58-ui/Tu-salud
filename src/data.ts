import { Specialty, Symptom } from "./types";

export const specialtiesData: Specialty[] = [
  {
    id: "urgencias",
    title: "Urgencias Médicas",
    icon: "🚑",
    description: "Atención médica crítica, quirúrgica y de estabilización inmediata disponible las 24 horas del día, los 7 días de la semana, para situaciones de alto riesgo y emergencias graves.",
    location: "Planta Baja, Ala Norte (Acceso directo por rampa)",
    doctorList: [
      { name: "Dr. Roberto Méndez", specialty: "Traumatología de Emergencias", schedule: "Turno Nocturno / 24h", avatar: "👨‍⚕️" },
      { name: "Dra. Elisa Sanabria", specialty: "Pediatría de Emergencia", schedule: "Rotativo Diario", avatar: "👩‍⚕️" },
      { name: "Dr. Marcos Vega", specialty: "Cardiólogo de Guardia", schedule: "Turno Tarde / Noche", avatar: "👨‍⚕️" }
    ]
  },
  {
    id: "cardio",
    title: "Cardiología",
    icon: "💙",
    description: "Diagnóstico, tratamiento y prevención de patologías cardiovasculares, con unidades de ecocardiografía, pruebas de esfuerzo y monitoreo Holter avanzado.",
    location: "Primer Piso, Edificio de Especialidades, Consultorio 104",
    doctorList: [
      { name: "Dra. Elena Vizcaíno", specialty: "Cardiología Intervencionista", schedule: "Lunes a Viernes 8:00 AM - 2:00 PM", avatar: "👩‍⚕️" },
      { name: "Dr. Ricardo Corazón", specialty: "Prevención y Rehabilitación Cardíaca", schedule: "Martes y Jueves 2:00 PM - 7:00 PM", avatar: "👨‍⚕️" }
    ]
  },
  {
    id: "pedia",
    title: "Pediatría",
    icon: "🧸",
    description: "Cuidado integral y personalizado para el crecimiento saludable de tus hijos, incluyendo control del recién nacido, inmunología infantil y nutrición pediátrica.",
    location: "Planta Baja, Ala Sur (Área infantil con zona lúdica)",
    doctorList: [
      { name: "Dr. Carlos Niñez", specialty: "Pediatría General y Neonatología", schedule: "Lunes a Jueves 9:00 AM - 4:00 PM", avatar: "👨‍⚕️" },
      { name: "Dra. Sofía Alarcón", specialty: "Inmunología Infantil", schedule: "Miércoles y Viernes 10:00 AM - 6:00 PM", avatar: "👩‍⚕️" }
    ]
  },
  {
    id: "neuro",
    title: "Neurología Avanzada",
    icon: "🧠",
    description: "Expertos en el diagnóstico de cefaleas crónicas, epilepsia, trastornos del sueño, demencias y control de recuperación post-ictus con técnicas avanzadas.",
    location: "Segundo Piso, Pabellón de Neurología y Psiquiatría",
    doctorList: [
      { name: "Dra. Sofía Mentes", specialty: "Neurología Clínica y Cefaleas", schedule: "Lunes a Miércoles 1:00 PM - 6:00 PM", avatar: "👩‍⚕️" },
      { name: "Dr. Xavier Cerebro", specialty: "Neurofisiología y Trastornos de Memoria", schedule: "Jueves y Viernes 8:00 AM - 1:00 PM", avatar: "👨‍⚕️" }
    ]
  },
  {
    id: "derma",
    title: "Dermatología",
    icon: "☀️",
    description: "Cuidado completo de la piel, cabello y uñas. Tratamiento de acné, dermatitis, detección temprana de cáncer de piel y procedimientos estéticos médicos.",
    location: "Primer Piso, Consultorios de Especialidades Médicas 112",
    doctorList: [
      { name: "Dra. Patricia Cutis", specialty: "Dermatología Clínica e Infantil", schedule: "Martes y Jueves 9:00 AM - 3:00 PM", avatar: "👩‍⚕️" }
    ]
  },
  {
    id: "odonto",
    title: "Odontología Integral",
    icon: "🦷",
    description: "Atención buco-dental de excelencia, con especialistas en endodoncia, periodoncia, diseño de sonrisa y limpiezas de prevención.",
    location: "Planta Baja, Ala Este (OdontoVida)",
    doctorList: [
      { name: "Dr. Gabriel Dientes", specialty: "Odontología General y Prótesis", schedule: "Lunes a Viernes 9:00 AM - 5:00 PM", avatar: "👨‍⚕️" }
    ]
  }
];

export const baselineSymptoms: Symptom[] = [
  {
    id: " headache",
    name: "Dolor de Cabeza",
    emoji: "🤯",
    description: "Sensación dolorosa en cualquier parte de la cabeza, variando desde un dolor sordo y constante hasta dolores punzantes o migrañas intensas.",
    causes: [
      "Estrés y tensión muscular acumulada en cuello y hombros",
      "Deshidratación prolongada",
      "Falta de sueño o cansancio extremo",
      "Fatiga visual (urgente revisión oftalmológica)",
      "Presión arterial alta (hipertensión)"
    ],
    recommendations: [
      "Descansa en una habitación oscura y silenciosa.",
      "Bebe un vaso grande de agua mineral templada.",
      "Aplica compresas frías en la frente o nuca.",
      "Evita el consumo de cafeína, alcohol y pantallas brillantes."
    ],
    severity: "low",
    department: "Neurología / Medicina General"
  },
  {
    id: "fever",
    name: "Fiebre Alta",
    emoji: "🌡️",
    description: "Aumento de la temperatura corporal por encima del rango normal (generalmente superior a 38°C), actuando como mecanismo de defensa inmune.",
    causes: [
      "Infecciones virales (gripe, resfriado, virus respiratorios)",
      "Infecciones bacterianas (faringitis, infecciones urinarias)",
      "Procesos inflamatorios corporales de origen sistémico"
    ],
    recommendations: [
      "Toma baños de agua tibia para refrescar la piel.",
      "Mantén una abundante hidratación constante (agua, caldos, suero oral).",
      "Duerme con ropa ligera y utiliza sábanas finas.",
      "Monitorea tu temperatura cada 4 horas con un termómetro óptimo."
    ],
    severity: "medium",
    department: "Pediatría (para niños) / Medicina General (adultos)"
  },
  {
    id: "stomach",
    name: "Dolor Estomacal / Abdominal",
    emoji: "🤢",
    description: "Molestias, retortijones o dolores agudos en la cavidad abdominal, variando desde espasmos leves hasta dolor punzante y localizado.",
    causes: [
      "Indigestión o acumulación de gases",
      "Gastroenteritis (infección estomacal vírica o bacteriana)",
      "Gastritis alimentaria o acidez de estómago severa",
      "Apéndice inflamado (Sintomatología de urgencia si se localiza abajo a la derecha)"
    ],
    recommendations: [
      "Evita comer alimentos sólidos por unas horas; prioriza dieta blanda.",
      "Toma infusión tibia de manzanilla o té de jengibre sin endulzar.",
      "No realices esfuerzos físicos pesados.",
      "Evita automedicarte con analgésicos fuertes, ya que pueden enmascarar dolores graves."
    ],
    severity: "medium",
    department: "Gastroenterología / Urgencias (si el dolor es grave y localizado)"
  },
  {
    id: "breathing",
    name: "Dificultad Respiratoria",
    emoji: "🫁",
    description: "Sensación incómoda o falta de aire al respirar (disnea), tos seca intensa, u opresión molesta en el tórax.",
    causes: [
      "Crisis asmática o hiperreactividad bronquial",
      "Infecciones respiratorias agudas (neumonía, bronquitis, covid)",
      "Reacciones alérgicas severas (anafilaxia)",
      "Problemas cardiovasculares latentes"
    ],
    recommendations: [
      "Siéntate en posición erguida en un sitio ventilado y respira con calma.",
      "Afloja cualquier prenda que apriete el cuello o pecho.",
      "Usa inhaladores recetados de emergencia si es paciente asmático conocido.",
      "Si la agitación no cesa, busca ayuda de inmediato."
    ],
    severity: "high",
    department: "Urgencias Médicas / Neumología"
  },
  {
    id: "rash",
    name: "Alergias o Erupciones de la Piel",
    emoji: "☀️",
    description: "Aparición súbita de ronchas, sarpullidos con picor intenso, enrojecimiento o descamación en áreas del cuerpo.",
    causes: [
      "Contacto con plantas o sustancias irritantes (dermatitis)",
      "Reacción a medicamentos o alimentos selectos",
      "Picaduras de insectos comunes",
      "Infecciones de la piel por hongos o bacterias"
    ],
    recommendations: [
      "No te rasques; puedes rasgar la piel y provocar una infección.",
      "Aplica compresas de agua fría o gel de aloe vera natural.",
      "Utiliza jabones de pH neutro y telas suaves de algodón.",
      "Registra qué alimentos o cosméticos nuevos has utilizado recientemente."
    ],
    severity: "low",
    department: "Dermatología"
  }
];
