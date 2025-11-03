// app/profile/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { usersAPI } from '@/lib/api/users';
import { User, Skill } from '@/types';

export default function EditProfilePage() {
  const { user, getCurrentUser } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    title: '',
    experience: '',
    bio: '',
    location: '',
    remotePolicy: 'Hybrid Preferred',
    desiredRoles: [],
    targetCompanies: [],
    skills: [],
  });
  const [newSkill, setNewSkill] = useState({ name: '', level: 3 });
  const [newRole, setNewRole] = useState('');
  const [newCompany, setNewCompany] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        title: user.title || '',
        experience: user.experience || '',
        bio: user.bio || '',
        location: user.location || '',
        remotePolicy: user.remotePolicy || 'Hybrid Preferred',
        desiredRoles: user.desiredRoles || [],
        targetCompanies: user.targetCompanies || [],
        skills: user.skills || [],
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await usersAPI.updateProfile(formData);
      await getCurrentUser(); // Refresh user data
      router.push(`/profile/${user?.username}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), { ...newSkill }]
      }));
      setNewSkill({ name: '', level: 3 });
    }
  };

  const removeSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter((_, i) => i !== index)
    }));
  };

  const addRole = () => {
    if (newRole.trim()) {
      setFormData(prev => ({
        ...prev,
        desiredRoles: [...(prev.desiredRoles || []), newRole.trim()]
      }));
      setNewRole('');
    }
  };

  const removeRole = (index: number) => {
    setFormData(prev => ({
      ...prev,
      desiredRoles: prev.desiredRoles?.filter((_, i) => i !== index)
    }));
  };

  const addCompany = () => {
    if (newCompany.trim()) {
      setFormData(prev => ({
        ...prev,
        targetCompanies: [...(prev.targetCompanies || []), newCompany.trim()]
      }));
      setNewCompany('');
    }
  };

  const removeCompany = (index: number) => {
    setFormData(prev => ({
      ...prev,
      targetCompanies: prev.targetCompanies?.filter((_, i) => i !== index)
    }));
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
        <p className="text-black">Update your professional information and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professional Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Full-Stack Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience *
            </label>
            <input
              type="text"
              required
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2 Years Experience"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Bangalore, India"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tell us about yourself, your skills, and what you're looking for..."
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Skills
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Skill name"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              value={newSkill.level}
              onChange={(e) => setNewSkill(prev => ({ ...prev, level: parseInt(e.target.value) }))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>⭐ Beginner</option>
              <option value={2}>⭐⭐ Intermediate</option>
              <option value={3}>⭐⭐⭐ Proficient</option>
              <option value={4}>⭐⭐⭐⭐ Advanced</option>
              <option value={5}>⭐⭐⭐⭐⭐ Expert</option>
            </select>
            <button
              type="button"
              onClick={addSkill}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills?.map((skill, index) => (
              <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {skill.name} ({'⭐'.repeat(skill.level)})
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Desired Roles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Desired Roles
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="e.g., Frontend Developer"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addRole}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.desiredRoles?.map((role, index) => (
              <div key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {role}
                <button
                  type="button"
                  onClick={() => removeRole(index)}
                  className="text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Target Companies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Target Companies
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              placeholder="e.g., Google, Microsoft"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addCompany}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.targetCompanies?.map((company, index) => (
              <div key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {company}
                <button
                  type="button"
                  onClick={() => removeCompany(index)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Remote Policy */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Work Preference
          </label>
          <select
            value={formData.remotePolicy}
            onChange={(e) => setFormData(prev => ({ ...prev, remotePolicy: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Remote Only">Remote Only</option>
            <option value="Hybrid Preferred">Hybrid Preferred</option>
            <option value="On-site Preferred">On-site Preferred</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}