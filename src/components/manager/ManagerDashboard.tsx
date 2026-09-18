import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  DollarSign, 
  FileText, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  Printer, 
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { AssistanceApplication, User, Language } from '../../types';
import { translations } from '../../translations';

interface ManagerDashboardProps {
  currentUser: User;
  applications: AssistanceApplication[];
  onApproveApplication: (appId: string, finalAmount: number, motivation: string, pvNumber: string) => void;
  onRejectApplication: (appId: string, motivation: string) => void;
  onRequestReInvestigation: (appId: string, note: string) => void;
  onViewOfficialDoc: (app: AssistanceApplication, docType: 'receipt' | 'decision') => void;
  language?: Language;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  currentUser,
  applications,
  onApproveApplication,
  onRejectApplication,
  onRequestReInvestigation,
  onViewOfficialDoc,
  language = 'ar'
}) => {
  const [selectedApp, setSelectedApp] = useState<AssistanceApplication | null>(null);
  const [decisionType, setDecisionType] = useState<'approve' | 'reject' | 'return'>('approve');
  const [finalAmount, setFinalAmount] = useState<number>(1000);
  const [motivation, setMotivation] = useState('');
  const [pvNumber, setPvNumber] = useState('PV-COM-2025/05');

  const t = translations[language];

  // Filter pending validation
  const pendingValidationApps = applications.filter(a => a.status === 'pending_validation');
  const approvedThisMonth = applications.filter(a => a.status === 'approved' || a.status === 'closed');

  // Budget calculations
  const annualBudgetTND = 650000;
  const committedBudgetTND = applications
    .filter(a => a.finalAmountTND && (a.status === 'approved' || a.status === 'closed'))
    .reduce((acc, curr) => acc + (curr.finalAmountTND || 0), 0) + 245000;
  const remainingBudgetTND = annualBudgetTND - committedBudgetTND;

  const handleOpenDecision = (app: AssistanceApplication) => {
    setSelectedApp(app);
    setFinalAmount(app.proposedAmountTND || app.requestedAmountTND || 1000);
    setMotivation(
      language === 'ar'
        ? `المصادقة على إسناد مساعدة مالية بموجب محضر اجتماع لجنة العمل الاجتماعي ${pvNumber} وطبقاً للمعايير والاعتمادات المرصودة.`
        : `Attribution validée par la commission sociale selon PV ${pvNumber}.`
    );
  };

  const handleConfirmDecision = () => {
    if (!selectedApp) return;
    if (decisionType === 'approve') {
      onApproveApplication(selectedApp.id, finalAmount, motivation, pvNumber);
    } else if (decisionType === 'reject') {
      onRejectApplication(selectedApp.id, motivation);
    } else {
      onRequestReInvestigation(selectedApp.id, motivation);
    }
    setSelectedApp(null);
  };

  return (
    <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-medium mb-2 border border-white/20">
            <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>
              {language === 'ar' 
                ? `فضاء رئيس مصلحة العمل الاجتماعي • ${currentUser.name}`
                : `Espace Responsable Action Sociale • ${currentUser.name}`}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            {language === 'ar' ? 'المصادقة النهائية وتأشيرة صرف المساعدات' : 'Validation & Arbitrage des Aides'}
          </h1>
          <p className="text-xs text-emerald-100 mt-1 max-w-xl">
            {language === 'ar'
              ? 'متابعة الميزانية السنوية للعمل الاجتماعي، مراجعة مقترحات المساعدين الاجتماعيين، وإصدار قرارات الإسناد الرسمية.'
              : 'Pilotage budgétaire, validation collégiale des dossiers et génération des arrêtés d’octroi.'}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/15 text-center min-w-[130px]">
          <span className="text-[10px] text-emerald-200 block">
            {language === 'ar' ? 'في انتظار المصادقة' : 'En attente de visa'}
          </span>
          <span className="text-2xl font-black text-white">{pendingValidationApps.length}</span>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">
            {language === 'ar' ? 'الميزانية السنوية المرصودة' : 'Budget Annuel Alloué'}
          </span>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {annualBudgetTND.toLocaleString()} <span className="text-xs font-bold text-slate-500">{t.currencyTND}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {language === 'ar' ? 'اعتمادات مصلحة العمل الاجتماعي 2025' : 'Exercice 2025'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">
            {language === 'ar' ? 'المبالغ الملتزم بها والمصروفة' : 'Budget Engagé'}
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {committedBudgetTND.toLocaleString()} <span className="text-xs font-bold text-slate-500">{t.currencyTND}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {((committedBudgetTND / annualBudgetTND) * 100).toFixed(1)}% {language === 'ar' ? 'نسبة الاستهلاك' : 'de consommation'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium block">
            {language === 'ar' ? 'الرصيد المالي المتبقي' : 'Reliquat Disponible'}
          </span>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            {remainingBudgetTND.toLocaleString()} <span className="text-xs font-bold text-slate-500">{t.currencyTND}</span>
          </div>
          <div className="text-[10px] text-emerald-700 mt-1">
            {language === 'ar' ? 'سيولة متوفرة لصرف المساعدات' : 'Fonds disponibles'}
          </div>
        </div>
      </div>

      {/* Pending Validation Dossiers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            {language === 'ar' ? 'الملفات الجاهزة للمصادقة والتأشيرة' : 'Dossiers à l’ordre du jour de la commission'}
          </h2>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-xl">
            {pendingValidationApps.length} {language === 'ar' ? 'ملفات معروضة' : 'dossiers'}
          </span>
        </div>

        {pendingValidationApps.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            {language === 'ar' ? 'لا توجد ملفات في انتظار المصادقة حالياً.' : 'Aucun dossier en attente d’arbitrage.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingValidationApps.map((app) => (
              <div
                key={app.id}
                className="p-5 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {app.referenceNumber}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{app.employeeName}</span>
                    <span className="text-xs text-slate-500">({app.employeeMatricule})</span>
                    <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      {t.status.pending_validation}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-emerald-800">{app.categoryTitle}</span>
                    <span> • </span>
                    <span>{app.subject}</span>
                    <span> • </span>
                    <span className="text-slate-500">{app.employeeDepartment}</span>
                  </div>

                  <div className="text-xs text-slate-700 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/80 inline-block">
                    <span className="text-slate-500">{language === 'ar' ? 'المبلغ المقترح من المساعد(ة) الاجتماعي(ة):' : 'Montant proposé :'} </span>
                    <span className="font-black text-emerald-900 text-sm">
                      {app.proposedAmountTND || app.requestedAmountTND} {t.currencyTND}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenDecision(app)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-2xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'اتخاذ القرار والتأشيرة' : 'Statuer'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Decision Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'ar' ? 'قرار لجنة العمل الاجتماعي' : 'Décision de la Commission Sociale'}
              </h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">
                  {selectedApp.employeeName} ({selectedApp.employeeMatricule})
                </span>
                <div className="text-slate-600">{selectedApp.subject}</div>
                <div className="text-emerald-800 font-bold mt-1">
                  {selectedApp.categoryTitle}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {language === 'ar' ? 'نوع القرار:' : 'Sens de la décision :'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDecisionType('approve')}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      decisionType === 'approve'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {language === 'ar' ? 'موافقة وإسناد' : 'Favorable'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisionType('return')}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      decisionType === 'return'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {language === 'ar' ? 'إعادة تعميق البحث' : 'Complément'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisionType('reject')}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      decisionType === 'reject'
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {language === 'ar' ? 'رفض المطلب' : 'Défavorable'}
                  </button>
                </div>
              </div>

              {decisionType === 'approve' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {language === 'ar' ? 'المبلغ النهائي المصادق عليه (د.ت):' : 'Montant final (TND) :'}
                    </label>
                    <input
                      type="number"
                      value={finalAmount}
                      onChange={(e) => setFinalAmount(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-emerald-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {language === 'ar' ? 'رقم محضر الجلسة:' : 'N° Procès Verbal :'}
                    </label>
                    <input
                      type="text"
                      value={pvNumber}
                      onChange={(e) => setPvNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {language === 'ar' ? 'التعليل الإداري للقرار:' : 'Motifs de la décision :'}
                </label>
                <textarea
                  rows={3}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition"
                >
                  {language === 'ar' ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDecision}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl transition shadow-xs"
                >
                  {language === 'ar' ? 'تأكيد وإصدار القرار' : 'Valider'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
