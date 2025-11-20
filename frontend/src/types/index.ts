export interface Patient {
  id: string;
  medical_id: string;
  name: string;
  ward: string;
  bed_number: string;
  gender: string;
  age: number;
  admission_date: string;
  attending_physician: string;
  nursing_level: string;
}

export interface NursingRecord {
  id: string;
  patient_id: string;
  content: string;
  recorder: string;
  recorded_at: string;
  created_at: string;
}