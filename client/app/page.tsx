// app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Get Referred Through 
            <span className="text-blue-600"> Real Value Exchange</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop asking for favors. Start offering your skills. Get quality referrals by solving real problems for company employees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/profile"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Your RefLink
            </Link>
            <Link 
              href="/sessions"
              className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Browse Sessions
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-3xl mb-4">💼</div>
            <h3 className="text-xl font-bold mb-2 text-black">Offer Your Skills</h3>
            <p className="text-gray-600">Solve real problems for employees in exchange for referrals</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-3xl mb-4">🔗</div>
            <h3 className="text-xl font-bold mb-2 text-black">Get Quality Referrals</h3>
            <p className="text-gray-600">Employees refer you with confidence after seeing your work</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2 text-black">Build Your Network</h3>
            <p className="text-gray-600">Create meaningful professional relationships through collaboration</p>
          </div>
        </section>
      </div>
    </div>
  )
}