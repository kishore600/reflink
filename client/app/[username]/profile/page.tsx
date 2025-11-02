/* eslint-disable @typescript-eslint/no-explicit-any */

import ConsultingOffers from './components/ConsultingOffers'
import ProofSection from './components/ProofSection'
import ReferralAsk from './components/ReferralAsk'

async function getUserProfile(username: string) {
  
  return {
    id: '1',
    name: 'Aisha Sharma',
    username: username,
    title: 'Full-Stack Developer',
    experience: '2 Years Experience',
    availableSlots: 3,
    completedSessions: 12,
    desiredRoles: ['Frontend Developer', 'Full-Stack Developer', 'React Developer'],
    targetCompanies: ['Zoho', 'Swiggy', 'Razorpay', 'Freshworks'],
    location: 'Bangalore, Hybrid',
    remotePolicy: 'Hybrid Preferred',
    consultingOffers: [
      {
        id: '1',
        title: 'React Bundle Optimization',
        description: 'I\'ll analyze and optimize your React application bundle size, reducing load time by 30-40%',
        duration: 120,
        skills: ['React', 'Webpack', 'Performance'],
        benefits: 'Production-ready bundle analysis report'
      },
      {
        id: '2',
        title: 'Dark Mode Implementation',
        description: 'Full dark mode implementation with theming system for your web application',
        duration: 180,
        skills: ['CSS', 'React', 'UI/UX'],
        benefits: 'Complete dark theme with toggle component'
      },
      {
        id: '3',
        title: 'Mobile Responsiveness Audit',
        description: 'Comprehensive mobile responsiveness review and fixes for your web application',
        duration: 90,
        skills: ['CSS', 'Responsive Design', 'Mobile First'],
        benefits: 'Mobile optimization report with specific fixes'
      }
    ],
    skills: [
      { name: 'React', level: 5 },
      { name: 'Next.js', level: 5 },
      { name: 'Node.js', level: 4 },
      { name: 'TypeScript', level: 4 },
      { name: 'Tailwind CSS', level: 5 }
    ],
    projects: [
      { id: '1', name: 'E-commerce Platform', tech: 'Next.js, Stripe' },
      { id: '2', name: 'Task Management App', tech: 'React, Node.js' },
      { id: '3', name: 'Portfolio Website', tech: 'Next.js, Framer Motion' },
      { id: '4', name: 'API Integration Tool', tech: 'Node.js, Express' }
    ],
    successStories: [
      {
        testimonial: 'Aisha helped optimize our React app bundle by 35%. Incredible skills!',
        employee: 'Rahul Kumar',
        company: 'Zoho'
      },
      {
        testimonial: 'The dark mode implementation was flawless and production-ready.',
        employee: 'Priya Singh',
        company: 'Swiggy'
      },
      {
        testimonial: 'Mobile audit saved us weeks of work. Highly recommend!',
        employee: 'Arjun Patel',
        company: 'Freshworks'
      }
    ]
  }
}
interface ProfilePageProps {
  params: {
    username: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  // Fetch user data
  const userData = await getUserProfile(params.username)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {userData.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  ⭐ Top Rated
                </span>
              </div>
              <p className="text-xl text-gray-600 mb-3">
                {userData.title} • {userData.experience}
              </p>
              <div className="flex items-center space-x-4 text-gray-500">
                <span className="flex items-center">
                  🔄 <span className="ml-1">Available for {userData.availableSlots} sessions this week</span>
                </span>
                <span>•</span>
                <span>✅ {userData.completedSessions} sessions completed</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Grid Layout - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Referral Ask */}
          <div className="lg:col-span-1">
            <ReferralAsk user={userData} />
          </div>

          {/* Column 2: Consulting Offers (THE MAGIC) */}
          <div className="lg:col-span-1">
            <ConsultingOffers offers={userData.consultingOffers} />
          </div>

          {/* Column 3: Proof & Skills */}
          <div className="lg:col-span-1">
            <ProofSection user={userData} />
          </div>

        </div>

        {/* Social Proof Footer */}
        <footer className="mt-12 bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg text-black font-semibold mb-4">Referral Success Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userData.successStories.map((story:any, index:any) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <p className="text-gray-600">&ldquo;{story.testimonial}&rdquo;</p>
                <p className="text-sm text-gray-500 mt-2">— {story.employee} at {story.company}</p>
              </div>
            ))}
          </div>
        </footer>

      </div>
    </div>
  )
}