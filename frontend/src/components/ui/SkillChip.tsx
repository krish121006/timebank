import React from 'react';

interface SkillChipProps {
  name: string;
  category?: string;
  proficiency?: string;
  mode?: 'TEACH' | 'LEARN';
}

export const SkillChip: React.FC<SkillChipProps> = ({ name, category, proficiency, mode }) => {
  const isTeach = mode === 'TEACH';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${
        isTeach
          ? 'bg-blue-50 text-[#2563EB] border-blue-200'
          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
      }`}
    >
      <span>{name}</span>
      {proficiency && <span className="opacity-60">· {proficiency}</span>}
    </span>
  );
};
