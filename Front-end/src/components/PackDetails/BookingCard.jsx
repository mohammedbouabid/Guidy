import React from "react";
import { Card, CardContent } from "@/components/ui/components/ui/card";
import { Button } from "@/components/ui/components/ui/button";
import  { useState, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { createBooking, fetchAllBookings, fetchPackBookingStatus } from "../../store/slices/bookingSlice";
import { useNavigate } from "react-router-dom";

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return "N/A";
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
};

export default function BookingCard({ pack }) {
  const [spotsBooked, setSpotsBooked] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState(null);
  const [remainingSpots, setRemainingSpots] = useState(pack.maxClients || 0);
  const [isFirstBooking, setIsFirstBooking] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.Auth);
  // Check for user in multiple possible locations in the auth state
  const user = auth?.user || auth?.currentUser || auth?.userData;
  const bookingState = useSelector((state) => state.booking);
  const bookings = bookingState?.items || [];
  const packStatus = bookingState?.packStatus?.[pack?._id] || null;
  const userRole = user?.role || null;
  
  // Load bookings for this pack (needed to compute remaining spots and VIP availability)
  useEffect(() => {
    if (pack?._id) {
      // For admins, they may use the global list; for clients, use pack status
      if (userRole === 'admin') {
        dispatch(fetchAllBookings({ packId: pack._id, limit: 100 }));
      } else {
        dispatch(fetchPackBookingStatus(pack._id));
      }
    }
  }, [dispatch, pack?._id, userRole]);

  // Compute user first-booking and remaining spots
  useEffect(() => {
    // Check if user has any previous bookings for this pack
    const userBookings = bookings.filter((booking) => {
      const bPackId = booking.packID?._id || booking.packID;
      const bUserId = booking.userID?._id || booking.userID;
      return bPackId === pack._id && bUserId === user?._id && !booking.isCancelled;
    });
    setIsFirstBooking(userBookings.length === 0);

    // Calculate remaining spots (exclude cancelled bookings)
    const bookedSpots = bookings
      .filter((booking) => {
        const bPackId = booking.packID?._id || booking.packID;
        return bPackId === pack._id && !booking.isCancelled;
      })
      .reduce((total, booking) => total + (booking.spotsBooked || 0), 0);

    setRemainingSpots(Math.max(0, (pack.maxClients || 0) - bookedSpots));
  }, [bookings, pack._id, pack.maxClients, user?._id]);

  // Prefer backend-computed remaining spots when available
  useEffect(() => {
    if (packStatus && typeof packStatus.remainingSpots === 'number') {
      setRemainingSpots(packStatus.remainingSpots);
    }
  }, [packStatus]);

  // VIP availability: disabled if any booking exists OR VIP exists (based on pack status)
  const vipTaken = packStatus ? (packStatus.vipExists || (packStatus.totalActiveBookings > 0)) : bookings.some((booking) => {
    const bPackId = booking.packID?._id || booking.packID;
    return bPackId === pack._id && !booking.isCancelled; // any active booking disables VIP
  });
  
  const handleSpotsChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= remainingSpots) {
      setSpotsBooked(value);
    }
  };
  
  const handleRegularBooking = async () => {
    await processBooking(false);
  };
  
  const handleVipBooking = async () => {
    await processBooking(true);
  };
  
  const processBooking = async (isVip) => {
    if (!user) {
      setBookingMessage({
        type: "error",
        text: "Please log in to book this tour."
      });
      return;
    }

    if (userRole && userRole !== "client") {
      setBookingMessage({
        type: "error",
        text: "Only clients are allowed to book."
      });
      return;
    }

    if (isVip && vipTaken) {
      setBookingMessage({
        type: "error",
        text: "VIP booking is no longer available for this pack."
      });
      return;
    }
    
    setIsLoading(true);
    setBookingMessage(null);
    
    try {
      const result = await dispatch(createBooking({
        packID: pack._id,
        isVip,
        spotsBooked
      })).unwrap();
      
      setBookingMessage({
        type: "success",
        text: "Your tour has been booked successfully!"
      });
      
      // Update remaining spots after successful booking
      setRemainingSpots(prev => Math.max(0, prev - spotsBooked));
      setIsFirstBooking(false);
      
    } catch (error) {
      setBookingMessage({
        type: "error",
        text: error.message || "There was an error processing your booking."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const totalPrice = pack.price * spotsBooked;

  return (
    <Card className="sticky top-8">
      <CardContent className="p-6">
        {/* Price + Availability */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-[#05073c]">
              ${pack.price}
            </span>
            <span className="text-sm text-[#717171]">per person</span>
          </div>

          {remainingSpots > 0 ? (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600">
                {remainingSpots} {remainingSpots === 1 ? 'spot' : 'spots'} available
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-600">Fully booked</span>
            </div>
          )}
        </div>

        {/* Quick Facts */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-[#717171]">Duration:</span>
            <span className="font-medium text-[#05073c]">
              {calculateDuration(pack.startDate, pack.endDate)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#717171]">Available Spots to Book:</span>
            <span className="font-medium text-[#05073c]">
              {remainingSpots} {remainingSpots === 1 ? 'spot' : 'spots'}
            </span>
          </div>
        </div>
        
        {/* Login / Role Message */}
        {!user && (
          <div className="p-3 mb-4 rounded-md bg-blue-50 text-blue-700">
            Please <Button 
              variant="link" 
              className="p-0 h-auto text-blue-700 underline" 
              onClick={() => navigate("/login")}
            >
              log in
            </Button> to book this tour.
          </div>
        )}
        {user && userRole && userRole !== "client" && (
          <div className="p-3 mb-4 rounded-md bg-red-50 text-red-700">
            Only clients are allowed to book.
          </div>
        )}
        
        {/* Booking Options - Only show if user is logged in and spots are available */}
        {user && userRole === "client" && remainingSpots > 0 && (
          <div className="space-y-4 mb-6">
            {/* Number of Spots */}
            <div className="space-y-2">
              <Label htmlFor="spots" className="text-sm text-[#717171]">
                Number of spots
              </Label>
              <Input
                id="spots"
                type="number"
                min="1"
                max={remainingSpots}
                value={spotsBooked}
                onChange={handleSpotsChange}
                className="w-full"
              />
            </div>
            
            {/* Total Price */}
            <div className="bg-orange-50 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-[#05073c]">Total:</span>
                <span className="text-xl font-bold text-orange-600">${totalPrice}</span>
              </div>
            </div>
          </div>
        )}

        {/* Booking Message */}
        {bookingMessage && (
          <div className={`p-3 mb-4 rounded-md ${
            bookingMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {bookingMessage.text}
          </div>
        )}

        {/* Booking Buttons */}
        {user && userRole === "client" && remainingSpots > 0 && (
          <div className="space-y-3">
            {/* Regular Booking Button */}
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              size="lg"
              onClick={handleRegularBooking}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Book Now"}
            </Button>
            
            {/* VIP Booking Button - Only show for first booking */}
            {isFirstBooking && (
              <Button
                className={`w-full ${vipTaken ? "bg-yellow-500 text-white cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 text-white"}`}
                size="lg"
                onClick={handleVipBooking}
                disabled={isLoading || vipTaken}
                title={vipTaken ? "VIP already booked for this pack" : "VIP booking (exclusive)"}
              >
                {vipTaken ? "VIP Unavailable" : (isLoading ? "Processing..." : "Book as VIP")}
              </Button>
            )}
          </div>
        )}

        <p className="text-xs text-center text-[#717171] mt-4">
          You won't be charged yet
        </p>
      </CardContent>
    </Card>
  );
}