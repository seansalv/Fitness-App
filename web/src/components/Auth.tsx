import { Loader2 } from 'lucide-react';
import { useState } from 'react';

type Props = {
  onComplete: () => void;
};

export function Auth({ onComplete }: Props) {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ alias: '', email: '', password: '' });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onComplete();
    }, 1500);
  };

  const updateField = (field: 'alias' | 'email' | 'password') => (event: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-6 pb-0">
        <div className="flex rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 rounded-lg transition-all ${
              mode === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Create hero
          </button>
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-3 rounded-lg transition-all ${
              mode === 'signin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
            }`}
          >
            Return to HQ
          </button>
        </div>
      </div>

      <div className="flex-1 p-6">
        <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto pt-8">
          {mode === 'signup' && (
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Hero alias</label>
              <input
                type="text"
                value={formData.alias}
                onChange={updateField('alias')}
                placeholder="What should we call you?"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={updateField('email')}
              placeholder="hero@example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={updateField('password')}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-8"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Syncing with HQ...
              </>
            ) : mode === 'signup' ? (
              'Create hero'
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

