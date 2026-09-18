import React from 'react';
import { X, Printer, Download, ShieldCheck, QrCode, CheckCircle2 } from 'lucide-react';
import { AssistanceApplication, Language } from '../../types';

interface DocumentPreviewModalProps {
  application: AssistanceApplication;
  docType: 'receipt' | 'decision';
  onClose: () => void;
  language?: Language;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  application,
  docType,
  onClose,
  language = 'ar'
}) => {
  const handlePrint = () => {
    window.print();
  };

  const isReceipt = docType === 'receipt';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Controls Bar (Hidden during print) */}
        <div className="bg-emerald-800 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-700 px-2.5 py-0.5 rounded-lg font-bold">
              {language === 'ar' ? 'وثيقة رسمية • اتصالات تونس' : 'DOCUMENT OFFICIEL TT'}
            </span>
            <span className="text-xs text-emerald-100">
              {language === 'ar'
                ? (isReceipt ? 'وصل إيداع مطلب مساعدة اجتماعية' : 'قرار إسناد مساعدة مالية')
                : (isReceipt ? 'Récépissé de Dépôt' : 'Notification de Décision')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-white hover:bg-slate-100 text-emerald-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'طباعة الوثيقة الرسمية' : 'Imprimer'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Sheet */}
        <div className="p-8 sm:p-12 overflow-y-auto bg-white font-sans print:p-0">
          <div className="border-2 border-slate-300 p-8 rounded-2xl print:border-none print:p-0">
            {/* Republic & Corporate Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6">
              <div className="text-right">
                <div className="font-bold text-xs text-slate-800">الجمهورية التونسية</div>
                <div className="text-xs text-slate-600">الشركة الوطنية للاتصالات (اتصالات تونس)</div>
                <div className="text-xs text-slate-600">الإدارة المركزية لرأس المال البشري</div>
                <div className="text-xs font-bold text-emerald-800">مصلحة العمل الاجتماعي والتعاونية</div>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-black text-xl mx-auto mb-1">
                  TT
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Tunisie Telecom
                </span>
              </div>

              <div className="text-left text-xs text-slate-600" dir="ltr">
                <div className="font-mono font-bold text-slate-900">{application.referenceNumber}</div>
                <div>Date : {new Date(application.createdAt).toLocaleDateString('fr-TN')}</div>
                <div className="text-[11px] text-slate-500">Intranet TT Sécurisé</div>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="my-8 text-center bg-slate-50 border border-slate-200 py-4 rounded-xl">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {isReceipt 
                  ? (language === 'ar' ? 'وصل إيداع مطلب مساعدة اجتماعية' : 'RÉCÉPISSÉ DE DÉPÔT DE DEMANDE D’AIDE')
                  : (language === 'ar' ? 'قرار إسناد مساعدة مالية واجتماعية' : 'NOTIFICATION D’OCTROI D’AIDE SOCIALE')}
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Réf: {application.referenceNumber} • Session {new Date().getFullYear()}
              </p>
            </div>

            {/* Employee Identification Card */}
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1 flex items-center justify-between">
                  <span>{language === 'ar' ? 'بيانات الموظف(ة) المعني(ة):' : 'Identité du Collaborateur :'}</span>
                  <span className="font-mono text-[11px] text-emerald-800 font-bold">
                    {application.employeeMatricule}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 font-medium ml-1">
                      {language === 'ar' ? 'الاسم واللقب:' : 'Nom & Prénom :'}
                    </span>
                    <span className="font-bold">{application.employeeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium ml-1">
                      {language === 'ar' ? 'الإدارة المعنية:' : 'Direction :'}
                    </span>
                    <span>{application.employeeDepartment}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium ml-1">
                      {language === 'ar' ? 'الإدارة الجهوية / الإقليم:' : 'District / Région :'}
                    </span>
                    <span>{application.employeeRegion}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium ml-1">
                      {language === 'ar' ? 'الهاتف المهني:' : 'Téléphone :'}
                    </span>
                    <span>{application.employeePhone}</span>
                  </div>
                </div>
              </div>

              {/* Dossier Information */}
              <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1">
                  {language === 'ar' ? 'بيانات الملف والمساعدة المطلوبة:' : 'Objet & Modalités de l’Aide :'}
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 font-medium ml-1">
                      {language === 'ar' ? 'صنف المساعدة:' : 'Catégorie :'}
                    </span>
                    <span className="font-bold text-slate-900">{application.categoryTitle}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium ml-1">
                      {language === 'ar' ? 'الموضوع:' : 'Objet :'}
                    </span>
                    <span>{application.subject}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium ml-1">
                      {language === 'ar' ? 'المبلغ المطلوب:' : 'Montant sollicité :'}
                    </span>
                    <span className="font-bold">{application.requestedAmountTND || '-'} د.ت</span>
                  </div>
                  {application.finalAmountTND && (
                    <div>
                      <span className="text-slate-400 font-medium ml-1">
                        {language === 'ar' ? 'المبلغ المقبول للإسناد:' : 'Montant accordé :'}
                      </span>
                      <span className="font-black text-emerald-800 text-sm">
                        {application.finalAmountTND} د.ت
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Decision Section (if decision notice) */}
              {!isReceipt && application.decision && (
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-300">
                  <div className="font-bold text-emerald-950 mb-2 border-b border-emerald-200 pb-1">
                    {language === 'ar' ? 'قرار لجنة العمل الاجتماعي وتأشيرة الإسناد:' : 'Avis & Visa de la Commission :'}
                  </div>
                  <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-800">
                    <div>
                      <span className="text-slate-500 ml-1">{language === 'ar' ? 'رقم محضر الجلسة:' : 'N° P.V :'}</span>
                      <span className="font-bold font-mono text-emerald-900">{application.decision.pvNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 ml-1">{language === 'ar' ? 'تاريخ المصادقة:' : 'Date d’effet :'}</span>
                      <span>{application.decision.decisionDate}</span>
                    </div>
                    <div className="col-span-2 mt-1">
                      <span className="text-slate-500 block mb-1">{language === 'ar' ? 'تعليل القرار:' : 'Motifs retenus :'}</span>
                      <p className="bg-white p-2.5 rounded-lg border border-emerald-200 font-medium">
                        {application.decision.motivation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Uploaded Documents Inventory */}
              <div className="pt-2">
                <div className="font-bold text-slate-800 mb-1">
                  {language === 'ar' ? 'قائمة المؤيدات والوثائق المودعة قانوناً:' : 'Inventaire des pièces justificatives :'}
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">{language === 'ar' ? 'اسم الوثيقة' : 'Intitulé'}</th>
                        <th className="p-2.5">{language === 'ar' ? 'تاريخ الرفع' : 'Date'}</th>
                        <th className="p-2.5">{language === 'ar' ? 'الحالة' : 'Statut'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {application.documents.map((doc, idx) => (
                        <tr key={doc.id}>
                          <td className="p-2.5 text-slate-400 font-mono">{idx + 1}</td>
                          <td className="p-2.5 font-medium text-slate-800">{doc.fileName}</td>
                          <td className="p-2.5 text-slate-500">
                            {new Date(doc.uploadedAt).toLocaleDateString(language === 'ar' ? 'ar-TN' : 'fr-FR')}
                          </td>
                          <td className="p-2.5 text-emerald-700 font-bold">
                            {language === 'ar' ? 'مرفق ومؤمن' : 'Validé'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Official Seal and Signatures */}
              <div className="mt-8 pt-6 border-t-2 border-slate-200 flex justify-between items-end">
                <div className="text-center">
                  <div className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-1 text-slate-400">
                    <QrCode className="w-10 h-10 text-slate-600" />
                    <span className="text-[8px] font-mono mt-0.5">TT-SEC-SEAL</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {language === 'ar' ? 'الختم الإلكتروني للمنظومة' : 'Cachet Électronique'}
                  </span>
                </div>

                <div className="text-center space-y-1">
                  <div className="text-[11px] font-bold text-slate-800">
                    {language === 'ar' 
                      ? 'عن مصلحة العمل الاجتماعي والتعاونية' 
                      : 'Pour le Service d’Action Sociale TT'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {language === 'ar' ? 'رئيس مصلحة العمل الاجتماعي' : 'Chef de Division Action Sociale'}
                  </div>
                  <div className="h-12 flex items-center justify-center">
                    <span className="font-serif italic font-bold text-emerald-900 text-sm">
                      [ تأشيرة إلكترونية معتمدة ]
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer legal disclaimer */}
              <div className="mt-8 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                {language === 'ar'
                  ? 'هذه الوثيقة رسمية ومعتمدة إلكترونياً ضمن منظومة العمل الاجتماعي لاتصالات تونس. تخضع لأحكام القانون عدد 63 لسنة 2004 المتعلق بحماية المعطيات الشخصية.'
                  : 'Document officiel généré par le portail intranet du service social de Tunisie Telecom. Conforme aux exigences de l’INPDP.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
