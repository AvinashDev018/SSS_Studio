"use client";

import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { useState, useEffect } from "react";
import { getBookedDates, createBooking } from "@/app/actions/booking";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Contact() {
  const [bookedDates, setBookedDates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    eventType: "Wedding",
    customEventType: "",
    date: "",
    location: "",
    requirements: ""
  });

  const [dateError, setDateError] = useState("");

  // Get today's date in YYYY-MM-DD format to prevent booking in the past
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Fetch booked dates from Supabase when the component mounts
    const fetchDates = async () => {
      const dates = await getBookedDates();
      setBookedDates(dates);
    };
    fetchDates();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFormData((prev) => ({ ...prev, date: selectedDate }));

    if (bookedDates.includes(selectedDate)) {
      setDateError("Sorry, this date is already booked! Please select another date.");
    } else {
      setDateError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bookedDates.includes(formData.date)) {
      alert("Cannot submit. The selected date is already booked.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Save booking to Supabase database via Server Action
    const result = await createBooking(formData);
    
    setIsSubmitting(false);

    if (!result.success) {
      alert(result.error || "Something went wrong. Please try again.");
      return;
    }

    const finalEventType = formData.eventType === "Other" ? formData.customEventType : formData.eventType;
    
    // Format the WhatsApp message
    const phoneNumber = "916383565425";
    const textMessage = `*New Booking Request!* 📸

*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Event Type:* ${finalEventType}
*Date:* ${formData.date}
*Location:* ${formData.location}

*Additional Requirements:*
${formData.requirements || "None"}

Please let me know if this date is available.`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMessage)}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
    
    // Reset form after successful submission
    setFormData({
      name: "",
      phone: "",
      eventType: "Wedding",
      customEventType: "",
      date: "",
      location: "",
      requirements: ""
    });
  };

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-amber-100 dark:to-yellow-600 drop-shadow-sm">Let's Create Magic</h1>
        <p className="text-zinc-600 dark:text-zinc-300 text-xl max-w-2xl mx-auto font-light leading-relaxed">
          Ready to book your session? Fill out the form below and we'll get back to you within 24 hours to discuss the details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Booking Form */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Booking Request</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Name</label>
                <input 
                  required 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 dark:focus:border-zinc-500" 
                  placeholder="John Doe" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Phone Number</label>
                <input 
                  required 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 dark:focus:border-zinc-500" 
                  placeholder="+91 98765 43210" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Event Type</label>
                  <select 
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 dark:focus:border-zinc-500"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Birthday Function">Birthday Function</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {formData.eventType === "Other" && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Please specify event type</label>
                    <input 
                      required 
                      type="text" 
                      name="customEventType"
                      value={formData.customEventType}
                      onChange={handleChange}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 dark:focus:border-zinc-500" 
                      placeholder="e.g. Corporate Event" 
                    />
                  </div>
                )}
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Date</label>
                <DatePicker
                  selected={formData.date ? new Date(formData.date) : null}
                  onChange={(date) => {
                    // DatePicker returns a Date object, convert it back to YYYY-MM-DD for our form state
                    const formattedDate = date ? date.toLocaleDateString('en-CA') : "";
                    setFormData((prev) => ({ ...prev, date: formattedDate }));
                    setDateError("");
                  }}
                  minDate={new Date()}
                  excludeDates={bookedDates.map(dateString => new Date(dateString))}
                  placeholderText="Select a date"
                  className={`w-full bg-zinc-50 dark:bg-zinc-950 border rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none ${dateError ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:border-amber-500 dark:focus:border-zinc-500'}`} 
                  wrapperClassName="w-full"
                  required
                />
                {dateError && <p className="text-red-500 text-sm mt-2">{dateError}</p>}
                
                <style jsx global>{`
                  .react-datepicker-wrapper {
                    display: block;
                    width: 100%;
                  }
                  .react-datepicker {
                    font-family: inherit;
                    background-color: #18181b;
                    border: 1px solid #27272a;
                    border-radius: 1rem;
                    color: white;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                  }
                  .react-datepicker__header {
                    background-color: #18181b;
                    border-bottom: 1px solid #27272a;
                    border-top-left-radius: 1rem;
                    border-top-right-radius: 1rem;
                  }
                  .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header {
                    color: white;
                  }
                  .react-datepicker__day-name {
                    color: #a1a1aa;
                  }
                  .react-datepicker__day {
                    color: #e4e4e7;
                  }
                  .react-datepicker__day:hover {
                    background-color: #27272a;
                    border-radius: 0.5rem;
                  }
                  .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
                    background-color: #D4AF37 !important;
                    color: black !important;
                    border-radius: 0.5rem;
                    font-weight: bold;
                  }
                  .react-datepicker__day--disabled {
                    color: #52525b !important;
                    text-decoration: line-through;
                  }
                  .react-datepicker__day--disabled:hover {
                    background-color: transparent;
                  }
                `}</style>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Location / Venue</label>
              <input 
                required 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 dark:focus:border-zinc-500" 
                placeholder="City or exact venue" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Additional Requirements</label>
              <textarea 
                rows={4} 
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500 dark:focus:border-zinc-500" 
                placeholder="Tell us more about your event..."
              ></textarea>
            </div>

              <button
                type="submit"
                disabled={bookedDates.includes(formData.date) || isSubmitting}
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-600 text-black py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Submitting..." : "Send Booking Request"}
              </button>
          </form>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Contact Information</h2>
          <div className="space-y-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-transparent">
                <MapPin className="w-6 h-6 text-amber-600 dark:text-white" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-amber-400">Visit Our Studio</h3>
                <p className="text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed text-lg">34, prasanna new colony, Avaniyapuram,<br/>Madurai.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-transparent">
                <Phone className="w-6 h-6 text-amber-600 dark:text-white" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-amber-400">Call Us</h3>
                <p className="text-zinc-600 dark:text-zinc-300 mt-1 text-lg">+91 63835 65425</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-transparent">
                <Mail className="w-6 h-6 text-amber-600 dark:text-white" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-zinc-900 dark:text-amber-400">Email Us</h3>
                <p className="text-zinc-600 dark:text-zinc-300 mt-1 text-lg">ajayavinashsss@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-transparent">
                <Clock className="w-6 h-6 text-amber-600 dark:text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">Opening Hours</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mt-1">Monday - Sunday: 9:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-100 dark:bg-zinc-900 h-64 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
            <iframe 
              src="https://maps.google.com/maps?q=34,%20prasanna%20new%20colony,%20Avaniyapuram,%20Madurai&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Studio Location"
              className="absolute inset-0"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
