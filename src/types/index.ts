export interface Surgeon {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  email?: string;
  phone?: string;
  created_at: string;
}

export interface Procedure {
  id: string;
  name: string;
  specialty: string;
  description?: string;
  created_at: string;
}

export interface PreferenceCard {
  id: string;
  surgeon_id: string;
  procedure_id: string;
  instruments: string[];
  sutures: string[];
  positioning: string;
  draping: string;
  special_equipment: string[];
  steps: string[];
  notes: string;
  created_at: string;
  updated_at: string;
  surgeon?: Surgeon;
  procedure?: Procedure;
}

export interface OperationCase {
  id: string;
  surgeon_id: string;
  procedure_id: string;
  patient_mrn?: string;
  date: string;
  duration_minutes?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
  surgeon?: Surgeon;
  procedure?: Procedure;
  preference_card?: PreferenceCard;
}

export interface CopilotMessage {
  role: 'user' | 'assistant';
  content: string;
}
