"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Printer, ArrowLeft, Camera } from "lucide-react";
import Link from "next/link";

export default function InvoicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("crm_orders");
    if (saved) {
      const orders = JSON.parse(saved);
      const found = orders.find(o => o.id === id);
      if (found) {
        setOrder(found);
      }
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-950 p-12 text-center">
        <p className="text-zinc-500">Loading invoice or order not found...</p>
        <Link href="/admin/crm" className="text-brand-gradient mt-4 block">&larr; Back to CRM</Link>
      </div>
    );
  }

  // A simple QR code generator using a public API for demonstration
  // In a real app, use a dedicated library like qrcode.react
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:3000/track?id=${order.id}`;

  return (
    <div className="min-h-screen bg-zinc-100 print:bg-white text-zinc-900 font-sans p-6 sm:p-12">
      
      {/* Non-printable controls */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-medium transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button onClick={handlePrint} className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
          <Printer className="w-5 h-5" /> Print Invoice
        </button>
      </div>

      {/* Printable Invoice Container */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-16 shadow-2xl rounded-2xl print:shadow-none print:p-0 print:rounded-none">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-zinc-100 pb-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-black">Avinash Studio</h1>
              <p className="text-zinc-500">Premium Photography & Frames</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-black text-zinc-200 uppercase tracking-widest">Invoice</h2>
            <p className="text-zinc-900 font-bold mt-2">#{order.id}</p>
            <p className="text-zinc-500 text-sm">Date: {order.date}</p>
          </div>
        </div>

        {/* Customer & Tracking Info */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Billed To</h3>
            <p className="font-bold text-lg text-black">{order.name}</p>
            <p className="text-zinc-600">WhatsApp Order</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Track Order</h3>
            <img src={qrCodeUrl} alt="Tracking QR Code" className="w-24 h-24 border-2 border-zinc-100 rounded-xl" />
            <p className="text-xs text-zinc-400 mt-2">Scan to track status</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-12">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-zinc-900">
                <th className="py-3 font-bold text-black uppercase tracking-wider text-sm">Description</th>
                <th className="py-3 font-bold text-black uppercase tracking-wider text-sm text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-zinc-100">
                <td className="py-4">
                  <p className="font-bold text-black">Studio Services / Custom Order</p>
                  <p className="text-sm text-zinc-500 mt-1 whitespace-pre-wrap">{order.message.substring(0, 150)}...</p>
                </td>
                <td className="py-4 text-right font-bold text-lg text-black">₹{order.total}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end border-t-2 border-zinc-900 pt-6">
          <div className="w-64">
            <div className="flex justify-between items-center mb-2">
              <span className="text-zinc-500 font-medium">Subtotal</span>
              <span className="font-bold text-black">₹{order.total}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-zinc-500 font-medium">Tax / VAT (0%)</span>
              <span className="font-bold text-black">₹0</span>
            </div>
            <div className="flex justify-between items-center border-t border-zinc-200 pt-4">
              <span className="text-xl font-black text-black">Total</span>
              <span className="text-2xl font-black text-black">₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-zinc-100 text-center text-sm text-zinc-400">
          <p className="font-bold text-zinc-900 mb-1">Thank you for your business!</p>
          <p>If you have any questions about this invoice, please contact Avinash Studio.</p>
        </div>

      </div>
    </div>
  );
}
