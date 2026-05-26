import React, { useState } from "react";
import { Stethoscope, Calendar, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-blue-50/50 backdrop-blur-md bg-opacity-95 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="flex items-center gap-2 cursor-pointer" onClick={() => handleScroll("inicio")}>
              <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-800">Hospital </span>
                <span className="text-xl font-extrabold text-emerald-600">Vida Sana</span>
              </div>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleScroll("inicio")}
              className="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => handleScroll("sintomas")}
              className="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
            >
              Guía de Síntomas
            </button>
            <button
              onClick={() => handleScroll("servicios")}
              className="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
            >
              Especialidades
            </button>
            <button
              onClick={() => handleScroll("juego")}
              className="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
            >
              Pausa Saludable
            </button>
            <button
              onClick={() => handleScroll("citas")}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/10 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Agendar Cita
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-emerald-600 hover:bg-slate-50 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 py-4 space-y-3 shadow-inner">
          <button
            onClick={() => handleScroll("inicio")}
            className="block w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors"
          >
            Inicio
          </button>
          <button
            onClick={() => handleScroll("sintomas")}
            className="block w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors"
          >
            Guía de Síntomas
          </button>
          <button
            onClick={() => handleScroll("servicios")}
            className="block w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors"
          >
            Especialidades
          </button>
          <button
            onClick={() => handleScroll("juego")}
            className="block w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors"
          >
            Pausa Saludable
          </button>
          <button
            onClick={() => handleScroll("citas")}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-center text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Agendar Cita
          </button>
        </div>
      )}
    </nav>
  );
}
