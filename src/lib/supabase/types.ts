export type ApplicationStatus = "pending" | "confirmed" | "canceled";

export interface Application {
  application_id: string;
  created_at: string;
  updated_at: string;
  school: string;
  contact_name: string;
  contact: string;
  email: string | null;
  grade: string;
  headcount: number;
  preferred_date: string;
  message: string | null;
  marketing: boolean;
  status: ApplicationStatus;
  admin_notes: string | null;
  cancellation_reason: string | null;
  ip_address: string | null;
  user_agent: string | null;
}

export interface StatusHistory {
  id: number;
  application_id: string;
  changed_at: string;
  from_status: ApplicationStatus | null;
  to_status: ApplicationStatus;
  changed_by: string | null;
  note: string | null;
}
