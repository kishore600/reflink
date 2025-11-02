// app/signup/page.tsx
export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Your RefLink
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Start getting quality referrals through value exchange
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-sm">
          {/* Form fields for signup */}
          <div>
            <label className="block text-sm font-medium text-black">Full Name</label>
            <input type="text" className="text-black mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2" />
          </div>
          
          <div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}