"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Paperclip, ChevronRight } from "lucide-react";

const MENU_OPTIONS = [
  { id: "pricing", label: "Pricing & Packages" },
  { id: "services", label: "Services" },
  { id: "location", label: "Location & Opening Hours" },
  { id: "booking", label: "How to Book" },
  { id: "delivery", label: "Photo Delivery" },
  { id: "preparation", label: "How to Prepare" },
  { id: "outfits", label: "Outfit Suggestions" },
  { id: "session", label: "Session Details" },
  { id: "quote", label: "Get a Custom Quote" },
  { id: "track", label: "Track Order" },
  { id: "report", label: "Report Damaged Item" },
  { id: "other", label: "Other Queries" },
];

const WHATSAPP_URL = "https://wa.me/916383565425?text=Hi!%20I%27m%20interested%20in%20booking%20a%20photography%20session.";

const FAQ_RESPONSES = {
  pricing: {
    title: "Packages and starting prices",
    text: "Choose a package based on the kind of memories you want to create. Every package can be adjusted for your event.",
    details: [
      "Essential Portrait — starts at ₹1,500; includes 5 edited high-resolution digital photos.",
      "Signature Family Session — starts at ₹4,500; includes 15 edited photos and 1 large physical print.",
      "Premium Event Coverage — starts at ₹15,000; includes event coverage, an album, and a cinematic highlight video.",
      "Final pricing depends on the date, event size, location, duration, photos, video, album, and prints you choose.",
    ],
    actions: [{ label: "View Services", href: "/services" }, { label: "Request a Quote", href: WHATSAPP_URL, external: true }],
  },
  services: {
    title: "What SSS Studio can create",
    text: "We cover personal milestones, family memories, professional portraits, and event storytelling.",
    details: [
      "Wedding photography and videography for candid and traditional moments.",
      "Portrait sessions for individuals, couples, families, and professional profiles.",
      "Birthday and small-function coverage with candid photos and highlight videos.",
      "Corporate photography for teams, events, branding, and LinkedIn profiles.",
      "Albums, framed prints, passport photos, collages, and personalized photo gifts are also available in the Studio Store.",
    ],
    actions: [{ label: "Explore Services", href: "/services" }, { label: "Open Studio Store", href: "/store" }],
  },
  location: {
    title: "Visit SSS Studio",
    text: "Here is everything you need before visiting or planning an outdoor session.",
    details: [
      "Address: 34, Prasanna New Colony, Avaniyapuram, Madurai.",
      "Opening hours: Monday to Sunday, 9:00 AM to 8:00 PM.",
      "Call: +91 63835 65425.",
      "For outdoor locations, share your preferred area with the team so travel, timing, and permissions can be confirmed.",
    ],
    actions: [{ label: "Get Directions", href: "https://maps.google.com/?q=34%2C%20Prasanna%20New%20Colony%2C%20Avaniyapuram%2C%20Madurai", external: true }, { label: "Call the Studio", href: "tel:+916383565425", external: true }],
  },
  booking: {
    title: "How booking works",
    text: "Booking takes a few simple steps and lets you see available dates and times.",
    details: [
      "1. Sign in or create an account.",
      "2. Select the package that fits your occasion.",
      "3. Choose an available date and time slot.",
      "4. Add your name, phone number, event type, location, and requirements.",
      "5. Submit the booking request. The studio team will confirm the details with you.",
      "Please contact us before booking if your event needs a custom package, multiple locations, or both photography and video.",
    ],
    actions: [{ label: "Book a Session", href: "/book" }, { label: "WhatsApp Us", href: WHATSAPP_URL, external: true }],
  },
  delivery: {
    title: "Photo and video delivery",
    text: "Your finished memories are prepared and shared according to the selected package.",
    details: [
      "Edited photos are delivered through a secure online gallery.",
      "Album and print delivery depends on selection, design approval, and production time.",
      "Video delivery time depends on the event size and editing style.",
      "The team will confirm the expected delivery timeline when your booking is reviewed.",
      "Keep your gallery link safe and contact us if you need help accessing your order.",
    ],
    actions: [{ label: "Track an Order", href: "/track" }],
  },
  preparation: {
    title: "How to prepare for your session",
    text: "A little preparation helps the session stay relaxed and gives you more variety in your final gallery.",
    details: [
      "Arrive 10 to 15 minutes early so you have time to settle in.",
      "Bring your outfits, footwear, accessories, and any meaningful props.",
      "Keep outfits freshly pressed and bring one comfortable look plus one statement look.",
      "For outdoor shoots, carry water, sunscreen, and a small touch-up kit.",
      "Share important family names, event moments, or must-have photographs with the team before the session.",
    ],
  },
  outfits: {
    title: "Outfit guidance",
    text: "Choose clothing that feels like you and photographs clearly against the planned background.",
    details: [
      "Portraits: solid colors, clean layers, and minimal distracting patterns keep attention on expressions.",
      "Weddings: Kanjivaram silk sarees, lehengas, sherwanis, silk kurtas, and veshti create a rich traditional look.",
      "Families: coordinate colors without wearing identical outfits; choose two or three complementary tones.",
      "Corporate: pressed formalwear, simple accessories, and calm colors create a confident professional image.",
      "Bring a backup outfit when possible, especially for long events or outdoor sessions.",
    ],
  },
  session: {
    title: "What to expect from a session",
    text: "The team guides you through poses, expressions, backgrounds, and lighting so you do not need to be an experienced model.",
    details: [
      "The session length depends on your package, number of people, outfit changes, and location.",
      "The photographer will suggest natural poses as well as formal portraits.",
      "You can discuss preferred photos, family combinations, and important event moments in advance.",
      "Extra time, locations, video coverage, albums, and prints can be discussed as add-ons.",
    ],
    actions: [{ label: "See the Portfolio", href: "/gallery" }],
  },
  quote: {
    title: "Get a custom quote",
    text: "A custom quote is best when your event does not fit one standard package.",
    details: [
      "Event type and date.",
      "Number of people and expected event duration.",
      "Studio, home, outdoor, or heritage location.",
      "Photography, video, album, prints, or photo gifts needed.",
      "Any special moments, themes, outfit changes, or travel requirements.",
    ],
    actions: [{ label: "Request on WhatsApp", href: WHATSAPP_URL, external: true }],
  },
  track: {
    title: "Track your order",
    text: "Use the Track Order page or the link shared with you by the studio.",
    details: [
      "Keep your order ID or tracking details ready.",
      "The order page can show the latest available status for your delivery.",
      "For a missing link, delayed order, or access problem, contact the studio team directly.",
    ],
    actions: [{ label: "Open Track Order", href: "/track" }],
  },
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi there! Welcome to SSS Studio. How can we help capture your memories today?",
      type: "text",
    },
    { id: 2, sender: "bot", type: "menu", options: MENU_OPTIONS },
  ]);
  const [currentState, setCurrentState] = useState("menu"); // 'menu', 'report_form', 'chat'

  // Form State for Report Damaged Item
  const [orderId, setOrderId] = useState("");
  const [damageImage, setDamageImage] = useState(null);
  const [userInput, setUserInput] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleMenuClick = (optionId, label) => {
    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: label, type: "text" },
    ]);

    const response = FAQ_RESPONSES[optionId];
    if (response) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "bot",
            type: "rich",
            title: response.title,
            text: response.text,
            details: response.details,
            actions: response.actions,
          },
          { id: Date.now() + 1, sender: "bot", type: "menu", options: MENU_OPTIONS },
        ]);
      }, 500);
      return;
    }

    // Handle bot response based on state machine
    setTimeout(() => {
      if (optionId === "report") {
        setCurrentState("report_form");
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "bot",
            text: "We're sorry to hear that. Please provide your Order ID and a photo of the damaged item.",
            type: "text",
          },
        ]);
      } else if (optionId === "pricing") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "bot",
            text: "Our photography packages start at ₹1,500 for an Essential Portrait session. Family sessions start at ₹4,500, and event coverage starts at ₹15,000. Visit Services or contact us for a custom quote.",
            type: "text",
          },
          { id: Date.now() + 1, sender: "bot", type: "menu", options: MENU_OPTIONS },
        ]);
      } else if (optionId === "services") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "bot",
            text: "SSS Studio offers wedding photography, portraits, birthday functions, family sessions, corporate photography, albums, frames, and photo gifts.",
            type: "text",
          },
          { id: Date.now() + 1, sender: "bot", type: "menu", options: MENU_OPTIONS },
        ]);
      } else if (optionId === "location") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "bot",
            text: "Our studio is at 34, Prasanna New Colony, Avaniyapuram, Madurai. We are open Monday to Sunday, 9:00 AM to 8:00 PM.",
            type: "text",
          },
          { id: Date.now() + 1, sender: "bot", type: "menu", options: MENU_OPTIONS },
        ]);
      } else if (optionId === "booking") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "bot",
            text: "To book, sign in, choose a package, select an available date and time, then add your contact details. You can start from the Book Session button or message us on WhatsApp.",
            type: "text",
          },
          {
            id: Date.now() + 1,
            sender: "bot",
            type: "actions",
            options: [
              { label: "Book a Session", href: "/book" },
              { label: "WhatsApp Us", href: WHATSAPP_URL, external: true },
            ],
          },
          { id: Date.now() + 2, sender: "bot", type: "menu", options: MENU_OPTIONS },
        ]);
      } else if (optionId === "delivery") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "bot",
            text: "Edited photos are delivered through a secure online gallery. Delivery time depends on your package and event size; our team will confirm it when you book.",
            type: "text",
          },
          { id: Date.now() + 1, sender: "bot", type: "menu", options: MENU_OPTIONS },
        ]);
      } else if (optionId === "preparation") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "bot",
            text: "Please arrive 10 to 15 minutes early, bring your preferred outfits and accessories, and keep outfits freshly pressed. For outdoor shoots, carry water and a small touch-up kit.",
            type: "text",
          },
          { id: Date.now() + 1, sender: "bot", type: "menu", options: MENU_OPTIONS },
        ]);
      } else if (optionId === "outfits") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "bot",
            text: "For portraits, solid colors photograph beautifully. For weddings, consider silk sarees, lehengas, sherwanis, silk kurtas, or veshti. Bring one comfortable outfit and one statement look for variety.",
            type: "text",
          },
          { id: Date.now() + 1, sender: "bot", type: "menu", options: MENU_OPTIONS },
        ]);
      } else if (optionId === "session") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "bot",
            text: "We photograph portraits, families, weddings, birthdays, and corporate events. Session length depends on your package, number of people, and location. We will confirm the schedule before your booking.",
            type: "text",
          },
          { id: Date.now() + 1, sender: "bot", type: "menu", options: MENU_OPTIONS },
        ]);
      } else if (optionId === "quote") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "bot",
            text: "For a custom quote, tell us your event type, preferred date, location, number of people, and whether you need photos, video, an album, or prints.",
            type: "text",
          },
          {
            id: Date.now() + 1,
            sender: "bot",
            type: "actions",
            options: [{ label: "Request on WhatsApp", href: WHATSAPP_URL, external: true }],
          },
          { id: Date.now() + 2, sender: "bot", type: "menu", options: MENU_OPTIONS },
        ]);
      } else if (optionId === "track") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "bot",
            text: "You can track your order using the link sent to your email, or visit the 'Track Order' page on our site.",
            type: "text",
          },
          { id: Date.now() + 1, sender: "bot", type: "menu", options: MENU_OPTIONS },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: "bot",
            text: "Please hold on, our team will get back to you shortly during working hours (9 AM - 6 PM).",
            type: "text",
          },
          {
            id: Date.now() + 1,
            sender: "bot",
            type: "actions",
            options: [{ label: "WhatsApp Us", href: WHATSAPP_URL, external: true }],
          },
          { id: Date.now() + 2, sender: "bot", type: "menu", options: MENU_OPTIONS },
        ]);
      }
    }, 500);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!orderId) return;

    // Simulate submission
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: `Submitted Report for Order ID: ${orderId}`,
        type: "text",
      },
    ]);

    setOrderId("");
    setDamageImage(null);
    setCurrentState("menu");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "bot",
          text: "Thank you. Our support team has received your report and will contact you within 24 hours.",
          type: "text",
        },
        { id: Date.now() + 1, sender: "bot", type: "menu", options: MENU_OPTIONS },
      ]);
    }, 1000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDamageImage(file.name);
    }
  };

  const getTextAnswer = (question) => {
    const normalizedQuestion = question.toLowerCase();

    if (normalizedQuestion.includes("damage") || normalizedQuestion.includes("damaged") || normalizedQuestion.includes("broken") || normalizedQuestion.includes("cracked") || normalizedQuestion.includes("defect") || normalizedQuestion.includes("frame is")) {
      return "I am sorry your item arrived damaged. Please use the damage report form below with your Order ID and a photo of the damaged item. Our support team will review it and contact you within 24 hours.";
    }
    if (normalizedQuestion.includes("price") || normalizedQuestion.includes("cost") || normalizedQuestion.includes("package")) {
      return "Our packages start at ₹1,500 for Essential Portrait, ₹4,500 for Signature Family Session, and ₹15,000+ for Premium Event Coverage. Contact us for a custom quote.";
    }
    if (normalizedQuestion.includes("where") || normalizedQuestion.includes("location") || normalizedQuestion.includes("address")) {
      return "We are at 34, Prasanna New Colony, Avaniyapuram, Madurai. We are open Monday to Sunday, 9:00 AM to 8:00 PM.";
    }
    if (normalizedQuestion.includes("open") || normalizedQuestion.includes("hour") || normalizedQuestion.includes("time")) {
      return "Our studio is open Monday to Sunday, 9:00 AM to 8:00 PM.";
    }
    if (normalizedQuestion.includes("book") || normalizedQuestion.includes("reserve")) {
      return "To book, choose a package, select an available date and time, and submit your contact details on the Book Session page. You can also message us on WhatsApp.";
    }
    if (normalizedQuestion.includes("wear") || normalizedQuestion.includes("outfit") || normalizedQuestion.includes("dress")) {
      return "For portraits, solid colors photograph beautifully. For weddings, consider silk sarees, lehengas, sherwanis, silk kurtas, or veshti. Bring one comfortable outfit and one statement look.";
    }
    if (normalizedQuestion.includes("prepare") || normalizedQuestion.includes("bring") || normalizedQuestion.includes("before")) {
      return "Please arrive 10 to 15 minutes early, bring your outfits and accessories, and keep outfits freshly pressed. For outdoor shoots, carry water and a small touch-up kit.";
    }
    if (normalizedQuestion.includes("how long") || normalizedQuestion.includes("duration") || normalizedQuestion.includes("time take")) {
      return "Session length depends on your package, number of people, and location. We will confirm the schedule before your booking.";
    }
    if (normalizedQuestion.includes("deliver") || normalizedQuestion.includes("photo") || normalizedQuestion.includes("album")) {
      return "Edited photos are delivered through a secure online gallery. Our team will confirm the delivery time based on your package and event size.";
    }
    if (normalizedQuestion.includes("quote") || normalizedQuestion.includes("custom") || normalizedQuestion.includes("video")) {
      return "For a custom quote, share your event type, preferred date, location, number of people, and whether you need photos, video, an album, or prints. Our team can help on WhatsApp.";
    }
    if (normalizedQuestion.includes("service") || normalizedQuestion.includes("offer") || normalizedQuestion.includes("shoot")) {
      return "We offer wedding, portrait, birthday, family, and corporate photography, plus albums, frames, and photo gifts.";
    }

    return "I can help with packages, services, location, opening hours, booking, photo delivery, and order tracking. For anything else, please contact our team on WhatsApp.";
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    const question = userInput.trim();
    if (!question || currentState === "report_form") return;
    const isDamageReport = /damage|damaged|broken|cracked|defect|frame is/i.test(question);

    if (isDamageReport) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "user", text: question, type: "text" },
        {
          id: Date.now() + 1,
          sender: "bot",
          text: getTextAnswer(question),
          type: "text",
        },
      ]);
      setCurrentState("report_form");
      setUserInput("");
      return;
    }

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: question, type: "text" },
      {
        id: Date.now() + 1,
        sender: "bot",
        text: getTextAnswer(question),
        type: "text",
      },
      {
        id: Date.now() + 2,
        sender: "bot",
        type: "actions",
        options: question.toLowerCase().includes("book")
          ? [{ label: "Book a Session", href: "/book" }]
          : [{ label: "Chat on WhatsApp", href: WHATSAPP_URL, external: true }],
      },
      { id: Date.now() + 3, sender: "bot", type: "menu", options: MENU_OPTIONS },
    ]);
    setUserInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? "bg-red-500 hover:bg-red-600 rotate-90" : "bg-black hover:bg-gray-800"
        } text-white`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 max-h-[calc(100vh-7rem)] bg-white rounded-2xl shadow-[0_5px_40px_-15px_rgba(0,0,0,0.3)] border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 origin-bottom-right">
          {/* Header */}
          <div className="bg-black text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Camera size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">SSS Studio Support</h3>
                <p className="text-xs text-gray-300">We typically reply instantly</p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 min-h-0 p-4 overflow-y-auto overscroll-contain bg-gray-50 h-[400px] max-h-[calc(100vh-13rem)] flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                }`}
              >
                {msg.type === "text" && (
                  <div
                    className={`p-3 rounded-2xl text-sm ${
                      msg.sender === "user"
                        ? "bg-black text-white rounded-tr-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}

                {msg.type === "rich" && (
                  <div className="p-3 rounded-2xl rounded-tl-sm bg-white border border-gray-200 text-gray-800 shadow-sm text-sm">
                    <p className="font-bold text-gray-900 mb-1">{msg.title}</p>
                    <p>{msg.text}</p>
                    {msg.details?.length > 0 && (
                      <ul className="mt-3 space-y-2 list-disc pl-4 text-gray-600">
                        {msg.details.map((detail) => <li key={detail}>{detail}</li>)}
                      </ul>
                    )}
                    {msg.actions?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {msg.actions.map((action) => (
                          <a
                            key={action.label}
                            href={action.href}
                            target={action.external ? "_blank" : undefined}
                            rel={action.external ? "noreferrer" : undefined}
                            className="inline-flex items-center gap-1.5 bg-black text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors"
                          >
                            {action.label}
                            <ChevronRight size={14} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {msg.type === "menu" && (
                  <div className="flex flex-col gap-2 mt-2 w-full">
                    {msg.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleMenuClick(opt.id, opt.label)}
                        className="flex items-center justify-between bg-white border border-gray-200 p-2.5 rounded-lg text-sm text-gray-700 hover:border-black hover:bg-gray-50 transition-colors shadow-sm w-full text-left"
                      >
                        {opt.label}
                        <ChevronRight size={16} className="text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}

                {msg.type === "actions" && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.options.map((action) => (
                      <a
                        key={action.label}
                        href={action.href}
                        target={action.external ? "_blank" : undefined}
                        rel={action.external ? "noreferrer" : undefined}
                        className="inline-flex items-center gap-1.5 bg-black text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors"
                      >
                        {action.label}
                        <ChevronRight size={14} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Inline Form for Report Damaged Item */}
            {currentState === "report_form" && (
              <div className="self-start w-full bg-white border border-gray-200 p-4 rounded-xl shadow-sm mt-2">
                <h4 className="text-sm font-semibold mb-3 text-gray-800">Submit Damage Report</h4>
                <form onSubmit={handleReportSubmit} className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Order ID *</label>
                    <input
                      type="text"
                      required
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="e.g. SSS-12345"
                      className="w-full text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Photo Evidence</label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md border border-gray-300 flex items-center gap-2 text-sm text-gray-700 transition-colors">
                        <Paperclip size={16} />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                      {damageImage && (
                        <span className="text-xs text-gray-500 truncate w-24">
                          {damageImage}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-2 w-full bg-black text-white text-sm font-medium py-2 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Submit Report
                  </button>
                </form>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Input Area */}
          <form onSubmit={handleTextSubmit} className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={currentState === "report_form" ? "Please use the form above" : "Ask about our studio..."}
                disabled={currentState === "report_form"}
                aria-label="Ask SSS Studio a question"
                className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={currentState === "report_form" || !userInput.trim()}
                aria-label="Send question"
                className="text-gray-400 enabled:hover:text-black disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Camera(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}
