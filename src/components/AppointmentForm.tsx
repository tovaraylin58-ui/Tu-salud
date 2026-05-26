import React, { useState, useEffect } from "react";
import { Appointment } from "../types";
import { specialtiesData } from "../data";
import { Calendar, Clock, CheckCircle, FileText, Trash2, ArrowRight, ShieldCheck, Mail, Phone, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AppointmentForm() {
  const [patientName, setPatientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem("vidasana_appointments");
    return saved ? JSON.parse(saved) : [];
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [recentBooking, setRecentBooking] = useState<Appointment | null>(null);

  useEffect(() => {
    localStorage.setItem("vidasana_appointments", JSON.stringify(appointments));
  }, [appointments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName || !email || !phone || !specialty || !date || !time) return;

    const newAppointment: Appointment = {
      id: Math.random().toString(36).substring(2, 9),
      patientName,
      email,
      phone,
      specialty,
      date,
      time,
      status: "confirmed"
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setRecentBooking(newAppointment);
    setBookingSuccess(true);

    // Reset inputs
    setPatientName("");
    setEmail("");
    setPhone("");
    setSpecialty("");
    setDate("");
    setTime("");
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((app) => app.id !== id));
  };

  return (
    <section id="citas" className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Content */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wider uppercase rounded-full border border-emerald-100 inline-block mb-3">
            Atención Rápida
          </span>
          <h2 className="text-3.5xl font-extrabold text-slate-800 tracking-tight">
            Agenda tu Visita Médica
          </h2>
          <p className="mt-3 text-slate-600 text-sm leading-relaxed">
            Completa la ficha técnica para coordinar tu cita clínica. Nuestro equipo de asesores médicos te validará el horario en un lapso menor de 1 hora.
          </p>
          <div className="w-12 h-1 bg-emerald-500 rounded-full mx-auto mt-5"></div>
        </div>

        {/* Layout Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Card Info Box Left */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Dirección y Contacto</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Nuestras centrales están listas de lunes a domingo para acompañar tu proceso de bienestar.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl font-bold shrink-0">
                    📍
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sede Central</h4>
                    <p className="text-slate-700 text-sm font-semibold mt-0.5">Calle Médica 123, Ciudad Salud</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl font-bold shrink-0">
                    📞
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teléfono de Enlace</h4>
                    <p className="text-slate-700 text-sm font-semibold mt-0.5">(555) 987-6543</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl font-bold shrink-0">
                    📧
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Correo Directo</h4>
                    <p className="text-slate-700 text-sm font-semibold mt-0.5">contacto@vidasana.com</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/30 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                  <strong>Protección Asegurada:</strong> Cumplimos estrictamente con la legislación de reserva de datos médicos e informaciones personales.
                </p>
              </div>
            </div>
          </div>

          {/* Form Side Right */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              
              {!bookingSuccess ? (
                <motion.div
                  key="booking-form"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
                >
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Input name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Nombre del Paciente</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="Ej: Juan Pérez Morales"
                          className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Contact details row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Correo Electrónico</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="paciente@correo.com"
                            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Teléfono de Enlace</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Ej: +54 9 11 2345 6789"
                            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-800 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dropdown specialty */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Especialidad Clínica</label>
                      <select
                        required
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        <option value="">Seleccione una especialidad...</option>
                        {specialtiesData.map((spec) => (
                          <option key={spec.id} value={spec.title}>
                            {spec.icon} {spec.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date and hour select row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Fecha del Turno</label>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-700 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Hora Sugerida</label>
                        <div className="relative">
                          <input
                            type="time"
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-700 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit schedule */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-500/10 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Agendar Turno Médico
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="booking-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-md text-center max-w-lg mx-auto"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 mx-auto mb-4">
                    <CheckCircle className="w-9 h-9 text-emerald-600" />
                  </div>
                  <h4 className="text-xl font-black text-slate-800">¡Turno Agendado con éxito!</h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Muchas gracias, <strong>{recentBooking?.patientName}</strong>. Hemos registrado correctamente tu solicitud médica.
                  </p>

                  {recentBooking && (
                    <div className="my-5 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-left text-xs text-slate-600 space-y-2">
                      <p><strong>🩺 Especialidad:</strong> {recentBooking.specialty}</p>
                      <p><strong>📆 Fecha sugerida:</strong> {recentBooking.date}</p>
                      <p><strong>⏰ Hora sugerida:</strong> {recentBooking.time}</p>
                      <p><strong>🆔 Cita ID:</strong> {recentBooking.id}</p>
                    </div>
                  )}

                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl active:scale-95 transition-all cursor-pointer"
                  >
                    Agendar otra consulta
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

        {/* Saved Scheduled Appointments List Dashboard Area */}
        {appointments.length > 0 && (
          <div className="mt-16 border-t border-slate-200/60 pt-16">
            <h3 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-emerald-600" />
              Mis Consultas Agendadas ({appointments.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {appointments.map((app) => (
                  <motion.div
                    key={app.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-5 bg-white rounded-2xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/5 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Paciente</span>
                          <span className="text-sm font-bold text-slate-800">{app.patientName}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Asignado
                        </span>
                      </div>

                      <div className="space-y-1 pt-1 text-xs text-slate-500">
                        <p><strong>Área:</strong> {app.specialty}</p>
                        <p className="flex items-center gap-1"><strong>Día:</strong> {app.date}</p>
                        <p className="flex items-center gap-1"><strong>Hora:</strong> {app.time}</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100/80 pt-3 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">ID: {app.id}</span>
                      <button
                        onClick={() => handleDeleteAppointment(app.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50/60 transition-colors cursor-pointer"
                        title="Cancelar consulta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
