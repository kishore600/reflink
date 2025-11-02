/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProofSection({ user }:any) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 h-full">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        📊 Proof of Skills
      </h2>

      {/* Skills */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Verified Skills:</h3>
        <div className="space-y-3">
          {user.skills.map((skill: any) => (
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

      {/* Projects */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Live Projects:</h3>
        <div className="grid grid-cols-2 gap-3">
          {user.projects.map((project: any) => (
            <div key={project.id} className="border rounded-lg p-3">
              <div className="aspect-video bg-gray-200 rounded mb-2"></div>
              <p className="font-bold text-sm text-black">{project.name}</p>
              <p className="text-xs text-black">{project.tech}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Video Pitch */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">90-Second Pitch:</h3>
        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-2xl">▶</span>
            </div>
            <p className="text-gray-600 text-sm">Play Video Introduction</p>
          </div>
        </div>
      </div>
    </div>
  )
}