// app/referrals/page.tsx
export default function ReferralsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🔗 My Referrals</h1>
          <p className="text-gray-600">Track your referral requests and application status</p>
        </div>
        
        <div className="grid gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Active Referrals</h2>
            <p className="text-gray-500 text-center py-8">No active referrals</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Referral History</h2>
            <p className="text-gray-500 text-center py-8">No referral history yet</p>
          </div>
        </div>
      </div>
    </div>
  )
}