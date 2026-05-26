import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "../types";
import { MessageSquare, Send, X, Bot, ShieldCheck, HeartPulse, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: "greet",
        sender: "bot",
        text: "¡Hola! Soy Sofía, tu asistente médica virtual del Hospital Vida Sana. 😊\n\n¿En qué puedo ayudarte hoy? Puedes hacerme consultas sobre horarios, nuestras especialidades, o describir brevemente cómo te sientes para guiarte de forma segura.",
        timestamp: new Date()
      }
    ];
  });
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // send all history for conversational memory
        body: JSON.stringify({ messages: [...messages, userMsg].slice(-8) })
      });

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: "bot",
        text: data.text || "Disculpas, no pude procesar la respuesta en este momento.",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: "err-msg",
        sender: "bot",
        text: "⚠️ Disculpas, estoy experimentando dificultades de conexión con el servidor clínico. Por favor, intenta de nuevo en unos momentos.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Chat Bubble Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-emerald-500/15 cursor-pointer border border-emerald-500/20 active:scale-95 transition-all"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 fill-current" />}
      </motion.button>

      {/* Expandable Dialog Frame */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="absolute bottom-16 right-0 w-85 h-120 bg-white border border-slate-100 rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Header Content */}
            <div className="p-4 bg-emerald-600 text-white flex items-center justify-between border-b border-emerald-700/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/14 rounded-full flex items-center justify-center border border-white/20">
                  <Bot className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold tracking-tight">Sofía</h4>
                  <span className="text-[10px] text-emerald-100 font-bold flex items-center gap-1 leading-none uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full inline-block animate-pulse"></span>
                    Asistente Clínico AI
                  </span>
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>

            {/* Scroll Area Messages Board */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4"
              style={{ contentVisibility: 'auto' }}
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] text-xs rounded-2xl p-3.5 space-y-1 ${
                      m.sender === "user"
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-white text-slate-700 rounded-bl-none border border-slate-100 shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                    <span className={`text-[9px] block text-right font-medium opacity-60 mt-1`}>
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Bot thinking placeholder loading */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-600 border border-slate-100 rounded-2xl p-3.5 rounded-bl-none flex items-center gap-2 shadow-sm">
                    <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                    <span className="text-xs font-semibold">Sofía está respondiendo...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Helper Questions Drawer Pane */}
            <div className="p-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto select-none shrink-0" style={{ scrollbarWidth: 'none' }}>
              <button
                onClick={() => handleQuickQuestion("¿Cuáles son los horarios de atención?")}
                className="text-[10px] shrink-0 font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 active:scale-95 transition-all text-left px-3 py-1.5 border border-slate-100 rounded-full cursor-pointer"
              >
                🕒 Horarios
              </button>
              <button
                onClick={() => handleQuickQuestion("¿Cómo puedo agendar una consulta médica?")}
                className="text-[10px] shrink-0 font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 active:scale-95 transition-all text-left px-3 py-1.5 border border-slate-100 rounded-full cursor-pointer"
              >
                📆 ¿Cómo agendo?
              </button>
              <button
                onClick={() => handleQuickQuestion("Tengo dolor punzante en el pecho y me falta el aire")}
                className="text-[10px] shrink-0 font-bold text-slate-500 bg-rose-50 border border-rose-100 hover:bg-rose-100 active:scale-95 transition-all text-left px-3 py-1.5 rounded-full cursor-pointer"
              >
                🚨 Síntoma Grave
              </button>
            </div>

            {/* Input Form Action Strip */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="p-3 border-t border-slate-100 bg-white flex gap-2 items-center shrink-0"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Haz una pregunta clínica..."
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-100 text-xs rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 text-slate-800"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4 fill-current" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
