/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any

'use client'

import { useState } from "react"


export default function ConsultingOffers({ offers }:any) {
  const [selectedOffer, setSelectedOffer] = useState<any>(null)

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 h-full">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        💼 Immediate Value I Can Provide
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        Choose a consulting session below. I&apos;ll help solve your current work problem in exchange for a referral.
      </p>

      <div className="space-y-4">
        {offers.map(({offer}:any) => (
          <div 
            key={offer?.id}
            className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-500 transition-all cursor-pointer"
            onClick={() => setSelectedOffer(offer)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-black text-lg">{offer?.title}</h3>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                {offer?.duration} mins
              </span>
            </div>
            
            <p className="text-black mb-4 text-sm">{offer?.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-1">
                {offer?.skills.map((skill: any)  => (
                  <span key={skill} className="bg-blue-50 text-blue-700 px-2 py-1 rounded ">
                    {skill}
                  </span>
                ))}
              </div>
              
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Claim Session
              </button>
            </div>

            {offer?.benefits && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-gray-500">
                  <strong>You&apos;ll get:</strong> {offer.benefits}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Session Booking Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Book {selectedOffer.title}</h3>
            {/* Calendar and time slot selection would go here */}
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setSelectedOffer(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}