"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, Package as PackageIcon, User, MapPin, Tag, Loader2 } from "lucide-react";
import { getDatePricing } from "@/lib/pricingEngine";

import { getPackages } from "@/app/actions/packages";
import { getBookedSlots, createBooking } from "@/app/actions/booking";

const TIME_SLOTS = [
 "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
 "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", 
 "05:00 PM", "06:00 PM", "07:00 PM"
];

export default function BookingWizard() {
 const [step, setStep] = useState(1);
 const [packages, setPackages] = useState([]);
 const [bookedSlots, setBookedSlots] = useState([]);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState("");
 const [currentDate, setCurrentDate] = useState(new Date());

 const [formData, setFormData] = useState({
 packageId: "",
 packageName: "", // for whatsapp msg
 date: "",
 timeSlot: "",
 name: "",
 phone: "",
 eventType: "Wedding",
 location: "",
 requirements: ""
 });

 useEffect(() => {
 async function loadData() {
 setIsLoading(true);
 const pkgs = await getPackages();
 setPackages(pkgs);
 const slots = await getBookedSlots();
 setBookedSlots(slots);
 setIsLoading(false);
 }
 loadData();
 }, []);

 const handleChange = (e) => {
 const { name, value } = e.target;
 setFormData(prev => ({ ...prev, [name]: value }));
 };

 const nextStep = () => {
 setError("");
 if (step === 1 && !formData.packageId) {
 setError("Please select a package to continue.");
 return;
 }
 if (step === 2 && (!formData.date || !formData.timeSlot)) {
 setError("Please select both a date and a time slot.");
 return;
 }
 setStep(prev => prev + 1);
 };

 const prevStep = () => {
 setError("");
 setStep(prev => prev - 1);
 };

 const handleSubmit = async () => {
 setIsSubmitting(true);
 setError("");

 const result = await createBooking(formData);

 if (!result.success) {
 setError(result.error);
 setIsSubmitting(false);
 return;
 }

 setIsSubmitting(false);
 setStep(4); // Move to success step
 };

 // Get available time slots for the selected date
 const getAvailableTimeSlots = () => {
 if (!formData.date) return TIME_SLOTS;
 
 const slotsForDate = bookedSlots
 .filter(b => b.date === formData.date)
 .map(b => b.timeSlot);
 
 return TIME_SLOTS.filter(slot => !slotsForDate.includes(slot));
 };

 return (
 <div className="w-full max-w-3xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
 
 {/* Header / Progress Indicator */}
 <div className="bg-zinc-50 dark:bg-zinc-950 p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center relative">
 {/* Progress Bar Background */}
 <div className="absolute bottom-0 left-0 h-1 bg-zinc-200 dark:bg-zinc-800 w-full" />
 <motion.div 
 className="absolute bottom-0 left-0 h-1 bg-brand-gradient hover-glow-brand"
 initial={{ width: "25%" }}
 animate={{ width: `${(step / 3) * 100}%` }}
 transition={{ duration: 0.3 }}
 />

 <div className="flex gap-4 items-center w-full justify-between px-2 sm:px-8 text-sm sm:text-base font-medium">
 <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-brand-gradient' : 'text-zinc-400'}`}>
 <PackageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
 <span className="hidden sm:block">Package</span>
 </div>
 <div className="flex-1 h-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2" />
 <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-brand-gradient' : 'text-zinc-400'}`}>
 <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
 <span className="hidden sm:block">Schedule</span>
 </div>
 <div className="flex-1 h-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2" />
 <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-brand-gradient' : 'text-zinc-400'}`}>
 <User className="w-5 h-5 sm:w-6 sm:h-6" />
 <span className="hidden sm:block">Details</span>
 </div>
 </div>
 </div>

 {/* Main Content Area */}
 <div className="flex-1 p-6 sm:p-10 relative overflow-hidden flex flex-col min-h-0">
 <AnimatePresence mode="wait">
 
 {/* STEP 1: Package Selection */}
 {step === 1 && (
 <motion.div
 key="step1"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="space-y-6 flex-1 flex flex-col w-full h-full"
 >
 <div>
 <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Choose a Package</h2>
 <p className="text-zinc-500 dark:text-zinc-400">Select the service package that best fits your needs.</p>
 </div>

 <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-24">
 {isLoading ? (
 <p className="text-zinc-500 text-center py-8">Loading packages...</p>
 ) : packages.length === 0 ? (
 <div className="text-center py-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
 <p className="text-zinc-600 dark:text-zinc-400 font-medium">No packages available right now.</p>
 <p className="text-zinc-500 text-sm mt-1">Please check back later or contact us directly.</p>
 </div>
 ) : (
 packages.map((pkg) => (
 <button
 key={pkg.id}
 type="button"
 aria-pressed={formData.packageId === pkg.id}
 onClick={() => setFormData({...formData, packageId: pkg.id, packageName: pkg.name})}
 className={`w-full text-left cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 flex justify-between items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
 formData.packageId === pkg.id 
 ? "border-cyan-500 bg-cyan-50 dark:bg-brand-gradient hover-glow-brand/10" 
 : "border-zinc-200 dark:border-zinc-800 hover:border-cyan-400/50"
 }`}
 >
 <div>
 <div className="flex items-center gap-3 mb-2">
 <h3 className="font-bold text-xl text-zinc-900 dark:text-white">{pkg.name}</h3>
 {pkg.popular && (
 <span className="px-2 py-1 bg-brand-gradient hover-glow-brand text-white border-transparent dark:bg-brand-gradient hover-glow-brand text-white border-transparent/40 text-brand-gradient dark:text-brand-gradient text-xs font-bold uppercase tracking-wider rounded-full">
 Popular
 </span>
 )}
 </div>
 <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-2">{pkg.description}</p>
 <p className="font-semibold text-brand-gradient dark:text-brand-gradient">{pkg.price}</p>
 </div>
 <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
 formData.packageId === pkg.id 
 ? "bg-brand-gradient hover-glow-brand text-white" 
 : "bg-zinc-200 dark:bg-zinc-800 text-transparent"
 }`}>
 <CheckCircle2 className="w-4 h-4" />
 </div>
 </button>
 ))
 )}
 </div>
 </motion.div>
 )}

 {/* STEP 2: Date & Time */}
 {step === 2 && (
 <motion.div
 key="step2"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="space-y-8 flex-1 flex flex-col w-full h-full"
 >
 <div>
 <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Select Date & Time</h2>
 <p className="text-zinc-500 dark:text-zinc-400">Choose when you'd like your session.</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
 {/* Custom Interactive Calendar */}
 <div className="flex flex-col gap-3">
 <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
 <CalendarIcon className="w-4 h-4" /> Pick a Date
 </label>
 
 {(() => {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
 <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-inner">
 {/* Month/Year Header */}
 <div className="flex justify-between items-center mb-4">
 <button
  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
  className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500"
 >
 <ChevronLeft className="w-4 h-4" />
 </button>
 <div className="font-bold text-zinc-800 dark:text-zinc-200">
 {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
 </div>
 <button
  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
  className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500"
 >
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>

 {/* Days of week */}
 <div className="grid grid-cols-7 gap-1 mb-2">
 {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
 <div key={day} className="text-center text-xs font-semibold text-zinc-400">
 {day}
 </div>
 ))}
 </div>

 {/* Dates Grid (Dynamic) */}
 <div className="grid grid-cols-7 gap-1">
 {/* Empty slots for starting day offset */}
 {Array.from({ length: startDay }).map((_, i) => (
  <div key={`empty-${i}`} className="aspect-square"></div>
 ))}
 
  {Array.from({ length: daysInMonth }).map((_, i) => {
  const day = i + 1;
  const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

  // Format as YYYY-MM-DD correctly avoiding timezone shifts
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${d}`;

  const pricing = getDatePricing(dateObj);
  
  const badgeColors = {
   green: "bg-green-500/20 text-green-400 border-green-500/30",
   amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
   rose: "bg-rose-500/20 text-rose-400 border-rose-500/30",
   zinc: ""
  };
  const tileBg = {
   green: "hover:bg-green-500/10",
   amber: "hover:bg-amber-500/10",
   rose: "hover:bg-rose-500/10",
   zinc: "hover:bg-zinc-200 dark:hover:bg-zinc-800"
  };
 
  const isPast = dateObj < today;
  const isSelected = formData.date === formattedDate;

  return (
  <button
  key={day}
  disabled={isPast}
  aria-pressed={isSelected}
  onClick={() => setFormData(prev => ({ ...prev, date: formattedDate, timeSlot: "" }))}
  title={!isPast ? pricing.label : undefined}
  className={`
  relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all duration-300
  ${isPast ? 'text-zinc-300 dark:text-zinc-700 cursor-not-allowed' : tileBg[pricing.badgeColor]}
  ${isSelected ? 'bg-brand-gradient hover-glow-brand text-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-500/50 scale-105' : 'text-zinc-700 dark:text-zinc-300'}
  `}
  >
  {day}
  {!isPast && !isSelected && pricing.badgeColor !== 'zinc' && (
   <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[7px] font-bold px-1 rounded-sm border ${badgeColors[pricing.badgeColor]} leading-tight`}>
    {pricing.discount > 0 ? `-${pricing.discount}%` : pricing.label.split(' ')[0]}
   </span>
  )}
  </button>
  );
  })}
 </div>
 </div>
  );
 })()}
 </div>

 {/* Time Slots */}
 <div className="flex flex-col gap-3">
 <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
 <Clock className="w-4 h-4" /> Pick a Time
 </label>
 
 {formData.date ? (
 <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
 {getAvailableTimeSlots().length > 0 ? (
 getAvailableTimeSlots().map(slot => (
 <button
 key={slot}
 aria-pressed={formData.timeSlot === slot}
 onClick={() => setFormData(prev => ({...prev, timeSlot: slot}))}
 className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
 formData.timeSlot === slot
 ? "bg-brand-gradient hover-glow-brand text-white shadow-md shadow-cyan-500/30"
 : "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
 }`}
 >
 {slot}
 </button>
 ))
 ) : (
 <p className="col-span-2 text-sm text-red-500 p-4 bg-red-500/10 rounded-xl text-center">
 All slots are booked for this date.
 </p>
 )}
 </div>
 ) : (
 <div className="h-full flex items-center justify-center p-6 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl text-zinc-500 text-sm text-center">
 Please select a date first to see available time slots.
 </div>
 )}
 </div>
 </div>

 {/* Dynamic Pricing Banner */}
 {formData.date && (() => {
  const selectedDate = new Date(formData.date + 'T00:00:00');
  const pricing = getDatePricing(selectedDate);
  const bannerStyles = {
   green: "bg-green-500/10 border-green-500/30 text-green-400",
   amber: "bg-amber-500/10 border-amber-500/30 text-amber-400",
   rose: "bg-rose-500/10 border-rose-500/30 text-rose-400",
   zinc: "bg-zinc-800/50 border-zinc-700/50 text-zinc-400",
  };
  return (
   <div className={`flex items-start gap-3 p-4 rounded-2xl border ${bannerStyles[pricing.badgeColor]} transition-all duration-300`}>
    <Tag className="w-4 h-4 mt-0.5 shrink-0" />
    <div>
     <p className="font-semibold text-sm">{pricing.label}</p>
     <p className="text-xs opacity-80 mt-0.5">{pricing.message}</p>
    </div>
   </div>
  );
 })()}
 </motion.div>
 )}

 {/* STEP 3: Client Details */}
 {step === 3 && (
 <motion.div
 key="step3"
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="space-y-6 flex-1 flex flex-col w-full h-full"
 >
 <div>
 <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Your Details</h2>
 <p className="text-zinc-500 dark:text-zinc-400">Final step! We just need some contact information.</p>
 </div>

 <div className="space-y-5 flex-1 overflow-y-auto pr-2">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 <div>
 <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">
 Full Name <span className="text-red-500">*</span>
 </label>
 <input 
 id="name"
 type="text" 
 name="name"
 value={formData.name}
 onChange={handleChange}
 required
 aria-required="true"
 className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500/50"
 />
 </div>
 <div>
 <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">
 Phone Number <span className="text-red-500">*</span>
 </label>
 <input 
 id="phone"
 type="tel" 
 name="phone"
 value={formData.phone}
 onChange={handleChange}
 required
 aria-required="true"
 className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500/50"
 />
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 <div>
  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Event Type</label>
  <div className="grid grid-cols-2 gap-2">
   {[
    { value: "Wedding", icon: "💍" },
    { value: "Portrait", icon: "🎭" },
    { value: "Birthday Function", icon: "🎂" },
    { value: "Maternity", icon: "🌸" },
    { value: "Product Shoot", icon: "📦" },
    { value: "Event", icon: "🎉" },
   ].map(({ value, icon }) => (
    <button
     key={value}
     type="button"
     aria-pressed={formData.eventType === value}
     onClick={() => setFormData(prev => ({ ...prev, eventType: value }))}
     className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
      formData.eventType === value
       ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
       : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:border-zinc-300 hover:border-cyan-400/50 hover:text-zinc-900 dark:hover:text-white'
     }`}
    >
     <span className="text-base">{icon}</span>
     <span className="leading-tight">{value}</span>
    </button>
   ))}
  </div>
 </div>
 <div>
 <label htmlFor="location" className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">
 Location <span className="text-red-500">*</span>
 </label>
 <div className="relative">
 <input 
 id="location"
 type="text" 
 name="location"
 value={formData.location}
 onChange={handleChange}
 required
 aria-required="true"
 className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500/50"
 placeholder="City or Venue"
 />
 <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
 </div>
 </div>
 </div>

 <div>
 <label htmlFor="requirements" className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Any special requirements? (Optional)</label>
 <textarea 
 id="requirements"
 rows={3}
 name="requirements"
 value={formData.requirements}
 onChange={handleChange}
 className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus-visible:ring-2 focus-visible:ring-cyan-500/50"
 />
 </div>
 </div>
 </motion.div>
 )}

 {/* STEP 4: Success */}
 {step === 4 && (
 <motion.div
 key="step4"
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12 overflow-y-auto pr-2"
 >
 <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]">
 <CheckCircle2 className="w-12 h-12" />
 </div>
 <div>
 <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Booking Requested!</h2>
 <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
 Your request for {formData.date} at {formData.timeSlot} has been received. 
 To lock in your date, please pay a ₹1,000 token advance.
 </p>
 </div>
 
 <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl max-w-sm w-full shadow-lg text-left relative overflow-hidden">
 <div className="absolute top-0 left-0 w-full h-1 bg-brand-gradient hover-glow-brand" />
 
 <div className="flex flex-col items-center mb-6">
 <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-3">Scan to pay token advance via UPI</p>
 <div className="w-40 h-40 bg-white p-2 rounded-xl shadow-inner">
 <img src="https://images.unsplash.com/photo-1607519539352-035987f2ff83?w=200&auto=format&fit=crop" alt="UPI QR Code" className="w-full h-full object-cover rounded-lg mix-blend-multiply opacity-80" />
 </div>
 </div>
 
 <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 flex flex-col items-center">
 <p className="text-sm font-bold text-zinc-900 dark:text-white mb-1"><MapPin className="w-4 h-4 inline mr-1 text-cyan-500" /> Prefer to pay in person?</p>
 <p className="text-xs text-zinc-500 text-center">Visit our studio within 24 hours to pay your advance and confirm your booking.</p>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* Footer Navigation */}
 {step < 4 && (
 <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/50">
 <button
 onClick={prevStep}
 disabled={step === 1 || isSubmitting}
 className="flex items-center gap-2 px-6 py-3 rounded-full font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-0 transition-all"
 >
 <ChevronLeft className="w-5 h-5" /> Back
 </button>

 {error && <p className="text-red-500 text-sm font-medium absolute left-1/2 -translate-x-1/2">{error}</p>}

 {step < 3 ? (
 <button
 onClick={nextStep}
 className="flex items-center gap-2 px-8 py-3 rounded-full font-bold bg-zinc-900 dark:bg-white text-white dark:text-black hover:scale-105 transition-all shadow-lg"
 >
 Continue <ChevronRight className="w-5 h-5" />
 </button>
 ) : (
 <button
 onClick={handleSubmit}
 disabled={isSubmitting || !formData.name || !formData.phone || !formData.location}
 className="flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold bg-brand-gradient hover-glow-brand text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 disabled:hover:scale-100 min-w-[200px]"
 >
 {isSubmitting ? (
 <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
 ) : (
 "Confirm Booking"
 )}
 </button>
 )}
 </div>
 )}
 </div>
 );
}
