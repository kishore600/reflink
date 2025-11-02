// app/sessions/page.tsx
export default function SessionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💼 My Sessions</h1>
          <p className="text-gray-600">Manage your consulting sessions and track progress</p>
        </div>
        
        <div className="grid gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Upcoming Sessions</h2>
            <p className="text-gray-500 text-center py-8">No upcoming sessions scheduled</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Session History</h2>
            <p className="text-gray-500 text-center py-8">No session history yet</p>
          </div>
        </div>
      </div>
    </div>
  )
}