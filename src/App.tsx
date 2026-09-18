import React, { useState } from 'react';
import { 
  Search, 
  HeartHandshake, 
  User as UserIcon, 
  Bell, 
  Globe, 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  PlusCircle, 
  FileText, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  HelpCircle, 
  Building2, 
  Layers, 
  Download,
  AlertCircle,
  FolderKanban,
  Sparkles,
  ArrowRight
} from 'lucide-react';

import { 
  mockUsers, 
  mockCategories, 
  mockApplications, 
  mockAuditLogs, 
  mockNotifications 
} from './data/mockData';
import { 
  User, 
  AssistanceApplication, 
  AssistanceCategory, 
  AuditLog, 
  NotificationItem, 
  Language,
  UploadedDocument,
  StatusHistoryEntry,
  DecisionRecord
} from './types';
import { translations } from './translations';

import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { NewApplicationModal } from './components/employee/NewApplicationModal';
import { ApplicationDetailModal } from './components/employee/ApplicationDetailModal';
import { SocialWorkerDashboard } from './components/social/SocialWorkerDashboard';
import { CaseReviewModal } from './components/social/CaseReviewModal';
import { ITDataAnalyticsDashboard } from './components/admin/ITDataAnalyticsDashboard';
import { DocumentPreviewModal } from './components/document/DocumentPreviewModal';
import { AuthView } from './components/auth/AuthView';

export default function App() {
  // Default language: French as requested by user
  const [language, setLanguage] = useState<Language>('fr');
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]); // Starts as Employee (Sami Ben Ammar)
  const [showAuthScreen, setShowAuthScreen] = useState<boolean>(false);

  // Active navigation view
  // 'news' = Portal Homepage with Banner & News (like the photo)
  // 'employee_space' = Dedicated Employee Interface
  // 'social_space' = Dedicated Social Worker Interface
  // 'it_analytics_space' = Dedicated IT Admin Data Analytics Interface
  const [activeNav, setActiveNav] = useState<'news' | 'employee_space' | 'social_space' | 'it_analytics_space'>('employee_space');
  const [searchQuery, setSearchQuery] = useState('');

  // Core domain states
  const [applications, setApplications] = useState<AssistanceApplication[]>(mockApplications);
  const [categories, setCategories] = useState<AssistanceCategory[]>(mockCategories);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  // Modals state
  const [showNewAppModal, setShowNewAppModal] = useState<boolean>(false);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState<AssistanceApplication | null>(null);
  const [selectedAppForReview, setSelectedAppForReview] = useState<AssistanceApplication | null>(null);
  const [officialDocPreview, setOfficialDocPreview] = useState<{
    app: AssistanceApplication;
    docType: 'receipt' | 'decision';
  } | null>(null);

  const isFrench = language === 'fr';

  // Handle direct login from AuthView
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setShowAuthScreen(false);
    
    // Direct user to their dedicated interface
    if (user.role === 'employee') {
      setActiveNav('employee_space');
    } else if (user.role === 'social_worker' || user.role === 'social_manager') {
      setActiveNav('social_space');
    } else if (user.role === 'admin') {
      setActiveNav('it_analytics_space');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowAuthScreen(true);
  };

  // Switch role helper for instant demonstration
  const handleQuickSwitchRole = (role: 'employee' | 'social_worker' | 'admin') => {
    const target = mockUsers.find(u => u.role === role) || mockUsers[0];
    setCurrentUser(target);
    setIsAuthenticated(true);
    setShowAuthScreen(false);

    if (role === 'employee') setActiveNav('employee_space');
    else if (role === 'social_worker') setActiveNav('social_space');
    else if (role === 'admin') setActiveNav('it_analytics_space');
  };

  // Append audit log
  const appendAuditLog = (
    action: string, 
    resource: string, 
    details: string,
    resourceId?: string, 
    severity: 'info' | 'warning' | 'security' = 'info'
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      resource,
      resourceId,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '10.220.14.88 (Intranet TT)',
      severity
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Create new application
  const handleCreateApplication = (partialApp: Partial<AssistanceApplication>) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const refNum = `TT-SOC-2025-${randomNum}`;
    const now = new Date().toISOString();

    const fullApp: AssistanceApplication = {
      id: `app-${Date.now()}`,
      referenceNumber: refNum,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      employeeMatricule: currentUser.matricule,
      employeeDepartment: currentUser.department,
      employeeRegion: currentUser.regionalDirection,
      employeePhone: currentUser.phone,
      categoryId: partialApp.categoryId || categories[0].id,
      categoryCode: partialApp.categoryCode || categories[0].code,
      categoryTitle: partialApp.categoryTitle || categories[0].title,
      requestedAmountTND: partialApp.requestedAmountTND || 1000,
      subject: partialApp.subject || (isFrench ? 'Demande d’aide sociale' : 'مطلب مساعدة اجتماعية'),
      situationDescription: partialApp.situationDescription || '',
      customFieldValues: partialApp.customFieldValues || {},
      status: 'submitted',
      priority: partialApp.priority || 'normal',
      createdAt: now,
      updatedAt: now,
      documents: partialApp.documents || [],
      comments: [],
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          fromStatus: 'draft',
          toStatus: 'submitted',
          changedBy: currentUser.id,
          changedByName: currentUser.name,
          changedByRole: currentUser.role,
          timestamp: now,
          comment: isFrench ? 'Dépôt initial dématérialisé avec pièces justificatives' : 'إيداع أولي إلكتروني مع مؤيدات مشفرة'
        }
      ]
    };

    setApplications(prev => [fullApp, ...prev]);
    appendAuditLog('SOUMISSION_DEMANDE', 'AssistanceApplication', `Dépôt initial dossier ${refNum}`, refNum, 'info');

    // Add in-app notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: isFrench ? 'Demande enregistrée avec succès' : 'تم تسجيل المطلب بنجاح',
      message: isFrench 
        ? `Votre demande réf. ${refNum} a été déposée. Récépissé disponible au téléchargement.`
        : `تم إيداع مطلبك عدد ${refNum}. يمكنك الآن استخراج وصل الإيداع الرسمي.`,
      timestamp: isFrench ? 'À l’instant' : 'الآن',
      read: false,
      applicationId: fullApp.id,
      type: 'status_change'
    };
    setNotifications(prev => [newNotif, ...prev]);

    setShowNewAppModal(false);

    // Prompt user with official printable receipt
    setOfficialDocPreview({
      app: fullApp,
      docType: 'receipt'
    });
  };

  // Update application status
  const handleUpdateStatus = (appId: string, newStatus: AssistanceApplication['status'], comment: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      const historyEntry: StatusHistoryEntry = {
        id: `h-${Date.now()}`,
        fromStatus: app.status,
        toStatus: newStatus,
        changedBy: currentUser.id,
        changedByName: currentUser.name,
        changedByRole: currentUser.role,
        timestamp: new Date().toISOString(),
        comment
      };
      return {
        ...app,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        statusHistory: [...app.statusHistory, historyEntry]
      };
    }));

    appendAuditLog(`STATUT_${newStatus.toUpperCase()}`, 'AssistanceApplication', comment, appId, 'info');
  };

  // Add comment
  const handleAddComment = (appId: string, content: string, isInternal: boolean) => {
    const newComment = {
      id: `comm-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content,
      createdAt: new Date().toISOString(),
      isInternalNote: isInternal
    };

    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      return {
        ...app,
        comments: [...app.comments, newComment]
      };
    }));

    appendAuditLog(
      isInternal ? 'NOTE_INTERNE_CONFIDENTIELLE' : 'MESSAGE_COLLABORATEUR',
      'AssistanceApplication',
      content.substring(0, 80),
      appId,
      isInternal ? 'security' : 'info'
    );
  };

  // Upload complementary document
  const handleUploadComplementaryDoc = (appId: string, doc: UploadedDocument) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      return {
        ...app,
        documents: [...app.documents, doc],
        status: 'under_review' as AssistanceApplication['status'],
        updatedAt: new Date().toISOString()
      };
    }));

    appendAuditLog('UPLOAD_COMPLEMENT_PIECE', 'UploadedDocument', `Ajout pièce ${doc.fileName}`, appId, 'info');
  };

  // Social worker requests additional documents
  const handleRequestSupplement = (appId: string, note: string) => {
    handleUpdateStatus(appId, 'info_requested', `Complément de pièces requis : ${note}`);
    handleAddComment(appId, `[Demande formelle de complément] : ${note}`, false);
  };

  // Social worker submits proposal to manager
  const handleSubmitProposal = (appId: string, proposedAmount: number, motivation: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      return {
        ...app,
        status: 'pending_validation',
        proposedAmountTND: proposedAmount,
        updatedAt: new Date().toISOString()
      };
    }));

    handleAddComment(appId, `[Proposition d'octroi de ${proposedAmount} TND transmise] : ${motivation}`, true);
    appendAuditLog('TRANSMISSION_PROPOSITION_AVIS', 'AssistanceApplication', `Proposition montant ${proposedAmount} TND`, appId, 'info');
  };

  // If user is on Authentication Screen, show AuthView
  if (!isAuthenticated || showAuthScreen) {
    return (
      <AuthView
        availableUsers={mockUsers}
        language={language}
        onLogin={handleLogin}
        onCancel={isAuthenticated ? () => setShowAuthScreen(false) : undefined}
      />
    );
  }

  // Get active role label
  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'employee': return isFrench ? 'Employé TT' : 'موظف';
      case 'social_worker': return isFrench ? 'Agent Social' : 'مساعد اجتماعي';
      case 'admin': return isFrench ? 'Admin IT (Data)' : 'مسؤول إعلامية وتحليل';
      default: return isFrench ? 'Agent' : 'عون';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Utility Bar */}
      <div className="bg-[#003d75] text-white text-xs px-4 py-1.5 border-b border-[#002e5b]">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="font-bold flex items-center gap-1 text-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {isFrench ? 'RÉSEAU INTRANET PRIVÉ • TUNISIE TELECOM' : 'شبكة الإنترانت الداخلية • اتصالات تونس'}
            </span>
            <span className="text-blue-300 hidden sm:inline">|</span>
            <span className="text-blue-200 hidden md:inline">
              {isFrench ? 'Direction Centrale du Capital Humain' : 'الإدارة المركزية لرأس المال البشري'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Role Switcher */}
            <div className="flex items-center gap-1.5 bg-[#002e5b] px-2 py-0.5 rounded-lg border border-blue-400/20">
              <span className="text-[10px] text-blue-300 hidden lg:inline">
                {isFrench ? 'Tester un rôle :' : 'تجربة صفة :'}
              </span>
              <button
                onClick={() => handleQuickSwitchRole('employee')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  currentUser.role === 'employee' ? 'bg-blue-500 text-white shadow-xs' : 'text-blue-200 hover:text-white'
                }`}
                title={isFrench ? 'Interface Employé' : 'واجهة الموظف'}
              >
                {isFrench ? 'Employé' : 'الموظف'}
              </button>
              <button
                onClick={() => handleQuickSwitchRole('social_worker')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  currentUser.role === 'social_worker' ? 'bg-emerald-600 text-white shadow-xs' : 'text-blue-200 hover:text-white'
                }`}
                title={isFrench ? 'Interface Agent Social' : 'واجهة المساعد الاجتماعي'}
              >
                {isFrench ? 'Agent Social' : 'المساعد'}
              </button>
              <button
                onClick={() => handleQuickSwitchRole('admin')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  currentUser.role === 'admin' ? 'bg-indigo-600 text-white shadow-xs' : 'text-blue-200 hover:text-white'
                }`}
                title={isFrench ? 'Interface Admin IT (Data)' : 'واجهة مسؤول الإعلامية'}
              >
                {isFrench ? 'Admin IT' : 'المشرف'}
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-900/60 hover:bg-blue-800 text-[11px] font-bold text-white transition border border-blue-400/30"
            >
              <Globe className="w-3 h-3 text-blue-300" />
              <span>{language === 'fr' ? 'العربية' : 'FR'}</span>
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-[11px] font-bold text-rose-200 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 px-2 py-0.5 rounded border border-rose-500/30 transition"
              title={isFrench ? 'Se déconnecter' : 'تسجيل الخروج'}
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">{isFrench ? 'Déconnexion' : 'خروج'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Website Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-3xl shadow-md border border-slate-200/80 overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[750px]">
            
            {/* =======================================================================
                LEFT SIDEBAR (Styled exactly as requested in the user's reference image)
                ======================================================================= */}
            <aside className="lg:col-span-3 border-r border-slate-200 p-5 sm:p-6 bg-white flex flex-col justify-between" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <div>
                {/* 1. Search Box at top of sidebar (Like in the photo: "Chercher 🔍") */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isFrench ? 'Chercher...' : 'بحث...'}
                      className="w-full pl-3 pr-9 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#0055a5] focus:outline-none focus:ring-1 focus:ring-[#0055a5] placeholder-slate-400 text-slate-700 bg-slate-50/50"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
                  </div>
                </div>

                {/* 2. "Menu" Heading with Red Underline Accent (Key visual feature in the photo) */}
                <div className="mb-3">
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                    {isFrench ? 'Menu' : 'القائمة'}
                  </h3>
                  <div className="h-[2.5px] w-9 bg-red-600 mt-1 rounded-full"></div>
                </div>

                {/* 3. Navigation Links in Royal Blue with Horizontal Dividers */}
                <nav className="space-y-0 text-xs sm:text-sm font-semibold">
                  
                  {/* Common Link: Actualités & Accueil */}
                  <button
                    onClick={() => setActiveNav('news')}
                    className={`w-full text-left py-2.5 px-1 border-b border-slate-100 flex items-center justify-between transition ${
                      activeNav === 'news'
                        ? 'text-[#0055a5] font-extrabold pl-2 border-l-4 border-l-[#0055a5]'
                        : 'text-[#0055a5] hover:text-[#003d75] hover:pl-1'
                    }`}
                  >
                    <span>{isFrench ? 'Actualités' : 'الأخبار والمستجدات'}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* ================= DEDICATED LINKS FOR EMPLOYEE ================= */}
                  {currentUser.role === 'employee' && (
                    <>
                      <button
                        onClick={() => setActiveNav('employee_space')}
                        className={`w-full text-left py-2.5 px-1 border-b border-slate-100 flex items-center justify-between transition ${
                          activeNav === 'employee_space'
                            ? 'text-[#0055a5] font-extrabold pl-2 border-l-4 border-l-[#0055a5]'
                            : 'text-[#0055a5] hover:text-[#003d75] hover:pl-1'
                        }`}
                      >
                        <span className="font-bold">{isFrench ? 'Mon Espace Collaborateur' : 'فضائي كموظف'}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => {
                          setActiveNav('employee_space');
                          setShowNewAppModal(true);
                        }}
                        className="w-full text-left py-2.5 px-1 border-b border-slate-100 flex items-center justify-between text-[#0055a5] hover:text-[#003d75] hover:pl-1 transition"
                      >
                        <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                          <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                          {isFrench ? 'Déposer une demande' : 'تقديم مطلب مساعدة'}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => setActiveNav('employee_space')}
                        className="w-full text-left py-2.5 px-1 border-b border-slate-100 flex items-center justify-between text-[#0055a5] hover:text-[#003d75] hover:pl-1 transition"
                      >
                        <span>{isFrench ? 'Mes dossiers en cours' : 'ملفاتي الجارية والمصروفة'}</span>
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {applications.filter(a => a.employeeId === currentUser.id).length}
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveNav('employee_space')}
                        className="w-full text-left py-2.5 px-1 border-b border-slate-100 flex items-center justify-between text-[#0055a5] hover:text-[#003d75] hover:pl-1 transition"
                      >
                        <span>{isFrench ? 'Barèmes & Éligibilité' : 'دليل المقاييس والشروط'}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => setActiveNav('employee_space')}
                        className="w-full text-left py-2.5 px-1 border-b border-slate-100 flex items-center justify-between text-[#0055a5] hover:text-[#003d75] hover:pl-1 transition"
                      >
                        <span>{isFrench ? 'Contacter l’Agent Social' : 'التواصل مع المساعد الاجتماعي'}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </>
                  )}

                  {/* ================= DEDICATED LINKS FOR SOCIAL WORKER ================= */}
                  {currentUser.role === 'social_worker' && (
                    <>
                      <button
                        onClick={() => setActiveNav('social_space')}
                        className={`w-full text-left py-2.5 px-1 border-b border-slate-100 flex items-center justify-between transition ${
                          activeNav === 'social_space'
                            ? 'text-[#0055a5] font-extrabold pl-2 border-l-4 border-l-[#0055a5]'
                            : 'text-[#0055a5] hover:text-[#003d75] hover:pl-1'
                        }`}
                      >
                        <span className="font-bold text-teal-800">{isFrench ? 'File d’Instruction Sociale' : 'ملفات قيد التحري'}</span>
                        <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {applications.filter(a => ['submitted', 'under_review', 'info_requested'].includes(a.status)).length}
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveNav('social_space')}
                        className="w-full text-left py-2.5 px-1 border-b border-slate-100 flex items-center justify-between text-[#0055a5] hover:text-[#003d75] hover:pl-1 transition"
                      >
                        <span>{isFrench ? 'Enquête & Pièces Médicales' : 'التدقيق الطبي والمالي'}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => setActiveNav('social_space')}
                        className="w-full text-left py-2.5 px-1 border-b border-slate-100 flex items-center justify-between text-[#0055a5] hover:text-[#003d75] hover:pl-1 transition"
                      >
                        <span>{isFrench ? 'Propositions d’Octroi' : 'مقترحات الإسناد'}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => setActiveNav('social_space')}
                        className="w-full text-left py-2.5 px-1 border-b border-slate-100 flex items-center justify-between text-[#0055a5] hover:text-[#003d75] hover:pl-1 transition"
                      >
                        <span>{isFrench ? 'Registre Historique TT' : 'سجل الملفات السابق'}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </>
                  )}

                  {/* ================= DEDICATED LINKS FOR IT ADMIN & DATA ANALYTICS ================= */}
                  {currentUser.role === 'admin' && (
                    <>
                      <button
                        onClick={() => setActiveNav('it_analytics_space')}
                        className={`w-full text-left py-2.5 px-1 border-b border-slate-100 flex items-center justify-between transition ${
                          activeNav === 'it_analytics_space'
                            ? 'text-[#0055a5] font-extrabold pl-2 border-l-4 border-l-[#0055a5]'
                            : 'text-[#0055a5] hover:text-[#003d75] hover:pl-1'
                        }`}
                      >
                        <span className="font-bold text-indigo-900">{isFrench ? 'Data Analytics & KPIs' : 'تحليل البيانات والإحصائيات'}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => setActiveNav('it_analytics_space')}
                        className="w-full text-left py-2.5 px-1 border-b border-slate-100 flex items-center justify-between text-[#0055a5] hover:text-[#003d75] hover:pl-1 transition"
                      >
                        <span>{isFrench ? 'Ventilation Budgétaire' : 'توزيع النفقات والميزانية'}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => setActiveNav('it_analytics_space')}
                        className="w-full text-left py-2.5 px-1 border-b border-slate-100 flex items-center justify-between text-[#0055a5] hover:text-[#003d75] hover:pl-1 transition"
                      >
                        <span>{isFrench ? 'Cartographie Régionale' : 'التوزيع الجغرافي بالأقاليم'}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => setActiveNav('it_analytics_space')}
                        className="w-full text-left py-2.5 px-1 border-b border-slate-100 flex items-center justify-between text-[#0055a5] hover:text-[#003d75] hover:pl-1 transition"
                      >
                        <span>{isFrench ? 'Journal d’Audit INPDP' : 'سجل الرقابة INPDP'}</span>
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-mono px-1.5 py-0.5 rounded">
                          {auditLogs.length}
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveNav('it_analytics_space')}
                        className="w-full text-left py-2.5 px-1 border-b border-slate-100 flex items-center justify-between text-[#0055a5] hover:text-[#003d75] hover:pl-1 transition"
                      >
                        <span>{isFrench ? 'Paramètres & Barèmes' : 'إعدادات المنظومة'}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </>
                  )}

                  {/* Authentication Link */}
                  <button
                    onClick={() => setShowAuthScreen(true)}
                    className="w-full text-left py-2.5 px-1 border-b border-slate-100 flex items-center justify-between text-slate-600 hover:text-[#0055a5] hover:pl-1 transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      {isFrench ? 'Portail d’Authentification' : 'بوابة تسجيل الدخول'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </nav>
              </div>

              {/* Sidebar Footer (Small legal text like in the image) */}
              <div className="mt-8 pt-4 border-t border-slate-200 text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-slate-500">
                  {isFrench ? '2026 — Direction Générale Tunisie Telecom' : '2026 — الإدارة العامة لاتصالات تونس'}
                </p>
                <div className="flex flex-wrap gap-x-2 text-[10px] text-slate-400">
                  <span className="hover:underline cursor-pointer">{isFrench ? 'Plan du site' : 'خريطة الموقع'}</span>
                  <span>•</span>
                  <span className="hover:underline cursor-pointer">{isFrench ? 'Mentions légales' : 'بيانات قانونية'}</span>
                  <span>•</span>
                  <span className="hover:underline cursor-pointer">{isFrench ? 'Conformité INPDP' : 'حماية المعطيات'}</span>
                </div>
              </div>
            </aside>

            {/* =======================================================================
                RIGHT MAIN CONTENT AREA (Header with title & logo, Banner, Content)
                ======================================================================= */}
            <main className="lg:col-span-9 p-6 sm:p-8 flex flex-col justify-between" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <div className="space-y-6">
                
                {/* 1. Header Bar: Large Institutional Title on Left + Emblem Logo on Right (As in the photo!) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#003d75] tracking-tight">
                      {isFrench 
                        ? 'Fonds d’Action Sociale & de Solidarité' 
                        : 'صندوق العمل الاجتماعي والتضامن'}
                    </h1>
                    <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                      {isFrench 
                        ? 'Société Nationale des Télécommunications — Tunisie Telecom' 
                        : 'الشركة الوطنية للاتصالات — اتصالات تونس'}
                    </p>
                  </div>

                  {/* Logo Badge on Right Side (Mirroring the SMISP logo in the user's laptop image) */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden md:block">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                        {isFrench ? 'Session Active' : 'المستخدم الحالي'}
                      </span>
                      <strong className="text-xs text-slate-800 font-bold block">{currentUser.name}</strong>
                      <span className="text-[10px] text-blue-700 font-mono font-semibold">
                        {currentUser.matricule} • {getRoleBadge(currentUser.role)}
                      </span>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#003d75] via-[#0055a5] to-[#e60000] p-0.5 shadow-md flex items-center justify-center">
                      <div className="w-full h-full bg-white rounded-[14px] flex flex-col items-center justify-center text-center p-1">
                        <HeartHandshake className="w-5 h-5 text-[#0055a5]" />
                        <span className="text-[9px] font-black text-[#e60000] tracking-tighter leading-none mt-0.5">TT SOC</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Hero Banner Photograph (Group of people together on green lawn outdoors in sunshine - matching the photo!) */}
                <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 group">
                  <img
                    src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&auto=format&fit=crop&q=80"
                    alt="Solidarité & Action Sociale Tunisie Telecom"
                    className="w-full h-44 sm:h-56 md:h-64 object-cover group-hover:scale-101 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded w-fit border border-emerald-500/30">
                      {isFrench ? 'Engagement Social & Bien-Être des Collaborateurs' : 'التضامن الاجتماعي والإحاطة بالأعوان'}
                    </span>
                    <h2 className="text-lg sm:text-2xl font-black mt-1.5 drop-shadow-sm text-white">
                      {isFrench 
                        ? 'Accompagnement, Prévoyance et Entraide au Quotidien' 
                        : 'المرافقة الاجتماعية والإحاطة العائلية والصحية'}
                    </h2>
                    <p className="text-xs text-slate-200 mt-0.5 max-w-xl hidden sm:block">
                      {isFrench
                        ? 'Des prestations sociales adaptées aux moments clés : aides médicales, prêts d’urgence, scolarité et événements familiaux.'
                        : 'منظومة إسناد المساعدات الاجتماعية ومرافقة أعوان اتصالات تونس وعائلاتهم.'}
                    </p>
                  </div>
                </div>

                {/* =======================================================================
                    3. DYNAMIC CONTENT SECTION ACCORDING TO USER NAVIGATION / ROLE
                    ======================================================================= */}

                {/* VIEW 1: ACTUALITÉS / ACCUEIL (Matching the news card in the photo) */}
                {activeNav === 'news' && (
                  <div className="space-y-6">
                    {/* Section Title with Red Underline Accent (Direct match to image) */}
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-[#003d75] tracking-tight">
                        {isFrench ? 'Dernières actualités' : 'آخر المستجدات والإعلانات'}
                      </h2>
                      <div className="h-[2.5px] w-10 bg-red-600 mt-1 rounded-full"></div>
                    </div>

                    {/* News Article / Campaign Card */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-3">
                      <div className="text-xs text-slate-400 font-semibold flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{isFrench ? 'Mercredi 18 Septembre 2026' : 'الأربعاء 18 سبتمبر 2026'}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2 max-w-2xl">
                          <h3 className="text-base sm:text-lg font-bold text-[#003d75] leading-snug">
                            {isFrench 
                              ? 'Campagne Annuelle des Aides Sociales & Prêts d’Urgence 2026' 
                              : 'انطلاق الحملة السنوية للمساعدات الاجتماعية والقروض الاستعجالية 2026'}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {isFrench
                              ? 'La Direction Centrale du Capital Humain de Tunisie Telecom informe l’ensemble des collaborateurs de l’ouverture de la plateforme numérique pour le dépôt des dossiers d’aides médicales, de bourses d’études et de secours d’urgence. La dématérialisation garantit un traitement accéléré sous 4 à 7 jours ouvrables et une traçabilité totale.'
                              : 'تعلم الإدارة المركزية لرأس المال البشري كافة أعوان الشركة عن فتح باب إيداع مطالب المساعدات الاجتماعية عبر المنصة الرقمية الموحدة لضمان سرعة المعالجة والشفافية التامة.'}
                          </p>
                        </div>

                        <div className="shrink-0 flex sm:flex-col gap-2">
                          <button
                            onClick={() => {
                              if (currentUser.role === 'employee') {
                                setActiveNav('employee_space');
                                setShowNewAppModal(true);
                              } else if (currentUser.role === 'social_worker') {
                                setActiveNav('social_space');
                              } else {
                                setActiveNav('it_analytics_space');
                              }
                            }}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-[#0055a5] hover:text-[#003d75] border border-[#0055a5] hover:bg-blue-50 transition text-center"
                          >
                            {isFrench ? 'Accéder à mon espace' : 'الدخول إلى فضائي'}
                          </button>
                          
                          {currentUser.role === 'employee' && (
                            <button
                              onClick={() => {
                                setActiveNav('employee_space');
                                setShowNewAppModal(true);
                              }}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition text-center shadow-xs"
                            >
                              {isFrench ? 'Déposer un dossier' : 'إيداع مطلب'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div 
                        onClick={() => handleQuickSwitchRole('employee')}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-xs transition cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold mb-2">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{isFrench ? 'Espace Employé' : 'فضاء الموظف'}</h4>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {isFrench ? 'Dépôt direct de demandes et suivi en temps réel' : 'إيداع المطالب والمتابعة الحينية'}
                        </p>
                      </div>

                      <div 
                        onClick={() => handleQuickSwitchRole('social_worker')}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-400 hover:shadow-xs transition cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-2">
                          <FileText className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{isFrench ? 'Espace Agent Social' : 'فضاء المساعد الاجتماعي'}</h4>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {isFrench ? 'Instruction, analyse des pièces et propositions d’octroi' : 'دراسة الملفات والتحري الاجتماعي'}
                        </p>
                      </div>

                      <div 
                        onClick={() => handleQuickSwitchRole('admin')}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold mb-2">
                          <BarChart3 className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{isFrench ? 'Espace Admin IT (Data)' : 'فضاء مسؤول الإعلامية'}</h4>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {isFrench ? 'Data analytics, indicateurs décisionnels et export CSV' : 'تحليل البيانات ومؤشرات الأداء واستخراج التقارير'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* VIEW 2: DEDICATED EMPLOYEE INTERFACE */}
                {activeNav === 'employee_space' && currentUser.role === 'employee' && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-[#003d75] tracking-tight flex items-center gap-2">
                        <span>{isFrench ? 'Mon Espace Collaborateur TT' : 'فضائي كموظف باتصالات تونس'}</span>
                        <span className="text-xs font-normal text-slate-400">({currentUser.name} - {currentUser.matricule})</span>
                      </h2>
                      <div className="h-[2.5px] w-10 bg-red-600 mt-1 rounded-full"></div>
                    </div>

                    <EmployeeDashboard
                      currentUser={currentUser}
                      applications={applications}
                      categories={categories}
                      onOpenNewApplication={() => setShowNewAppModal(true)}
                      onSelectApplication={(app) => setSelectedAppForDetail(app)}
                      language={language}
                    />
                  </div>
                )}

                {/* VIEW 3: DEDICATED SOCIAL WORKER INTERFACE */}
                {activeNav === 'social_space' && (currentUser.role === 'social_worker' || currentUser.role === 'social_manager') && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-[#003d75] tracking-tight flex items-center gap-2">
                        <span>{isFrench ? 'Espace Instruction Sociale' : 'فضاء المساعد الاجتماعي والتحري'}</span>
                        <span className="text-xs font-normal text-slate-400">({currentUser.name} - Assistante Sociale Principale)</span>
                      </h2>
                      <div className="h-[2.5px] w-10 bg-red-600 mt-1 rounded-full"></div>
                    </div>

                    <SocialWorkerDashboard
                      currentUser={currentUser}
                      applications={applications}
                      categories={categories}
                      onReviewCase={(app) => setSelectedAppForReview(app)}
                      language={language}
                    />
                  </div>
                )}

                {/* VIEW 4: DEDICATED IT ADMIN & DATA ANALYTICS INTERFACE */}
                {activeNav === 'it_analytics_space' && currentUser.role === 'admin' && (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-[#003d75] tracking-tight flex items-center gap-2">
                        <span>{isFrench ? 'Espace Administration IT & Data Analytics' : 'فضاء إدارة النظم والمعلوماتية وتحليل البيانات'}</span>
                        <span className="text-xs font-normal text-slate-400">({currentUser.name} - DSI / Data)</span>
                      </h2>
                      <div className="h-[2.5px] w-10 bg-red-600 mt-1 rounded-full"></div>
                    </div>

                    <ITDataAnalyticsDashboard
                      currentUser={currentUser}
                      applications={applications}
                      categories={categories}
                      auditLogs={auditLogs}
                      language={language}
                    />
                  </div>
                )}

                {/* If role mismatch with activeNav, show helpful notice and switcher */}
                {((activeNav === 'employee_space' && currentUser.role !== 'employee') ||
                  (activeNav === 'social_space' && currentUser.role !== 'social_worker' && currentUser.role !== 'social_manager') ||
                  (activeNav === 'it_analytics_space' && currentUser.role !== 'admin')) && (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                    <AlertCircle className="w-8 h-8 text-blue-600 mx-auto" />
                    <h3 className="font-bold text-sm text-slate-800">
                      {isFrench 
                        ? 'Changement de profil requis pour accéder à cette interface' 
                        : 'يتطلب الدخول إلى هذه الواجهة تغيير المستخدم النشط'}
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      {isFrench
                        ? 'Vous êtes actuellement connecté en tant que ' + currentUser.name + ' (' + getRoleBadge(currentUser.role) + '). Cliquez ci-dessous pour basculer vers le profil correspondant :'
                        : 'أنت متصل حالياً باسم ' + currentUser.name + ' (' + getRoleBadge(currentUser.role) + ').'}
                    </p>
                    <div className="pt-2">
                      {activeNav === 'employee_space' && (
                        <button
                          onClick={() => handleQuickSwitchRole('employee')}
                          className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-800"
                        >
                          {isFrench ? 'Basculer vers le profil Employé' : 'التحويل إلى حساب الموظف'}
                        </button>
                      )}
                      {activeNav === 'social_space' && (
                        <button
                          onClick={() => handleQuickSwitchRole('social_worker')}
                          className="px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-teal-800"
                        >
                          {isFrench ? 'Basculer vers le profil Agent Social' : 'التحويل إلى حساب المساعد الاجتماعي'}
                        </button>
                      )}
                      {activeNav === 'it_analytics_space' && (
                        <button
                          onClick={() => handleQuickSwitchRole('admin')}
                          className="px-4 py-2 bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-indigo-800"
                        >
                          {isFrench ? 'Basculer vers le profil Admin IT' : 'التحويل إلى حساب المشرف الإعلامي'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </main>

          </div>
        </div>
      </div>

      {/* =======================================================================
          MODALS
          ======================================================================= */}

      {/* MODAL 1: NEW APPLICATION WIZARD (FOR EMPLOYEES) */}
      {showNewAppModal && (
        <NewApplicationModal
          currentUser={currentUser}
          categories={categories}
          onClose={() => setShowNewAppModal(false)}
          onSubmitApplication={handleCreateApplication}
          language={language}
        />
      )}

      {/* MODAL 2: APPLICATION DETAIL VIEW (FOR EMPLOYEES) */}
      {selectedAppForDetail && (
        <ApplicationDetailModal
          application={selectedAppForDetail}
          currentUser={currentUser}
          onClose={() => setSelectedAppForDetail(null)}
          onAddComment={handleAddComment}
          onUploadComplementaryDoc={handleUploadComplementaryDoc}
          onViewOfficialDoc={(app, docType) => setOfficialDocPreview({ app, docType })}
          language={language}
        />
      )}

      {/* MODAL 3: CASE REVIEW & PROPOSAL (FOR SOCIAL WORKERS) */}
      {selectedAppForReview && (
        <CaseReviewModal
          application={selectedAppForReview}
          currentUser={currentUser}
          onClose={() => setSelectedAppForReview(null)}
          onUpdateStatus={handleUpdateStatus}
          onAddComment={handleAddComment}
          onRequestSupplement={handleRequestSupplement}
          onSubmitProposal={handleSubmitProposal}
          onViewOfficialDoc={(app, docType) => setOfficialDocPreview({ app, docType })}
          language={language}
        />
      )}

      {/* MODAL 4: OFFICIAL DOCUMENT PRINT PREVIEW (RECEIPT OR DECISION) */}
      {officialDocPreview && (
        <DocumentPreviewModal
          application={officialDocPreview.app}
          docType={officialDocPreview.docType}
          onClose={() => setOfficialDocPreview(null)}
          language={language}
        />
      )}
    </div>
  );
}
