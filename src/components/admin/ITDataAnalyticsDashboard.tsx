import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Users, 
  MapPin, 
  FileCheck2,
  Calendar,
  Sparkles,
  Download,
  Filter,
  Search,
  ShieldCheck,
  Server,
  Layers,
  Database,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { AssistanceApplication, AssistanceCategory, AuditLog, User, Language } from '../../types';

interface ITDataAnalyticsDashboardProps {
  currentUser: User;
  applications: AssistanceApplication[];
  categories: AssistanceCategory[];
  auditLogs: AuditLog[];
  onUpdateCategory?: (cat: AssistanceCategory) => void;
  language?: Language;
}

export const ITDataAnalyticsDashboard: React.FC<ITDataAnalyticsDashboardProps> = ({
  currentUser,
  applications,
  categories,
  auditLogs,
  onUpdateCategory,
  language = 'fr'
}) => {
  const isFrench = language === 'fr';
  const [activeSubTab, setActiveSubTab] = useState<'bi' | 'distribution' | 'geography' | 'audit' | 'config'>('bi');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  // Core metrics calculations
  const totalApps = applications.length;
  const approvedApps = applications.filter(a => ['approved', 'closed'].includes(a.status)).length;
  const underReviewApps = applications.filter(a => ['submitted', 'under_review', 'info_requested', 'pending_validation'].includes(a.status)).length;
  const rejectedApps = applications.filter(a => a.status === 'rejected').length;

  const totalGrantedTND = applications
    .filter(a => a.finalAmountTND && ['approved', 'closed'].includes(a.status))
    .reduce((acc, curr) => acc + (curr.finalAmountTND || 0), 0) + 245000;

  const annualBudgetTND = 500000;
  const budgetConsumedPct = Math.round((totalGrantedTND / annualBudgetTND) * 100);

  // Category stats
  const categoryStats = categories.map(cat => {
    const count = applications.filter(a => a.categoryId === cat.id).length;
    const approvedCount = applications.filter(a => a.categoryId === cat.id && ['approved', 'closed'].includes(a.status)).length;
    const amount = applications
      .filter(a => a.categoryId === cat.id && a.finalAmountTND)
      .reduce((acc, curr) => acc + (curr.finalAmountTND || 0), 0) + (cat.code === 'AIDE_MED' ? 84000 : cat.code === 'PRET_URG' ? 62000 : 35000);
    return {
      ...cat,
      count: count + (cat.code === 'AIDE_MED' ? 42 : cat.code === 'PRET_URG' ? 28 : 18),
      approvedCount: approvedCount + (cat.code === 'AIDE_MED' ? 38 : cat.code === 'PRET_URG' ? 25 : 15),
      amount
    };
  });

  const totalCalculatedApps = categoryStats.reduce((sum, c) => sum + c.count, 0);

  // Regions
  const regions = [
    { name: isFrench ? 'District Grand Tunis' : 'إقليم تونس الكبرى', count: 68, pct: 46, budget: '142 500 TND', sla: '3.8 j' },
    { name: isFrench ? 'Direction Régionale Centre (Sousse / Monastir)' : 'الإدارة الجهوية للوسط (سوسة / المنستير)', count: 36, pct: 24, budget: '78 200 TND', sla: '4.1 j' },
    { name: isFrench ? 'Direction Régionale Sud (Sfax / Gabès)' : 'الإدارة الجهوية للجنوب (صفاقس / قابس)', count: 28, pct: 19, budget: '61 400 TND', sla: '4.5 j' },
    { name: isFrench ? 'Direction Régionale Nord (Bizerte / Béja)' : 'الإدارة الجهوية للشمال (بنزرت / باجة)', count: 16, pct: 11, budget: '30 350 TND', sla: '4.4 j' }
  ];

  // CSV Export simulator
  const handleExportCSV = () => {
    const headers = 'Reference,Date,Collaborateur,Direction,Categorie,Montant_Demande_TND,Montant_Accorde_TND,Statut\n';
    const rows = applications.map(a => 
      `"${a.referenceNumber}","${a.createdAt.split('T')[0]}","${a.employeeName}","${a.employeeRegion}","${a.categoryTitle}",${a.requestedAmountTND},${a.finalAmountTND || 0},"${a.status}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Extraction_Analytique_TT_Social_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotification(isFrench ? 'Extraction CSV générée et téléchargée avec succès !' : 'تم استخراج وتنزيل ملف CSV الإحصائي بنجاح !');
    setTimeout(() => setExportNotification(null), 4000);
  };

  return (
    <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-indigo-500/20 text-indigo-300 font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              {isFrench ? 'Département IT • Gouvernance & Data Analytics' : 'إدارة النظم المعلوماتية • تحليل البيانات والحوكمة'}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">•</span>
            <span className="text-xs text-emerald-400 font-semibold hidden sm:inline flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {isFrench ? 'Flux de données synchronisé en temps réel' : 'مزامنة مباشرة للمعطيات'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
            {isFrench 
              ? 'Pilotage Décisionnel & Analyse des Données Sociales TT' 
              : 'لوحة القيادة والتحليل الإحصائي للعمل الاجتماعي'}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {isFrench
              ? 'Tableau de bord centralisé pour l’analyse multidimensionnelle des prestations, du suivi budgétaire, des délais SLA et de la conformité INPDP.'
              : 'منظومة مركزية لتحليل البيانات وتوزيع المساعدات ومتابعة استهلاك الميزانية والامتثال القانوني.'}
          </p>
        </div>

        {/* Action Button: Export CSV */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
          >
            <Download className="w-4 h-4" />
            <span>{isFrench ? 'Exporter les Données (CSV)' : 'تصدير البيانات (CSV)'}</span>
          </button>
        </div>
      </div>

      {exportNotification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs flex items-center gap-2 font-bold shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotification}</span>
        </div>
      )}

      {/* Sub-tabs for IT Analyst */}
      <div className="border-b border-slate-200">
        <nav className="flex flex-wrap gap-4 sm:gap-6">
          <button
            onClick={() => setActiveSubTab('bi')}
            className={`pb-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeSubTab === 'bi'
                ? 'border-indigo-700 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{isFrench ? 'Tableau de Bord BI & KPIs' : 'مؤشرات الأداء الرئيسية (BI)'}</span>
          </button>
          <button
            onClick={() => setActiveSubTab('distribution')}
            className={`pb-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeSubTab === 'distribution'
                ? 'border-indigo-700 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isFrench ? 'Analyse par Prestation' : 'التوزيع حسب نوع المساعدة'}</span>
          </button>
          <button
            onClick={() => setActiveSubTab('geography')}
            className={`pb-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeSubTab === 'geography'
                ? 'border-indigo-700 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{isFrench ? 'Répartition Régionale TT' : 'التوزيع الجغرافي والأقاليم'}</span>
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`pb-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeSubTab === 'audit'
                ? 'border-indigo-700 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isFrench ? `Journal d’Audit INPDP (${auditLogs.length})` : `سجل التتبع والرقابة (${auditLogs.length})`}</span>
          </button>
          <button
            onClick={() => setActiveSubTab('config')}
            className={`pb-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeSubTab === 'config'
                ? 'border-indigo-700 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{isFrench ? 'Paramétrage Barèmes & Règles' : 'إعدادات المقاييس والأسقف'}</span>
          </button>
        </nav>
      </div>

      {/* TAB 1: EXECUTIVE BI & METRICS */}
      {activeSubTab === 'bi' && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Budget Mandaté */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>{isFrench ? 'Budget Social Alloué / Consommé' : 'الميزانية الاجتماعية المستهلكة'}</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {totalGrantedTND.toLocaleString()} <span className="text-xs font-bold text-slate-500">TND</span>
              </div>
              <div className="mt-2.5">
                <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>{isFrench ? 'Taux de consommation :' : 'نسبة الاستهلاك :'}</span>
                  <span className="font-bold text-emerald-700">{budgetConsumedPct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${budgetConsumedPct}%` }}></div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                {isFrench ? `Plafond annuel voté : ${annualBudgetTND.toLocaleString()} TND` : `السقف السنوي المرصود : ${annualBudgetTND.toLocaleString()} د.ت`}
              </div>
            </div>

            {/* KPI 2: SLA Instruction */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>{isFrench ? 'Délai Moyen d’Instruction (SLA)' : 'متوسط أجل المعالجة'}</span>
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                4.2 <span className="text-xs font-bold text-slate-500">{isFrench ? 'jours' : 'أيام'}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-2">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>{isFrench ? '-68% vs délai papier historique (14j)' : '-68% مقارنة بالمعالجة الورقية'}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                {isFrench ? 'Engagement SLA contrat interne : ≤ 7 jours' : 'الالتزام التعاقدي الداخلي : ≤ 7 أيام'}
              </div>
            </div>

            {/* KPI 3: Taux d'accord */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>{isFrench ? 'Taux d’Avis Favorables' : 'نسبة الموافقة على المطالب'}</span>
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-black text-teal-700 mt-2">
                89.4 <span className="text-sm font-bold">%</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-600 mt-2">
                {isFrench ? '132 dossiers conformes / 148 instruits' : '132 ملفاً مستوفياً للشروط'}
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                {isFrench ? 'Critères d’éligibilité statutaires appliqués' : 'وفقاً لمقاييس اللجنة المتناصفة'}
              </div>
            </div>

            {/* KPI 4: Complétude dépôt */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>{isFrench ? 'Complétude Immédiate au Dépôt' : 'اكتمال الوثائق عند الإيداع'}</span>
                <FileCheck2 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-blue-700 mt-2">
                84.2 <span className="text-sm font-bold">%</span>
              </div>
              <div className="text-[11px] font-semibold text-emerald-600 mt-2">
                {isFrench ? '+32% grâce au guide de pièces numérique' : '+32% بفضل التدقيق الرقمي المسبق'}
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                {isFrench ? 'Moins de relances et de blocages administratifs' : 'تقليص حالات طلب وثائق تكميلية'}
              </div>
            </div>
          </div>

          {/* Operational Funnel & Status Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isFrench ? 'Entonnoir de Traitement & Pipeline des Demandes' : 'مسار المعالجة وحالات الملفات الجارية'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isFrench ? 'Visualisation du cycle de vie opérationnel de bout en bout' : 'متابعة تدفق الملفات من الإيداع إلى الصرف النهائي'}
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-xl">
                {isFrench ? `Total Traité : ${totalCalculatedApps} dossiers` : `المجموع : ${totalCalculatedApps} ملف`}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                <div className="text-xs font-bold text-blue-800">{isFrench ? 'Dépôts Récents' : 'إيداعات جديدة'}</div>
                <div className="text-2xl font-black text-blue-900 mt-1">24</div>
                <div className="text-[11px] text-blue-600 mt-1">{isFrench ? 'En attente d’affectation' : 'في انتظار التوزيع'}</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
                <div className="text-xs font-bold text-amber-800">{isFrench ? 'En Cours d’Instruction' : 'قيد التحري الاجتماعي'}</div>
                <div className="text-2xl font-black text-amber-900 mt-1">38</div>
                <div className="text-[11px] text-amber-600 mt-1">{isFrench ? 'Vérification pièces & barèmes' : 'تدقيق الفواتير والمؤيدات'}</div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                <div className="text-xs font-bold text-indigo-800">{isFrench ? 'En Arbitrage / Visa' : 'في انتظار التأشيرة المالية'}</div>
                <div className="text-2xl font-black text-indigo-900 mt-1">14</div>
                <div className="text-[11px] text-indigo-600 mt-1">{isFrench ? 'Proposition formulée' : 'مقترحات منجزة معروضة'}</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <div className="text-xs font-bold text-emerald-800">{isFrench ? 'Accordées & Mandatées' : 'مصادق عليها ومصروفة'}</div>
                <div className="text-2xl font-black text-emerald-900 mt-1">72</div>
                <div className="text-[11px] text-emerald-600 mt-1">{isFrench ? 'Virement bancaire exécuté' : 'تحويل بنكي منجز'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISTRIBUTION BY AID CATEGORY */}
      {activeSubTab === 'distribution' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {isFrench ? 'Ventilation des Dépenses par Catégorie de Prestation Sociale' : 'توزيع النفقات والمطالب حسب صنف المساعدة'}
              </h2>
              <p className="text-xs text-slate-500">
                {isFrench ? 'Volume de dossiers et montants cumulés en Dinars Tunisiens (TND)' : 'الأحجام والمبالغ الإجمالية بالدينار التونسي'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {categoryStats.map((c, i) => {
              const pct = Math.round((c.count / totalCalculatedApps) * 100);
              return (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-bold text-slate-700">
                        {c.code}
                      </span>
                      <strong className="text-slate-800">{isFrench ? c.title : (c.titleAr || c.title)}</strong>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-slate-500">
                        {c.count} {isFrench ? 'dossiers' : 'ملفات'} ({pct}%)
                      </span>
                      <strong className="text-emerald-700 font-mono">
                        {c.amount.toLocaleString()} TND
                      </strong>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                      style={{ width: `${pct * 2}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{isFrench ? `Plafond : ${c.ceilingAmountTND} TND` : `السقف : ${c.ceilingAmountTND} د.ت`}</span>
                    <span>{isFrench ? `Délai SLA : ${c.slaDays} jours` : `أجل المعالجة : ${c.slaDays} أيام`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: REGIONAL BREAKDOWN */}
      {activeSubTab === 'geography' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              {isFrench ? 'Cartographie & Répartition Géographique (Districts TT)' : 'التوزيع الجغرافي حسب الأقاليم والإدارات الجهوية'}
            </h2>
            <p className="text-xs text-slate-500">
              {isFrench ? 'Suivi de la couverture d’action sociale sur l’ensemble du territoire tunisien' : 'متابعة تغطية المساعدات على كامل تراب الجمهورية'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regions.map((reg) => (
              <div key={reg.name} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <strong className="text-xs text-slate-900">{reg.name}</strong>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    {reg.pct}% {isFrench ? 'du volume' : 'من الحجم'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">{isFrench ? 'Dossiers :' : 'الملفات :'}</span>
                    <strong className="text-slate-800">{reg.count}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{isFrench ? 'Budget alloué :' : 'المبلغ المصروف :'}</span>
                    <strong className="text-emerald-700">{reg.budget}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{isFrench ? 'SLA Moyen :' : 'معدل الأجل :'}</span>
                    <strong className="text-indigo-700">{reg.sla}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS INPDP */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">
                {isFrench ? 'Journal Centralisé d’Audit & Traçabilité Légale (INPDP)' : 'سجل التدقيق والتتبع القانوني المركزي'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {isFrench ? 'Horodatage inaltérable • Conformité Loi n° 2004-63 du 27 juillet 2004' : 'بصمة زمنية مشفرة • قانون حماية المعطيات الشخصية'}
              </div>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-xl border border-emerald-200">
              {auditLogs.length} {isFrench ? 'événements tracés' : 'عمليات مسجلة'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">{isFrench ? 'Horodatage (UTC)' : 'التاريخ والوقت'}</th>
                  <th className="p-3">{isFrench ? 'Utilisateur' : 'المستخدم'}</th>
                  <th className="p-3">{isFrench ? 'Rôle' : 'الصفة'}</th>
                  <th className="p-3">{isFrench ? 'Action' : 'العملية'}</th>
                  <th className="p-3">{isFrench ? 'Cible / Dossier' : 'الملف المعني'}</th>
                  <th className="p-3">{isFrench ? 'Gravité' : 'الخطورة'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500">{new Date(log.timestamp).toLocaleString(isFrench ? 'fr-FR' : 'ar-TN')}</td>
                    <td className="p-3 font-sans font-semibold text-slate-800">{log.userName}</td>
                    <td className="p-3 font-sans">
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold">{log.userRole}</span>
                    </td>
                    <td className="p-3 font-bold text-indigo-700">{log.action}</td>
                    <td className="p-3 font-semibold text-slate-700">{log.resourceId || log.resource}</td>
                    <td className="p-3">
                      {log.severity === 'security' ? (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                          SÉCURITÉ
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          INFO
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CONFIGURATION & RULES */}
      {activeSubTab === 'config' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {isFrench ? 'Paramètres Système & Barèmes Configurables' : 'إعدادات المنظومة والمقاييس المالية'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isFrench ? 'Ajustement des plafonds budgétaires et délais SLA sans déploiement de code.' : 'تعديل الأسقف والآجال مباشرة عبر المنظومة.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-slate-900">{isFrench ? cat.title : (cat.titleAr || cat.title)}</strong>
                  <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                    {cat.code}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{isFrench ? 'Plafond Max :' : 'السقف الأقصى :'}</span>
                    <strong className="text-emerald-700">{cat.ceilingAmountTND} TND</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{isFrench ? 'Délai SLA :' : 'أجل المعالجة :'}</span>
                    <strong className="text-slate-800">{cat.slaDays} {isFrench ? 'jours' : 'أيام'}</strong>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500">
                  {cat.requiredDocuments.length} {isFrench ? 'pièces obligatoires définies' : 'وثائق إجبارية معرفة'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
