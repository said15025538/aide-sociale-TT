import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Send, 
  Lock, 
  UserCheck, 
  DollarSign, 
  ArrowRight, 
  FileCheck, 
  HelpCircle,
  Clock,
  Printer,
  ShieldCheck
} from 'lucide-react';
import { AssistanceApplication, User, UploadedDocument, Language } from '../../types';
import { translations } from '../../translations';

interface CaseReviewModalProps {
  application: AssistanceApplication;
  currentUser: User;
  onClose: () => void;
  onUpdateStatus: (appId: string, newStatus: AssistanceApplication['status'], comment: string) => void;
  onAddComment: (appId: string, content: string, isInternal: boolean) => void;
  onRequestSupplement: (appId: string, note: string) => void;
  onSubmitProposal: (appId: string, proposedAmount: number, motivation: string) => void;
  onViewOfficialDoc: (app: AssistanceApplication, docType: 'receipt' | 'decision') => void;
  language?: Language;
}

export const CaseReviewModal: React.FC<CaseReviewModalProps> = ({
  application,
  currentUser,
  onClose,
  onUpdateStatus,
  onAddComment,
  onRequestSupplement,
  onSubmitProposal,
  onViewOfficialDoc,
  language = 'ar'
}) => {
  const [activeTab, setActiveTab] = useState<'review' | 'action_supplement' | 'action_proposal' | 'internal_notes'>('review');

  const [supplementNote, setSupplementNote] = useState('');
  const [proposedAmount, setProposedAmount] = useState<number>(
    application.proposedAmountTND || application.requestedAmountTND || 1000
  );
  const [proposalMotivation, setProposalMotivation] = useState(
    language === 'ar'
      ? 'ملف اجتماعي مستوفٍ للشروط القانونية والمؤيدات. إبداء رأي إيجابي للموافقة على إسناد المساعدة وفق المقاييس المعتمدة.'
      : 'Dossier social complet et instruit conformément au barème. Avis favorable pour octroi.'
  );

  const [internalNoteText, setInternalNoteText] = useState('');
  const [docStatuses, setDocStatuses] = useState<Record<string, 'approved' | 'rejected'>>({});
  const t = translations[language];

  const handleToggleDocStatus = (docId: string, status: 'approved' | 'rejected') => {
    setDocStatuses(prev => ({ ...prev, [docId]: status }));
  };

  const handleSendSupplement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplementNote.trim()) return;
    onRequestSupplement(application.id, supplementNote.trim());
    onClose();
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitProposal(application.id, Number(proposedAmount), proposalMotivation.trim());
    onClose();
  };

  const handleAddInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalNoteText.trim()) return;
    onAddComment(application.id, internalNoteText.trim(), true);
    setInternalNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header in Fresh Emerald */}
        <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono bg-white/15 text-white font-bold text-xs px-2.5 py-1 rounded-xl">
              {application.referenceNumber}
            </span>
            <div>
              <h2 className="text-base font-bold">
                {language === 'ar' ? 'دراسة وتحري الملف الاجتماعي' : 'Instruction du Dossier Social'}
              </h2>
              <div className="text-xs text-emerald-200 flex items-center gap-2">
                <span>{application.employeeName} ({application.employeeMatricule})</span>
                <span>•</span>
                <span>{application.categoryTitle}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewOfficialDoc(application, 'receipt')}
              className="bg-white/10 hover:bg-white/20 text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الوصل' : 'Récépissé'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="bg-slate-100 px-6 pt-2 border-b border-slate-200 flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('review')}
            className={`pb-2.5 px-3 transition border-b-2 ${
              activeTab === 'review'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'ar' ? 'فحص المؤيدات والبيانات' : 'Examen des Pièces'}
          </button>
          <button
            onClick={() => setActiveTab('action_proposal')}
            className={`pb-2.5 px-3 transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'action_proposal'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'اقتراح مبلغ الإسناد والتأشيرة' : 'Proposer une Décision'}</span>
          </button>
          <button
            onClick={() => setActiveTab('action_supplement')}
            className={`pb-2.5 px-3 transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'action_supplement'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'طلب وثيقة تكميلية' : 'Demander Complément'}</span>
          </button>
          <button
            onClick={() => setActiveTab('internal_notes')}
            className={`pb-2.5 px-3 transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'internal_notes'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'ar' ? 'الملاحظات السرية' : 'Notes Internes'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4">
          {/* TAB 1: REVIEW & DOCUMENTS */}
          {activeTab === 'review' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-2">
                  {language === 'ar' ? 'ظروف المطلب والوضعية الاجتماعية:' : 'Exposé des motifs :'}
                </div>
                <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                  {application.situationDescription}
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800 flex items-center justify-between">
                  <span>{language === 'ar' ? 'تدقيق الوثائق والمؤيدات المرفوعة:' : 'Pièces justificatives chiffrées :'}</span>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {language === 'ar' ? 'مطابق لقانون حماية المعطيات الشخصية INPDP' : 'Conformité INPDP'}
                  </span>
                </div>

                <div className="space-y-2">
                  {application.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-800">{doc.fileName}</div>
                          <div className="text-[10px] text-slate-400">
                            {(doc.fileSize / 1024).toFixed(0)} KB • {language === 'ar' ? 'مرفق ومؤمن' : 'Chiffré'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleDocStatus(doc.id, 'approved')}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                            docStatuses[doc.id] === 'approved'
                              ? 'bg-emerald-700 text-white'
                              : 'bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                          }`}
                        >
                          {language === 'ar' ? 'مطابقة ومقبولة' : 'Valider'}
                        </button>
                        <button
                          onClick={() => handleToggleDocStatus(doc.id, 'rejected')}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                            docStatuses[doc.id] === 'rejected'
                              ? 'bg-rose-600 text-white'
                              : 'bg-white border border-rose-300 text-rose-700 hover:bg-rose-50'
                          }`}
                        >
                          {language === 'ar' ? 'غير مقبولة' : 'Rejeter'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROPOSAL */}
          {activeTab === 'action_proposal' && (
            <form onSubmit={handleSendProposal} className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-emerald-900">
                <div className="font-bold mb-1">
                  {language === 'ar' ? 'صياغة مقترح الإسناد لإحالته على مصادقة الإدارة:' : 'Proposition de décision pour validation :'}
                </div>
                <p className="text-xs text-emerald-800">
                  {language === 'ar'
                    ? 'سيتم توجيه هذا المقترح مباشرة إلى رئيس مصلحة العمل الاجتماعي مع إشعار بالبريد الإلكتروني الداخلي.'
                    : 'La proposition sera transmise au Responsable Action Sociale pour visa.'}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {language === 'ar' ? 'المبلغ المقترح للإسناد (د.ت):' : 'Montant proposé (TND) :'}
                </label>
                <input
                  type="number"
                  value={proposedAmount}
                  onChange={(e) => setProposedAmount(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-bold text-emerald-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {language === 'ar' ? 'تعليل التقرير الاجتماعي والتوصية:' : 'Motivation de l’avis social :'}
                </label>
                <textarea
                  rows={4}
                  value={proposalMotivation}
                  onChange={(e) => setProposalMotivation(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold p-3 rounded-2xl transition shadow-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'إحالة المقترح للمصادقة النهائية' : 'Transmettre au Responsable'}</span>
              </button>
            </form>
          )}

          {/* TAB 3: SUPPLEMENT */}
          {activeTab === 'action_supplement' && (
            <form onSubmit={handleSendSupplement} className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900">
                <div className="font-bold mb-1">
                  {language === 'ar' ? 'طلب وثائق تكميلية من الموظف:' : 'Demande formelle de complément :'}
                </div>
                <p className="text-xs text-amber-800">
                  {language === 'ar'
                    ? 'سيصل إشعار فوري للموظف في حسابه لتنبيهه بإضافة الوثائق المطلوبة.'
                    : 'L’agent recevra une notification instantanée pour téléverser les pièces.'}
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {language === 'ar' ? 'بيان الوثائق التكميلية المطلوبة:' : 'Détail des pièces exigées :'}
                </label>
                <textarea
                  rows={4}
                  placeholder={language === 'ar' ? 'مثال: يرجى إضافة كشف الحساب الأصلي أو الفاتورة المفصلة من المصحة...' : 'Précisez les pièces manquantes...'}
                  value={supplementNote}
                  onChange={(e) => setSupplementNote(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold p-3 rounded-2xl transition shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'ar' ? 'إرسال طلب الاستكمال للموظف' : 'Notifier l’agent'}</span>
              </button>
            </form>
          )}

          {/* TAB 4: INTERNAL CONFIDENTIAL NOTES */}
          {activeTab === 'internal_notes' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>{language === 'ar' ? 'ملاحظات داخلية سرية (خاصة بالمصلحة الاجتماعية فقط):' : 'Notes internes confidentielles :'}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {language === 'ar'
                    ? 'هذه الملاحظات لا تظهر إطلاقاً للموظف، ومخصصة فقط للمساعدين الاجتماعيين ورئيس المصلحة.'
                    : 'Strictement invisibles pour le collaborateur.'}
                </p>
              </div>

              <form onSubmit={handleAddInternalNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'أضف ملاحظة داخلية سرية...' : 'Ajouter une note...'}
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl transition"
                >
                  {language === 'ar' ? 'حفظ' : 'Ajouter'}
                </button>
              </form>

              <div className="space-y-2">
                {application.comments
                  .filter(c => c.isInternalNote)
                  .map((comm) => (
                    <div key={comm.id} className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-xs">
                      <div className="font-bold text-amber-950 flex items-center justify-between">
                        <span>{comm.authorName} ({comm.authorRole})</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date(comm.createdAt).toLocaleString(language === 'ar' ? 'ar-TN' : 'fr-FR')}
                        </span>
                      </div>
                      <p className="text-slate-700 mt-1">{comm.content}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
