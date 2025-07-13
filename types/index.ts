export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'hr' | 'employee';
  employeeId?: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  salary: number;
  status: 'active' | 'inactive';
  avatar?: string;
  address: string;
  emergencyContact: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  headId?: string;
  employeeCount: number;
  budget?: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  workingHours?: number;
  notes?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  pendingLeaves: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  newHiresThisMonth: number;
  averageWorkingHours: number;
  pendingReviews: number;
  activeOnboarding: number;
  upcomingShifts: number;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'closed';
  isAnonymous: boolean;
  questions: SurveyQuestion[];
  responses: SurveyResponse[];
  targetAudience: 'all' | 'department' | 'role';
  targetValue?: string;
}

export interface SurveyQuestion {
  id: string;
  type: 'text' | 'rating' | 'multiple-choice' | 'yes-no';
  question: string;
  required: boolean;
  options?: string[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  employeeId: string;
  employeeName?: string;
  responses: { [questionId: string]: string | number };
  submittedDate: string;
  isAnonymous: boolean;
}

export interface SmartSuggestion {
  id: string;
  type: 'leave' | 'training' | 'performance' | 'schedule';
  title: string;
  description: string;
  confidence: number;
  data: any;
  employeeId?: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  experience: string[];
  skills: string[];
  education: string[];
  summary: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewerId: string;
  reviewerName: string;
  reviewPeriod: string;
  status: 'draft' | 'in-progress' | 'completed' | 'overdue';
  overallRating: number;
  goals: Goal[];
  competencies: Competency[];
  feedback: string;
  employeeFeedback?: string;
  createdDate: string;
  dueDate: string;
  completedDate?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  progress: number;
  rating?: number;
}

export interface Competency {
  id: string;
  name: string;
  description: string;
  rating: number;
  comments?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  settings: TenantSettings;
  subscription: TenantSubscription;
  createdAt: string;
  isActive: boolean;
}

export interface TenantSettings {
  allowGoogleCalendar: boolean;
  defaultTimezone: string;
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: number[];
  leaveApprovalWorkflow: 'auto' | 'manager' | 'hr';
  features: {
    surveys: boolean;
    performance: boolean;
    onboarding: boolean;
    shifts: boolean;
    aiTools: boolean;
  };
}

export interface TenantSubscription {
  plan: 'starter' | 'professional' | 'enterprise';
  maxEmployees: number;
  features: string[];
  expiresAt: string;
}

export interface CalendarEvent {
  id: string;
  tenantId: string;
  employeeId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: 'leave' | 'shift' | 'meeting' | 'training' | 'holiday';
  googleEventId?: string;
  isAllDay: boolean;
  location?: string;
  attendees?: string[];
  reminders?: CalendarReminder[];
  status: 'confirmed' | 'tentative' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

export interface CalendarReminder {
  method: 'email' | 'popup';
  minutes: number;
}

export interface GoogleCalendarIntegration {
  id: string;
  tenantId: string;
  employeeId: string;
  googleCalendarId: string;
  accessToken: string;
  refreshToken: string;
  isEnabled: boolean;
  syncSettings: {
    syncLeaves: boolean;
    syncShifts: boolean;
    syncMeetings: boolean;
    syncHolidays: boolean;
  };
  lastSyncAt?: string;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  category: 'documentation' | 'equipment' | 'training' | 'access' | 'other';
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  completedDate?: string;
  completedBy?: string;
  notes?: string;
}

export interface OnboardingWorkflow {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  expectedCompletionDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  progress: number;
  tasks: OnboardingTask[];
  assignedHR: string;
  notes?: string;
}

export interface OffboardingWorkflow {
  id: string;
  employeeId: string;
  employeeName: string;
  lastWorkingDay: string;
  reason: 'resignation' | 'termination' | 'retirement' | 'other';
  status: 'initiated' | 'in-progress' | 'completed';
  progress: number;
  tasks: OnboardingTask[];
  assignedHR: string;
  exitInterviewCompleted: boolean;
  notes?: string;
}

export interface Shift {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  employeeId: string;
  employeeName: string;
  department: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'missed' | 'cancelled';
  location?: string;
  notes?: string;
  createdBy: string;
  createdDate: string;
}

export interface ShiftTemplate {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  department: string;
  requiredEmployees: number;
  description?: string;
}