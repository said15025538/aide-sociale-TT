import React, { useState } from 'react';
import { 
  PlusCircle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileQuestion, 
  Download, 
  ExternalLink,
  ChevronRight,
  Shield,
  HelpCircle,
  Calendar,
  Building,
  UserCheck,
  HeartHandshake,
  Sparkles,
  Printer,
  ChevronDown,
  Info
} from 'lucide-react';
import { User, AssistanceApplication, AssistanceCategory, Language } from '../../types';
import { translations } from '../../translations';

interface EmployeeDashboardProps {
  currentUser: User;
  applications: AssistanceApplication[];
  categories: AssistanceCategory[];
  language: Language;
  onOpenNewApplication: () => void;
  onSelectApplication: (app: AssistanceApplication) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  currentUser,
  applications,
  categories,
  language,
  onOpenNewApplication,
  onSelectApplication
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'guide' | 'faq'>('requests');
  const [selectedSimCategory, setSelectedSimCategory] = useState<string>(categories[0]?.id || '');
  const t = translations[language];

  // Applications belonging to this employee
  const myApps = applications.filter(a => a.employeeId === currentUser.id);

  // Key metrics
  const totalCount = myApps.length;
  const inProgressCount = myApps.filter(a => ['submitted', 'under_review', 'info_requested', 'pending_validation'].includes(a.status)).length;
  const approvedCount = myApps.filter(a => ['approved', 'closed'].includes(a.status)).length;
  const totalReceivedTND = myApps
    .filter(a => a.finalAmountTND && ['approved', 'closed'].includes(a.status))
    .reduce((acc, curr) => acc + (curr.finalAmountTND || 0), 0);

  // Check if any app needs urgent employee attention (supplementary documents requested)
  const pendingAttentionApp = myApps.find(a => a.status === 'info_requested');

  const simCat = categories.find(c => c.id === selectedSimCategory) || categories[0];

  const getStatusBadge = (status: AssistanceApplication['status']) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {t.status.draft}
          </span>
        );
      case 'submitted':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
            {t.status.submitted}
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 ml-1 mr-1" />
            {t.status.under_review}
          </span>
        );
      case 'info_requested':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300 animate-pulse">
            <AlertCircle className="w-3 h-3 ml-1 mr-1" />
            {t.status.info_requested}
          </span>
        );
      case 'pending_validation':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
            {t.status.pending_validation}
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 ml-1 mr-1 text-emerald-600" />
            {t.status.approved}
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            {t.status.rejected}
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
            {t.status.closed}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
            {status}
          </span>
        );
    }
  };

  const getCategoryTitle = (cat: AssistanceCategory) => {
    if (language === 'ar') return cat.titleAr || cat.title;
    return cat.title;
  };

  return (
    <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* 1. Welcoming Banner in Fresh Emerald & Warm Gold */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-medium mb-3 border border-white/20">
            <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>
              {language === 'ar' 
                ? `فضاء الموظف • المعرف الإداري: ${currentUser.matricule}`
                : `Espace Collaborateur • Matricule ${currentUser.matricule}`}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'ar' 
              ? `أهلاً وسهلاً، ${currentUser.name}`
              : `Bienvenue, ${currentUser.name}`}
          </h1>

          <p className="mt-2 text-sm text-emerald-100 leading-relaxed">
            {language === 'ar'
              ? `${currentUser.department} • مصلحة العمل الاجتماعي لاتصالات تونس على ذمتكم لمرافقتكم ومساندتكم في مختلف الظروف العائلية والصحية بكل أمان وسرية.`
              : `${currentUser.department} • Le service social de Tunisie Telecom vous accompagne en toute confidentialité dans vos moments de vie.`}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewApplication}
              className="inline-flex items-center gap-2 bg-white text-emerald-800 hover:bg-emerald-50 font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>{t.newApplication}</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className="inline-flex items-center gap-2 bg-emerald-900/40 hover:bg-emerald-900/60 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition border border-emerald-500/30"
            >
              <FileText className="w-4 h-4 text-emerald-200" />
              <span>{t.consultGuides}</span>
            </button>
          </div>
        </div>

        {/* Decorative Graphic Element */}
        <div className="absolute left-4 sm:left-12 -bottom-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute left-24 -top-8 w-32 h-32 rounded-full bg-emerald-400/10 blur-xl pointer-events-none" />
      </div>

      {/* 2. Urgent Attention Alert (If documents are requested) */}
      {pendingAttentionApp && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-rose-900">
                {language === 'ar' 
                  ? `مطلوب وثائق تكميلية لمطلبك رقم ${pendingAttentionApp.referenceNumber}`
                  : `Pièces requises pour le dossier ${pendingAttentionApp.referenceNumber}`}
              </div>
              <p className="text-xs text-rose-700 mt-0.5">
                {language === 'ar'
                  ? 'طلبت المساعدة الاجتماعية وثائق إضافية لمواصلة دراسة ملفك وصرف المساعدة في أقرب الآجال.'
                  : 'L’assistante sociale requiert des pièces complémentaires pour finaliser l’instruction.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectApplication(pendingAttentionApp)}
            className="shrink-0 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
          >
            {language === 'ar' ? 'إضافة الوثائق الآن' : 'Compléter mon dossier'}
          </button>
        </div>
      )}

      {/* 3. Four Clean KPI Cards in Soft Palette */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t.kpiTotalRequests}</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">{totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {language === 'ar' ? 'كامل مسار المساعدات' : 'Historique total'}
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-amber-200 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t.kpiInProgress}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-600">{inProgressCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {language === 'ar' ? 'متوسط المعالجة: 5 أيام' : 'Délai moyen SLA : 5j'}
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-emerald-200 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t.kpiApproved}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-600">{approvedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {language === 'ar' ? 'موافقة وتأشيرة نهائية' : 'Décision favorable'}
          </div>
        </div>

        {/* Disbursed Amount */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-teal-200 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>{t.kpiDisbursedTND}</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-teal-800">
            {totalReceivedTND} <span className="text-sm font-semibold">{t.currencyTND}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {language === 'ar' ? 'تحويلات بنكية تمت' : 'Virements effectués'}
          </div>
        </div>
      </div>

      {/* 4. Simplified Tab Bar */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex space-x-2">
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition ${
            activeTab === 'requests'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.tabMyRequests} ({myApps.length})
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition ${
            activeTab === 'guide'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.tabGuideScales} ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition ${
            activeTab === 'faq'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.tabHelpFaq}
        </button>
      </div>

      {/* 5. TAB CONTENT */}

      {/* TAB 1: MY REQUESTS */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              {language === 'ar' ? 'سجل المطالب والمتابعة' : 'Historique des dossiers'}
            </h2>
            <button
              onClick={onOpenNewApplication}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.newApplication}</span>
            </button>
          </div>

          {myApps.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <FileQuestion className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">{t.noRequestsYet}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {t.depositFirstPrompt}
              </p>
              <button
                onClick={onOpenNewApplication}
                className="mt-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs"
              >
                {t.depositNewRequest}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {myApps.map((app) => (
                <div
                  key={app.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {app.referenceNumber}
                      </span>
                      <span className="font-bold text-sm text-slate-900">
                        {app.subject}
                      </span>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                      <span>{app.categoryTitle}</span>
                      <span>•</span>
                      <span>
                        {language === 'ar' ? 'تاريخ الإيداع:' : 'Déposé le :'} {new Date(app.createdAt).toLocaleDateString(language === 'ar' ? 'ar-TN' : 'fr-FR')}
                      </span>
                      {app.requestedAmountTND && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">
                            {language === 'ar' ? 'المبلغ المطلوب:' : 'Demandé :'} {app.requestedAmountTND} {t.currencyTND}
                          </span>
                        </>
                      )}
                      {app.finalAmountTND && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-emerald-700">
                            {language === 'ar' ? 'المبلغ الممنوح:' : 'Accordé :'} {app.finalAmountTND} {t.currencyTND}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onSelectApplication(app)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-2xs flex items-center gap-1.5"
                    >
                      <span>{t.actionViewDetails}</span>
                      <ChevronRight className={`w-3.5 h-3.5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AID CATEGORIES & ELIGIBILITY */}
      {activeTab === 'guide' && (
        <div className="space-y-6">
          {/* Quick Category Simulator */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>{language === 'ar' ? 'حاسبة ومستكشف سقف المساعدة' : 'Simulateur & Plafond de prise en charge'}</span>
            </div>
            <p className="text-xs text-emerald-800 mb-3">
              {language === 'ar'
                ? 'اختر نوع المساعدة للاطلاع على أقصى سقف مالي، والآجال التقديرية، والوثائق المطلوبة قانونياً.'
                : 'Sélectionnez une catégorie pour consulter son plafond et les pièces justificatives requises.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <select
                  value={selectedSimCategory}
                  onChange={(e) => setSelectedSimCategory(e.target.value)}
                  className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {getCategoryTitle(c)} ({c.ceilingAmountTND} {t.currencyTND})
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-white rounded-xl p-2.5 border border-emerald-200 text-center flex flex-col justify-center">
                <span className="text-[10px] text-slate-500">{language === 'ar' ? 'السقف الأقصى التقديري' : 'Plafond d’aide'}</span>
                <span className="text-base font-black text-emerald-800">
                  {simCat.ceilingAmountTND} {t.currencyTND}
                </span>
              </div>
            </div>
          </div>

          {/* Grid of all categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:border-emerald-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {cat.code}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 mt-1">
                        {getCategoryTitle(cat)}
                      </h3>
                    </div>
                    <div className="bg-emerald-50 text-emerald-800 font-extrabold text-xs px-2.5 py-1 rounded-xl border border-emerald-200 shrink-0">
                      {cat.ceilingAmountTND} {t.currencyTND}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div className="text-[11px] font-bold text-slate-700">
                      {language === 'ar' ? 'الوثائق والمؤيدات المطلوبة:' : 'Documents exigés :'}
                    </div>
                    <ul className="text-xs text-slate-500 space-y-1">
                      {cat.requiredDocuments.map((doc) => (
                        <li key={doc.id} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                          <span>{doc.name}</span>
                          {doc.isMandatory && (
                            <span className="text-[9px] text-rose-600 font-bold">
                              ({language === 'ar' ? 'إجباري' : 'obligatoire'})
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    {language === 'ar' 
                      ? `الأجل التقديري للدراسة: ${cat.slaDays} أيام`
                      : `Délai SLA d’instruction : ${cat.slaDays} jours`}
                  </span>
                  <button
                    onClick={onOpenNewApplication}
                    className="text-emerald-700 font-bold hover:text-emerald-900 flex items-center gap-1"
                  >
                    <span>{language === 'ar' ? 'طلب هذه الإعانة' : 'Demander'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FAQ & SUPPORT */}
      {activeTab === 'faq' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-2">
            {language === 'ar' ? 'الأسئلة الشائعة ومعلومات الاتصال بالمصلحة الاجتماعية' : 'Foire aux Questions & Contact'}
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 mb-1">
                {language === 'ar' 
                  ? 'كيف تتم دراسة الملفات وما هي آجال الرد؟' 
                  : 'Comment sont examinés les dossiers et quels sont les délais ?'}
              </div>
              <p className="text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'تتولى المساعدة الاجتماعية مراجعة المؤيدات والوثائق في ظرف 3 إلى 7 أيام عمل. فور استكمال الملف، يُعرض على رئيس المصلحة واللجنة للمصادقة وتأشيرة الصرف.'
                  : 'L’assistante sociale vérifie les pièces sous 3 à 7 jours ouvrés avant transmission au responsable pour validation.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 mb-1">
                {language === 'ar' 
                  ? 'هل المعطيات الطبية والاجتماعية سرية ومحمية؟' 
                  : 'Mes données médicales sont-elles confidentielles ?'}
              </div>
              <p className="text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'نعم، جميع التقارير الطبية مشفرة بنظام AES-256 ولا يطلع عليها سوى المساعد الاجتماعي المختص طبقاً للقانون عدد 63 لسنة 2004 المتعلق بحماية المعطيات الشخصية (INPDP).'
                  : 'Oui, tous les documents médicaux sont chiffrés et accessibles exclusivement au personnel social qualifié selon la loi INPDP.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 mb-1">
                {language === 'ar' 
                  ? 'الاتصال المباشر بالمساعدة الاجتماعية المكلفة بجهتك' 
                  : 'Contact direct des assistantes sociales'}
              </div>
              <p className="text-slate-600 leading-relaxed">
                {language === 'ar'
                  ? 'الهاتف الداخلي المباشر: 234 001 71 (موزع تونس الكبرى) أو عبر البريد الإلكتروني الداخلي: action.sociale@tunisietelecom.tn'
                  : 'Poste interne direct : 71 001 234 ou par e-mail : action.sociale@tunisietelecom.tn'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
