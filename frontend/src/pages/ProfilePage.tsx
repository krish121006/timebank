import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserSkill } from '../types';
import { SkillChip } from '../components/ui/SkillChip';
import { User as UserIcon, Plus, Trash2, Star, Calendar, Clock, Globe } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Development');
  const [proficiency, setProficiency] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'>('INTERMEDIATE');
  const [mode, setMode] = useState<'TEACH' | 'LEARN'>('TEACH');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProfileSkills = async () => {
    try {
      const res = await api.get('/profile/me');
      setSkills(res.data.skills || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfileSkills();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/skills/me', {
        skillName,
        category,
        proficiency,
        mode,
        description,
        availabilityDays: ['Saturday', 'Sunday']
      });
      setShowAddSkill(false);
      setSkillName('');
      setDescription('');
      await fetchProfileSkills();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Remove this skill listing?')) return;
    try {
      await api.delete(`/skills/me/${skillId}`);
      await fetchProfileSkills();
    } catch (err) {
      console.error(err);
    }
  };

  const teachSkills = skills.filter((s) => s.mode === 'TEACH');
  const learnSkills = skills.filter((s) => s.mode === 'LEARN');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="card flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            {user?.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0F172A]">{user?.name}</h1>
              {user?.isPremium && (
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded border border-amber-300">
                  ⚡ Premium
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">@{user?.username} · {user?.timezone || 'UTC'}</p>
            <div className="flex items-center gap-3 text-xs text-slate-600 mt-2">
              <span className="flex items-center text-amber-600 font-semibold">
                ★ {user?.ratingAverage ?? 5.0} ({user?.ratingCount ?? 0} reviews)
              </span>
              <span>·</span>
              <span>{user?.completedExchangesCount ?? 0} sessions completed</span>
            </div>
          </div>
        </div>

        <button onClick={() => setShowAddSkill(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Add Skill Listing
        </button>
      </div>

      {/* Skills Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Can Teach Section */}
        <div className="card space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
              Skills I Can Teach
            </h2>
            <span className="text-xs font-semibold text-slate-400">{teachSkills.length} listed</span>
          </div>

          {teachSkills.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">No teaching skills listed yet. Add skills you can teach to earn time credits!</p>
          ) : (
            <div className="space-y-3">
              {teachSkills.map((s) => (
                <div key={s._id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex justify-between items-center">
                  <div>
                    <SkillChip name={s.skillName} category={s.category} proficiency={s.proficiency} mode="TEACH" />
                    <p className="text-xs text-slate-500 mt-1">{s.description || 'Available for 1-on-1 mentoring.'}</p>
                  </div>
                  <button onClick={() => handleDeleteSkill(s._id)} className="text-slate-400 hover:text-rose-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wants to Learn Section */}
        <div className="card space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Skills I Want to Learn
            </h2>
            <span className="text-xs font-semibold text-slate-400">{learnSkills.length} requested</span>
          </div>

          {learnSkills.length === 0 ? (
            <p className="text-slate-400 text-sm py-4">No learning requests listed. Add skills you want to learn!</p>
          ) : (
            <div className="space-y-3">
              {learnSkills.map((s) => (
                <div key={s._id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex justify-between items-center">
                  <div>
                    <SkillChip name={s.skillName} category={s.category} proficiency={s.proficiency} mode="LEARN" />
                    <p className="text-xs text-slate-500 mt-1">{s.description || 'Looking for guidance.'}</p>
                  </div>
                  <button onClick={() => handleDeleteSkill(s._id)} className="text-slate-400 hover:text-rose-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Skill Modal */}
      {showAddSkill && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-xl font-bold text-[#0F172A]">Add New Skill Listing</h3>

            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mode</label>
                <div className="flex gap-3">
                  <label className={`flex-1 text-center py-2 rounded-lg border text-sm font-semibold cursor-pointer ${mode === 'TEACH' ? 'bg-blue-50 text-[#2563EB] border-blue-300' : 'border-slate-200'}`}>
                    <input type="radio" name="mode" value="TEACH" checked={mode === 'TEACH'} onChange={() => setMode('TEACH')} className="hidden" />
                    Can Teach
                  </label>
                  <label className={`flex-1 text-center py-2 rounded-lg border text-sm font-semibold cursor-pointer ${mode === 'LEARN' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'border-slate-200'}`}>
                    <input type="radio" name="mode" value="LEARN" checked={mode === 'LEARN'} onChange={() => setMode('LEARN')} className="hidden" />
                    Want to Learn
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="e.g. React.js, Python, UI/UX Design"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Proficiency Level</label>
                <select value={proficiency} onChange={(e) => setProficiency(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe what you offer or need..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddSkill(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
