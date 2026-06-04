import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/authSlice';
import { useAuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import API from '../services/api';

const TABS = ['Profile', 'Account', 'Appearance', 'Notifications'];

const Settings = () => {
  const user = useSelector(selectUser);
  const { refreshUser } = useAuthContext();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('Profile');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    email: user?.email || '',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put(`/users/${user._id}`, form);
      await refreshUser();
      toast.success('Settings saved!');
    } catch { toast.error('Failed to save settings'); } finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-gray-900 p-1 rounded-xl overflow-x-auto hide-scrollbar">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'
              }`}>{tab}</button>
          ))}
        </div>

        {/* Profile tab */}
        {activeTab === 'Profile' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white">Public profile</h2>
            <div className="flex items-center gap-4">
              <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=7C3AED&color=fff&size=80`}
                alt="" className="w-20 h-20 rounded-full object-cover border-2 border-violet-500/40" />
              <div>
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm text-white rounded-lg transition-colors">Change avatar</button>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 5MB</p>
              </div>
            </div>
            {[{key:'username',label:'Username'},{key:'bio',label:'Bio',multi:true}].map(f => (
              <div key={f.key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-300">{f.label}</label>
                {f.multi ? (
                  <textarea value={form[f.key]} onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))} rows={3} maxLength={300}
                    className="w-full bg-gray-800 border border-gray-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none resize-none transition-colors" />
                ) : (
                  <input type="text" value={form[f.key]} onChange={e => setForm(p=>({...p,[f.key]:e.target.value}))}
                    className="w-full bg-gray-800 border border-gray-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors" />
                )}
              </div>
            ))}
            <button onClick={handleSave} disabled={saving}
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        )}

        {/* Account tab */}
        {activeTab === 'Account' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white">Account</h2>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))}
                className="w-full bg-gray-800 border border-gray-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors" />
            </div>
            <div className="pt-4 border-t border-gray-800">
              <h3 className="text-base font-medium text-red-400 mb-2">Danger zone</h3>
              <button className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-400 text-sm rounded-lg transition-colors">
                Delete account
              </button>
            </div>
          </div>
        )}

        {/* Appearance tab */}
        {activeTab === 'Appearance' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white">Appearance</h2>
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
              <div>
                <p className="text-sm font-medium text-white">Dark mode</p>
                <p className="text-xs text-gray-400">Switch between light and dark themes</p>
              </div>
              <button onClick={toggleTheme}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-violet-600' : 'bg-gray-600'
                }`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        )}

        {/* Notifications tab */}
        {activeTab === 'Notifications' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
            {[
              { label: 'New subscribers', desc: 'When someone subscribes to your channel' },
              { label: 'Comments', desc: 'When someone comments on your video' },
              { label: 'Likes', desc: 'When someone likes your video' },
              { label: 'Watch party invites', desc: 'When you are invited to a watch party' },
              { label: 'Community mentions', desc: 'When you are mentioned in a community' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <button className="relative w-12 h-6 rounded-full bg-violet-600">
                  <span className="absolute top-1 w-4 h-4 bg-white rounded-full shadow translate-x-7" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
