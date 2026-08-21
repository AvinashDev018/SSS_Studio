"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { Plus, Trash2, Tag, Percent, IndianRupee } from "lucide-react";

export default function AdminPromosPage() {
  const [promos, setPromos] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPromo, setNewPromo] = useState({ code: "", type: "PERCENTAGE", value: 10 });

  useEffect(() => {
    const saved = localStorage.getItem("studioPromos");
    if (saved) {
      setPromos(JSON.parse(saved));
    } else {
      const initial = [
        { id: "pr-1", code: "WELCOME10", type: "PERCENTAGE", value: 10, active: true },
        { id: "pr-2", code: "FLAT50", type: "FIXED", value: 50, active: true },
      ];
      setPromos(initial);
      localStorage.setItem("studioPromos", JSON.stringify(initial));
    }
  }, []);

  const savePromos = (newPromos) => {
    setPromos(newPromos);
    localStorage.setItem("studioPromos", JSON.stringify(newPromos));
  };

  const handleAdd = () => {
    if (!newPromo.code.trim()) return;
    const promo = {
      id: `pr-${Date.now()}`,
      code: newPromo.code.toUpperCase().trim(),
      type: newPromo.type,
      value: Number(newPromo.value),
      active: true
    };
    savePromos([...promos, promo]);
    setIsAdding(false);
    setNewPromo({ code: "", type: "PERCENTAGE", value: 10 });
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this promo code?")) {
      savePromos(promos.filter(p => p.id !== id));
    }
  };

  const toggleActive = (id) => {
    const updated = promos.map(p => {
      if (p.id === id) return { ...p, active: !p.active };
      return p;
    });
    savePromos(updated);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <AdminNav currentPath="/admin/promos" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Promo Codes
          </h1>
          <p className="text-zinc-500 mt-2">Create and manage discount codes for your customers.</p>
        </div>

        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-[#D4AF37] hover:bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-bold transition-colors"
        >
          <Plus className="w-4 h-4" /> {isAdding ? "Cancel" : "Add Promo Code"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl mb-8 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-lg mb-4 text-zinc-900 dark:text-white">Create New Promo Code</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Promo Code</label>
              <input 
                type="text" 
                value={newPromo.code}
                onChange={e => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})}
                placeholder="e.g. SUMMER20"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 uppercase font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Discount Type</label>
              <select 
                value={newPromo.type}
                onChange={e => setNewPromo({...newPromo, type: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Discount Value</label>
              <input 
                type="number" 
                value={newPromo.value}
                onChange={e => setNewPromo({...newPromo, value: e.target.value})}
                placeholder="10"
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <button 
                onClick={handleAdd}
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black font-bold py-2 rounded-lg"
              >
                Save Code
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
              <th className="p-4 text-zinc-500 font-medium"><div className="flex items-center gap-2"><Tag className="w-4 h-4" /> Code</div></th>
              <th className="p-4 text-zinc-500 font-medium">Type</th>
              <th className="p-4 text-zinc-500 font-medium">Discount</th>
              <th className="p-4 text-zinc-500 font-medium">Status</th>
              <th className="p-4 text-zinc-500 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {promos.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-zinc-500">
                  No promo codes available.
                </td>
              </tr>
            ) : (
              promos.map(promo => (
                <tr key={promo.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/50">
                  <td className="p-4">
                    <span className="font-mono font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-1 rounded">
                      {promo.code}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {promo.type === "PERCENTAGE" ? "Percentage" : "Fixed Amount"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 font-bold">
                      {promo.type === "PERCENTAGE" ? <Percent className="w-3 h-3 text-zinc-400" /> : <IndianRupee className="w-3 h-3 text-zinc-400" />}
                      {promo.value}
                    </div>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleActive(promo.id)}
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        promo.active 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {promo.active ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
