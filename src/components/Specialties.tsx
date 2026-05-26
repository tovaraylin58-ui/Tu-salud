import React, { useState } from "react";
import { specialtiesData } from "../data";
import { Specialty } from "../types";
import { Clock, MapPin, Search, ArrowRight, X, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Specialties() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);

  const handleBookSpecialty = () => {
    setSelectedSpecialty(null);
    const element = document.getElementById("citas");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wider uppercase rounded-full border border-emerald-100 inline-block mb-3">
            Calidad de Excelencia
          </span>
          <h2 className="text-3.5xl font-extrabold text-slate-800 tracking-tight">
            Especialidades Médicas Especializadas
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed text-md">
            Nuestro equipo de médicos de clase mundial utiliza tecnología de vanguardia y tratamientos basados en evidencia científica para brindarte un cuidado integral y humano.
          </p>
          <div className="w-16 h-1 bg-emerald-500 rounded-full mx-auto mt-6"></div>
        </div>

        {/* Categories Grid Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialtiesData.map((spec) => (
            <motion.div
              key={spec.id}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onClick={() => setSelectedSpecialty(spec)}
              className="bg-slate-50/50 hover:bg-white rounded-3xl p-8 border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-lg shadow-slate-100/30 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 text-2.5xl font-bold flex items-center justify-center rounded-2xl group-hover:bg-emerald-600 group-hover:text-white group-hover:rotate-6 transition-all duration-300">
                  {spec.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-6 tracking-tight group-hover:text-emerald-700 transition-colors">
                  {spec.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mt-3 line-clamp-3">
                  {spec.description}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100/50 flex items-center justify-between text-xs font-semibold text-emerald-600 group-hover:text-emerald-700">
                <span>Conocer Médicos y Ubicación</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pop-up Info Modal sheet */}
        <AnimatePresence>
          {selectedSpecialty && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedSpecialty(null)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />

              {/* Modal Card Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                {/* Accent Top Bar */}
                <div className="h-2 bg-emerald-600 w-full" />

                {/* Cancel Header Button */}
                <button
                  onClick={() => setSelectedSpecialty(null)}
                  className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Main scrollable body */}
                <div className="p-8 overflow-y-auto space-y-6">
                  {/* Top Intro Header */}
                  <div className="flex items-center gap-4">
                    <span className="text-4xl p-3 bg-emerald-50 rounded-2xl block">{selectedSpecialty.icon}</span>
                    <div>
                      <span className="text-xs text-emerald-600 font-extrabold uppercase tracking-wide">Especialidad Hospitalaria</span>
                      <h4 className="text-2xl font-black tracking-tight text-slate-800 mt-0.5">{selectedSpecialty.title}</h4>
                    </div>
                  </div>

                  {/* General Summary Description */}
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {selectedSpecialty.description}
                  </p>

                  {/* Location Info Room */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ubicación del Servicio</h5>
                      <p className="text-slate-700 text-sm font-semibold mt-0.5">{selectedSpecialty.location}</p>
                    </div>
                  </div>

                  {/* Doctors Lists list */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Equipo Médico / Médicos de Planta</h5>
                    <div className="space-y-3">
                      {selectedSpecialty.doctorList.map((doc, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-slate-100 flex items-center justify-between gap-4 bg-white hover:border-emerald-100 hover:bg-emerald-50/10 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-2.5xl p-1 bg-slate-50 border border-slate-100 rounded-lg block">{doc.avatar}</span>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{doc.name}</p>
                              <p className="text-xs text-slate-500 font-medium">{doc.specialty}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 rounded-md font-bold px-2 py-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {doc.schedule}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action buttons */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                  <button
                    onClick={() => setSelectedSpecialty(null)}
                    className="px-5 py-2.5 font-bold text-sm text-slate-500 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={handleBookSpecialty}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    Agendar Horario
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
