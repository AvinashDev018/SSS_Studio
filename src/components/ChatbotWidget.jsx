"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  Paperclip, 
  ChevronRight, 
  Sparkles, 
  Package, 
  ShieldCheck, 
  ExternalLink, 
  Camera, 
  Clock, 
  CheckCircle2, 
  Search,
  Loader2
} from "lucide-react";

const MENU_OPTIONS = [
  { id: "frames_ai", label: "🖼️ Recommend a Frame Size (AI)" },
  { id: "quote_ai", label: "💍 Calculate Wedding / Event Quote (AI)" },
  { id: "pricing", label: "Pricing & Standard Packages" },
  { id: "location", label: "Studio Location & Hours (Avaniyapuram)" },
  { id: "delivery", label: "1-Month Delivery Guarantee" },
  { id: "track", label: "📦 Track an Order" },
  { id: "report", label: "Report Damaged Item" },
];

const QUICK_SUGGESTIONS = [
  "🖼️ Recommend frame for sofa wall",
  "💍 2-Day Wedding with Drone quote",
  "⚡ What is 1-Month Delivery Guarantee?",
  "🎁 Birthday gift items & prices",
  "📍 Studio Location & Timings",
  "தமிழ் உதவி (Tamil Support)",
];

const WHATSAPP_URL = "https://wa.me/916383565425?text=Hi!%20I%27m%20interested%20in%20booking%20a%20photography%20session%20with%20SSS%20Studio.";

const FAQ_RESPONSES = {
  pricing: {
    title: "Packages and starting prices",
    text: "Choose a package based on the memories you want to create. Every package includes our 1-Month Delivery Guarantee.",
    details: [
      "Essential Portrait — starts at ₹1,500 (5 edited digital photos).",
      "Signature Family Session — starts at ₹4,500 (15 edited photos + 1 large print).",
      "Premium Event Coverage — starts at ₹15,000 (Full album + cinematic highlights).",
      "Handcrafted Photo Frames — 13 sizes from ₹349 to ₹4,999 with Sparkle & Matte finishes.",
    ],
    actions: [
      { label: "View Services", href: "/services" },
      { label: "View Frame Price List", href: "/#frames" },
      { label: "Request on WhatsApp", href: WHATSAPP_URL, external: true }
    ],
  },
  location: {
    title: "Visit SSS Studio in Madurai",
    text: "Here is everything you need before visiting or planning your session:",
    details: [
      "Address: 34, Prasanna New Colony, Avaniyapuram, Madurai, Tamil Nadu.",
      "Opening hours: Monday to Sunday, 9:00 AM to 8:00 PM.",
      "Call / WhatsApp: +91 63835 65425.",
    ],
    actions: [
      { label: "Get Directions", href: "https://maps.google.com/?q=34%2C%20Prasanna%20New%20Colony%2C%20Avaniyapuram%2C%20Madurai", external: true },
      { label: "Call Studio", href: "tel:+916383565425", external: true }
    ],
  },
  delivery: {
    title: "1-Month Delivery Guarantee",
    text: "We respect your time. SSS Photography Studio guarantees your edited master album and photos within 30 days of ceremony selection, or receive ₹1,000 cash credit.",
    details: [
      "Standard Studios take 3-6 months; SSS delivers in 30 days.",
      "High-resolution edited photos accessible on private cloud gallery.",
      "Direct courier delivery for handcrafted photo frames and albums.",
    ],
    actions: [{ label: "Browse Photo Frames", href: "/#frames" }],
  },
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Vanakkam! 🙏 Welcome to SSS Photography Studio. I am your autonomous AI Studio Concierge powered by DeepSeek. How can I assist with your wedding, portrait session, or custom photo frame today?",
      type: "text",
    },
    { id: 2, sender: "bot", type: "menu", options: MENU_OPTIONS },
  ]);
  const [currentState, setCurrentState] = useState("menu");
  const [isAgentTyping, setIsAgentTyping] = useState(false);

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
  }, [messages, isOpen, isAgentTyping]);

  const sendToAgent = async (userPrompt) => {
    // Add user message
    const userMsg = { id: Date.now(), sender: "user", text: userPrompt, type: "text" };
    setMessages((prev) => [...prev, userMsg]);
    setIsAgentTyping(true);

    try {
      // Build conversation history
      const history = messages
        .filter((m) => m.type === "text")
        .slice(-6)
        .map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        }));

      history.push({ role: "user", content: userPrompt });

      const res = await fetch("/api/deepseek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      const botMsgId = Date.now() + 1;

      const newMessages = [
        {
          id: botMsgId,
          sender: "bot",
          text: data.reply || "Vanakkam! I'm here to help you choose the best frame or photography package.",
          type: "text",
        },
      ];

      // Render agent action cards if any tool was executed
      if (data.actionCards && data.actionCards.length > 0) {
        data.actionCards.forEach((card, idx) => {
          newMessages.push({
            id: botMsgId + idx + 2,
            sender: "bot",
            type: "agent_card",
            cardData: card,
          });
        });
      }

      setMessages((prev) => [...prev, ...newMessages]);
    } catch (err) {
      console.error("Agent chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "Vanakkam! Our team is available 24/7 on WhatsApp. Feel free to message our master photographer directly:",
          type: "actions",
          options: [{ label: "Chat on WhatsApp", href: WHATSAPP_URL, external: true }],
        },
      ]);
    } finally {
      setIsAgentTyping(false);
    }
  };

  const handleMenuClick = (optionId, label) => {
    if (optionId === "frames_ai") {
      sendToAgent("Recommend a handcrafted photo frame size for my living room wall above a 3-seater sofa.");
      return;
    }
    if (optionId === "quote_ai") {
      sendToAgent("Calculate quote for a 2-Day traditional wedding with candid photos, 4K video, aerial drone, and master album in Madurai.");
      return;
    }

    if (optionId === "track") {
      sendToAgent("How can I track my photo frame order?");
      return;
    }

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
      }, 400);
      return;
    }

    if (optionId === "report") {
      setCurrentState("report_form");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "bot",
          text: "We're sorry to hear that. Please provide your Order ID and photo of the damaged item.",
          type: "text",
        },
      ]);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    const q = userInput.trim();
    if (!q) return;

    setUserInput("");
    sendToAgent(q);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!orderId) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: `Submitted Damage Report for Order: ${orderId}`, type: "text" },
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
          text: "Thank you. Our studio support team in Avaniyapuram has received your report and will resolve it within 24 hours.",
          type: "text",
        },
        { id: Date.now() + 1, sender: "bot", type: "menu", options: MENU_OPTIONS },
      ]);
    }, 800);
  };

  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-[95]">
      {/* Floating Agent Button & Label */}
      <div className="flex items-center gap-2.5">
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#051a15]/95 backdrop-blur-md border border-teal-400/40 text-teal-300 rounded-full text-xs font-bold shadow-xl shadow-teal-500/20 cursor-pointer hover:bg-teal-950 transition-all hover:scale-105"
          >
            <Sparkles size={13} className="text-teal-400 animate-pulse" />
            <span>Ask DeepSeek AI (Frames & Quotes)</span>
          </div>
        )}

        <button
          suppressHydrationWarning
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Studio AI Concierge"
          className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
            isOpen ? "bg-red-500 hover:bg-red-600 rotate-90" : "bg-gradient-to-r from-teal-400 to-emerald-500 hover:scale-105 shadow-teal-500/50 shadow-lg text-black font-bold"
          } cursor-pointer`}
        >
        {isOpen ? (
          <X size={22} />
        ) : (
          <>
            <MessageCircle size={24} className="sm:w-6 sm:h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-300 rounded-full border-2 border-zinc-900 animate-pulse flex items-center justify-center">
              <Sparkles size={8} className="text-black" />
            </span>
          </>
        )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 sm:bottom-20 right-0 w-[calc(100vw-1.5rem)] sm:w-[420px] max-w-[420px] max-h-[80vh] sm:max-h-[85vh] h-[490px] sm:h-[520px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border-2 border-[#d4af37]/60 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 origin-bottom-right">
          {/* Header */}
          <div className="p-4 bg-white border-b border-black/10 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-[#d4af37] flex items-center justify-center shadow-md text-black font-bold">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-zinc-900">SSS Studio AI Assistant</h3>
                  <span className="bg-black/5 text-[#8b6508] text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border border-[#d4af37]/40">
                    DeepSeek Agent
                  </span>
                </div>
                <p className="text-[11px] text-[#8b6508] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Online • Tamil & English Fluent
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-600 hover:text-black p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Suggestion Pills */}
          <div className="bg-[#FAFAFA] px-3 py-2 border-b border-black/10 flex gap-2 overflow-x-auto no-scrollbar">
            {QUICK_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => sendToAgent(sug)}
                className="shrink-0 text-xs font-bold bg-white text-zinc-900 border border-[#d4af37]/60 hover:bg-[#d4af37] hover:text-black px-3.5 py-1.5 rounded-full transition-all shadow-sm cursor-pointer active:scale-95"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="flex-1 min-h-0 p-4 overflow-y-auto overscroll-contain bg-[#F9F9FB] h-[380px] max-h-[calc(100vh-14rem)] flex flex-col gap-3.5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[88%] ${
                  msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                }`}
              >
                {msg.type === "text" && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#d4af37] text-black font-bold rounded-tr-sm shadow-md"
                        : "bg-white border border-black/10 text-zinc-900 font-medium rounded-tl-sm shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                )}

                {/* AGENTIC RICH ACTION CARD */}
                {msg.type === "agent_card" && (
                  <div className="w-full mt-1">
                    {/* Frame Recommendation Tool Output */}
                    {msg.cardData.action === "RECOMMEND_FRAMES" && (
                      <div className="bg-white border-2 border-[#d4af37]/60 rounded-2xl p-3.5 shadow-md text-xs text-zinc-900">
                        <div className="flex items-center justify-between mb-2 border-b border-black/10 pb-2">
                          <span className="font-bold text-[#8b6508] flex items-center gap-1 text-[11px] uppercase tracking-wider">
                            <Package size={13} /> Recommended Custom Frames
                          </span>
                          <span className="text-[10px] text-zinc-500 font-bold">13 Sizes Available</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 my-2">
                          {msg.cardData.recommendedFrames?.map((f) => (
                            <div
                              key={f.id}
                              className="flex items-center justify-between bg-[#FAFAFA] border border-black/10 p-2.5 rounded-xl"
                            >
                              <div>
                                <span className="font-serif font-bold text-sm text-zinc-900">{f.size} Inch</span>
                                {f.tag && (
                                  <span className="ml-2 text-[9px] bg-[#d4af37]/20 text-[#8b6508] font-black px-1.5 py-0.5 rounded border border-[#d4af37]/40">
                                    {f.tag}
                                  </span>
                                )}
                                <p className="text-[10px] text-zinc-600 font-medium mt-0.5">{f.bestFor}</p>
                              </div>
                              <span className="font-serif font-black text-[#8b6508] text-sm">{f.priceFormatted}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-black/10 flex gap-2">
                          <a
                            href="/#frames"
                            onClick={() => setIsOpen(false)}
                            className="w-full py-2 bg-[#d4af37] text-black font-bold text-[11px] rounded-lg text-center flex items-center justify-center gap-1 hover:brightness-105 shadow-sm"
                          >
                            Order in Frame Studio →
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Package Quote Calculation Tool Output */}
                    {msg.cardData.action === "PACKAGE_QUOTE" && (
                      <div className="bg-white border-2 border-[#d4af37]/60 rounded-2xl p-3.5 shadow-md text-xs text-zinc-900">
                        <div className="flex items-center justify-between mb-2 border-b border-black/10 pb-2">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-[#8b6508] tracking-wider">
                              Package Quote Estimate
                            </span>
                            <h4 className="font-bold text-zinc-900 capitalize text-sm">
                              {msg.cardData.eventType} Ceremony ({msg.cardData.days} {msg.cardData.days > 1 ? "Days" : "Day"})
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="font-serif font-black text-base text-[#8b6508]">
                              {msg.cardData.totalEstimated}
                            </span>
                          </div>
                        </div>

                        <ul className="space-y-1 my-2 text-[11px] text-zinc-800 font-semibold">
                          {msg.cardData.deliverables?.map((del, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <CheckCircle2 size={12} className="text-[#8b6508] shrink-0" />
                              <span>{del}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-2.5 pt-2 border-t border-black/10 flex items-center justify-between">
                          <span className="text-[10px] text-[#8b6508] flex items-center gap-1 font-bold">
                            <ShieldCheck size={12} /> 1-Month Delivery Guaranteed
                          </span>
                          <a
                            href={`https://wa.me/916383565425?text=${encodeURIComponent(
                              `Hi SSS Studio! I got an AI package quote for ${msg.cardData.eventType} (${msg.cardData.totalEstimated}). Can we finalize the date?`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                          >
                            Chat on WhatsApp <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Order Tracking Output */}
                    {msg.cardData.action === "TRACK_ORDER" && (
                      <div className="bg-white border-2 border-[#d4af37]/60 rounded-2xl p-3.5 shadow-md text-xs text-zinc-900">
                        <div className="flex items-center justify-between mb-2 border-b border-black/10 pb-2">
                          <div className="flex items-center gap-1.5">
                            <Package size={14} className="text-[#8b6508]" />
                            <span className="font-mono font-bold text-zinc-900 text-xs">
                              {msg.cardData.orderId || "Order Tracking"}
                            </span>
                          </div>
                          {msg.cardData.found && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full font-bold text-[10px] uppercase">
                              {msg.cardData.status}
                            </span>
                          )}
                        </div>

                        {msg.cardData.found ? (
                          <>
                            {msg.cardData.customerName && (
                              <p className="text-zinc-800 text-[11px] mb-2 font-medium">
                                Client: <strong className="text-zinc-900 font-bold">{msg.cardData.customerName}</strong>
                                {msg.cardData.eventType && ` • ${msg.cardData.eventType} Shoot`}
                              </p>
                            )}

                            {/* Progress bar */}
                            <div className="my-2.5">
                              <div className="flex justify-between text-[10px] text-[#8b6508] font-bold mb-1">
                                <span>{msg.cardData.stageLabel || msg.cardData.status}</span>
                                <span>{msg.cardData.progress || 50}%</span>
                              </div>
                              <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden border border-black/10">
                                <div
                                  className="h-full bg-[#d4af37] rounded-full transition-all duration-500"
                                  style={{ width: `${msg.cardData.progress || 50}%` }}
                                />
                              </div>
                              {msg.cardData.stageDesc && (
                                <p className="text-[10px] text-zinc-600 font-medium mt-1">{msg.cardData.stageDesc}</p>
                              )}
                            </div>

                            {msg.cardData.courierTrackingId && (
                              <div className="p-2 bg-[#FAFAFA] rounded-lg border border-black/10 my-2 text-[10px] flex justify-between items-center">
                                <span className="text-zinc-600 font-medium">Courier ID:</span>
                                <span className="font-mono text-[#8b6508] font-bold">{msg.cardData.courierTrackingId}</span>
                              </div>
                            )}

                            <div className="mt-3 pt-2 border-t border-black/10 flex gap-2">
                              <a
                                href={msg.cardData.trackUrl || `/track?id=${msg.cardData.orderId}`}
                                onClick={() => setIsOpen(false)}
                                className="flex-1 py-1.5 bg-[#d4af37] text-black font-bold text-[11px] rounded-lg text-center flex items-center justify-center gap-1 hover:brightness-105 shadow-sm"
                              >
                                View Timeline →
                              </a>
                              <a
                                href={`https://wa.me/916383565425?text=${encodeURIComponent(
                                  `Hi SSS Studio! Checking on status of order ${msg.cardData.orderId} (${msg.cardData.customerName}).`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="py-1.5 px-3 bg-emerald-600 text-white font-bold text-[11px] rounded-lg text-center flex items-center justify-center gap-1 hover:bg-emerald-500 shadow-sm"
                              >
                                WhatsApp
                              </a>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-zinc-800 text-xs leading-relaxed my-2 font-medium">{msg.cardData.message}</p>
                            <div className="mt-2 pt-2 border-t border-black/10 flex justify-end">
                              <a
                                href="/track"
                                onClick={() => setIsOpen(false)}
                                className="text-[#8b6508] hover:underline text-[11px] font-bold flex items-center gap-1"
                              >
                                Open Track Page <ExternalLink size={10} />
                              </a>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {msg.type === "rich" && (
                  <div className="p-3.5 rounded-2xl rounded-tl-sm bg-white border border-black/10 text-zinc-900 shadow-sm text-xs sm:text-sm">
                    <p className="font-bold text-[#8b6508] mb-1">{msg.title}</p>
                    <p className="text-zinc-800 font-medium">{msg.text}</p>
                    {msg.details?.length > 0 && (
                      <ul className="mt-2.5 space-y-1.5 list-disc pl-4 text-zinc-700 text-xs font-medium">
                        {msg.details.map((detail, i) => <li key={i}>{detail}</li>)}
                      </ul>
                    )}
                    {msg.actions?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {msg.actions.map((action, i) => (
                          <a
                            key={i}
                            href={action.href}
                            target={action.external ? "_blank" : undefined}
                            rel={action.external ? "noreferrer" : undefined}
                            className="inline-flex items-center gap-1.5 bg-[#d4af37] hover:brightness-105 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                          >
                            {action.label}
                            <ChevronRight size={13} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {msg.type === "menu" && (
                  <div className="flex flex-col gap-1.5 mt-2 w-full">
                    {msg.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleMenuClick(opt.id, opt.label)}
                        className="flex items-center justify-between bg-white border border-[#d4af37]/40 p-2.5 rounded-xl text-xs font-bold text-zinc-900 hover:bg-[#d4af37] hover:text-black transition-all shadow-sm w-full text-left cursor-pointer"
                      >
                        <span>{opt.label}</span>
                        <ChevronRight size={14} className="text-[#8b6508]" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Agent Typing Indicator */}
            {isAgentTyping && (
              <div className="self-start flex items-center gap-2 bg-white border border-[#d4af37]/60 px-3 py-2 rounded-2xl rounded-tl-sm text-xs text-[#8b6508] font-bold shadow-sm">
                <Loader2 size={13} className="animate-spin text-[#8b6508]" />
                <span>DeepSeek Agent is consulting studio data...</span>
              </div>
            )}

            {/* Inline Form for Report Damaged Item */}
            {currentState === "report_form" && (
              <div className="self-start w-full bg-white border-2 border-[#d4af37]/60 p-3.5 rounded-2xl shadow-md mt-2 text-zinc-900">
                <h4 className="text-xs font-bold mb-2.5 text-[#8b6508]">Submit Damage Report</h4>
                <form onSubmit={handleReportSubmit} className="flex flex-col gap-2.5 text-xs">
                  <div>
                    <label className="text-[10px] text-zinc-600 font-bold mb-1 block">Order ID *</label>
                    <input
                      type="text"
                      required
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="e.g. SSS-12345"
                      className="w-full text-xs bg-[#FAFAFA] border border-black/15 rounded-lg p-2 text-zinc-900 font-semibold focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-600 font-bold mb-1 block">Photo Evidence</label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-[#FAFAFA] hover:bg-zinc-100 px-3 py-1.5 rounded-lg border border-black/15 flex items-center gap-1.5 text-xs text-zinc-900 font-bold transition-colors">
                        <Paperclip size={13} />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files[0] && setDamageImage(e.target.files[0].name)}
                        />
                      </label>
                      {damageImage && <span className="text-[10px] text-zinc-600 font-medium truncate w-24">{damageImage}</span>}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-1 w-full bg-[#d4af37] text-black text-xs font-bold py-2 rounded-lg hover:brightness-105 transition-colors shadow-sm"
                  >
                    Submit Report
                  </button>
                </form>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Input Area */}
          <form onSubmit={handleTextSubmit} className="p-3 bg-white border-t border-black/10">
            <div className="flex items-center gap-2 bg-[#FAFAFA] border border-[#d4af37]/60 rounded-full px-3.5 py-1.5 focus-within:border-[#d4af37] focus-within:ring-1 focus-within:ring-[#d4af37] transition-all shadow-inner">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={isAgentTyping ? "DeepSeek is typing..." : "Ask in English or தமிழ் (e.g. Frame size)..."}
                disabled={isAgentTyping || currentState === "report_form"}
                aria-label="Ask SSS Studio DeepSeek Agent"
                className="bg-transparent flex-1 text-xs sm:text-sm outline-none text-zinc-900 font-semibold placeholder:text-zinc-400 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isAgentTyping || !userInput.trim() || currentState === "report_form"}
                aria-label="Send question"
                className="w-8 h-8 rounded-full bg-[#d4af37] hover:scale-105 active:scale-95 text-black flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer font-bold shadow-md"
              >
                <Send size={15} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
