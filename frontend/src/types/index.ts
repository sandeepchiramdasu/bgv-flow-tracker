export interface ActivityLog {
  id: number;
  action: string;
  from_status: string | null;
  to_status: string;
  changed_by: string;
  timestamp: string;
}

export interface Candidate {
  id: number;
  name: string;
  phone_number: string; 
  work_email: string;   
  status: "identity_check" | "employment_check" | "final_report";
  identity_verified: boolean;
  employment_verified: boolean;
  remarks?: string;
  internal_remarks?: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null; 
  tat_hours: number;
  tat_status: "green" | "yellow" | "red";
  logs?: ActivityLog[];
}

export interface Analytics {
  total_candidates: number;
  status_distribution: {
    identity_check: number;
    employment_check: number;
    final_report: number;
  };
  delayed_in_progress: number;
  delayed_completed: number;
  on_time_completed: number;
  average_tat_hours: number;
}