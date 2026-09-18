import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Send, 
  Download, 
  UploadCloud, 
  MessageSquare, 
  User, 
  ShieldCheck,
  ChevronRight,
  Printer,
  History,
  FileCheck
} from 'lucide-react';
import { AssistanceApplication, User as UserType, UploadedDocument, Language } from '../../types';
import { translations } from '../../translations';

interface ApplicationDetailModalProps {
  application: AssistanceApplication;
  currentUser: UserType;
  onClose: () => void;
  onAddComment: (appId: string, content: string, isInternal: boolean) => void;
  onUploadComplementaryDoc: (appId: string, doc: UploadedDocument) => void;
  onViewOfficialDoc: (app: AssistanceApplication, docType: 'receipt' | 'decision') => void;
  language?: Language;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  currentUser,
  onClose,
  onAddComment,
  onUploadComplementaryDoc,
  onViewOfficialDoc,
  language = 'ar'
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'messages' | 'history'>('details');
  const [commentText, setCommentText] = useState('');
  const t = translations[language];

  const statusSteps = [
    { key: 'submitted', label: language === 'ar' ? 'تم الإيداع' : 'Soumise' },
    { key: 'under_review', label: language === 'ar' ? 'قيد الدراسة' : 'En cours' },
    { key: 'pending_validation', label: language === 'ar' ? 'التأشيرة' : 'Validation' },
    { key: 'approved', label: language === 'ar' ? 'المصادقة' : 'Décision' },
    { key: 'closed', label: language === 'ar' ? 'الصرف' : 'Clôturée' }
  ];

  const getStepState = (stepKey: string) => {
    const current = application.status;
    if (current === 'rejected' && stepKey === 'approved') return 'rejected';
    if (current === 'info_requested' && stepKey === 'under_review') return 'attention';

    const order = ['draft', 'submitted', 'under_review', 'info_requested', 'complete', 'pending_validation', 'approved', 'closed'];
    const currentIndex = order.indexOf(current);
    const stepIndex = order.indexOf(stepKey);

    if (currentIndex >= stepIndex) return 'completed';
    return 'upcoming';
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(application.id, commentText.trim(), false);
    setCommentText('');
  };

  const handleSimulateComplementaryUpload = () => {
    const newDoc: UploadedDocument = {
      id: `doc-comp-${Date.now()}`,
      documentDefId: 'doc-comp',
      fileName: language === 'ar' ? 'وثيقة_تكميلية_مرفوعة.pdf' : 'justificatif_complementaire.pdf',
      fileSize: 1100000,
      fileType: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      status: 'pending_check'
    };
    onUploadComplementaryDoc(application.id, newDoc);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono bg-white/15 text-white font-bold text-xs px-2.5 py-1 rounded-xl">
              {application.referenceNumber}
            </span>
            <div>
              <h2 className="text-base font-bold">{application.subject}</h2>
              <div className="text-xs text-emerald-200 flex items-center gap-2">
                <span>{application.categoryTitle}</span>
                <span>•</span>
                <span>
                  {language === 'ar' ? 'تاريخ الإيداع:' : 'Déposé le :'} {new Date(application.createdAt).toLocaleDateString(language === 'ar' ? 'ar-TN' : 'fr-FR')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewOfficialDoc(application, 'receipt')}
              className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-xs font-semibold px-3 py-1.5 rounded-xl transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'وصل الإيداع' : 'Récépissé'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Line */}
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-3.5 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

              {statusSteps.map((st) => {
                const state = getStepState(st.key);
                return (
                  <div key={st.key} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                        state === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : state === 'attention'
                          ? 'bg-rose-500 text-white animate-bounce'
                          : state === 'rejected'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {state === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : state === 'attention' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-[10px]">•</span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] mt-1 font-bold ${
                        state === 'completed'
                          ? 'text-emerald-800'
                          : state === 'attention'
                          ? 'text-rose-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="bg-slate-100 px-6 pt-2 border-b border-slate-200 flex space-x-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'details'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'ar' ? 'تفاصيل المطلب والمؤيدات' : 'Détails & Pièces'}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'messages'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'التواصل مع المساعدة الاجتماعية' : 'Messagerie'}</span>
            {application.comments.filter(c => !c.isInternalNote).length > 0 && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full">
                {application.comments.filter(c => !c.isInternalNote).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'مسار المعالجة' : 'Historique'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4">
          {/* TAB 1: DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              {/* Alert if info requested */}
              {application.status === 'info_requested' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-rose-900">
                        {language === 'ar' ? 'مطلوب وثيقة تكميلية' : 'Complément requis'}
                      </div>
                      <p className="text-rose-700 text-[11px] mt-0.5">
                        {language === 'ar'
                          ? 'الرجاء تحميل الوثيقة الناقصة لاستكمال دراسة المطلب دون تأخير.'
                          : 'Veuillez téléverser la pièce demandée par le service social.'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSimulateComplementaryUpload}
                    className="shrink-0 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'تحميل الوثيقة الآن' : 'Téléverser'}</span>
                  </button>
                </div>
              )}

              {/* Information Grid */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="font-bold text-slate-800 text-sm">
                  {language === 'ar' ? 'بيانات المطلب:' : 'Informations générales :'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-slate-400 font-medium block">
                      {language === 'ar' ? 'نوع المساعدة:' : 'Prestation :'}
                    </span>
                    <span className="font-bold">{application.categoryTitle}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">
                      {language === 'ar' ? 'المبلغ المطلوب:' : 'Montant demandé :'}
                    </span>
                    <span className="font-bold text-emerald-800">
                      {application.requestedAmountTND ? `${application.requestedAmountTND} ${t.currencyTND}` : '-'}
                    </span>
                  </div>
                  {application.finalAmountTND && (
                    <div className="col-span-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-emerald-700 font-bold block">
                        {language === 'ar' ? 'المبلغ المصادق عليه نهائياً:' : 'Montant accordé par la commission :'}
                      </span>
                      <span className="text-base font-black text-emerald-900">
                        {application.finalAmountTND} {t.currencyTND}
                      </span>
                    </div>
                  )}
                  <div className="col-span-2">
                    <span className="text-slate-400 font-medium block">
                      {language === 'ar' ? 'شرح الظروف:' : 'Description de la situation :'}
                    </span>
                    <p className="mt-1 text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                      {application.situationDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="space-y-2">
                <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
                  <span>{language === 'ar' ? 'المؤيدات والوثائق المرفوعة:' : 'Pièces justificatives chiffrées :'}</span>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {language === 'ar' ? 'تشفير AES-256' : 'Chiffré AES-256'}
                  </span>
                </div>

                <div className="space-y-2">
                  {application.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <div className="font-bold text-slate-800">{doc.fileName}</div>
                          <div className="text-[10px] text-slate-400">
                            {(doc.fileSize / 1024).toFixed(0)} KB • {language === 'ar' ? 'محمل بنجاح' : 'Téléversé'}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        {language === 'ar' ? 'تم الفحص' : 'Vérifié'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MESSAGING */}
          {activeTab === 'messages' && (
            <div className="space-y-3 flex flex-col h-full">
              <div className="flex-1 space-y-3 max-h-64 overflow-y-auto p-2">
                {application.comments.filter(c => !c.isInternalNote).length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    {language === 'ar'
                      ? 'لا توجد رسائل متبادلة بعد. يمكنك كتابة استفسار للمساعدة الاجتماعية.'
                      : 'Aucun message. Vous pouvez poser une question à l’assistante sociale.'}
                  </div>
                ) : (
                  application.comments
                    .filter(c => !c.isInternalNote)
                    .map((comm) => {
                      const isMe = comm.authorId === currentUser.id;
                      return (
                        <div
                          key={comm.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div className="text-[10px] text-slate-400 mb-1">
                            {comm.authorName} ({new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                          </div>
                          <div
                            className={`p-3 rounded-2xl max-w-md text-xs ${
                              isMe
                                ? 'bg-emerald-700 text-white rounded-tr-none'
                                : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                            }`}
                          >
                            {comm.content}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendComment} className="flex gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'اكتب رسالتك للمساعدة الاجتماعية...' : 'Votre message...'}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl transition shadow-2xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'إرسال' : 'Envoyer'}</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: TIMELINE & HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="font-bold text-slate-800">
                {language === 'ar' ? 'المراحل الزمنية لمعالجة المطلب:' : 'Journal des étapes :'}
              </div>
              <div className="divide-y divide-slate-100 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                {application.statusHistory.map((hist) => (
                  <div key={hist.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">
                        {hist.changedByName} ({hist.changedByRole})
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(hist.timestamp).toLocaleString(language === 'ar' ? 'ar-TN' : 'fr-FR')}
                      </div>
                      {hist.comment && (
                        <div className="text-xs text-slate-600 mt-1 bg-white p-2 rounded-lg border border-slate-200">
                          {hist.comment}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => onViewOfficialDoc(application, 'receipt')}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'ar' ? 'تحميل / طباعة الوصل الرسمي' : 'Imprimer le récépissé'}</span>
          </button>

          <button
            onClick={onClose}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2 rounded-xl transition shadow-xs"
          >
            {language === 'ar' ? 'إغلاق' : 'Fermer'}
          </button>
        </div>
      </div>
    </div>
  );
};
