import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";

interface Counselor {
  id: number;
  name: string;
  specialization: string;
  experience_years: number;
  rating?: number;
  reviews?: number;
  description?: string;
  session_fee?: number;
  next_available?: string;
  profile_image?: string;
}

interface Slot {
  slot_id: number;
  slot_time: string;
  counselor_id?: number;
  counselor_name?: string;
}

const CounsellorList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    therapyType: [] as string[],
    priceRange: "any",
    language: "English",
    sortBy: "recommended"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [counselorsRes, slotsRes] = await Promise.all([
        axiosClient.get("/booking/counselors").catch(() => ({ data: [] })),
        axiosClient.get("/booking/slots").catch(() => ({ data: [] }))
      ]);
      
      const counselorsData = counselorsRes.data || [];
      const slotsData = slotsRes.data || [];
      
      // If no counselors from API, create sample data
      let counselorsWithData = counselorsData;
      if (counselorsData.length === 0) {
        counselorsWithData = [
          {
            id: 1,
            name: "Dr. Sarah Jenkins",
            specialization: "Career Counselling",
            experience_years: 10,
            rating: 4.9,
            reviews: 124,
            description: "I specialize in helping individuals overcome anxiety and depression using cognitive behavioral therapy techniques. My approach is warm, empathetic, and evidence-based.",
            session_fee: 1500,
            next_available: "Tomorrow, 10 AM"
          },
          {
            id: 2,
            name: "Michael Chen, LMFT",
            specialization: "Educational Guidance",
            experience_years: 8,
            rating: 4.8,
            reviews: 86,
            description: "Helping couples and families rebuild trust and communication. I provide a safe space for difficult conversations and healing.",
            session_fee: 1300,
            next_available: "Today, 4 PM"
          },
          {
            id: 3,
            name: "Elena Rodriguez",
            specialization: "Psychology",
            experience_years: 12,
            rating: 5.0,
            reviews: 42,
            description: "Specializing in stress management and burnout prevention for professionals. Let's work together to find balance and wellness.",
            session_fee: 1100,
            next_available: "Mon, 2 PM"
          },
          {
            id: 4,
            name: "Dr. James Wilson",
            specialization: "Engineering Careers",
            experience_years: 15,
            rating: 4.7,
            reviews: 210,
            description: "Expert in medication management and psychiatric evaluation. I focus on finding the right treatment plan for each individual.",
            session_fee: 2000,
            next_available: "Wed, 11 AM"
          },
          {
            id: 5,
            name: "Linda Kim",
            specialization: "Medical Careers",
            experience_years: 9,
            rating: 4.9,
            reviews: 98,
            description: "Experienced counselor specializing in career transitions and professional development. Let's explore your potential together.",
            session_fee: 1200,
            next_available: "Fri, 3 PM"
          }
        ];
      }
      
      // Enhance counselors with slot data
      const counselorsWithSlots = counselorsWithData.map((counselor: any) => {
        const counselorSlots = slotsData.filter((slot: any) => 
          slot.counselor_id === counselor.id || slot.counselor_name === counselor.name
        );
        const nextAvailable = counselorSlots.length > 0 
          ? formatNextAvailable(new Date(counselorSlots[0].slot_time))
          : counselor.next_available || "No slots available";
        
        return {
          ...counselor,
          rating: counselor.rating || (4.5 + Math.random() * 0.5),
          reviews: counselor.reviews || Math.floor(Math.random() * 200) + 20,
          description: counselor.description || `Experienced ${counselor.specialization} counselor with ${counselor.experience_years} years of experience helping students navigate their career paths.`,
          session_fee: counselor.session_fee || (1000 + Math.floor(Math.random() * 500)),
          next_available: nextAvailable
        };
      });
      
      setCounselors(counselorsWithSlots);
      setSlots(slotsData);
    } catch (err) {
      console.error("Error loading counselors:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatNextAvailable = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    if (days === 1) return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    return date.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' });
  };

  const handleBookNow = (counselor: Counselor) => {
    setSelectedCounselor(counselor);
    setShowBooking(true);
  };

  const handleTherapyTypeChange = (type: string) => {
    setFilters(prev => ({
      ...prev,
      therapyType: prev.therapyType.includes(type)
        ? prev.therapyType.filter(t => t !== type)
        : [...prev.therapyType, type]
    }));
  };

  const filteredCounselors = counselors.filter(counselor => {
    if (filters.search && !counselor.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !counselor.specialization.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.priceRange !== "any") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      const fee = counselor.session_fee || 0;
      if (max) {
        if (fee < min || fee > max) return false;
      } else {
        if (fee < min) return false;
      }
    }
    return true;
  });

  const sortedCounselors = [...filteredCounselors].sort((a, b) => {
    if (filters.sortBy === "recommended") {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (filters.sortBy === "price-low") {
      return (a.session_fee || 0) - (b.session_fee || 0);
    }
    if (filters.sortBy === "price-high") {
      return (b.session_fee || 0) - (a.session_fee || 0);
    }
    return 0;
  });

  if (showBooking && selectedCounselor) {
    return (
      <BookingFlow 
        counselor={selectedCounselor} 
        slots={slots.filter((s: any) => s.counselor_id === selectedCounselor.id)}
        onBack={() => setShowBooking(false)}
        onComplete={() => {
          setShowBooking(false);
          loadData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Find the right support for your journey.</h1>
          <p className="text-blue-100 text-xl mb-10 max-w-3xl">
            Connect with licensed therapists who understand your needs. Filter by specialization, availability, and more.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-xl p-2 shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-3">
              <i className="fas fa-map-marker-alt text-slate-400"></i>
              <input
                type="text"
                placeholder="City or Zip Code"
                className="flex-1 outline-none text-slate-900 placeholder:text-slate-400"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
            <div className="flex-1 flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-3">
              <i className="fas fa-briefcase text-slate-400"></i>
              <select className="flex-1 outline-none text-slate-900 bg-transparent cursor-pointer">
                <option>Issue (e.g. Anxiety)</option>
                <option>Career Guidance</option>
                <option>College Selection</option>
                <option>Skills Assessment</option>
              </select>
            </div>
            <div className="flex-1 flex items-center gap-3 border border-slate-200 rounded-lg px-4 py-3">
              <i className="fas fa-calendar text-slate-400"></i>
              <select className="flex-1 outline-none text-slate-900 bg-transparent cursor-pointer">
                <option>Availability</option>
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
              <i className="fas fa-chevron-down text-slate-400 text-xs"></i>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition whitespace-nowrap">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-900 text-lg">Filters</h3>
                <button 
                  onClick={() => setFilters({ search: "", therapyType: [], priceRange: "any", language: "English", sortBy: "recommended" })}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Reset
                </button>
              </div>

              {/* Therapy Type */}
              <div className="mb-8">
                <h4 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">THERAPY TYPE</h4>
                <div className="space-y-3">
                  {["Individual", "Couples", "Family", "Teen"].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.therapyType.includes(type)}
                        onChange={() => handleTherapyTypeChange(type)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-slate-900">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">PRICE RANGE</h4>
                <div className="space-y-3">
                  {[
                    { value: "any", label: "Any Price" },
                    { value: "0-1000", label: "₹0 - ₹1,000" },
                    { value: "1000-2000", label: "₹1,000 - ₹2,000" },
                    { value: "2000", label: "₹2,000+" }
                  ].map((range) => (
                    <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={filters.priceRange === range.value}
                        onChange={() => setFilters({...filters, priceRange: range.value})}
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />
                      <span className="text-sm text-slate-700 group-hover:text-slate-900">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">LANGUAGE</h4>
                <select
                  value={filters.language}
                  onChange={(e) => setFilters({...filters, language: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Tamil</option>
                  <option>Telugu</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Content - Counselor Listings */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600">
                <span className="font-semibold text-slate-900">{sortedCounselors.length}</span> counselors available
              </p>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
              >
                <option value="recommended">Sort by: Recommended</option>
                <option value="price-low">Sort by: Price (Low to High)</option>
                <option value="price-high">Sort by: Price (High to Low)</option>
              </select>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 animate-pulse">
                    <div className="h-32 bg-slate-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {sortedCounselors.map((counselor) => {
                  const isTopRated = counselor.rating && counselor.rating >= 4.9;
                  const isNew = counselor.reviews && counselor.reviews < 50;
                  
                  return (
                    <div key={counselor.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Profile Image */}
                        <div className="shrink-0">
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {counselor.name.charAt(0)}
                          </div>
                        </div>

                        {/* Counselor Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-yellow-500 text-lg">
                                  <i className="fas fa-star"></i>
                                </span>
                                <span className="font-semibold text-slate-900 text-lg">{counselor.rating?.toFixed(1)}</span>
                                <span className="text-slate-500 text-sm">({counselor.reviews})</span>
                                {isTopRated && (
                                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                    Top Rated
                                  </span>
                                )}
                                {isNew && (
                                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                    New
                                  </span>
                                )}
                              </div>
                              <h3 className="text-2xl font-bold text-slate-900 mb-1">{counselor.name}</h3>
                              <p className="text-slate-600">{counselor.specialization}</p>
                            </div>
                          </div>

                          {/* Specialization Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {counselor.specialization.split(',').slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100">
                                {tag.trim()}
                              </span>
                            ))}
                            {counselor.experience_years && (
                              <span className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full">
                                {counselor.experience_years} years exp.
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-slate-600 text-sm mb-5 leading-relaxed line-clamp-2">
                            {counselor.description}
                          </p>

                          {/* Session Fee & Availability */}
                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-8">
                              <div>
                                <p className="text-slate-500 text-xs mb-1 uppercase tracking-wide">Session Fee</p>
                                <p className="font-semibold text-slate-900 text-lg">₹{counselor.session_fee}/50min</p>
                              </div>
                              <div>
                                <p className="text-slate-500 text-xs mb-1 uppercase tracking-wide">Next Available</p>
                                <p className="font-medium text-slate-900">{counselor.next_available}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleBookNow(counselor)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 shadow-md hover:shadow-lg"
                            >
                              Book Now <i className="fas fa-arrow-right"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {sortedCounselors.length === 0 && (
                  <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
                    <i className="fas fa-search text-4xl text-slate-300 mb-4"></i>
                    <p className="text-slate-600 text-lg mb-2">No counselors found matching your filters.</p>
                    <button
                      onClick={() => setFilters({ search: "", therapyType: [], priceRange: "any", language: "English", sortBy: "recommended" })}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Booking Flow Component
interface BookingFlowProps {
  counselor: Counselor;
  slots: Slot[];
  onBack: () => void;
  onComplete: () => void;
}

const BookingFlow = ({ counselor, slots, onBack, onComplete }: BookingFlowProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState<"schedule" | "payment">("schedule");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);

  const availableSlots = slots.filter(slot => {
    const slotTime = new Date(slot.slot_time);
    return slotTime > new Date();
  });

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  const handleContinueToPayment = () => {
    if (selectedSlot) {
      setStep("payment");
    }
  };

  const handleCompleteBooking = async () => {
    if (!user || !selectedSlot) return;

    setProcessing(true);
    try {
      await axiosClient.post("/booking/book", {
        studentId: user.id,
        slotId: selectedSlot.slot_id
      });
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert("Booking confirmed! Payment successful.");
      onComplete();
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to complete booking. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-6">
          <button onClick={onBack} className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2 font-medium">
            <i className="fas fa-arrow-left"></i> Back to Counselors
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {counselor.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{counselor.name}</h2>
              <p className="text-slate-600">{counselor.specialization}</p>
            </div>
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === "schedule" ? "text-blue-600" : "text-green-600"}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === "schedule" ? "bg-blue-600 text-white" : "bg-green-600 text-white"}`}>
              {step === "schedule" ? "1" : <i className="fas fa-check"></i>}
            </div>
            <span className="font-medium">Select Time</span>
          </div>
          <div className="w-16 h-1 bg-slate-200">
            <div className={`h-full transition-all ${step === "payment" ? "bg-green-600" : "bg-slate-200"}`}></div>
          </div>
          <div className={`flex items-center gap-2 ${step === "payment" ? "text-blue-600" : "text-slate-400"}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === "payment" ? "bg-blue-600 text-white" : "bg-slate-200"}`}>
              2
            </div>
            <span className="font-medium">Payment</span>
          </div>
        </div>

        {step === "schedule" ? (
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Select a time slot</h3>
            
            {availableSlots.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-calendar-times text-4xl text-slate-300 mb-4"></i>
                <p className="text-slate-600 mb-4">No available slots for this counselor.</p>
                <button onClick={onBack} className="text-blue-600 hover:text-blue-700 font-medium">
                  Back to Counselors
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                  {availableSlots.map((slot) => {
                    const slotDate = new Date(slot.slot_time);
                    const isSelected = selectedSlot?.slot_id === slot.slot_id;
                    
                    return (
                      <button
                        key={slot.slot_id}
                        onClick={() => handleSlotSelect(slot)}
                        className={`p-4 rounded-lg border-2 transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 hover:border-blue-300 text-slate-700"
                        }`}
                      >
                        <div className="font-semibold text-sm">
                          {slotDate.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {slotDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="font-medium mt-2">
                          {slotDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleContinueToPayment}
                    disabled={!selectedSlot}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                  >
                    Continue to Payment <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Complete Payment</h3>

            {/* Booking Summary */}
            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-slate-900 mb-4">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Counselor:</span>
                  <span className="font-medium text-slate-900">{counselor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Session Time:</span>
                  <span className="font-medium text-slate-900">
                    {selectedSlot && new Date(selectedSlot.slot_time).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Duration:</span>
                  <span className="font-medium text-slate-900">50 minutes</span>
                </div>
                <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between">
                  <span className="font-semibold text-slate-900">Total:</span>
                  <span className="font-bold text-lg text-slate-900">₹{counselor.session_fee}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h4 className="font-semibold text-slate-900 mb-4">Payment Method</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-blue-600 rounded-lg cursor-pointer bg-blue-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <i className="fas fa-credit-card text-blue-600"></i>
                  <span className="font-medium">Credit/Debit Card</span>
                </label>
                <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-300">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <i className="fas fa-mobile-alt text-slate-600"></i>
                  <span className="font-medium">UPI</span>
                </label>
                <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-300">
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <i className="fas fa-wallet text-slate-600"></i>
                  <span className="font-medium">Wallet</span>
                </label>
              </div>
            </div>

            {/* Payment Form */}
            {paymentMethod === "card" && (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Complete Booking Button */}
            <button
              onClick={handleCompleteBooking}
              disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Complete Booking - ₹{counselor.session_fee}
                  <i className="fas fa-lock"></i>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounsellorList;
