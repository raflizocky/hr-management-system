'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Employee, 
  Department, 
  LeaveRequest, 
  AttendanceRecord, 
  DashboardStats, 
  User,
  PerformanceReview,
  AuditLog,
  OnboardingWorkflow,
  OffboardingWorkflow,
  Shift,
  ShiftTemplate,
  Survey,
  SmartSuggestion
} from '@/types';

interface DataContextType {
  employees: Employee[];
  departments: Department[];
  leaveRequests: LeaveRequest[];
  attendanceRecords: AttendanceRecord[];
  dashboardStats: DashboardStats;
  users: User[];
  performanceReviews: PerformanceReview[];
  auditLogs: AuditLog[];
  onboardingWorkflows: OnboardingWorkflow[];
  offboardingWorkflows: OffboardingWorkflow[];
  shifts: Shift[];
  shiftTemplates: ShiftTemplate[];
  surveys: Survey[];
  smartSuggestions: SmartSuggestion[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addDepartment: (department: Omit<Department, 'id' | 'employeeCount'>) => void;
  updateDepartment: (id: string, department: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>) => void;
  updateLeaveRequest: (id: string, request: Partial<LeaveRequest>) => void;
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendanceRecord: (id: string, record: Partial<AttendanceRecord>) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'isActive'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addPerformanceReview: (review: Omit<PerformanceReview, 'id'>) => void;
  updatePerformanceReview: (id: string, review: Partial<PerformanceReview>) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  addOnboardingWorkflow: (workflow: Omit<OnboardingWorkflow, 'id'>) => void;
  updateOnboardingWorkflow: (id: string, workflow: Partial<OnboardingWorkflow>) => void;
  addOffboardingWorkflow: (workflow: Omit<OffboardingWorkflow, 'id'>) => void;
  updateOffboardingWorkflow: (id: string, workflow: Partial<OffboardingWorkflow>) => void;
  addShift: (shift: Omit<Shift, 'id'>) => void;
  updateShift: (id: string, shift: Partial<Shift>) => void;
  deleteShift: (id: string) => void;
  addShiftTemplate: (template: Omit<ShiftTemplate, 'id'>) => void;
  addSurvey: (survey: Omit<Survey, 'id'>) => void;
  updateSurvey: (id: string, survey: Partial<Survey>) => void;
  addSmartSuggestion: (suggestion: Omit<SmartSuggestion, 'id'>) => void;
  exportData: (type: 'employees' | 'leave' | 'attendance', format: 'csv' | 'pdf') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'Mike Johnson',
    email: 'mike@company.com',
    phone: '+1-555-0101',
    department: 'Engineering',
    position: 'Senior Developer',
    joinDate: '2023-01-15',
    salary: 85000,
    status: 'active',
    address: '123 Main St, City, State 12345',
    emergencyContact: '+1-555-0102',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Sarah Wilson',
    email: 'sarah@company.com',
    phone: '+1-555-0201',
    department: 'Marketing',
    position: 'Marketing Manager',
    joinDate: '2023-02-01',
    salary: 72000,
    status: 'active',
    address: '456 Oak Ave, City, State 12345',
    emergencyContact: '+1-555-0202',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'David Chen',
    email: 'david@company.com',
    phone: '+1-555-0301',
    department: 'Engineering',
    position: 'Frontend Developer',
    joinDate: '2023-03-10',
    salary: 68000,
    status: 'active',
    address: '789 Pine St, City, State 12345',
    emergencyContact: '+1-555-0302',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    description: 'Software development and technical operations',
    headId: '1',
    employeeCount: 2,
    budget: 500000
  },
  {
    id: '2',
    name: 'Marketing',
    description: 'Marketing and brand management',
    headId: '2',
    employeeCount: 1,
    budget: 200000
  },
  {
    id: '3',
    name: 'Human Resources',
    description: 'Employee relations and organizational development',
    employeeCount: 0,
    budget: 150000
  }
];

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Mike Johnson',
    type: 'vacation',
    startDate: '2024-02-15',
    endDate: '2024-02-19',
    days: 5,
    reason: 'Family vacation',
    status: 'pending',
    appliedDate: '2024-01-20'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Sarah Wilson',
    type: 'sick',
    startDate: '2024-01-25',
    endDate: '2024-01-25',
    days: 1,
    reason: 'Medical appointment',
    status: 'approved',
    appliedDate: '2024-01-24',
    approvedBy: 'HR Manager',
    approvedDate: '2024-01-24'
  }
];

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Mike Johnson',
    date: '2024-01-22',
    checkIn: '09:00',
    checkOut: '18:00',
    status: 'present',
    workingHours: 8
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Sarah Wilson',
    date: '2024-01-22',
    checkIn: '09:15',
    checkOut: '17:30',
    status: 'late',
    workingHours: 7.25
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'David Chen',
    date: '2024-01-22',
    checkIn: '08:45',
    checkOut: '17:45',
    status: 'present',
    workingHours: 8
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'John Admin',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    createdAt: '2023-01-01',
    lastLogin: '2024-01-22',
    isActive: true
  },
  {
    id: '2',
    email: 'hr@company.com',
    name: 'Sarah HR',
    role: 'hr',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    createdAt: '2023-02-01',
    lastLogin: '2024-01-22',
    isActive: true
  },
  {
    id: '3',
    email: 'employee@company.com',
    name: 'Mike Employee',
    role: 'employee',
    employeeId: 'EMP001',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    createdAt: '2023-03-01',
    lastLogin: '2024-01-22',
    isActive: true
  },
  {
    id: '4',
    email: 'hr2@company.com',
    name: 'Lisa Manager',
    role: 'hr',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    createdAt: '2023-04-01',
    lastLogin: '2024-01-21',
    isActive: true
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [onboardingWorkflows, setOnboardingWorkflows] = useState<OnboardingWorkflow[]>([]);
  const [offboardingWorkflows, setOffboardingWorkflows] = useState<OffboardingWorkflow[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shiftTemplates, setShiftTemplates] = useState<ShiftTemplate[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalEmployees: 3,
    totalDepartments: 3,
    pendingLeaves: 1,
    presentToday: 2,
    absentToday: 0,
    lateToday: 1,
    newHiresThisMonth: 1,
    averageWorkingHours: 7.75,
    pendingReviews: 0,
    activeOnboarding: 0,
    upcomingShifts: 0
  });

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee = { ...employee, id: Date.now().toString() };
    setEmployees(prev => [...prev, newEmployee]);
    updateDashboardStats();
  };

  const updateEmployee = (id: string, employeeData: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...employeeData } : emp));
    updateDashboardStats();
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    updateDashboardStats();
  };

  const addDepartment = (department: Omit<Department, 'id' | 'employeeCount'>) => {
    const newDepartment = { ...department, id: Date.now().toString(), employeeCount: 0 };
    setDepartments(prev => [...prev, newDepartment]);
  };

  const updateDepartment = (id: string, departmentData: Partial<Department>) => {
    setDepartments(prev => prev.map(dept => dept.id === id ? { ...dept, ...departmentData } : dept));
  };

  const deleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(dept => dept.id !== id));
  };

  const addLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>) => {
    const newRequest = {
      ...request,
      id: Date.now().toString(),
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending' as const
    };
    setLeaveRequests(prev => [...prev, newRequest]);
    updateDashboardStats();
  };

  const updateLeaveRequest = (id: string, requestData: Partial<LeaveRequest>) => {
    setLeaveRequests(prev => prev.map(req => req.id === id ? { ...req, ...requestData } : req));
    updateDashboardStats();
  };

  const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord = { ...record, id: Date.now().toString() };
    setAttendanceRecords(prev => [...prev, newRecord]);
    updateDashboardStats();
  };

  const updateAttendanceRecord = (id: string, recordData: Partial<AttendanceRecord>) => {
    setAttendanceRecords(prev => prev.map(rec => rec.id === id ? { ...rec, ...recordData } : rec));
    updateDashboardStats();
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...userData } : user));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const addPerformanceReview = (review: Omit<PerformanceReview, 'id'>) => {
    const newReview = { ...review, id: Date.now().toString() };
    setPerformanceReviews(prev => [...prev, newReview]);
    addAuditLog({
      userId: 'current-user',
      userName: 'Current User',
      action: 'CREATE',
      resource: 'Performance Review',
      resourceId: newReview.id,
      details: `Created performance review for ${review.employeeName}`
    });
  };

  const updatePerformanceReview = (id: string, reviewData: Partial<PerformanceReview>) => {
    setPerformanceReviews(prev => prev.map(review => review.id === id ? { ...review, ...reviewData } : review));
    addAuditLog({
      userId: 'current-user',
      userName: 'Current User',
      action: 'UPDATE',
      resource: 'Performance Review',
      resourceId: id,
      details: `Updated performance review`
    });
  };

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev].slice(0, 1000)); // Keep last 1000 logs
  };

  const addOnboardingWorkflow = (workflow: Omit<OnboardingWorkflow, 'id'>) => {
    const newWorkflow = { ...workflow, id: Date.now().toString() };
    setOnboardingWorkflows(prev => [...prev, newWorkflow]);
    addAuditLog({
      userId: 'current-user',
      userName: 'Current User',
      action: 'CREATE',
      resource: 'Onboarding Workflow',
      resourceId: newWorkflow.id,
      details: `Created onboarding workflow for ${workflow.employeeName}`
    });
  };

  const updateOnboardingWorkflow = (id: string, workflowData: Partial<OnboardingWorkflow>) => {
    setOnboardingWorkflows(prev => prev.map(workflow => workflow.id === id ? { ...workflow, ...workflowData } : workflow));
  };

  const addOffboardingWorkflow = (workflow: Omit<OffboardingWorkflow, 'id'>) => {
    const newWorkflow = { ...workflow, id: Date.now().toString() };
    setOffboardingWorkflows(prev => [...prev, newWorkflow]);
    addAuditLog({
      userId: 'current-user',
      userName: 'Current User',
      action: 'CREATE',
      resource: 'Offboarding Workflow',
      resourceId: newWorkflow.id,
      details: `Created offboarding workflow for ${workflow.employeeName}`
    });
  };

  const updateOffboardingWorkflow = (id: string, workflowData: Partial<OffboardingWorkflow>) => {
    setOffboardingWorkflows(prev => prev.map(workflow => workflow.id === id ? { ...workflow, ...workflowData } : workflow));
  };

  const addShift = (shift: Omit<Shift, 'id'>) => {
    const newShift = { ...shift, id: Date.now().toString() };
    setShifts(prev => [...prev, newShift]);
    addAuditLog({
      userId: 'current-user',
      userName: 'Current User',
      action: 'CREATE',
      resource: 'Shift',
      resourceId: newShift.id,
      details: `Created shift for ${shift.employeeName} on ${shift.date}`
    });
  };

  const updateShift = (id: string, shiftData: Partial<Shift>) => {
    setShifts(prev => prev.map(shift => shift.id === id ? { ...shift, ...shiftData } : shift));
  };

  const deleteShift = (id: string) => {
    setShifts(prev => prev.filter(shift => shift.id !== id));
    addAuditLog({
      userId: 'current-user',
      userName: 'Current User',
      action: 'DELETE',
      resource: 'Shift',
      resourceId: id,
      details: `Deleted shift`
    });
  };

  const addShiftTemplate = (template: Omit<ShiftTemplate, 'id'>) => {
    const newTemplate = { ...template, id: Date.now().toString() };
    setShiftTemplates(prev => [...prev, newTemplate]);
  };

  const addSurvey = (survey: Omit<Survey, 'id'>) => {
    const newSurvey = { ...survey, id: Date.now().toString() };
    setSurveys(prev => [...prev, newSurvey]);
    addAuditLog({
      userId: 'current-user',
      userName: 'Current User',
      action: 'CREATE',
      resource: 'Survey',
      resourceId: newSurvey.id,
      details: `Created survey: ${survey.title}`
    });
  };

  const updateSurvey = (id: string, surveyData: Partial<Survey>) => {
    setSurveys(prev => prev.map(survey => survey.id === id ? { ...survey, ...surveyData } : survey));
  };

  const addSmartSuggestion = (suggestion: Omit<SmartSuggestion, 'id'>) => {
    const newSuggestion = { ...suggestion, id: Date.now().toString() };
    setSmartSuggestions(prev => [...prev, newSuggestion]);
  };

  const exportData = (type: 'employees' | 'leave' | 'attendance', format: 'csv' | 'pdf') => {
    addAuditLog({
      userId: 'current-user',
      userName: 'Current User',
      action: 'EXPORT',
      resource: `${type} Data`,
      details: `Exported ${type} data in ${format.toUpperCase()} format`
    });
    
    // Simulate export functionality
    alert(`Exporting ${type} data as ${format.toUpperCase()}...`);
  };

  const updateDashboardStats = () => {
    const totalEmployees = employees.filter(emp => emp.status === 'active').length;
    const pendingLeaves = leaveRequests.filter(req => req.status === 'pending').length;
    const todayRecords = attendanceRecords.filter(rec => rec.date === new Date().toISOString().split('T')[0]);
    const presentToday = todayRecords.filter(rec => rec.status === 'present').length;
    const lateToday = todayRecords.filter(rec => rec.status === 'late').length;
    const absentToday = totalEmployees - presentToday - lateToday;
    const pendingReviews = performanceReviews.filter(review => review.status === 'in-progress').length;
    const activeOnboarding = onboardingWorkflows.filter(workflow => workflow.status === 'in-progress').length;
    const today = new Date().toISOString().split('T')[0];
    const upcomingShifts = shifts.filter(shift => shift.date >= today && shift.status === 'scheduled').length;

    setDashboardStats({
      totalEmployees,
      totalDepartments: departments.length,
      pendingLeaves,
      presentToday,
      absentToday: Math.max(0, absentToday),
      lateToday,
      newHiresThisMonth: 1,
      averageWorkingHours: 7.75,
      pendingReviews,
      activeOnboarding,
      upcomingShifts
    });
  };

  useEffect(() => {
    updateDashboardStats();
  }, [employees, departments, leaveRequests, attendanceRecords, users, performanceReviews, onboardingWorkflows, shifts]);

  return (
    <DataContext.Provider value={{
      employees,
      departments,
      leaveRequests,
      attendanceRecords,
      dashboardStats,
      users,
      performanceReviews,
      auditLogs,
      onboardingWorkflows,
      offboardingWorkflows,
      shifts,
      shiftTemplates,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      addDepartment,
      updateDepartment,
      deleteDepartment,
      addLeaveRequest,
      updateLeaveRequest,
      addAttendanceRecord,
      updateAttendanceRecord,
      addUser,
      updateUser,
      deleteUser,
      addPerformanceReview,
      updatePerformanceReview,
      addAuditLog,
      addOnboardingWorkflow,
      updateOnboardingWorkflow,
      addOffboardingWorkflow,
      updateOffboardingWorkflow,
      addShift,
      updateShift,
      deleteShift,
      addShiftTemplate,
      exportData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}