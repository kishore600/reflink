/* eslint-disable @typescript-eslint/no-explicit-any */
// app/[username]/components/ReferralAsk.tsx
export default function ReferralAsk({ user }:any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 h-full">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        🎯 My Referral Ask
      </h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-700">Seeking Roles:</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {user.desiredRoles.map((role:any) => (
              <span key={role} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {role}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Target Companies:</h3>
          <div className="flex flex-wrap gap-3 mt-3">
            {user.targetCompanies.map((company:any) => (
              <div key={company} className="bg-gray-100 p-3 rounded-lg flex items-center">
                <span className="font-medium text-black">{company}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-semibold text-gray-700 mb-2">Work Preferences:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Location:</span>
              <span className="font-medium">{user.location}</span>
            </div>
            <div className="flex justify-between">
              <span>Remote Policy:</span>
              <span className="font-medium">{user.remotePolicy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}