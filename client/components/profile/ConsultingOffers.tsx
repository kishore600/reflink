/* eslint-disable @typescript-eslint/no-explicit-any */
// components/profile/ConsultingOffers.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { sessionsAPI } from '@/lib/api/sessions';
import { ConsultingOffer } from '@/types';

export default function ConsultingOffers({ offers, userId, username }: any) {
  const { user: currentUser } = useAuthStore();
  const [selectedOffer, setSelectedOffer] = useState<ConsultingOffer | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [userBookedOffers, setUserBookedOffers] = useState<any>(new Set());

  const isOwnProfile = currentUser?._id === userId;

  // Check which offers the current user has already booked
  useEffect(() => {
    if (currentUser && offers.length > 0) {
      const bookedOfferIds = new Set();
      offers.forEach((offer:any) => {
        if (offer.bookedUsers && offer.bookedUsers.includes(currentUser._id)) {
          bookedOfferIds.add(offer._id);
        }
      });
      setUserBookedOffers(bookedOfferIds);
    }
  }, [currentUser, offers]);

  const handleBookSession = async (offer: ConsultingOffer) => {
    if (!currentUser) {
      alert('Please login to book a session');
      return;
    }

    // Check if user has already booked this offer
    if (userBookedOffers.has(offer._id)) {
      alert('You have already booked this session!');
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
      // Add to booked offers
      setUserBookedOffers((prev:any) => new Set(prev).add(offer._id));
      setSelectedOffer(null);
      setBookingDate('');
      setBookingNotes('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to book session');
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelSession = async (offerId: string) => {
    if (!confirm('Are you sure you want to cancel this session?')) {
      return;
    }

    try {
      // First, find the session for this offer
      const sessions = await sessionsAPI.getSessions('all');
      const session = sessions.find(s => 
        s.consultingOffer._id === offerId && 
        s.employee._id === currentUser?._id && 
        s.status === 'scheduled'
      );

      if (session) {
        await sessionsAPI.cancelSession(session._id);
        alert('Session cancelled successfully!');
        // Remove from booked offers
        setUserBookedOffers((prev:any) => {
          const newSet = new Set(prev);
          newSet.delete(offerId);
          return newSet;
        });
      } else {
        alert('No active session found to cancel');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel session');
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
        {offers.map((offer:any) => {
          const isBooked = userBookedOffers.has(offer._id);
          const isFullyBooked = offer.bookedUsers && offer.bookedUsers.length >= 5; // Example limit

          return (
            <div 
              key={offer._id}
              className={`border-2 rounded-xl p-5 transition-all ${
                isBooked 
                  ? 'border-green-500 bg-green-50' 
                  : isFullyBooked
                  ? 'border-gray-300 bg-gray-100'
                  : 'border-gray-200 hover:border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{offer.title}</h3>
                  {isBooked && (
                    <span className="inline-block mt-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      ✅ You&lsquo;ve booked this session
                    </span>
                  )}
                  {isFullyBooked && !isBooked && (
                    <span className="inline-block mt-1 bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                      🔒 Fully booked
                    </span>
                  )}
                </div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                  {offer.duration} mins
                </span>
              </div>
              
              <p className="text-black mb-4 text-sm">{offer.description}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-1">
                  {offer.skills.map((skill:any) => (
                    <span key={skill} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
                
                {!isOwnProfile && (
                  <div className="flex gap-2">
                    {isBooked ? (
                      <>
                        <button 
                          onClick={() => handleCancelSession(offer._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
                        >
                          Cancel Session
                        </button>
                        <a 
                          href="/dashboard/sessions"
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                        >
                          View Session
                        </a>
                      </>
                    ) : isFullyBooked ? (
                      <button 
                        disabled
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed"
                      >
                        Fully Booked
                      </button>
                    ) : (
                      <button 
                        onClick={() => setSelectedOffer(offer)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        Book Session
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Booking Stats */}
              <div className="mt-3 pt-3 border-t flex justify-between items-center text-sm text-gray-500">
                {offer.benefits && (
                  <span>
                    <strong>You&rsquo;ll get:</strong> {offer.benefits}
                  </span>
                )}
                {offer.bookedUsers && (
                  <span>
                    {offer.bookedUsers.length} / 5 booked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-black text-xl font-bold mb-4">Book {selectedOffer.title}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  className="text-black w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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