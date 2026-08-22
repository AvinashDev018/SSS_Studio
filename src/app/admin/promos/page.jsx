"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Percent, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PromoDashboard() {
 const [promos, setPromos] = useState([]);
 const [newCode, setNewCode] = useState("");
 const [newDiscount, setNewDiscount] = useState("");
 const [newType, setNewType] = useState("percentage"); // percentage or fixed

 useEffect(() => {
 const saved = localStorage.getItem("studioPromos");
 if (saved) {
 setPromos(JSON.parse(saved));
 }
 }, []);

 const savePromos = (newPromos) => {
 setPromos(newPromos);
 localStorage.setItem("studioPromos", JSON.stringify(newPromos));
 };

 const handleAddPromo = (e) => {
 e.preventDefault();
 if (!newCode || !newDiscount) return;

 const promo = {
 id: Date.now().toString(),
 code: newCode.toUpperCase(),
 discount: Number(newDiscount),
 type: newType,
 active: true,
 uses: 0
 };

 savePromos([...promos, promo]);
 setNewCode("");
 setNewDiscount("");
 };

 const handleDelete = (id) => {
 if (window.confirm("Are you sure you want to delete this promo code?")) {
 savePromos(promos.filter(p => p.id !== id));
 }
 };

 const toggleActive = (id) => {
 savePromos(promos.map(p => {
 if (p.id === id) return { ...p, active: !p.active };
 return p;
 }));
 };

 return (
 <div className="min-h-screen bg-zinc-950 p-6 sm:p-12 text-zinc-100 font-sans">
 <div className="max-w-7xl mx-auto space-y-12">
 
 {/* Header */}
 <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
 <div>
 <h1 className="text-4xl font-serif font-bold text-white mb-2">Promos & Discounts</h1>
 <p className="text-zinc-400">Manage offline-first discount codes for your customers.</p>
 </div>
 <Link href="/admin">
 <button className="text-brand-gradient hover:text-cyan-400 transition-colors text-sm font-medium">
 &larr; Back to Admin
 </button>
 </Link>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 
 {/* Create Promo Form */}
 <div className="lg:col-span-1">
 <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl sticky top-8">
 <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
 <Plus className="text-brand-gradient w-5 h-5" /> Create Promo Code
 </h2>
 <form onSubmit={handleAddPromo} className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-zinc-400 mb-1">Code Name</label>
 <input 
 type="text" 
 value={newCode}
 onChange={(e) => setNewCode(e.target.value.toUpperCase())}
 placeholder="e.g. FESTIVAL20"
 className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white uppercase focus:border-cyan-500 focus:outline-none transition-colors"
 required
 />
 </div>
 
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-zinc-400 mb-1">Discount Type</label>
 <select 
 value={newType}
 onChange={(e) => setNewType(e.target.value)}
 className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors appearance-none"
 >
 <option value="percentage">Percentage (%)</option>
 <option value="fixed">Fixed Amount (₹)</option>
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-zinc-400 mb-1">Value</label>
 <input 
 type="number" 
 value={newDiscount}
 onChange={(e) => setNewDiscount(e.target.value)}
 placeholder={newType === 'percentage' ? "20" : "500"}
 className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
 required
 min="1"
 max={newType === 'percentage' ? "100" : "100000"}
 />
 </div>
 </div>

 <button 
 type="submit"
 className="w-full bg-brand-gradient hover-glow-brand hover:bg-brand-gradient hover-glow-brand text-white border-transparent text-black font-bold py-3 rounded-xl transition-colors mt-2"
 >
 Generate Code
 </button>
 </form>
 </div>
 </div>

 {/* Active Promos List */}
 <div className="lg:col-span-2 space-y-4">
 <h2 className="text-2xl font-bold text-white mb-6">Active Codes</h2>
 
 {promos.length === 0 ? (
 <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center text-zinc-500">
 <Tag className="w-12 h-12 mx-auto mb-4 opacity-20" />
 <p>No promo codes created yet.</p>
 </div>
 ) : (
 promos.map(promo => (
 <div key={promo.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between group hover:border-zinc-700 transition-colors">
 <div className="flex items-center gap-4">
 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${promo.active ? 'bg-brand-gradient hover-glow-brand/10 text-brand-gradient' : 'bg-zinc-800 text-zinc-500'}`}>
 {promo.type === 'percentage' ? <Percent className="w-6 h-6" /> : <Tag className="w-6 h-6" />}
 </div>
 <div>
 <h3 className={`text-xl font-mono font-bold ${promo.active ? 'text-white' : 'text-zinc-500 line-through'}`}>
 {promo.code}
 </h3>
 <p className="text-sm text-zinc-400">
 {promo.type === 'percentage' ? `${promo.discount}% OFF` : `₹${promo.discount} OFF`}
 </p>
 </div>
 </div>
 
 <div className="flex items-center gap-3">
 <button 
 onClick={() => toggleActive(promo.id)}
 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${promo.active ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-brand-gradient hover-glow-brand text-black hover:bg-brand-gradient hover-glow-brand text-white border-transparent'}`}
 >
 {promo.active ? 'Deactivate' : 'Activate'}
 </button>
 <button 
 onClick={() => handleDelete(promo.id)}
 className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
 >
 <Trash2 className="w-5 h-5" />
 </button>
 </div>
 </div>
 ))
 )}
 </div>

 </div>
 </div>
 </div>
 );
}
