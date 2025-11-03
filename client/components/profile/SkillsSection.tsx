// components/profile/SkillsSection.tsx
import { Skill } from '@/types';

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  if (skills.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-700 mb-3">Skills</h3>
        <p className="text-gray-500 text-sm">No skills listed yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="font-semibold text-gray-700 mb-3">Skills</h3>
      <div className="space-y-3">
        {skills.map(skill => (
          <div key={skill.name} className="flex items-center justify-between">
            <span className="text-gray-700">{skill.name}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`text-lg ${i < skill.level ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}