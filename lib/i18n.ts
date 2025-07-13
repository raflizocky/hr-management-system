import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: "Dashboard",
      employees: "Employees",
      departments: "Departments",
      leaveRequests: "Leave Requests",
      attendance: "Attendance",
      performance: "Performance",
      surveys: "Surveys & Feedback",
      onboarding: "Onboarding",
      shifts: "Shift Management",
      reports: "Reports",
      users: "User Management",
      settings: "Settings",
      logout: "Logout",
      
      // Common
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      add: "Add",
      view: "View",
      submit: "Submit",
      approve: "Approve",
      reject: "Reject",
      search: "Search",
      filter: "Filter",
      export: "Export",
      
      // Dashboard
      totalEmployees: "Total Employees",
      pendingLeaves: "Pending Leaves",
      presentToday: "Present Today",
      recentActivity: "Recent Activity",
      
      // Auth
      signIn: "Sign In",
      welcomeBack: "Welcome Back",
      signInToAccess: "Sign in to access your dashboard",
      email: "Email",
      password: "Password",
      enterEmail: "Enter your email",
      enterPassword: "Enter your password",
      signingIn: "Signing in...",
      tryDemoAccounts: "Try Demo Accounts",
      experienceRoles: "Experience different role perspectives",
      
      // Leave Management
      newRequest: "New Request",
      leaveType: "Leave Type",
      startDate: "Start Date",
      endDate: "End Date",
      reason: "Reason",
      vacation: "Vacation",
      sick: "Sick Leave",
      personal: "Personal Leave",
      
      // Surveys
      employeeSurveys: "Employee Surveys",
      createSurvey: "Create Survey",
      surveyTitle: "Survey Title",
      surveyDescription: "Survey Description",
      anonymous: "Anonymous",
      required: "Required",
      
      // Smart Suggestions
      smartSuggestions: "Smart Suggestions",
      suggestedLeaveDates: "Suggested Leave Dates",
      basedOnWorkload: "Based on your workload and team availability",
      
      // AI Features
      aiPowered: "AI-Powered",
      resumeParsing: "Resume Parsing",
      autoExtraction: "Automatic data extraction from resumes",
      
      // Company
      companyName: "HRMS Pro Corporation",
      companyTagline: "Enterprise Human Resource Management",
      companyDescription: "Streamline your workforce operations"
    }
  },
  es: {
    translation: {
      // Navigation
      dashboard: "Panel de Control",
      employees: "Empleados",
      departments: "Departamentos",
      leaveRequests: "Solicitudes de Permiso",
      attendance: "Asistencia",
      performance: "Rendimiento",
      surveys: "Encuestas y Comentarios",
      onboarding: "Incorporación",
      shifts: "Gestión de Turnos",
      reports: "Informes",
      users: "Gestión de Usuarios",
      settings: "Configuración",
      logout: "Cerrar Sesión",
      
      // Common
      save: "Guardar",
      cancel: "Cancelar",
      edit: "Editar",
      delete: "Eliminar",
      add: "Agregar",
      view: "Ver",
      submit: "Enviar",
      approve: "Aprobar",
      reject: "Rechazar",
      search: "Buscar",
      filter: "Filtrar",
      export: "Exportar",
      
      // Dashboard
      totalEmployees: "Total de Empleados",
      pendingLeaves: "Permisos Pendientes",
      presentToday: "Presentes Hoy",
      recentActivity: "Actividad Reciente",
      
      // Auth
      signIn: "Iniciar Sesión",
      welcomeBack: "Bienvenido de Nuevo",
      signInToAccess: "Inicia sesión para acceder a tu panel",
      email: "Correo Electrónico",
      password: "Contraseña",
      enterEmail: "Ingresa tu correo electrónico",
      enterPassword: "Ingresa tu contraseña",
      signingIn: "Iniciando sesión...",
      tryDemoAccounts: "Probar Cuentas Demo",
      experienceRoles: "Experimenta diferentes perspectivas de roles",
      
      // Company
      companyName: "HRMS Pro Corporation",
      companyTagline: "Gestión Empresarial de Recursos Humanos",
      companyDescription: "Optimiza las operaciones de tu fuerza laboral"
    }
  },
  fr: {
    translation: {
      // Navigation
      dashboard: "Tableau de Bord",
      employees: "Employés",
      departments: "Départements",
      leaveRequests: "Demandes de Congé",
      attendance: "Présence",
      performance: "Performance",
      surveys: "Enquêtes et Commentaires",
      onboarding: "Intégration",
      shifts: "Gestion des Équipes",
      reports: "Rapports",
      users: "Gestion des Utilisateurs",
      settings: "Paramètres",
      logout: "Déconnexion",
      
      // Company
      companyName: "HRMS Pro Corporation",
      companyTagline: "Gestion des Ressources Humaines d'Entreprise",
      companyDescription: "Rationalisez les opérations de votre main-d'œuvre"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;