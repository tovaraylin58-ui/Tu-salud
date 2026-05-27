import React from "react";
import Navbar from "./components/Navbar";
import SymptomGuide from "./components/SymptomGuide";
import FirstAid from "./components/FirstAid";
import DoctorAssistant from "./components/DoctorAssistant";
import Specialties from "./components/Specialties";
import RelaxGame from "./components/RelaxGame";
import AppointmentForm from "./components/AppointmentForm";
import AIChatbot from "./components/AIChatbot";
import { ArrowRight, ShieldCheck, HeartPulse, Sparkles, Activity, Clock } from "lucide-react";
import { motion } from "motion/react";

export default function App() {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700 selection:bg-emerald-100 selection:text-emerald-900 scroll-behavior-smooth">
      {/* Top Header */}
      <Navbar />

      {/* Hero Section with Vibrant Colors */}
      <header id="inicio" className="relative py-24 md:py-32 bg-gradient-to-br from-emerald-500/10 via-white to-cyan-400/20 overflow-hidden border-b border-slate-100">
        
        {/* Abstract SVG Background grid design */}
        <div className="absolute inset-0 z-0 opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Texts Hero Details */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/20"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Atención Médica de Vanguardia</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4"
              >
                <h1 className="text-4xl sm:text-5xl md:text-5.5xl font-black text-slate-800 tracking-tight leading-tight">
                  Cuidamos lo que más importa: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-600 block sm:inline">Tu Salud</span>
                </h1>
                <p className="max-w-xl mx-auto lg:mx-0 text-slate-500 text-md sm:text-lg leading-relaxed">
                  Atención médica de nivel internacional con un equipo de profesionales altamente comprometido. Consulta nuestra guía interactiva de síntomas, aclara dudas con el Doctor Virtual, o agenda tu turno en segundos.
                </p>
              </motion.div>


              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <button
                  onClick={() => handleScroll("citas")}
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-97 text-white font-extrabold rounded-full text-base shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Agendar Turno Hoy
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleScroll("sintomas")}
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 active:scale-97 text-slate-700 font-extrabold rounded-full text-base border border-slate-200/80 shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Activity className="w-4.5 h-4.5 text-emerald-600" />
                  Consultar Síntomas
                </button>
              </motion.div>

              {/* Trust markers stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 text-left"
              >
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-800">24/7</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mt-1">Urgencias</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-800">+15k</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mt-1">Pacientes</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-800">100%</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mt-1">Garantizado</span>
                </div>
              </motion.div>

            </div>

            {/* Right Graphics Illustration Box */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="relative bg-emerald-100/30 p-4 rounded-3xl border border-emerald-500/10 shadow-inner w-full max-w-sm"
              >
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col items-center text-center space-y-4">
                  <span className="text-5xl">🏥</span>
                  <h3 className="text-lg font-black text-slate-800">Vida Sana Online</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                    Ofrecemos herramientas interactivas de primer nivel para simplificar los cuidados cotidianos de tu hogar.
                  </p>
                  
                  <div className="w-full space-y-2 pt-2">
                    <div className="bg-slate-50 p-2.5 rounded-xl text-left text-xs border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-600 font-semibold">Triaje Inteligente de Síntomas</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Activo</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl text-left text-xs border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-600 font-semibold">Asistente Virtual Sofia AI</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Online</span>
                    </div>
                  </div>
                </div>

                {/* Overlapping small visual cards */}
                <div className="absolute -bottom-6 -right-6 bg-white border border-slate-100 rounded-2xl p-3 shadow-lg hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl font-bold">
                    🛡️
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">Acreditado</span>
                    <span className="text-[11px] text-slate-700 font-extrabold">Secretaría Nacional</span>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Sections */}
      <main>
        {/* Symptom Checker interactive Area */}
        <SymptomGuide />

        {/* First Aid Manual & Interactive Simulator */}
        <FirstAid />

        {/* Doctor Assistant interactive Animated Companion */}
        <DoctorAssistant />

        {/* Specialities and Departments */}
        <Specialties />

        {/* Relax game Zone */}
        <RelaxGame />

        {/* Schedules Calendar Booking Intake */}
        <AppointmentForm />
      </main>

      {/* Floating Chatbot Tool */}
      <AIChatbot />

      {/* Footer copyright */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-bold tracking-tight text-white">Hospital</span>
            <span className="text-lg font-extrabold text-emerald-500">Vida Sana</span>
          </div>
          <p className="text-xs leading-relaxed max-w-md mx-auto text-slate-500">
            &copy; 2026 Hospital Vida Sana. Todos los derechos reservados. Cuidando tu vida, cultivando salud con excelencia y humanismo.
          </p>
          <div className="text-[10px] text-slate-600">
            Sede: Calle Médica 123, Ciudad Salud | Central Nacional de Turnos: (555) 987-6543
          </div>
        </div>
      </footer>
    </div>
  );
}
