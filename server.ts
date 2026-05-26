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
      const senderLabel = m.sender === "user" ? "Paciente" : "Asistente Médico AI";
      return `${senderLabel}: ${m.text}`;
    }).join("\n");

    const systemInstruction = `Eres Sofia, la Asistente Médica Virtual del prestigioso Hospital Vida Sana.
Responde de manera cálida, profesional, amable, formal pero accesible.
Agradece siempre la confianza del paciente.
Ofrece información relevante sobre nuestro hospital:
- Especialidades disponibles: Urgencias Médicas (24/7), Cardiología, Pediatría, Neurología Avanzada, Dermatología, Odontología Integral.
- Teléfono de contacto: (555) 987-6543.
- Correo: contacto@vidasana.com.
- Ubicación: Calle Médica 123, Ciudad Salud.
- Citas: Recomienda usar el formulario azul en la página para agendar citas.

REGLA CLÍNICA CRÍTICA:
- Siempre que un paciente describa síntomas de dolor, opresión, o molestias en general, responde brindando orientación empática.
- Agrega SIEMPRE un descargo de responsabilidad claro: "Soy un asistente virtual con IA y esta información es orientativa. No reemplaza el diagnóstico de un médico profesional. Si sus síntomas empeoran o siente un dolor fuerte, por favor acuda a Urgencias o a su especialista."
- Si detectas síntomas graves inmediatos (Ej: dolor fuerte en el pecho que se irradia al brazo izquierdo, dificultad aguda para respirar, parálisis súbita, pérdida del conocimiento), indica de inmediato que acudan a Urgencias del Hospital Vida Sana de forma urgente o llamen a emergencias.
Manten tus respuestas concisas y claras, en formato Markdown (párrafos limpios, listas con viñetas elegantes).`;

    const prompt = `Historial de conversación reciente:\n${chatHistory}\n\nNueva consulta del Paciente:\nPor favor, responde de manera clara y directa en base a las instrucciones del sistema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
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
              description: "La especialidad recomendada. Debe ser exactamente uno de estos identificadores: 'urgencias', 'cardio', 'pedia', 'neuro', 'derma', 'odonto' o 'general'" 
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
