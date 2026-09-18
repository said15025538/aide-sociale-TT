import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Settings, 
  Users, 
  Database, 
  FileCode, 
  Lock, 
  Check, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  Download,
  KeyRound,
  FileText
} from 'lucide-react';
import { AssistanceCategory, AuditLog, User, UserRole, Language } from '../../types';

interface AdminDashboardProps {
  currentUser: User;
  categories: AssistanceCategory[];
  auditLogs: AuditLog[];
  onUpdateCategory: (updatedCat: AssistanceCategory) => void;
  language?: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  categories,
  auditLogs,
  onUpdateCategory,
  language = 'ar'
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'audit' | 'security' | 'roles'>('categories');
  const [editingCategory, setEditingCategory] = useState<AssistanceCategory | null>(null);

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    onUpdateCategory(editingCategory);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {language === 'ar' ? 'الإدارة العامة والحوكمة الرقمية' : 'Espace Administration & Gouvernance SI'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1 tracking-tight">
            {language === 'ar' ? 'تهيئة النظام وسجل التدقيق القانوني (INPDP)' : 'Paramétrage & Journal d’Audit Légal (INPDP)'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {language === 'ar'
              ? 'إدارة أصناف المساعدات الاجتماعية، قواعد المصادقة، والوثائق الإجبارية، وضمان التتبع الكامل لسلامة المعطيات الحساسة.'
              : 'Gestion des catégories d’aide sociale, des règles de validation, des pièces obligatoires et traçabilité inviolable.'}
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="text-xs text-slate-400">
            {language === 'ar' ? 'المشرف المتصل' : 'Administrateur connecté'}
          </div>
          <div className="text-sm font-bold text-slate-200">{currentUser.name}</div>
          <div className="text-[11px] text-emerald-400 font-mono">{currentUser.matricule} • DSI/Sécurité</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex flex-wrap gap-4 sm:gap-6">
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'categories'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'ar' ? `أصناف المساعدات والأسقف (${categories.length})` : `Catégories d’aides & Barèmes (${categories.length})`}
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`pb-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'audit'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'ar' ? `سجل التتبع والتدقيق INPDP (${auditLogs.length})` : `Journal d’Audit INPDP (${auditLogs.length})`}
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`pb-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'roles'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'ar' ? 'مصفوفة الصلاحيات والأدوار (RBAC)' : 'Matrice des Rôles (RBAC)'}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'security'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'ar' ? 'الأمان والتشفير وSSO' : 'Sécurité, Chiffrement & SSO'}
          </button>
        </nav>
      </div>

      {/* TAB 1: CATEGORIES & RULES CONFIG */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {language === 'ar' ? 'قواعد ومعايير المساعدات الاجتماعية' : 'Prestations Sociales Configurables'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'ar'
                  ? 'تعديل الأسقف المالية، والآجال التقديرية، والوثائق المطلوبة بصورة مباشرة ودون الحاجة لتعديل برمجي.'
                  : 'Modifiez les plafonds en TND et les délais SLA sans recompilation logicielle.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                      {cat.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {language === 'ar' ? (cat.titleAr || cat.title) : cat.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-slate-100 transition"
                    title={language === 'ar' ? 'تعديل المعايير' : 'Modifier la règle'}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 block">{language === 'ar' ? 'السقف المالي' : 'Plafond'}</span>
                    <strong className="text-emerald-800">{cat.ceilingAmountTND} د.ت</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{language === 'ar' ? 'أجل المعالجة' : 'Délai SLA'}</span>
                    <strong className="text-slate-800">{cat.slaDays} {language === 'ar' ? 'أيام' : 'jours'}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    {language === 'ar' ? `الوثائق المطلوبة (${cat.requiredDocuments.length}):` : `Pièces obligatoires (${cat.requiredDocuments.length}) :`}
                  </span>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {cat.requiredDocuments.map(doc => (
                      <li key={doc.id} className="flex items-center justify-between">
                        <span>• {doc.name}</span>
                        {doc.isMandatory && (
                          <span className="text-[10px] text-rose-600 font-bold">
                            {language === 'ar' ? 'إجباري' : 'Requis'}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Modal */}
          {editingCategory && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <form onSubmit={handleSaveCategory} className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'ar' ? `تهيئة: ${editingCategory.titleAr || editingCategory.title}` : `Configurer : ${editingCategory.title}`}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'ar' ? 'السقف المالي التقديري (د.ت):' : 'Plafond budgétaire (TND) :'}
                  </label>
                  <input
                    type="number"
                    value={editingCategory.ceilingAmountTND}
                    onChange={(e) => setEditingCategory({ ...editingCategory, ceilingAmountTND: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {language === 'ar' ? 'أجل المعالجة التعاقدي (بالأيام):' : 'Délai SLA (jours) :'}
                  </label>
                  <input
                    type="number"
                    value={editingCategory.slaDays}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slaDays: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 rounded-xl border border-slate-300 font-bold"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold shadow-xs hover:bg-emerald-800"
                  >
                    {language === 'ar' ? 'حفظ التعديلات' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">
                {language === 'ar' ? 'السجل المركزي لعمليات الدخول والاطلاع الطبي' : 'Journal Centralisé des Événements & Accès Médicaux'}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {language === 'ar' ? 'بصمة زمنية غير قابلة للتعديل • مطابق للمادة 47 من قانون حماية المعطيات الشخصية INPDP' : 'Horodatage UTC inaltérable • Loi 2004-63 INPDP'}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">{language === 'ar' ? 'التاريخ والوقت' : 'Horodatage'}</th>
                  <th className="p-3">{language === 'ar' ? 'المستخدم' : 'Utilisateur'}</th>
                  <th className="p-3">{language === 'ar' ? 'الصفة' : 'Rôle'}</th>
                  <th className="p-3">{language === 'ar' ? 'العملية المنجزة' : 'Action'}</th>
                  <th className="p-3">{language === 'ar' ? 'الملف / المرجع' : 'Cible'}</th>
                  <th className="p-3">{language === 'ar' ? 'الخطورة' : 'Gravité'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-500">{new Date(log.timestamp).toLocaleString(language === 'ar' ? 'ar-TN' : 'fr-FR')}</td>
                    <td className="p-3 font-sans font-semibold text-slate-800">{log.userName}</td>
                    <td className="p-3 font-sans">
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold">{log.userRole}</span>
                    </td>
                    <td className="p-3 font-bold text-emerald-800">{log.action}</td>
                    <td className="p-3 font-semibold text-slate-700">{log.resourceId || log.resource}</td>
                    <td className="p-3">
                      {log.severity === 'security' ? (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">
                          {language === 'ar' ? 'أمان' : 'SÉCURITÉ'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {language === 'ar' ? 'إعلام' : 'INFO'}
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

      {/* TAB 3: ROLES & RBAC MATRIX */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4 text-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {language === 'ar' ? 'مصفوفة الصلاحيات والحصانات (RBAC)' : 'Matrice des Permissions & Habilitations (RBAC)'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'ar'
                ? 'تطبيق مبدأ الحد الأدنى من الامتيازات على المعطيات الشخصية لموظفي اتصالات تونس.'
                : 'Principe du moindre privilège appliqué aux données sensibles.'}
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-right text-xs">
              <thead className="bg-emerald-800 text-white">
                <tr>
                  <th className="p-3">{language === 'ar' ? 'الصلاحية والوظيفة' : 'Capacité Fonctionnelle'}</th>
                  <th className="p-3 text-center">{language === 'ar' ? 'الموظف' : 'Employé'}</th>
                  <th className="p-3 text-center">{language === 'ar' ? 'المساعد الاجتماعي' : 'Assistante Sociale'}</th>
                  <th className="p-3 text-center">{language === 'ar' ? 'رئيس المصلحة' : 'Responsable Social'}</th>
                  <th className="p-3 text-center">{language === 'ar' ? 'مشرف المنظومة' : 'Administrateur DSI'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold">{language === 'ar' ? 'تقديم مطلب مساعدة شخصي' : 'Créer une demande'}</td>
                  <td className="p-3 text-center text-emerald-600 font-bold">✓ ({language === 'ar' ? 'ملفاته فقط' : 'Ses dossiers'})</td>
                  <td className="p-3 text-center text-slate-400">-</td>
                  <td className="p-3 text-center text-slate-400">-</td>
                  <td className="p-3 text-center text-slate-400">-</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold">{language === 'ar' ? 'الاطلاع على الوثائق الطبية السرية' : 'Consulter pièces médicales'}</td>
                  <td className="p-3 text-center text-emerald-600 font-bold">✓ ({language === 'ar' ? 'وثائقه فقط' : 'Ses pièces'})</td>
                  <td className="p-3 text-center text-emerald-600 font-bold">✓ ({language === 'ar' ? 'كامل الملفات' : 'Tous'})</td>
                  <td className="p-3 text-center text-emerald-600 font-bold">✓ ({language === 'ar' ? 'عند التحكيم' : 'Arbitrage'})</td>
                  <td className="p-3 text-center text-rose-500 font-bold">✗ {language === 'ar' ? 'ممنوع قانوناً' : 'Interdit'}</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold">{language === 'ar' ? 'تأشيرة الصرف والمصادقة النهائية' : 'Signer l’octroi'}</td>
                  <td className="p-3 text-center text-slate-400">-</td>
                  <td className="p-3 text-center text-amber-600 font-bold">{language === 'ar' ? 'مقترح فقط' : 'Proposition'}</td>
                  <td className="p-3 text-center text-emerald-600 font-bold">✓ {language === 'ar' ? 'تأشيرة قانونية' : 'Visa'}</td>
                  <td className="p-3 text-center text-slate-400">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & SSO */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <KeyRound className="w-4 h-4 text-emerald-700" />
              {language === 'ar' ? 'التسجيل الموحد SSO لاتصالات تونس' : 'Authentification & SSO Entreprise TT'}
            </div>
            <p className="text-slate-500 leading-relaxed">
              {language === 'ar'
                ? 'الربط الآمن مع دليل الموظفين Active Directory / LDAP المركزي لاتصالات تونس وبروتوكول SAML 2.0.'
                : 'Intégration Active Directory / LDAP Tunisie Telecom et SAML 2.0.'}
            </p>
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span>{language === 'ar' ? 'حالة الربط SSO TT-ADFS:' : 'Connecteur SSO :'}</span>
                <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  {language === 'ar' ? 'متصل ومؤمن' : 'Actif & Connecté'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>{language === 'ar' ? 'المصادقة الثنائية (OTP / SMS):' : 'Double facteur (2FA) :'}</span>
                <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  {language === 'ar' ? 'إجباري للمساعدين ورئيس المصلحة' : 'Obligatoire'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Lock className="w-4 h-4 text-emerald-700" />
              {language === 'ar' ? 'تشفير الوثائق والمعطيات' : 'Chiffrement des Données & Documents'}
            </div>
            <p className="text-slate-500 leading-relaxed">
              {language === 'ar'
                ? 'امتثال كامل للمعايير الوطنية للهيئة الوطنية لحماية المعطيات الشخصية INPDP بخصوص الملفات الطبية والمالية.'
                : 'Conformité stricte aux exigences de l’INPDP.'}
            </p>
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <span>{language === 'ar' ? 'التشفير أثناء النقل:' : 'En transit :'}</span>
                <span className="font-bold text-slate-800">TLS 1.3 Strict</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{language === 'ar' ? 'التشفير في التخزين:' : 'Au repos :'}</span>
                <span className="font-bold text-slate-800">AES-256 (KMS TT)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
