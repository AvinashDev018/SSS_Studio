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
    <div className="fixed bottom-6 right-6 z-[95]">
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
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
            isOpen ? "bg-red-500 hover:bg-red-600 rotate-90" : "bg-gradient-to-r from-teal-400 to-emerald-500 hover:scale-105 shadow-teal-500/50 shadow-lg text-black font-bold"
          } cursor-pointer`}
        >
        {isOpen ? (
          <X size={24} />
        ) : (
          <>
            <MessageCircle size={26} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-300 rounded-full border-2 border-zinc-900 animate-pulse flex items-center justify-center">
              <Sparkles size={8} className="text-black" />
            </span>
          </>
        )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[90vw] max-w-[420px] max-h-[calc(100vh-6rem)] bg-zinc-950 text-zinc-100 rounded-3xl shadow-[0_15px_60px_-15px_rgba(0,0,0,0.8)] border border-teal-500/30 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 origin-bottom-right">
          {/* Header */}
          <div className="bg-[#071310] border-b border-teal-500/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20 text-[#071f1b]">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">SSS Studio AI Concierge</h3>
                  <span className="bg-teal-500/20 text-teal-300 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider border border-teal-400/30">
                    DeepSeek Agent
                  </span>
                </div>
                <p className="text-[11px] text-teal-400/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Online • Tamil & English Fluent
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Suggestion Pills */}
          <div className="bg-[#050b09] px-3 py-2 border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
            {QUICK_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => sendToAgent(sug)}
                className="shrink-0 text-[11px] bg-teal-950/60 hover:bg-teal-900/80 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full transition-all hover:scale-102 cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="flex-1 min-h-0 p-4 overflow-y-auto overscroll-contain bg-[#060e0c] h-[380px] max-h-[calc(100vh-14rem)] flex flex-col gap-3.5">
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
                        ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-black font-semibold rounded-tr-sm shadow-md"
                        : "bg-[#0b1b17] border border-teal-500/20 text-zinc-100 rounded-tl-sm shadow-sm"
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
                      <div className="bg-[#0a201c] border border-teal-500/40 rounded-2xl p-3.5 shadow-xl text-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-teal-300 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                            <Package size={13} /> Recommended Custom Frames
                          </span>
                          <span className="text-[10px] text-zinc-400">13 Sizes Available</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 my-2">
                          {msg.cardData.recommendedFrames?.map((f) => (
                            <div
                              key={f.id}
                              className="flex items-center justify-between bg-black/40 border border-teal-500/20 p-2.5 rounded-xl"
                            >
                              <div>
                                <span className="font-serif font-bold text-sm text-white">{f.size} Inch</span>
                                {f.tag && (
                                  <span className="ml-2 text-[9px] bg-teal-500/20 text-teal-300 font-bold px-1.5 py-0.5 rounded border border-teal-400/30">
                                    {f.tag}
                                  </span>
                                )}
                                <p className="text-[10px] text-zinc-400 mt-0.5">{f.bestFor}</p>
                              </div>
                              <span className="font-serif font-bold text-teal-400 text-sm">{f.priceFormatted}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-teal-500/20 flex gap-2">
                          <a
                            href="/#frames"
                            onClick={() => setIsOpen(false)}
                            className="w-full py-2 bg-gradient-to-r from-teal-400 to-emerald-400 text-black font-bold text-[11px] rounded-lg text-center flex items-center justify-center gap-1 hover:brightness-110"
                          >
                            Order in Frame Studio →
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Package Quote Calculation Tool Output */}
                    {msg.cardData.action === "PACKAGE_QUOTE" && (
                      <div className="bg-[#081d19] border border-teal-400/40 rounded-2xl p-3.5 shadow-xl text-xs">
                        <div className="flex items-center justify-between mb-2 border-b border-teal-500/20 pb-2">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                              Package Quote Estimate
                            </span>
                            <h4 className="font-bold text-white capitalize text-sm">
                              {msg.cardData.eventType} Ceremony ({msg.cardData.days} {msg.cardData.days > 1 ? "Days" : "Day"})
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="font-serif font-bold text-base text-teal-300">
                              {msg.cardData.totalEstimated}
                            </span>
                          </div>
                        </div>

                        <ul className="space-y-1 my-2 text-[11px] text-zinc-300">
                          {msg.cardData.deliverables?.map((del, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                              <span>{del}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-2.5 pt-2 border-t border-teal-500/20 flex items-center justify-between">
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                            <ShieldCheck size={12} /> 1-Month Delivery Guaranteed
                          </span>
                          <a
                            href={`https://wa.me/916383565425?text=${encodeURIComponent(
                              `Hi SSS Studio! I got an AI package quote for ${msg.cardData.eventType} (${msg.cardData.totalEstimated}). Can we finalize the date?`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1"
                          >
                            Chat on WhatsApp <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Order Tracking Output */}
                    {msg.cardData.action === "TRACK_ORDER" && (
                      <div className="bg-[#091b17] border border-teal-500/30 rounded-2xl p-3 shadow-md text-xs">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-teal-300 flex items-center gap-1 text-[11px]">
                            <Search size={12} /> Order Status
                          </span>
                          {msg.cardData.found && (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold text-[10px]">
                              {msg.cardData.status}
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-300 text-xs leading-relaxed">{msg.cardData.message}</p>
                        <div className="mt-2 pt-2 border-t border-white/10 flex justify-end">
                          <a
                            href="/track"
                            onClick={() => setIsOpen(false)}
                            className="text-teal-400 hover:underline text-[11px] font-semibold"
                          >
                            Open Track Page →
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {msg.type === "rich" && (
                  <div className="p-3.5 rounded-2xl rounded-tl-sm bg-[#0a1b17] border border-teal-500/20 text-zinc-100 shadow-sm text-xs sm:text-sm">
                    <p className="font-bold text-teal-300 mb-1">{msg.title}</p>
                    <p className="text-zinc-300">{msg.text}</p>
                    {msg.details?.length > 0 && (
                      <ul className="mt-2.5 space-y-1.5 list-disc pl-4 text-zinc-400 text-xs">
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
                            className="inline-flex items-center gap-1.5 bg-teal-400 hover:bg-teal-300 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
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
                        className="flex items-center justify-between bg-[#081714] border border-teal-500/20 p-2.5 rounded-xl text-xs text-zinc-300 hover:border-teal-400 hover:text-white hover:bg-teal-950/40 transition-all shadow-sm w-full text-left cursor-pointer"
                      >
                        <span>{opt.label}</span>
                        <ChevronRight size={14} className="text-teal-400/60" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Agent Typing Indicator */}
            {isAgentTyping && (
              <div className="self-start flex items-center gap-2 bg-[#0a1c18] border border-teal-500/30 px-3 py-2 rounded-2xl rounded-tl-sm text-xs text-teal-300">
                <Loader2 size={13} className="animate-spin text-teal-400" />
                <span>DeepSeek Agent is consulting studio data...</span>
              </div>
            )}

            {/* Inline Form for Report Damaged Item */}
            {currentState === "report_form" && (
              <div className="self-start w-full bg-[#081714] border border-teal-500/30 p-3.5 rounded-2xl shadow-sm mt-2">
                <h4 className="text-xs font-bold mb-2.5 text-teal-300">Submit Damage Report</h4>
                <form onSubmit={handleReportSubmit} className="flex flex-col gap-2.5 text-xs">
                  <div>
                    <label className="text-[10px] text-zinc-400 mb-1 block">Order ID *</label>
                    <input
                      type="text"
                      required
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      placeholder="e.g. SSS-12345"
                      className="w-full text-xs bg-black/50 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 mb-1 block">Photo Evidence</label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 text-xs text-zinc-300 transition-colors">
                        <Paperclip size={13} />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files[0] && setDamageImage(e.target.files[0].name)}
                        />
                      </label>
                      {damageImage && <span className="text-[10px] text-zinc-400 truncate w-24">{damageImage}</span>}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-1 w-full bg-teal-400 text-black text-xs font-bold py-2 rounded-lg hover:bg-teal-300 transition-colors"
                  >
                    Submit Report
                  </button>
                </form>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Input Area */}
          <form onSubmit={handleTextSubmit} className="p-3 bg-[#071310] border-t border-teal-500/20">
            <div className="flex items-center gap-2 bg-black/60 border border-teal-500/30 rounded-full px-3.5 py-1.5 focus-within:border-teal-400 transition-colors">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={isAgentTyping ? "DeepSeek is typing..." : "Ask in English or தமிழ் (e.g. Frame size)..."}
                disabled={isAgentTyping || currentState === "report_form"}
                aria-label="Ask SSS Studio DeepSeek Agent"
                className="bg-transparent flex-1 text-xs sm:text-sm outline-none text-white placeholder:text-zinc-500 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isAgentTyping || !userInput.trim() || currentState === "report_form"}
                aria-label="Send question"
                className="w-7 h-7 rounded-full bg-teal-400 hover:bg-teal-300 text-black flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
