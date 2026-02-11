
export interface Batch {
  id: string;
  name: string;
  category: 'HSC' | 'Admission' | 'Professional' | 'Intensive' | 'Online';
  timeSlots: string[];
  fee: string;
}

export interface Sheet {
  id: string;
  chapter: string;
  title: string;
  description: string;
  icon: string;
  downloadUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
