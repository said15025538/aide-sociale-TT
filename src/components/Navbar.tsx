import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User as UserIcon, 
  Bell, 
  Globe, 
  ChevronDown, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  Clock,
  Sparkles,
  Palette,
  HeartHandshake
} from 'lucide-react';
import { User, UserRole, Language, NotificationItem } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  currentUser: User;
  onSwitchUser: (userId: string) => void;
  allUsers: User[];
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeView: 'app' | 'spec';
  onViewChange: (view: 'app' | 'spec') => void;
  notifications: NotificationItem[];
  onOpenNotification: (appId?: string) => void;
  activeTheme?: 'emerald' | 'ocean' | 'warm';
  onThemeChange?: (theme: 'emerald' | 'ocean' | 'warm') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchUser,
  allUsers,
  language,
  onLanguageChange,
  activeView,
  onViewChange,
  notifications,
  onOpenNotification,
  activeTheme = 'emerald',
  onThemeChange
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const t = translations[language];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'employee': return t.roleEmployee;
      case 'social_worker': return t.roleSocialWorker;
      case 'social_manager': return t.roleManager;
      case 'admin': return t.roleAdmin;
    }
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case 'employee': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'social_worker': return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'social_manager': return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'admin': return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Banner - Simpler and in fresh soft tone */}
      <div className="bg-emerald-800 text-emerald-50 text-xs px-4 py-1.5 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs">
          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            {language === 'ar' ? 'منظومة داخلية مؤمنة • اتصالات تونس' : 'INTRANET SÉCURISÉ • TUNISIE TELECOM'}
          </span>
          <span className="hidden sm:inline text-emerald-400">|</span>
          <span className="hidden md:inline text-emerald-100">
            {language === 'ar' 
              ? 'مصلحة العمل الاجتماعي والتعاونية • حماية المعطيات الشخصية INPDP'
              : 'Direction Capital Humain • Conformité INPDP (Loi 2004-63)'}
          </span>
        </div>

        {/* Quick Role & Theme Switchers */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Palette Chooser */}
          {onThemeChange && (
            <div className="relative">
              <button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="flex items-center gap-1 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100 px-2 py-0.5 rounded text-[11px] transition"
                title={language === 'ar' ? 'تغيير الألوان' : 'Changer les couleurs'}
              >
                <Palette className="w-3 h-3 text-emerald-300" />
                <span className="hidden sm:inline">
                  {language === 'ar' ? 'الألوان' : 'Thème'}
                </span>
              </button>

              {showThemeMenu && (
                <div className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} mt-1.5 w-48 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1 z-50`}>
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    {language === 'ar' ? 'اختر نسق الألوان' : 'Palette de couleurs'}
                  </div>
                  <button
                    onClick={() => { onThemeChange('emerald'); setShowThemeMenu(false); }}
                    className={`w-full px-3 py-2 text-right text-xs flex items-center justify-between hover:bg-emerald-50 ${activeTheme === 'emerald' ? 'font-bold text-emerald-700 bg-emerald-50/50' : ''}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
                      {language === 'ar' ? 'أخضر التضامن (افتراضي)' : 'Émeraude Solidarité'}
                    </span>
                    {activeTheme === 'emerald' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  <button
                    onClick={() => { onThemeChange('ocean'); setShowThemeMenu(false); }}
                    className={`w-full px-3 py-2 text-right text-xs flex items-center justify-between hover:bg-teal-50 ${activeTheme === 'ocean' ? 'font-bold text-teal-700 bg-teal-50/50' : ''}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-teal-600 inline-block"></span>
                      {language === 'ar' ? 'أزرق محيطي هادئ' : 'Bleu Océan Doux'}
                    </span>
                    {activeTheme === 'ocean' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                  </button>
                  <button
                    onClick={() => { onThemeChange('warm'); setShowThemeMenu(false); }}
                    className={`w-full px-3 py-2 text-right text-xs flex items-center justify-between hover:bg-amber-50 ${activeTheme === 'warm' ? 'font-bold text-amber-800 bg-amber-50/50' : ''}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-600 inline-block"></span>
                      {language === 'ar' ? 'عنبري دافئ' : 'Ambre Chaleureux'}
                    </span>
                    {activeTheme === 'warm' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Persona Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 bg-emerald-900/70 hover:bg-emerald-900 px-2.5 py-0.5 rounded text-xs text-white transition border border-emerald-700/50"
            >
              <span className="text-emerald-200 text-[11px] hidden sm:inline">
                {language === 'ar' ? 'الصفة الحالية:' : 'Rôle:'}
              </span>
              <span className="font-bold text-white text-[11px]">{getRoleLabel(currentUser.role)}</span>
              <ChevronDown className="w-3 h-3 text-emerald-300" />
            </button>

            {showRoleMenu && (
              <div className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} mt-1.5 w-72 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50`}>
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  {language === 'ar' ? 'اختر الحساب للتجربة' : 'Sélectionner un profil de test'}
                </div>
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u.id);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                      currentUser.id === u.id ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name.substring(0, 1)}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-800">{u.name}</div>
                        <div className="text-[10px] text-slate-500">{u.grade}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${getRoleBadgeStyle(u.role)}`}>
                      {getRoleLabel(u.role)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Clean Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Main Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-extrabold shadow-sm text-base">
              TT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  {language === 'ar' ? 'اتصالات تونس' : 'Tunisie Telecom'}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {language === 'ar' ? 'العمل الاجتماعي' : 'Action Sociale'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {language === 'ar' 
                  ? 'بوابة المساعدات والإعانات لمنظوري اتصالات تونس'
                  : 'Portail des Aides Sociales & Prêts Exceptionnels'}
              </p>
            </div>
          </div>

          {/* Simple Navigation / Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* View Switcher: Interactive App vs Specifications */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => onViewChange('app')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                  activeView === 'app'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'ar' ? 'المنظومة' : 'Portail'}</span>
              </button>

              <button
                onClick={() => onViewChange('spec')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                  activeView === 'spec'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">{language === 'ar' ? 'كراس الشروط' : 'Cahier des charges'}</span>
                <span className="md:hidden">DOC</span>
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs font-bold">
              <button
                onClick={() => onLanguageChange('ar')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  language === 'ar' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => onLanguageChange('fr')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  language === 'fr' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fr
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50`}>
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">
                      {language === 'ar' ? 'الإشعارات والتنبيهات' : 'Notifications'}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      {unreadCount} {language === 'ar' ? 'جديد' : 'non lues'}
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">
                        {language === 'ar' ? 'لا توجد إشعارات حالياً' : 'Aucune notification'}
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            onOpenNotification(n.applicationId);
                            setShowNotifMenu(false);
                          }}
                          className={`p-3 text-right text-xs hover:bg-slate-50 cursor-pointer transition ${
                            !n.read ? 'bg-emerald-50/30' : ''
                          }`}
                        >
                          <div className="font-bold text-slate-800">{n.title}</div>
                          <div className="text-slate-600 mt-0.5 line-clamp-2">{n.message}</div>
                          <div className="text-[10px] text-slate-400 mt-1">{n.timestamp}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Current User Quick Avatar */}
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold flex items-center justify-center text-xs">
                {currentUser.name.substring(0, 1)}
              </div>
              <div className="hidden lg:block text-right">
                <div className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500">{currentUser.matricule}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
