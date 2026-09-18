import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  ChevronRight, 
  Eye, 
  UserCheck, 
  FolderCheck,
  Send,
  SlidersHorizontal,
  Download
} from 'lucide-react';
import { AssistanceApplication, AssistanceCategory, User, Language } from '../../types';
import { translations } from '../../translations';

interface SocialWorkerDashboardProps {
  currentUser: User;
  applications: AssistanceApplication[];
  categories: AssistanceCategory[];
  onReviewCase: (app: AssistanceApplication) => void;
  language?: Language;
}

export const SocialWorkerDashboard: React.FC<SocialWorkerDashboardProps> = ({
  currentUser,
  applications,
  categories,
  onReviewCase,
  language = 'ar'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const t = translations[language];

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      app.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.employeeMatricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || app.categoryId === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus;
    const matchesRegion = selectedRegion === 'all' || app.employeeRegion.includes(selectedRegion);

    return matchesSearch && matchesCategory && matchesStatus && matchesRegion;
  });

  // Metrics
  const activeCasesCount = applications.filter(a => ['submitted', 'under_review', 'info_requested'].includes(a.status)).length;
  const readyForValidationCount = applications.filter(a => a.status === 'pending_validation').length;
  const urgentlyNeededCount = applications.filter(a => a.priority === 'urgent' && a.status !== 'closed').length;

  const getStatusBadge = (status: AssistanceApplication['status']) => {
    switch (status) {
      case 'submitted':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">{t.status.submitted}</span>;
      case 'under_review':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">{t.status.under_review}</span>;
      case 'info_requested':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">{t.status.info_requested}</span>;
      case 'pending_validation':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">{t.status.pending_validation}</span>;
      case 'approved':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">{t.status.approved}</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">{t.status.rejected}</span>;
      case 'closed':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">{t.status.closed}</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-medium mb-2 border border-white/20">
            <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>
              {language === 'ar' 
                ? `فضاء المساعد(ة) الاجتماعي(ة) • ${currentUser.name}`
                : `Espace Assistante Sociale • ${currentUser.name}`}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            {language === 'ar' ? 'معالجة وتدقيق مطالب المساعدة الاجتماعية' : 'File d’Instruction Sociale'}
          </h1>
          <p className="text-xs text-emerald-100 mt-1 max-w-xl">
            {language === 'ar'
              ? 'مراجعة المؤيدات والتقارير الطبية، طلب الاستكمالات، وصياغة مقترحات الإسناد للمصادقة.'
              : 'Vérification des pièces justificatives, demandes de compléments et propositions d’attribution.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15 text-center min-w-[100px]">
            <span className="text-[10px] text-emerald-200 block">
              {language === 'ar' ? 'الملفات النشطة' : 'Dossiers actifs'}
            </span>
            <span className="text-xl font-black text-white">{activeCasesCount}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15 text-center min-w-[100px]">
            <span className="text-[10px] text-emerald-200 block">
              {language === 'ar' ? 'جاهز للتأشيرة' : 'À valider'}
            </span>
            <span className="text-xl font-black text-emerald-200">{readyForValidationCount}</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`w-4 h-4 text-slate-400 absolute top-3 ${language === 'ar' ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              placeholder={language === 'ar' ? 'البحث بالاسم، المعرف المالي، أو رقم الملف...' : 'Recherche par nom, matricule, référence...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                language === 'ar' ? 'pr-9 pl-3' : 'pl-9 pr-3'
              }`}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">{language === 'ar' ? 'جميع الحالات' : 'Tous les statuts'}</option>
              <option value="submitted">{t.status.submitted}</option>
              <option value="under_review">{t.status.under_review}</option>
              <option value="info_requested">{t.status.info_requested}</option>
              <option value="pending_validation">{t.status.pending_validation}</option>
              <option value="approved">{t.status.approved}</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">{language === 'ar' ? 'جميع الأصناف' : 'Toutes les prestations'}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {language === 'ar' ? (c.titleAr || c.title) : c.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="font-bold text-xs text-slate-800">
            {language === 'ar' ? `نتائج البحث (${filteredApps.length} ملف)` : `Résultats (${filteredApps.length} dossiers)`}
          </span>
        </div>

        {filteredApps.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            {language === 'ar' ? 'لا توجد ملفات تطابق معايير البحث.' : 'Aucun dossier ne correspond aux filtres.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="p-4 sm:p-5 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {app.referenceNumber}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{app.employeeName}</span>
                    <span className="text-xs text-slate-500">({app.employeeMatricule})</span>
                    {getStatusBadge(app.status)}
                    {app.priority === 'urgent' && (
                      <span className="bg-rose-100 text-rose-800 font-bold text-[10px] px-1.5 py-0.2 rounded">
                        {language === 'ar' ? 'مستعجل' : 'Urgent'}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-emerald-800">{app.categoryTitle}</span>
                    <span> • </span>
                    <span>{app.subject}</span>
                    <span> • </span>
                    <span className="text-slate-400">{app.employeeDepartment}</span>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    {language === 'ar' ? 'المبلغ المطلوب:' : 'Demandé :'} {app.requestedAmountTND || '-'} {t.currencyTND}
                    <span> • </span>
                    {language === 'ar' ? 'عدد المؤيدات:' : 'Pièces :'} {app.documents.length}
                    <span> • </span>
                    {new Date(app.createdAt).toLocaleDateString(language === 'ar' ? 'ar-TN' : 'fr-FR')}
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => onReviewCase(app)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-2xs flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'دراسة وتدقيق الملف' : 'Instruire'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
