"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";

// Mock database of already booked dates (Format: YYYY-MM-DD)
// Once the Spring Boot backend is ready, we will fetch this array from the API!
const mockBookedDates = [
  "2026-08-20",
  "2026-08-25",
  "2026-09-01"
];

export default function Contact() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFormData((prev) => ({ ...prev, date: selectedDate }));

    if (mockBookedDates.includes(selectedDate)) {
      setDateError("Sorry, this date is already booked! Please select another date.");
    } else {
      setDateError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mockBookedDates.includes(formData.date)) {
      alert("Cannot submit. The selected date is already booked.");
      return;
    }
    
    const finalEventType = formData.eventType === "Other" ? formData.customEventType : formData.eventType;
    
    // Format the WhatsApp message
    const phoneNumber = "919865992379";
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
  };

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Book Your Session</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          Fill out the form below with your details and we will get back to you shortly to confirm your booking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Booking Form */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-6">Booking Request</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Name</label>
                <input 
                  required 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500" 
                  placeholder="John Doe" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Phone Number</label>
                <input 
                  required 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500" 
                  placeholder="+91 98765 43210" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Event Type</label>
                  <select 
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Birthday Function">Birthday Function</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {formData.eventType === "Other" && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Please specify event type</label>
                    <input 
                      required 
                      type="text" 
                      name="customEventType"
                      value={formData.customEventType}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500" 
                      placeholder="e.g. Corporate Event" 
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Date</label>
                <input 
                  required 
                  type="date" 
                  name="date"
                  min={today}
                  value={formData.date}
                  onChange={handleDateChange}
                  style={{ colorScheme: "dark" }}
                  className={`w-full bg-zinc-950 border rounded-lg px-4 py-3 text-white focus:outline-none ${dateError ? 'border-red-500 focus:border-red-500' : 'border-zinc-800 focus:border-zinc-500'}`} 
                />
                {dateError && <p className="text-red-500 text-sm mt-2">{dateError}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Location / Venue</label>
              <input 
                required 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500" 
                placeholder="City or exact venue" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Additional Requirements</label>
              <textarea 
                rows={4} 
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-zinc-500" 
                placeholder="Tell us more about your event..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={!!dateError}
              className={`w-full font-bold py-4 rounded-xl transition-colors ${dateError ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200'}`}
            >
              Submit Booking Request
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
          <div className="space-y-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="bg-zinc-900 p-4 rounded-xl">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Visit Our Studio</h3>
                <p className="text-zinc-400 mt-1">34, prasanna new colony, Avaniyapuram, Madurai.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-zinc-900 p-4 rounded-xl">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Call Us</h3>
                <p className="text-zinc-400 mt-1">+91 98659 92379</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-zinc-900 p-4 rounded-xl">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Email Us</h3>
                <p className="text-zinc-400 mt-1">ajayavinashsss@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-zinc-900 p-4 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-white">Opening Hours</h3>
                <p className="text-zinc-400 mt-1">Monday - Sunday: 9:00 AM - 8:00 PM</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 h-64 rounded-3xl border border-zinc-800 overflow-hidden relative">
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
