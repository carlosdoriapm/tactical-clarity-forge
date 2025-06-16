
export interface Conversation {
  id: string;
  user_id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  context?: any;
}

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
  metadata?: any;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  target_date?: string;
  created_at: string;
  updated_at: string;
  progress: number;
  metadata?: any;
}

export interface Decision {
  id: string;
  user_id: string;
  conversation_id?: string;
  decision_text: string;
  analysis_result?: any;
  status: 'pending' | 'implemented' | 'cancelled' | 'reviewing';
  created_at: string;
  updated_at: string;
  implementation_date?: string;
  review_date?: string;
}
