/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/profile/ConsultingOffers.tsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { sessionsAPI } from '@/lib/api/sessions';
import { ConsultingOffer } from '@/types';

interface ConsultingOffersProps {
  offers: ConsultingOffer[];
  userId: string;
  username: string;
}

export default function ConsultingOffers({ offers, userId, username }: ConsultingOffersProps) {
  const { user: currentUser } = useAuthStore();
  const [selectedOffer, setSelectedOffer] = useState<ConsultingOffer | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  const isOwnProfile = currentUser?._id === userId;

  const handleBookSession = async (offer: ConsultingOffer) => {
    if (!currentUser) {
      alert('Please login to book a session');
      return;
    }

    setIsBooking(true);
    try {
      await sessionsAPI.bookSession({
        consultingOfferId: offer._id,
        scheduledAt: bookingDate,
        notes: bookingNotes,
      });
      alert('Session booked successfully!');
      setSelectedOffer(null);
      setBookingDate('');
      setBookingNotes('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to book session');
    } finally {
      setIsBooking(false);
    }
  };

  if (offers.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Consulting Offers</h2>
        <p className="text-black">
          {isOwnProfile ? 'You haven\'t created any consulting offers yet.' : 'No consulting offers available.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        💼 Consulting Offers
      </h2>
      <p className="text-black mb-6 text-sm">
        {isOwnProfile 
          ? 'Your available consulting sessions that employees can book.'
          : `Book a session with ${username} to solve your technical problems.`
        }
      </p>

      <div className="space-y-4">
        {offers.map((offer) => (
          <div 
            key={offer._id}
            className="border-2 border-gray-200 rounded-xl p-5 hover:border-blue-500 transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-gray-900 text-lg">{offer.title}</h3>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                {offer.duration} mins
              </span>
            </div>
            
            <p className="text-black mb-4 text-sm">{offer.description}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-1">
                {offer.skills.map(skill => (
                  <span key={skill} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
              
              {!isOwnProfile && (
                <button 
                  onClick={() => setSelectedOffer(offer)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Book Session
                </button>
              )}
            </div>

            {offer.benefits && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm text-gray-500">
                  <strong>You'll get:</strong> {offer.benefits}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Book {selectedOffer.title}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe what you'd like help with..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => {
                  setSelectedOffer(null);
                  setBookingDate('');
                  setBookingNotes('');
                }}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleBookSession(selectedOffer)}
                disabled={!bookingDate || isBooking}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isBooking ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}