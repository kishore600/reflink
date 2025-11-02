// app/profile/page.tsx
export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">👤 My Profile</h1>
          <p className="text-gray-600">Manage your profile and RefLink settings</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-black">Personal Information</h2>
              {/* Profile form would go here */}
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4 text-black">Consulting Offers</h2>
              {/* Consulting offers management would go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}