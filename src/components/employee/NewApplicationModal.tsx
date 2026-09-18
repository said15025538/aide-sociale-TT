import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  UploadCloud, 
  File, 
  Trash2, 
  AlertCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Info,
  Calendar,
  Building,
  DollarSign,
  HeartHandshake
} from 'lucide-react';
import { User, AssistanceCategory, AssistanceApplication, UploadedDocument, Language } from '../../types';
import { translations } from '../../translations';

interface NewApplicationModalProps {
  currentUser: User;
  categories: AssistanceCategory[];
  onClose: () => void;
  onSubmitApplication: (newApp: Partial<AssistanceApplication>) => void;
  language?: Language;
}

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({
  currentUser,
  categories,
  onClose,
  onSubmitApplication,
  language = 'ar'
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(categories[0]?.id || '');
  
  // Form fields
  const [subject, setSubject] = useState('');
  const [situationDescription, setSituationDescription] = useState('');
  const [requestedAmountTND, setRequestedAmountTND] = useState<number | ''>('');
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'high'>('normal');
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});
  
  // Uploaded docs state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedDocument[]>([]);
  const [honorDeclaration, setHonorDeclaration] = useState(false);
  const [inpdpConsent, setInpdpConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const t = translations[language];
  const selectedCategory = categories.find(c => c.id === selectedCategoryId) || categories[0];

  const handleSimulatedFileUpload = (docDefId: string, docName: string) => {
    const simulatedDoc: UploadedDocument = {
      id: `doc-up-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      documentDefId: docDefId,
      fileName: `${docName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_justificatif.pdf`,
      fileSize: Math.floor(Math.random() * 2000000) + 500000,
      fileType: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      status: 'pending_check'
    };

    setUploadedFiles(prev => [...prev.filter(d => d.documentDefId !== docDefId), simulatedDoc]);
  };

  const handleRemoveFile = (docDefId: string) => {
    setUploadedFiles(prev => prev.filter(d => d.documentDefId !== docDefId));
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!selectedCategoryId) {
        setErrorMsg(language === 'ar' ? 'الرجاء اختيار نوع المساعدة الاجتماعية.' : 'Veuillez sélectionner un type d’aide.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!subject.trim()) {
        setErrorMsg(language === 'ar' ? 'الرجاء كتابة عنوان أو موضوع موجز للمطلب.' : 'Veuillez préciser l’objet de la demande.');
        return;
      }
      if (!situationDescription.trim()) {
        setErrorMsg(language === 'ar' ? 'الرجاء توضيح الظروف الاجتماعية التي دعت إلى هذا المطلب.' : 'Veuillez décrire la situation motivant la demande.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      // Check mandatory documents
      const mandatoryDefs = selectedCategory.requiredDocuments.filter(d => d.isMandatory);
      const missingMandatory = mandatoryDefs.filter(
        d => !uploadedFiles.some(f => f.documentDefId === d.id)
      );

      if (missingMandatory.length > 0) {
        setErrorMsg(
          language === 'ar' 
            ? `وثيقة إجبارية غير محملة: ${missingMandatory[0].name}`
            : `Pièce obligatoire manquante : ${missingMandatory[0].name}`
        );
        return;
      }
      setStep(4);
    }
  };

  const handleFinalSubmit = () => {
    if (!honorDeclaration || !inpdpConsent) {
      setErrorMsg(
        language === 'ar' 
          ? 'يجب التصريح بصحة البيانات والموافقة على معالجة المعطيات الشخصية للمتابعة.'
          : 'Veuillez certifier l’exactitude des données et consentir au traitement INPDP.'
      );
      return;
    }

    const refNumber = `TT-SOC-2025-0${Math.floor(Math.random() * 900) + 100}`;
    const newApp: Partial<AssistanceApplication> = {
      referenceNumber: refNumber,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      employeeMatricule: currentUser.matricule,
      employeeDepartment: currentUser.department,
      employeeRegion: currentUser.regionalDirection,
      employeePhone: currentUser.phone,
      categoryId: selectedCategory.id,
      categoryCode: selectedCategory.code,
      categoryTitle: language === 'ar' ? (selectedCategory.titleAr || selectedCategory.title) : selectedCategory.title,
      subject,
      situationDescription,
      requestedAmountTND: requestedAmountTND ? Number(requestedAmountTND) : undefined,
      priority,
      customFieldValues,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: uploadedFiles,
      comments: [],
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          fromStatus: 'draft',
          toStatus: 'submitted',
          changedBy: currentUser.id,
          changedByName: currentUser.name,
          changedByRole: 'employee',
          timestamp: new Date().toISOString(),
          comment: language === 'ar' ? 'إيداع إلكتروني أولي للمطلب والمؤيدات' : 'Dépôt initial dématérialisé'
        }
      ]
    };

    onSubmitApplication(newApp);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header in Fresh Emerald */}
        <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-emerald-200 font-extrabold text-sm">
              TT
            </div>
            <div>
              <h2 className="text-base font-bold">
                {language === 'ar' ? 'إيداع مطلب مساعدة اجتماعية جديد' : 'Nouvelle Demande d’Aide Sociale'}
              </h2>
              <p className="text-xs text-emerald-200">
                {language === 'ar' ? (
                  <>
                    المرحلة {step} من 4 • {step === 1 && 'اختيار نوع المساعدة'}
                    {step === 2 && 'الموضوع والبيانات'}
                    {step === 3 && 'المؤيدات والوثائق'}
                    {step === 4 && 'التصريح والتأكيد'}
                  </>
                ) : (
                  <>Étape {step} sur 4</>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
          {[
            { num: 1, label: language === 'ar' ? '1. الصنف' : '1. Prestation' },
            { num: 2, label: language === 'ar' ? '2. البيانات' : '2. Motif' },
            { num: 3, label: language === 'ar' ? '3. الوثائق' : '3. Pièces' },
            { num: 4, label: language === 'ar' ? '4. الإيداع' : '4. Signature' }
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-1.5 font-bold ${
                step === s.num
                  ? 'text-emerald-800'
                  : step > s.num
                  ? 'text-emerald-600'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === s.num
                    ? 'bg-emerald-700 text-white'
                    : step > s.num
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step > s.num ? <Check className="w-3 h-3" /> : s.num}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: CATEGORY SELECTION */}
          {step === 1 && (
            <div className="space-y-3">
              <label className="block font-bold text-slate-800 text-sm mb-2">
                {language === 'ar' ? 'اختر نوع المساعدة الاجتماعية المطلوبة:' : 'Sélectionnez le type d’aide :'}
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {categories.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50'
                          : 'border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          <span>{language === 'ar' ? (cat.titleAr || cat.title) : cat.title}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>

                      <div className="text-left shrink-0">
                        <span className="inline-block bg-white border border-emerald-300 text-emerald-800 font-extrabold text-xs px-2.5 py-1 rounded-xl shadow-2xs">
                          {cat.ceilingAmountTND} {t.currencyTND}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: MOTIVE & SITUATION DESCRIPTION */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {language === 'ar' ? 'موضوع المطلب باختصار:' : 'Objet succinct de la demande :'}
                </label>
                <input
                  type="text"
                  placeholder={language === 'ar' ? 'مثال: مساهمة في مصاريف عملية جراحية، إعانة عودة مدرسية...' : 'Ex: Opération chirurgicale urgente, secours sinistre...'}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {language === 'ar' ? 'المبلغ التقديري المطلوب (د.ت):' : 'Montant estimé souhaité (TND) :'}
                  </label>
                  <input
                    type="number"
                    placeholder={`سقف الإعانة: ${selectedCategory.ceilingAmountTND} د.ت`}
                    value={requestedAmountTND}
                    onChange={(e) => setRequestedAmountTND(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    {language === 'ar' ? 'درجة الاستعجال:' : 'Degré d’urgence :'}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="normal">{language === 'ar' ? 'عادية (ضمن الآجال القانونية)' : 'Normale'}</option>
                    <option value="urgent">{language === 'ar' ? 'مستعجلة (حالة صحية أو حادث طارئ)' : 'Urgente'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {language === 'ar' ? 'شرح الظروف الاجتماعية والمادية:' : 'Description des circonstances motivant la demande :'}
                </label>
                <textarea
                  rows={4}
                  placeholder={language === 'ar' ? 'اذكر التفاصيل الضرورية لتمكين المساعدة الاجتماعية من تقييم الحالة بموضوعية وسرية...' : 'Précisez les éléments nécessaires pour l’instruction sociale...'}
                  value={situationDescription}
                  onChange={(e) => setSituationDescription(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* STEP 3: DOCUMENT UPLOAD */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'جميع الوثائق المرفوعة تُحفظ مشفرة وتُعامل بسرية مهنية تامة طبقاً لقانون حماية المعطيات الشخصية INPDP.'
                    : 'Les pièces sont chiffrées AES-256 et confidentielles selon la loi INPDP.'}
                </span>
              </div>

              <div className="space-y-3">
                {selectedCategory.requiredDocuments.map((docDef) => {
                  const isUploaded = uploadedFiles.some(f => f.documentDefId === docDef.id);
                  return (
                    <div
                      key={docDef.id}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span>{docDef.name}</span>
                          {docDef.isMandatory && (
                            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded">
                              {language === 'ar' ? 'إجباري' : 'Obligatoire'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{docDef.description}</p>
                      </div>

                      <div className="shrink-0">
                        {isUploaded ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-100 px-2 py-1 rounded-lg">
                              <Check className="w-3.5 h-3.5" />
                              {language === 'ar' ? 'تم الرفع' : 'Téléversé'}
                            </span>
                            <button
                              onClick={() => handleRemoveFile(docDef.id)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title={language === 'ar' ? 'حذف' : 'Supprimer'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSimulatedFileUpload(docDef.id, docDef.name)}
                            className="bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                          >
                            <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{language === 'ar' ? 'تحميل الوثيقة (PDF/صورة)' : 'Téléverser'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: DECLARATION & SUBMISSION */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800">
                  {language === 'ar' ? 'ملخص المطلب قبل التأكيد النهائي:' : 'Récapitulatif de la demande :'}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400">{language === 'ar' ? 'الموظف:' : 'Agent :'}</span> {currentUser.name}
                  </div>
                  <div>
                    <span className="text-slate-400">{language === 'ar' ? 'المعرف:' : 'Matricule :'}</span> {currentUser.matricule}
                  </div>
                  <div>
                    <span className="text-slate-400">{language === 'ar' ? 'الصنف:' : 'Prestation :'}</span> {language === 'ar' ? (selectedCategory.titleAr || selectedCategory.title) : selectedCategory.title}
                  </div>
                  <div>
                    <span className="text-slate-400">{language === 'ar' ? 'المبلغ المطلوب:' : 'Montant :'}</span> {requestedAmountTND || '-'} {t.currencyTND}
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">{language === 'ar' ? 'عدد الوثائق المرفقة:' : 'Pièces jointes :'}</span> {uploadedFiles.length} {language === 'ar' ? 'وثائق مشفرة' : 'fichiers'}
                  </div>
                </div>
              </div>

              {/* Declarations Checkboxes */}
              <div className="space-y-2.5 pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={honorDeclaration}
                    onChange={(e) => setHonorDeclaration(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>
                    {language === 'ar'
                      ? 'أصرح بشرفي بصحة ودقة جميع المعلومات والمؤيدات الواردة بهذا المطلب.'
                      : 'Je certifie sur l’honneur l’exactitude de l’ensemble des déclarations.'}
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={inpdpConsent}
                    onChange={(e) => setInpdpConsent(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>
                    {language === 'ar'
                      ? 'أوافق على معالجة معطياتي الشخصية من قبل مصلحة العمل الاجتماعي لاتصالات تونس طبقاً لأحكام القانون الأساسي عدد 63 لسنة 2004 (INPDP).'
                      : 'J’autorise le traitement de mes données par le service social TT conformément à la loi INPDP.'}
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1"
            >
              <ArrowRight className={`w-3.5 h-3.5 ${language === 'ar' ? '' : 'rotate-180'}`} />
              <span>{language === 'ar' ? 'السابق' : 'Précédent'}</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <span>{language === 'ar' ? 'المتابعة' : 'Suivant'}</span>
              <ArrowLeft className={`w-3.5 h-3.5 ${language === 'ar' ? '' : 'rotate-180'}`} />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-sm flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'ar' ? 'إيداع المطلب واستخراج الوصل' : 'Confirmer et déposer'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
