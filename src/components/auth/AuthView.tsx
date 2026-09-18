import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle, 
  KeyRound, 
  CheckCircle2, 
  Building2, 
  FileText, 
  BarChart3, 
  HeartHandshake, 
  Eye, 
  EyeOff,
  Sparkles
} from 'lucide-react';
import { User as UserType, Language } from '../../types';

interface AuthViewProps {
  onLogin: (user: UserType) => void;
  availableUsers: UserType[];
  language: Language;
  onCancel?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLogin,
  availableUsers,
  language,
  onCancel
}) => {
  const [selectedRole, setSelectedRole] = useState<'employee' | 'social_worker' | 'admin'>('employee');
  const [matriculeInput, setMatriculeInput] = useState<string>('TT-48291');
  const [passwordInput, setPasswordInput] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick select role helper
  const handleSelectRolePreset = (role: 'employee' | 'social_worker' | 'admin') => {
    setSelectedRole(role);
    setErrorMsg(null);
    if (role === 'employee') {
      setMatriculeInput('TT-48291');
    } else if (role === 'social_worker') {
      setMatriculeInput('TT-21045');
    } else if (role === 'admin') {
      setMatriculeInput('TT-08914');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Find corresponding user by matricule or role
    const matchedUser = availableUsers.find(
      u => u.matricule.toLowerCase() === matriculeInput.trim().toLowerCase() ||
           (u.role === selectedRole) ||
           (selectedRole === 'admin' && u.role === 'admin')
    );

    if (matchedUser) {
      onLogin(matchedUser);
    } else {
      // Fallback to first user of selected role
      const fallback = availableUsers.find(u => u.role === selectedRole) || availableUsers[0];
      onLogin(fallback);
    }
  };

  const isFrench = language === 'fr';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Brand Banner */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white shadow-lg mb-4">
          <HeartHandshake className="w-9 h-9 text-blue-100" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {isFrench ? 'Portail d’Action Sociale & Solidarité' : 'بوابة العمل الاجتماعي والتضامن'}
        </h2>
        <p className="mt-1 text-sm font-semibold text-blue-700">
          {isFrench ? 'Société Nationale des Télécommunications • Tunisie Telecom' : 'الشركة الوطنية للاتصالات • اتصالات تونس'}
        </p>
        <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto">
          {isFrench 
            ? 'Accès sécurisé réservé aux collaborateurs, assistantes sociales et administrateurs SI'
            : 'فضاء مؤمن ومخصص حصرياً لأعوان اتصالات تونس والمصالح الاجتماعية'}
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 sm:rounded-3xl border border-slate-200">
          
          {/* Quick Demo Role Picker with 3 Distinct Archetypes */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {isFrench ? '1. Choisissez votre profil pour accéder à son interface dédiée :' : '1. اختر صفتك للدخول المباشر إلى واجهتك المخصصة :'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Employee */}
              <button
                type="button"
                onClick={() => handleSelectRolePreset('employee')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  selectedRole === 'employee'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  {selectedRole === 'employee' && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="font-bold text-xs text-slate-900">
                    {isFrench ? 'Employé TT' : 'الموظف'}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">
                    Sami Ben Ammar
                  </div>
                  <div className="text-[10px] font-mono text-blue-700 font-semibold mt-0.5">
                    TT-48291
                  </div>
                </div>
              </button>

              {/* Social Worker */}
              <button
                type="button"
                onClick={() => handleSelectRolePreset('social_worker')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  selectedRole === 'social_worker'
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  {selectedRole === 'social_worker' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="font-bold text-xs text-slate-900">
                    {isFrench ? 'Agent Social' : 'المساعد الاجتماعي'}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">
                    Mme Leila Trabelsi
                  </div>
                  <div className="text-[10px] font-mono text-emerald-700 font-semibold mt-0.5">
                    TT-21045
                  </div>
                </div>
              </button>

              {/* IT Admin & Data Analytics */}
              <button
                type="button"
                onClick={() => handleSelectRolePreset('admin')}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  selectedRole === 'admin'
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  {selectedRole === 'admin' && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="font-bold text-xs text-slate-900">
                    {isFrench ? 'Admin IT (Data)' : 'مسؤول إعلامية وتحليل'}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">
                    Karim Mansouri
                  </div>
                  <div className="text-[10px] font-mono text-indigo-700 font-semibold mt-0.5">
                    TT-08914
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isFrench ? 'Matricule Télécom ou Identifiant Réseau :' : 'المعرف المالي أو المعرف الإداري :'}
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <input
                  type="text"
                  required
                  value={matriculeInput}
                  onChange={(e) => setMatriculeInput(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  placeholder="ex. TT-48291"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isFrench ? 'Mot de passe Réseau Intranet :' : 'كلمة المرور لشبكة الإنترانت :'}
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>{isFrench ? 'Mémoriser ma session sur ce poste' : 'تذكر الجلسة على هذا الحاسوب'}</span>
              </label>
              <span className="text-blue-700 font-semibold hover:underline cursor-pointer">
                {isFrench ? 'Assistance DSI / Mot de passe oublié ?' : 'المساعدة الفنية / نسيت كلمة المرور؟'}
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full mt-2 flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition"
            >
              <span>
                {isFrench 
                  ? `Se connecter à l'espace ${selectedRole === 'employee' ? 'Employé' : selectedRole === 'social_worker' ? 'Agent Social' : 'Admin IT'}`
                  : `تسجيل الدخول إلى فضاء ${selectedRole === 'employee' ? 'الموظف' : selectedRole === 'social_worker' ? 'المساعد الاجتماعي' : 'المشرف الإعلامي'}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Security details & INPDP mention */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-3 text-[11px] text-slate-500">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">
                {isFrench ? 'Authentification Sécurisée & Chiffrée (INPDP)' : 'مصادقة مؤمنة ومشفرة (الهيئة الوطنية لحماية المعطيات الشخصية)'}
              </strong>
              <p className="mt-0.5 leading-relaxed">
                {isFrench 
                  ? 'Connexion sécurisée via le serveur d’authentification d’entreprise Tunisie Telecom. Toute tentative d’accès non autorisé est tracée et enregistrée.'
                  : 'اتصال مشفر ومطابق لقانون حماية المعطيات الشخصية عدد 63 لسنة 2004. كافة العمليات مسجلة بسجل التدقيق الرقمي.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
