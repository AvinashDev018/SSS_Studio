"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, Package as PackageIcon, User, MapPin } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

    // Success - format WhatsApp message
    const phoneNumber = "916383565425";
    const textMessage = `*New Booking Request!* 📸

*Client Name:* ${formData.name}
*Phone:* ${formData.phone}
*Event Type:* ${formData.eventType}
*Package:* ${formData.packageName}
*Date:* ${formData.date}
*Time:* ${formData.timeSlot}
*Location:* ${formData.location}

*Additional Requirements:*
${formData.requirements || "None"}

Please confirm if you are available.`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMessage)}`;
    
    setIsSubmitting(false);
    setStep(4); // Move to success step
    
    // Open WhatsApp after a short delay
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
    }, 1500);
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
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-600"
          initial={{ width: "25%" }}
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 0.3 }}
        />

        <div className="flex gap-4 items-center w-full justify-between px-2 sm:px-8 text-sm sm:text-base font-medium">
          <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-amber-500' : 'text-zinc-400'}`}>
            <PackageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:block">Package</span>
          </div>
          <div className="flex-1 h-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2" />
          <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-amber-500' : 'text-zinc-400'}`}>
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:block">Schedule</span>
          </div>
          <div className="flex-1 h-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2" />
          <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-amber-500' : 'text-zinc-400'}`}>
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:block">Details</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 sm:p-10 relative overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Package Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 h-full flex flex-col"
            >
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Choose a Package</h2>
                <p className="text-zinc-500 dark:text-zinc-400">Select the service package that best fits your needs.</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
                {isLoading ? (
                  <p className="text-zinc-500 text-center py-8">Loading packages...</p>
                ) : packages.length === 0 ? (
                  <div className="text-center py-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium">No packages available right now.</p>
                    <p className="text-zinc-500 text-sm mt-1">Please check back later or contact us directly.</p>
                  </div>
                ) : (
                  packages.map((pkg) => (
                    <div 
                      key={pkg.id}
                      onClick={() => setFormData({...formData, packageId: pkg.id, packageName: pkg.name})}
                      className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 flex justify-between items-center group ${
                        formData.packageId === pkg.id 
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10" 
                          : "border-zinc-200 dark:border-zinc-800 hover:border-amber-400/50"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-xl text-zinc-900 dark:text-white">{pkg.name}</h3>
                          {pkg.popular && (
                            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-2">{pkg.description}</p>
                        <p className="font-semibold text-amber-600 dark:text-amber-500">{pkg.price}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        formData.packageId === pkg.id 
                          ? "bg-amber-500 text-white" 
                          : "bg-zinc-200 dark:bg-zinc-800 text-transparent"
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
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
              className="space-y-8 h-full flex flex-col"
            >
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Select Date & Time</h2>
                <p className="text-zinc-500 dark:text-zinc-400">Choose when you'd like your session.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                {/* Calendar */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" /> Pick a Date
                  </label>
                  <DatePicker
                    selected={formData.date ? new Date(formData.date) : null}
                    onChange={(date) => {
                      const formattedDate = date ? date.toLocaleDateString('en-CA') : "";
                      setFormData((prev) => ({ ...prev, date: formattedDate, timeSlot: "" })); // Reset time when date changes
                    }}
                    minDate={new Date()}
                    inline
                  />
                  {/* Calendar Styles injected locally */}
                  <style jsx global>{`
                    .react-datepicker {
                      font-family: inherit;
                      background-color: transparent;
                      border: 1px solid #27272a;
                      border-radius: 1rem;
                      color: inherit;
                      width: 100%;
                    }
                    .react-datepicker__month-container { width: 100%; }
                    .react-datepicker__header {
                      background-color: transparent;
                      border-bottom: 1px solid #27272a;
                    }
                    .react-datepicker__day--selected {
                      background-color: #f59e0b !important;
                      color: white !important;
                      border-radius: 0.5rem;
                    }
                  `}</style>
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
                            onClick={() => setFormData(prev => ({...prev, timeSlot: slot}))}
                            className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                              formData.timeSlot === slot
                                ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
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
            </motion.div>
          )}

          {/* STEP 3: Client Details */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 h-full flex flex-col"
            >
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Your Details</h2>
                <p className="text-zinc-500 dark:text-zinc-400">Final step! We just need some contact information.</p>
              </div>

              <div className="space-y-5 flex-1 overflow-y-auto pr-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Event Type</label>
                    <select 
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Wedding">Wedding</option>
                      <option value="Portrait">Portrait</option>
                      <option value="Birthday Function">Birthday Function</option>
                      <option value="Maternity">Maternity</option>
                      <option value="Product Shoot">Product Shoot</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Location</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500" 
                        placeholder="City or Venue"
                      />
                      <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-1">Any special requirements? (Optional)</label>
                  <textarea 
                    rows={3}
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500" 
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
              className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12"
            >
              <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Booking Requested!</h2>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                  We've received your request. You are now being redirected to WhatsApp to confirm the details with our team.
                </p>
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
              className="flex items-center gap-2 px-8 py-3 rounded-full font-bold bg-gradient-to-r from-amber-400 to-yellow-600 text-black hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? "Processing..." : "Confirm Booking"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
