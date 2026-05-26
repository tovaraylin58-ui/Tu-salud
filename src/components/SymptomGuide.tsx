import React, { useState } from "react";
import { baselineSymptoms } from "../data";
import { Symptom } from "../types";
import { Search, Sparkles, AlertTriangle, ArrowRight, HeartPulse, ShieldAlert, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SymptomAnalysisResult {
  symptomName: string;
  analysis: string;
  possibleCauses: string[];
  recomms: string[];
  redFlags: string[];
  severity: "low" | "medium" | "high";
  suggestedSpecialtyId: string;
}

export default function SymptomGuide() {
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [customQuery, setCustomQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<SymptomAnalysisResult | null>(null);

  // Quick baseline selection
  const handleSelectBaseline = (symptom: Symptom) => {
    setAiResult(null);
    setSelectedSymptom(symptom);
    setErrorMsg(null);
    // Smooth scroll down to details
    setTimeout(() => {
      document.getElementById("symptom-detail-view")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  };

  // Perform AI-powered symptom analysis
  const handleSymptomAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSelectedSymptom(null);
    setAiResult(null);

    try {
      const response = await fetch("/api/symptom-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputSymptom: customQuery })
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener el análisis médico inteligente.");
      }

      const data = await response.json();
      setAiResult(data);
      // Smooth scroll to view
      setTimeout(() => {
        document.getElementById("symptom-detail-view")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Ocurrió un error al consultar el servicio AI. Por favor, inténtelo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const severityColors = {
    low: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800" },
    medium: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-800" },
    high: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", badge: "bg-rose-100 text-rose-800" }
  };

  const getSpecialtyLabel = (id: string) => {
    switch (id) {
      case "urgencias": return "🚑 Urgencias Médicas (24h)";
      case "cardio": return "💙 Cardiología";
      case "pedia": return "🧸 Pediatría";
      case "neuro": return "🧠 Neurología Avanzada";
      case "derma": return "☀️ Dermatología";
      case "odonto": return "🦷 Odontología Integral";
      default: return "🩺 Medicina General";
    }
  };

  const handleGoToSpecialty = () => {
    const element = document.getElementById("servicios");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGoToAppointments = () => {
    const element = document.getElementById("citas");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="sintomas" className="py-20 bg-slate-50 border-t border-b border-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wider uppercase rounded-full border border-emerald-100 inline-block mb-3">
            Guía de Salud
          </span>
          <h2 className="text-3.5xl font-extrabold text-slate-800 tracking-tight">
            ¿Cómo te sientes hoy?
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed text-md">
            Consulta nuestra guía de síntomas más frecuentes o escribe detalladamente lo que sientes para recibir orientación médica personalizada impulsada por Inteligencia Artificial.
          </p>
          <div className="w-16 h-1 bg-emerald-500 rounded-full mx-auto mt-6"></div>
        </div>

        {/* Dynamic Symptom Checker Interface Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quick Choice & Custom Search Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-600" />
                Consulta Rápida de Síntomas
              </h3>
              <div className="flex flex-col gap-2.5">
                {baselineSymptoms.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectBaseline(s)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-sm flex items-center justify-between cursor-pointer ${
                      selectedSymptom?.id === s.id
                        ? "bg-sky-50/50 border-sky-400 text-sky-900 font-medium"
                        : "bg-slate-50/50 border-slate-100 hover:bg-slate-100/70 text-slate-700 font-medium"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{s.emoji}</span>
                      <span>{s.name}</span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* AI Assistant Analyzer Form */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl shadow-lg text-white">
              <h3 className="text-lg font-bold tracking-tight flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                Análisis por Síntomas con IA
              </h3>
              <p className="text-xs text-teal-100 leading-relaxed mb-4">
                Describe detalladamente cómo te sientes (ej. "tengo dolor sordo en la espalda baja desde ayer" o "dolor de garganta con placas blancas").
              </p>
              <form onSubmit={handleSymptomAnalysis} className="space-y-3">
                <textarea
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="Ej: Tengo dolor constante en la muela derecha y me palpita..."
                  className="w-full h-24 p-3 bg-white/10 placeholder-teal-100/70 text-white rounded-xl text-sm border border-emerald-400/30 focus:outline-none focus:ring-2 focus:ring-emerald-300 outline-none resize-none transition-all"
                  required
                ></textarea>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-400 text-slate-900 font-bold py-3 px-4 rounded-xl text-sm hover:bg-amber-300 active:scale-98 transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analizando síntomas...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Obtener Diagnóstico Orientativo
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results Screen & View Detail Block */}
          <div className="lg:col-span-7" id="symptom-detail-view">
            <AnimatePresence mode="wait">
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center min-h-[350px]"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center animate-ping absolute top-0 left-0"></div>
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center relative">
                      <HeartPulse className="w-8 h-8 text-emerald-600 animate-pulse" />
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-slate-800">Cargando Análisis Médico...</h4>
                  <p className="text-slate-500 text-sm mt-2 max-w-sm">
                    Nuestra Inteligencia Artificial está evaluando tus síntomas clínicos orientativos. Por favor espera unos segundos.
                  </p>
                </motion.div>
              )}

              {errorMsg && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center text-rose-700 min-h-[350px] flex flex-col items-center justify-center"
                >
                  <AlertTriangle className="w-12 h-12 text-rose-500 mb-3" />
                  <p className="font-semibold">{errorMsg}</p>
                </motion.div>
              )}

              {/* No Selection Initial Slate */}
              {!selectedSymptom && !aiResult && !isLoading && !errorMsg && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-10 rounded-3xl border border-dashed border-slate-200 shadow-inner text-center text-slate-400 min-h-[350px] flex flex-col items-center justify-center"
                >
                  <HeartPulse className="w-16 h-16 text-slate-300 mb-4 animate-pulse" />
                  <h4 className="text-md font-bold text-slate-600">Ningún síntoma seleccionado</h4>
                  <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                    Usa los selectores rápidos de la izquierda o escribe una descripción personalizada en el panel de IA para recibir una ficha técnica médica informativa.
                  </p>
                </motion.div>
              )}

              {/* AI Symptom Checker Result View */}
              {aiResult && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
                >
                  {/* Card Header with Severity */}
                  <div className={`p-6 border-b border-slate-100 flex items-center justify-between ${
                    aiResult.severity === "high" ? "bg-rose-50/40" : aiResult.severity === "medium" ? "bg-amber-50/40" : "bg-emerald-50/30"
                  }`}>
                    <div>
                      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Análisis Clínico Inteligente</span>
                      <h3 className="text-xl font-black text-slate-800 mt-1 flex items-center gap-2">
                        🩺 {aiResult.symptomName}
                      </h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold leading-none ${
                      severityColors[aiResult.severity].badge
                    }`}>
                      Gravedad: {aiResult.severity === "high" ? "Elevada" : aiResult.severity === "medium" ? "Moderada" : "Leve"}
                    </span>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* General analysis text */}
                    <div>
                      <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Evaluación Preliminar</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{aiResult.analysis}</p>
                    </div>

                    {/* Causes and recommendations two-column */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <div>
                        <h4 className="text-xs text-emerald-700 font-extrabold uppercase tracking-wider mb-3">Posibles Causas</h4>
                        <ul className="space-y-2">
                          {aiResult.possibleCauses.map((cause, i) => (
                            <li key={i} className="text-slate-600 text-xs flex items-start gap-2">
                              <span className="text-emerald-500 font-bold">•</span>
                              <span>{cause}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs text-emerald-700 font-extrabold uppercase tracking-wider mb-3">¿Qué puedes hacer?</h4>
                        <ul className="space-y-2">
                          {aiResult.recomms.map((rec, i) => (
                            <li key={i} className="text-slate-600 text-xs flex items-start gap-2">
                              <span className="text-teal-500 font-bold">✓</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Red Flags warnings */}
                    {aiResult.redFlags && aiResult.redFlags.length > 0 && (
                      <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl">
                        <h4 className="text-xs text-rose-700 font-black uppercase tracking-wider flex items-center gap-1.5 mb-2">
                          <ShieldAlert className="w-4 h-4 text-rose-600" />
                          Signos de Alarma Críticos
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {aiResult.redFlags.map((flag, i) => (
                            <li key={i} className="text-rose-800 text-xs flex items-start gap-1.5">
                              <span className="text-rose-500 font-extrabold">•</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Department Referral & CTA */}
                    <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-5 gap-4">
                      <div>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Especialidad Recomendada</span>
                        <div className="text-slate-800 font-extrabold text-sm mt-0.5">
                          {getSpecialtyLabel(aiResult.suggestedSpecialtyId)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleGoToSpecialty}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          Ver Especialidad
                        </button>
                        <button
                          onClick={handleGoToAppointments}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/10 active:scale-95 transition-all cursor-pointer"
                        >
                          Agendar Cita ahora
                        </button>
                      </div>
                    </div>

                    {/* Health advice advisory notice disclaimer */}
                    <div className="p-3 bg-blue-50/50 rounded-xl text-slate-500 text-[10px] leading-relaxed text-center">
                      ⚠️ <strong>Descargo de responsabilidad de salud:</strong> Este análisis de Inteligencia Artificial solo tiene fines informativos y orientativos de bienestar. No debe utilizarse como sustituto de un diagnóstico médico profesional, tratamiento oportuno o consejo de un especialista certificado. Busque atención de emergencias médicas de inmediato si surge sospecha de una situación grave.
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Baseline Static Care Guide Result View */}
              {selectedSymptom && !aiResult && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
                >
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div>
                      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Guía de Autodespacho Informativa</span>
                      <h3 className="text-xl font-black text-slate-800 mt-1 flex items-center gap-2">
                        {selectedSymptom.emoji} {selectedSymptom.name}
                      </h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold leading-none ${
                      severityColors[selectedSymptom.severity].badge
                    }`}>
                      Gravedad: {selectedSymptom.severity === "high" ? "Elevada" : selectedSymptom.severity === "medium" ? "Moderada" : "Leve"}
                    </span>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 font-mono">Definición General</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{selectedSymptom.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <div>
                        <h4 className="text-xs text-emerald-700 font-extrabold uppercase tracking-wider mb-3">Principales Desencadenantes</h4>
                        <ul className="space-y-2">
                          {selectedSymptom.causes.map((cause, i) => (
                            <li key={i} className="text-slate-600 text-xs flex items-start gap-2">
                              <span className="text-emerald-500 font-bold">•</span>
                              <span>{cause}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs text-emerald-700 font-extrabold uppercase tracking-wider mb-3">Cuidados de Alivio</h4>
                        <ul className="space-y-2">
                          {selectedSymptom.recommendations.map((rec, i) => (
                            <li key={i} className="text-slate-600 text-xs flex items-start gap-2">
                              <span className="text-teal-500 font-bold">✓</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-5 gap-4">
                      <div>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Derivación Sugerida</span>
                        <div className="text-slate-800 font-extrabold text-sm mt-0.5">
                          💼 {selectedSymptom.department}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleGoToSpecialty}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          Ver Especialidades
                        </button>
                        <button
                          onClick={handleGoToAppointments}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/10 active:scale-95 transition-all cursor-pointer"
                        >
                          Agendar Cita ahora
                        </button>
                      </div>
                    </div>

                    {/* Health advice advisory notice disclaimer */}
                    <div className="p-3 bg-blue-50/50 rounded-xl text-slate-500 text-[10px] leading-relaxed text-center">
                      ⚠️ <strong>Descargo de responsabilidad de salud:</strong> Este análisis de consulta sobre el síntoma es puramente informacional. No reemplaza el valor de una consulta médica ni de una urgencia de salud correspondiente. Busque consejo médico inmediato si lo amerita.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
