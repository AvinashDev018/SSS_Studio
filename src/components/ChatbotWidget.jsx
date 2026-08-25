"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Paperclip, ChevronRight } from "lucide-react";

const MENU_OPTIONS = [
  { id: "pricing", label: "Pricing & Packages" },
  { id: "track", label: "Track Order" },
  { id: "report", label: "Report Damaged Item" },
  { id: "other", label: "Other Queries" },
];

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
            text: "Our packages start at ₹5,000! You can use our 'Build Your Story' calculator to get a custom estimate.",
            type: "text",
          },
          { id: Date.now() + 1, sender: "bot", type: "menu", options: MENU_OPTIONS },
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
          { id: Date.now() + 1, sender: "bot", type: "menu", options: MENU_OPTIONS },
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
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_5px_40px_-15px_rgba(0,0,0,0.3)] border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 origin-bottom-right">
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
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 h-[400px] flex flex-col gap-4">
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

          {/* Bottom Input Area (Visual only for this state machine) */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder={currentState === "report_form" ? "Please use the form above" : "Select an option above..."}
                disabled
                className="bg-transparent flex-1 text-sm outline-none cursor-not-allowed text-gray-500"
              />
              <button disabled className="text-gray-400">
                <Send size={18} />
              </button>
            </div>
          </div>
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
