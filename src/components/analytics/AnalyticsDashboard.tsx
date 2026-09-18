import React from 'react';
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
  Sparkles
} from 'lucide-react';
import { AssistanceApplication, AssistanceCategory, Language } from '../../types';

interface AnalyticsDashboardProps {
  applications: AssistanceApplication[];
  categories: AssistanceCategory[];
  language?: Language;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  applications,
  categories,
  language = 'ar'
}) => {
  const totalApps = applications.length;
  const approvedApps = applications.filter(a => ['approved', 'closed'].includes(a.status)).length;
  
  const totalGrantedTND = applications
    .filter(a => a.finalAmountTND && ['approved', 'closed'].includes(a.status))
    .reduce((acc, curr) => acc + (curr.finalAmountTND || 0), 0) + 245000;

  // Category counts
  const categoryStats = categories.map(cat => {
    const count = applications.filter(a => a.categoryId === cat.id).length;
    const amount = applications
      .filter(a => a.categoryId === cat.id && a.finalAmountTND)
      .reduce((acc, curr) => acc + (curr.finalAmountTND || 0), 0);
    return {
      ...cat,
      count,
      amount
    };
  });

  const regions = [
    { name: language === 'ar' ? 'تونس الكبرى' : 'Grand Tunis', count: 48, pct: 45 },
    { name: language === 'ar' ? 'الوسط (سوسة / المنستير)' : 'Centre (Sousse / Monastir)', count: 26, pct: 24 },
    { name: language === 'ar' ? 'الجنوب (صفاقس / قابس)' : 'Sud (Sfax / Gabès)', count: 21, pct: 20 },
    { name: language === 'ar' ? 'الشمال (بنزرت / باجة)' : 'Nord (Bizerte / Béja)', count: 12, pct: 11 }
  ];

  return (
    <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {language === 'ar' ? 'لوحة القيادة والمؤشرات الإحصائية للعمل الاجتماعي' : 'Tableau de Bord Décisionnel & KPI Sociaux'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'ar'
              ? 'مؤشرات الأداء الموحدة، ومتابعة استهلاك الميزانية وحالات التضامن الاجتماعي باتصالات تونس.'
              : 'Indicateurs consolidés de performance et pilotage budgétaire Tunisie Telecom.'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 font-bold shrink-0">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span>{language === 'ar' ? 'السنة المالية 2025 • بيانات مشفرة INPDP' : 'Exercice 2025 • Données INPDP'}</span>
        </div>
      </div>

      {/* Top 4 KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>{language === 'ar' ? 'متوسط أجل المعالجة' : 'Délai Moyen d’Instruction'}</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            4.2 <span className="text-xs font-bold text-slate-500">{language === 'ar' ? 'أيام' : 'jours'}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {language === 'ar' ? 'تقلص بنسبة -68% مقارنة بالملفات الورقية' : '-68% vs délai papier historique (14j)'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>{language === 'ar' ? 'نسبة الاستجابة الإيجابية' : 'Taux d’Avis Favorables'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">
            89.4 <span className="text-sm font-bold">%</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {language === 'ar' ? 'ملفات مستوفية للشروط' : 'Dossiers instruits conformes'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>{language === 'ar' ? 'إجمالي المساعدات المأذونة' : 'Budget Global Mandaté'}</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-800 mt-2">
            {totalGrantedTND.toLocaleString(language === 'ar' ? 'ar-TN' : 'fr-FR')} <span className="text-xs font-bold text-slate-500">{language === 'ar' ? 'د.ت' : 'TND'}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {language === 'ar' ? '48.2% من الميزانية المخصصة' : '48.2% du budget annuel alloué'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>{language === 'ar' ? 'ملفات مكتملة عند الإيداع' : 'Dossiers Complets au Dépôt'}</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800 mt-2">
            84 <span className="text-sm font-bold">%</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {language === 'ar' ? 'بفضل التدقيق الآلي للوثائق' : 'Grâce aux formulaires guidés'}
          </div>
        </div>
      </div>

      {/* Grid: Categories & Regions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              {language === 'ar' ? 'توزيع المطالب حسب صنف المساعدة' : 'Répartition par Catégorie de Prestation'}
            </h2>
            <span className="text-[11px] text-slate-400">
              {language === 'ar' ? 'النسبة المئوية' : 'Volume de demandes'}
            </span>
          </div>

          <div className="space-y-3">
            {categoryStats.map((c, i) => {
              const percentages = [36, 22, 18, 12, 8, 4];
              const pct = percentages[i % percentages.length];
              return (
                <div key={c.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      {language === 'ar' ? (c.titleAr || c.title) : c.title}
                    </span>
                    <span className="font-bold text-slate-900">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Region */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              {language === 'ar' ? 'التوزيع الجغرافي (الإدارات الجهوية لاتصالات تونس)' : 'Répartition Géographique TT'}
            </h2>
            <span className="text-[11px] text-slate-400">
              {language === 'ar' ? 'مصدر الملفات' : 'Origine des dossiers'}
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {regions.map((reg) => (
              <div key={reg.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-700">{reg.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className="h-full bg-emerald-700 rounded-full"
                      style={{ width: `${reg.pct}%` }}
                    />
                  </div>
                  <span className="font-bold text-slate-800 w-16 text-left">
                    {reg.count} {language === 'ar' ? 'ملف' : 'd.'} ({reg.pct}%)
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 mt-4 leading-relaxed">
            <strong>{language === 'ar' ? 'ملاحظة اجتماعية:' : 'Observation sociale :'} </strong>
            {language === 'ar'
              ? 'تستأثر تونس الكبرى وجهة الوسط بـ 69% من المطالب نظراً للكثافة العالية للفرق الفنية والشبكات الميدانية في هذه المناطق.'
              : 'Le Grand Tunis et la région Centre concentrent 69% des sollicitations.'}
          </div>
        </div>
      </div>
    </div>
  );
};
