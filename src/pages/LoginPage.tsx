import { useState } from 'react';
import { useStore } from '../store/useStore';
import { api } from '../services/api';
import { Lock, Mail, ArrowRight, UserCheck, Stethoscope } from 'lucide-react';

export function LoginPage() {
  const { setCurrentUser, setPage, addToast } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await api.login(email, password);
      setCurrentUser(res.user);
      addToast(`Welcome back, ${res.user.name}!`, 'success');
      setPage('dashboard');
    } catch (err: any) {
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    try {
      const res = await api.login(demoEmail);
      setCurrentUser(res.user);
      addToast(`Logged in as ${res.user.name}`, 'success');
      setPage('dashboard');
    } catch (err: any) {
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-md shadow-slate-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-teal-500 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-500/20">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Sign in to MediCare AI</h2>
          <p className="text-xs text-slate-500">
            Access your symptoms, triage consultations, and health history.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ajith@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="border-t border-slate-100 pt-4 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Or test with verified demo profiles:
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ajith@example.com')}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:bg-teal-50 hover:border-teal-300 text-xs flex items-center justify-between transition-colors"
            >
              <div>
                <span className="font-bold text-slate-900">Ajith</span>
                <span className="text-slate-500 ml-1.5">(22y • Adult • Penicillin allergy)</span>
              </div>
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@medicare.ai')}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:bg-amber-50 hover:border-amber-300 text-xs flex items-center justify-between transition-colors"
            >
              <div>
                <span className="font-bold text-slate-900">Dr. Sarah Vance</span>
                <span className="text-slate-500 ml-1.5">(Clinical Admin Portal)</span>
              </div>
              <UserCheck className="w-3.5 h-3.5 text-amber-600" />
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          New to MediCare AI?{' '}
          <button
            onClick={() => setPage('register')}
            className="text-teal-600 hover:text-teal-700 font-bold underline ml-1"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}
