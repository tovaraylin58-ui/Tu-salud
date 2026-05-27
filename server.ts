import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const app = express();
app.use(express.json());

const PORT = 3000;

// API Endpoint for General Chatbot
app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Mensajes inválidos o ausentes." });
  }

  try {
    // Collect last few messages to give context or construct a prompt
    const chatHistory = messages.map((m: any) => {
      const senderLabel = m.sender === "user" ? "Paciente o Usuario" : "Sofia (Asistente Médica)";
      return `${senderLabel}: ${m.text}`;
    }).join("\n");

    const systemInstruction = `Eres Sofia, la Asistente Médica Virtual del prestigioso Hospital Vida Sana.
Tu objetivo principal es interactuar de manera fluida, natural, empática y conversacional con los pacientes.

⚠️ DIRECTIVAS DE INTERACCIÓN CRÍTICAS (PARA NO REPETIR TEXTO):
1. NUNCA respondas con el mismo texto introductorio, ni repitas los datos de contacto (teléfono, correo, dirección) ni la lista entera de especialidades en cada mensaje de manera robótica. Solo proporciona estos datos cuando el paciente los pregunte directamente o sea altamente oportuno en el contexto.
2. Evita sonar como un sistema automatizado rígido. Respuestas más cortas, naturales y personalizadas de acuerdo a lo que el usuario acaba de escribir son idóneas.
3. INTERACTÚA ACTIVAMENTE: Haz preguntas de seguimiento personalizadas que inviten a continuar la interacción y conocer más sobre la necesidad del paciente. Ejemplos de cierre interactivo: "¿Hace cuánto tiempo que vienes sintiendo esta molestia?", "¿Te gustaría que te ayude a saber con qué especialista deberías agendar?", "¿Deseas saber el pabellón de esa consulta?".
4. ESPECIALIDADES (Solo si te preguntan): Urgencias Médicas (24/7), Cardiología, Pediatría, Neurología Avanzada, Dermatología, Odontología Integral, Ginecología y Obstetricia, Oftalmología, Traumatología y Ortopedia, Nutrición y Dietética.
5. Datos de contacto:
   - Teléfono: (555) 987-6543
   - Correo electrónico: contacto@vidasana.com
   - Dirección: Calle Médica 123, Ciudad Salud
   - Agenda de Citas: Invítalos a rellenar el formulario interactivo rápido situado al final de esta página web.

REGLA CLÍNICA CRÍTICA DE SEGURIDAD:
- Siempre que un paciente describa síntomas o molestias físicas, bríndale una calidez humana genuina.
- Agrega un descargo de responsabilidad sutil pero claro, adaptado a sus síntomas particulares (sustituye las palabras rígidas por un consejo empático): "Recuerda que soy una asistente virtual y esta guía es meramente informativa. Es fundamental que consultes a un médico profesional para tener un diagnóstico médico certero."
- Si detectas síntomas de posible emergencia médica grave (como dolor punzante en el pecho con mareo, falta de oxígeno súbita, pérdida de fuerza en medio cuerpo), indícales con urgencia y prioridad absoluta que deben acudir de inmediato al Servicio de Urgencias 24/7 del Hospital Vida Sana o llamar a la línea de ayuda de emergencias de su país.`;

    const prompt = `Historial de conversación reciente:\n${chatHistory}\n\nNueva consulta del Paciente e Instrucción final:\nPor favor, responde a la última intervención de manera natural, interactiva e inteligente, prestando atención a no repetir información que ya se haya mencionado antes en el historial, y cerrando con una pregunta de seguimiento que enganche al usuario en la interacción.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.75,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ 
      error: "Error interno del servidor al procesar la consulta médica.",
      detail: error.message 
    });
  }
});

// API Endpoint for Doctor Assistant (Dr. Mateo) Interactive Audio Advice
app.post("/api/doctor-assistant", async (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== "string" || question.trim() === "") {
    return res.status(400).json({ error: "La pregunta es requerida." });
  }

  try {
    const systemInstruction = `Eres el Dr. Mateo, el caricaturizado, empático, profesional y experto doctor virtual de Hospital Vida Sana.
Tu objetivo es dar una respuesta médica orientativa, cálida, personalizada y con un lenguaje sumamente humano y fluido a la inquietud del paciente.

⚠️ DIRECTIVAS DE EVITACIÓN DE REPETICIÓN (SÚPER IMPORTANTE):
1. NUNCA respondas empezando con las mismas frases exactas (como "Como tu doctor virtual" o "¡Excelente consulta!"). Debes cambiar el tono u orden de las oraciones constantemente para dar una experiencia natural.
2. Sé conciso y claro (máximo 4 oraciones de extensión total). Esto es sumamente crítico porque tu respuesta se convertirá en voz artificial hablada y las descripciones demasiado largas aburren o cansan al paciente.
3. Evita las listas o viñetas. Estructura tu respuesta en un solo párrafo corrido de lectura fluida.
4. Indica de forma breve qué especialidad del Hospital Vida Sana trata estos temas habitualmente.
5. Finaliza con una pregunta corta de aliento humano que invite a reflexionar sobre su bienestar (ej.: "¿Has descansado adecuadamente de noche?", "¿Has bebido suficiente líquido?", "¿Te gustaría agendar una cita de prevención?").
6. No olvides mencionar sutilmente que si hay dolor opresivo de pecho o asfixia, debe ir a Urgencias de inmediato.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Consulta del paciente: "${question}"`,
      config: {
        systemInstruction,
        temperature: 0.88, // Moderate-high temperature to maximize phrasing variety and avoid word loops
      },
    });

    res.json({ text: response.text || "" });
  } catch (error: any) {
    console.error("Error calling Gemini API for Dr. Mateo:", error);
    res.status(500).json({ 
      error: "Error interno al procesar la consulta del Dr. Mateo.",
      detail: error.message 
    });
  }
});

// API Endpoint for Symptom Analysis
app.post("/api/symptom-analysis", async (req, res) => {
  const { inputSymptom } = req.body;
  if (!inputSymptom || typeof inputSymptom !== "string" || inputSymptom.trim() === "") {
    return res.status(400).json({ error: "Por favor, ingresa los síntomas descritos." });
  }

  try {
    const systemInstruction = `Eres un motor experto de triaje médico y análisis de síntomas del Hospital Vida Sana.
Analiza la descripción dada por el paciente sobre lo que siente o sus síntomas (en idioma español).
Clasifica de manera rigurosa la gravedad aproximada en: "low" (baja), "medium" (media) o "high" (alta).
Identifica las causas probables benignas comunes o afecciones comunes, las recomendaciones de alivio de primer orden seguros, y banderas rojas de emergencia absoluta ("red flags").
Recomienda la especialidad idónea basándote EXCLUSIVAMENTE en las de nuestro hospital:
- "urgencias" (Urgencias Médicas 24/7, para casos graves/agudos/dolor de pecho/disnea)
- "cardio" (Cardiología, para palpitaciones, presión, dolor torácico menos severo)
- "pedia" (Pediatría, si se menciona a niños, bebés)
- "neuro" (Neurología Avanzada, para dolores de cabeza intensos, adormecimientos de extremidades, mareos severos)
- "derma" (Dermatología, para sarpullidos, picazón, pecas, irritación cutánea)
- "odonto" (Odontología, para dolores de muela, encías)
- "gineco" (Ginecología y Obstetricia, para embarazo, control prenatal, dudas o síntomas femeninos)
- "oftalmo" (Oftalmología, para dolores oculares, visión borrosa, disminución visual)
- "traumato" (Traumatología y Ortopedia, para esguinces, fracturas, dolores óseos o articulares)
- "nutricion" (Nutrición y Dietética, para planes de alimentación, control metabólico, obesidad o desnutrición)
- O "general" (Medicina General, para síntomas indeterminados como cansancio o malestar intermitente).

Debes responder estrictamente en un formato JSON estructurado que coincida con la firma solicitada.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Analiza este síntoma descrito por el paciente: "${inputSymptom}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            symptomName: { 
              type: Type.STRING, 
              description: "Nombre simplificado y elegante del síntoma analizado en español (Ej: Dolor de Cabeza Tensional)" 
            },
            analysis: { 
              type: Type.STRING, 
              description: "Una explicación descriptiva y empática sobre qué podría estar experimentando el paciente (en español)." 
            },
            possibleCauses: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 a 5 posibles desencadenantes o causas habituales de este síntoma." 
            },
            recomms: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 a 4 recomendaciones prácticas, seguras y de autocuidado en casa." 
            },
            redFlags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 a 4 signos de alarma graves ante los cuales debe ir de inmediato a urgencias." 
            },
            severity: { 
              type: Type.STRING, 
              description: "Debe ser exactamente una de estas tres palabras sencillas en minúsculas: 'low', 'medium' o 'high'" 
            },
            suggestedSpecialtyId: { 
              type: Type.STRING, 
              description: "La especialidad recomendada. Debe ser exactamente uno de estos identificadores: 'urgencias', 'cardio', 'pedia', 'neuro', 'derma', 'odonto', 'gineco', 'oftalmo', 'traumato', 'nutricion' o 'general'" 
            }
          },
          required: ["symptomName", "analysis", "possibleCauses", "recomms", "redFlags", "severity", "suggestedSpecialtyId"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error analyzing symptoms:", error);
    res.status(500).json({ 
      error: "Error interno en el módulo de análisis inteligente de síntomas.",
      detail: error.message 
    });
  }
});

// Configure Vite or Serve Built Static Frontend Files
import { createServer as createViteServer } from "vite";

async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode with compiled static assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully active and listening on port ${PORT}`);
  });
}

setupServer();
