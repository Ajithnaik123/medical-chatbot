import { useState } from 'react';
import { useStore, PageRoute } from '../../store/useStore';
import { initialUsers } from '../../data/initialData';
import {
  Activity,
  MessageSquare,
  History,
  BookOpen,
  CalendarHeart,
  ShieldCheck,
  Lock,
  Volume2,
  VolumeX,
  Languages,
  UserCheck,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Stethoscope,
} from 'lucide-react';

export function Navbar() {
  const {
    currentPage,
    setPage,
    currentUser,
    switchDemoUser,
    logout,
    language,
    setLanguage,
    ttsEnabled,
    setTtsEnabled,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navLinks: Array<{ id: PageRoute; label: string; icon: any }> = [
    { id: 'home', label: 'Home', icon: Activity },
    { id: 'chat', label: 'AI Chatbot', icon: MessageSquare },
    { id: 'history', label: 'History', icon: History },
    { id: 'diary', label: 'Symptom Diary', icon: CalendarHeart },
    { id: 'resources', label: 'Health Library', icon: BookOpen },
    { id: 'privacy', label: 'Privacy & Consent', icon: ShieldCheck },
  ];

  if (currentUser?.role === 'admin') {
    navLinks.push({ id: 'admin', label: 'Admin Portal', icon: Lock });
  }

  const languages = [
    { code: 'en' as const, name: 'English', native: 'English' },
    { code: 'te' as const, name: 'Telugu', native: 'తెలుగు' },
    { code: 'hi' as const, name: 'Hindi', native: 'हिंदी' },
    { code: 'es' as const, name: 'Spanish', native: 'Español' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-teal-600 transition-colors">
                    MediCare <span className="text-teal-600 font-black">AI</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200/60 rounded">
                    Clinical Aid
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 leading-none">
                  Structured Symptom Guidance
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setPage(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2">
            {/* Text-to-Speech Toggle */}
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              title={ttsEnabled ? 'Audio Speech Reader is ON' : 'Turn ON Audio Speech Reader'}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                ttsEnabled
                  ? 'bg-teal-50 border-teal-300 text-teal-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {ttsEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-teal-600 animate-pulse" />
                  <span className="hidden sm:inline text-xs font-semibold">Speech ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span className="hidden sm:inline text-xs">Speech OFF</span>
                </>
              )}
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                title="Select Consultation Language"
              >
                <Languages className="w-4 h-4 text-teal-600" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setLangDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Language
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-teal-50 hover:text-teal-700 transition-colors ${
                        language === l.code ? 'font-bold text-teal-700 bg-teal-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.name}</span>
                      <span className="text-[11px] text-slate-400">{l.native}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile & Demo Switcher */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-100 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-500 leading-none capitalize">
                      {currentUser.age} yrs • {currentUser.ageGroup}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="p-3 bg-slate-50 rounded-xl mb-2">
                      <div className="font-bold text-sm text-slate-900">{currentUser.name}</div>
                      <div className="text-xs text-slate-500">{currentUser.email}</div>
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-teal-100 text-teal-800">
                          Age: {currentUser.age} ({currentUser.ageGroup})
                        </span>
                        {currentUser.role === 'admin' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                            Clinical Admin
                          </span>
                        )}
                        {currentUser.allergies.length > 0 && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-rose-100 text-rose-800">
                            Allergies: {currentUser.allergies.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Demo Patient Profile:
                    </div>
                    <div className="space-y-1 mb-2">
                      {initialUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchDemoUser(u.id);
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-slate-100 transition-colors ${
                            currentUser.id === u.id ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <UserCheck className={`w-3.5 h-3.5 ${currentUser.id === u.id ? 'text-teal-600' : 'text-slate-400'}`} />
                            <span>{u.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {u.age}y ({u.ageGroup})
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          setPage('profile');
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                      >
                        Manage Health Profile & Allergies
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage('login')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                >
                  Log In
                </button>
                <button
                  onClick={() => setPage('register')}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setPage(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
