export interface Symptom {
  id: string;
  name: string;
  emoji: string;
  description: string;
  causes: string[];
  recommendations: string[];
  severity: "low" | "medium" | "high";
  department: string;
}

export interface Doctor {
  name: string;
  specialty: string;
  schedule: string;
  avatar: string;
}

export interface Specialty {
  id: string;
  title: string;
  icon: string;
  description: string;
  doctorList: Doctor[];
  location: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  specialty: string;
  date: string;
  time: string;
  status: "confirmed" | "pending";
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}
