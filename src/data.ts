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
  },
  {
    id: "gineco",
    title: "Ginecología y Obstetricia",
    icon: "🤰",
    description: "Cuidado integral de la salud femenina en todas las etapas de la vida, obstetricia de precisión, control prenatal detallado, partos humanizados y prevención ginecológica.",
    location: "Segundo Piso, Pabellón Materno-Infantil, Consultorio 204",
    doctorList: [
      { name: "Dra. Carolina Materna", specialty: "Ginecología Obstétrica", schedule: "Lunes a Jueves 8:00 AM - 1:00 PM", avatar: "👩‍⚕️" },
      { name: "Dr. José Útero", specialty: "Medicina Materno-Fetal", schedule: "Martes y Viernes 2:00 PM - 6:00 PM", avatar: "👨‍⚕️" }
    ]
  },
  {
    id: "oftalmo",
    title: "Oftalmología",
    icon: "👁️",
    description: "Diagnóstico precoz y cirugía ocular de vanguardia. Tratamiento especializado para astigmatismo, miopía, glaucoma, estrabismo pediátrico y prevención ocular.",
    location: "Primer Piso, Ala Oeste, Unidad de Oftalmología",
    doctorList: [
      { name: "Dr. Sebastián Vista", specialty: "Cirugía Refractiva y Córnea", schedule: "Lunes a Viernes 9:00 AM - 3:00 PM", avatar: "👨‍⚕️" },
      { name: "Dra. Lucía Retina", specialty: "Oftalmología Pediátrica", schedule: "Miércoles y Sábado 9:00 AM - 1:00 PM", avatar: "👩‍⚕️" }
    ]
  },
  {
    id: "traumato",
    title: "Traumatología y Ortopedia",
    icon: "🦴",
    description: "Rehabilitación y cirugía ortopédica para afecciones articulares, columna vertebral y fracturas sufridas en deportes o accidentes, empleando técnicas mínimamente invasivas.",
    location: "Planta Baja, Pabellón Ortopédico, Consultorio 012",
    doctorList: [
      { name: "Dr. Fernando Hueso", specialty: "Artroscopia de Hombro y Rodilla", schedule: "Lunes, Miércoles y Viernes 10:00 AM - 5:00 PM", avatar: "👨‍⚕️" },
      { name: "Dra. Jimena Columna", specialty: "Traumatología y Patología Espinal", schedule: "Martes y Jueves 2:00 PM - 7:00 PM", avatar: "👩‍⚕️" }
    ]
  },
  {
    id: "nutricion",
    title: "Nutrición y Dietética",
    icon: "🥗",
    description: "Consultas personalizadas para reeducación alimentaria, nutrición deportiva, control calórico integral, diabetes gestacional y formulación de planes basados en evidencia científica.",
    location: "Tercer Piso, Centro de Nutrición y Vida Saludable",
    doctorList: [
      { name: "Dra. Camila Sana", specialty: "Nutrición Clínica y Salud Metabólica", schedule: "Lunes a Viernes 8:00 AM - 4:00 PM", avatar: "👩‍⚕️" }
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
  },
  {
    id: "eye-strain",
    name: "Fatiga o Dolor Ocular",
    emoji: "👁️",
    description: "Visión borrosa repentina, ardor o sequedad ocular con dolor sordo, a menudo acompañado de sensibilidad de luz tras esfuerzo visual prolongado.",
    causes: [
      "Sobreexposición a pantallas digitales de luz azul sin descanso",
      "Iluminación inadecuada del espacio de trabajo",
      "Fórmula de graduación desactualizada en anteojos",
      "Ojo seco crónico o inflamación de párpados"
    ],
    recommendations: [
      "Practica la regla 20-20-20: mira a un objeto a 6 metros de distancia por 20 segundos cada 20 minutos.",
      "Usa lágrimas artificiales lubricantes si sientes sequedad.",
      "Modera la luz ambiental y ajusta el brillo de tus pantallas.",
      "Evita frotar tus ojos con fuerza."
    ],
    severity: "low",
    department: "Oftalmología"
  },
  {
    id: "sprain",
    name: "Dolor en Articulaciones o Huesos",
    emoji: "骨",
    description: "Inflamación, imposibilidad de apoyar peso o movilidad disminuida por un golpe severo, torcedura o sobreesfuerzo articular.",
    causes: [
      "Traumatología o torceduras en ligamentos (esguince)",
      "Sobrecarga o fatiga muscular severa",
      "Procesos degenerativos (artrosis o artritis en etapas activas)",
      "Fisura u otras lesiones óseas"
    ],
    recommendations: [
      "Aplica la regla RICE: Reposo absoluto, Hielo indirecto, Compresión con vendaje elástico sutil y Elevación de la extremidad.",
      "Evita pisar o forzar la articulación afectada.",
      "Registra si hay hematoma visible o deformidad."
    ],
    severity: "medium",
    department: "Traumatología y Ortopedia"
  }
];
