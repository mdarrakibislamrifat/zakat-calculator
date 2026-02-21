"use client";
import { useState, useEffect } from "react";
import { Coins, Wallet, Landmark, Info, ArrowRight, Download, Calculator, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

export default function ZakatCalculator() {
  const [rates, setRates] = useState({ gold: 9500, silver: 125 });
  const [cash, setCash] = useState<number>(0);
  const [goldWeight, setGoldWeight] = useState<number>(0);
  const [silverWeight, setSilverWeight] = useState<number>(0);
  const [debts, setDebts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const apiKey = "goldapi-3sx1vlsmlvzv1nv-io";
        const [goldRes, silverRes] = await Promise.all([
          fetch("https://www.goldapi.io/api/XAU/BDT", { headers: { "x-access-token": apiKey } }),
          fetch("https://www.goldapi.io/api/XAG/BDT", { headers: { "x-access-token": apiKey } })
        ]);
        const goldData = await goldRes.json();
        const silverData = await silverRes.json();

        if (goldData.price_gram_24k && silverData.price_gram) {
          setRates({ gold: goldData.price_gram_24k, silver: silverData.price_gram });
        }
      } catch (error) {
        console.error("API Error: Using fallback rates.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLivePrices();
  }, []);

  const totalAssets = cash + (goldWeight * rates.gold) + (silverWeight * rates.silver);
  const netWealth = totalAssets - debts;
  const nisabThreshold = rates.silver * 612.36; 
  const isZakatEligible = netWealth >= nisabThreshold;
  const zakatAmount = isZakatEligible ? netWealth * 0.025 : 0;

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Zakat Summary - ZAKAT.LY", 20, 20);
    doc.setFontSize(14);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 35);
    doc.text(`Cash & Savings: BDT ${cash}`, 20, 55);
    doc.text(`Gold (Grams): ${goldWeight}g`, 20, 65);
    doc.text(`Silver (Grams): ${silverWeight}g`, 20, 75);
    doc.text(`Debts: BDT ${debts}`, 20, 85);
    doc.setTextColor(16, 78, 59);
    doc.text(`Total Zakat Payable: BDT ${zakatAmount.toFixed(2)}`, 20, 105);
    doc.save("Zakat_Summary.pdf");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20 selection:bg-emerald-100">
      
      {/* --- Enhanced Navbar --- */}
      <nav className="max-w-7xl mx-auto p-4 md:p-6 flex justify-between items-center bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center">
            <Calculator className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Zakat<span className="text-emerald-600">.ly</span></h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Precision Calculator</p>
          </div>
        </div>
        
        <div className="hidden md:flex gap-4">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-sm">
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Live Gold (24K)</span>
                    <span className="text-sm font-bold text-slate-700">৳{rates.gold.toLocaleString()}</span>
                </div>
                <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-sm">
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Live Silver</span>
                    <span className="text-sm font-bold text-slate-700">৳{rates.silver.toLocaleString()}</span>
                </div>
                <TrendingUp size={16} className="text-emerald-500" />
            </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-16 grid lg:grid-cols-12 gap-16">
        
        {/* --- Left Side: Inputs --- */}
        <div className="lg:col-span-7">
          <header className="mb-12">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="bg-emerald-100 text-emerald-700 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Islamic Finance</span>
                <h2 className="text-5xl font-extrabold text-slate-900 mt-4 leading-[1.1]">
                  Fulfill your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Obligation</span> with confidence.
                </h2>
                <p className="text-slate-500 mt-6 text-lg max-w-md leading-relaxed">
                  Automatically adjusted with real-time market rates for gold and silver.
                </p>
            </motion.div>
          </header>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { label: "Cash & Savings", icon: <Wallet size={22}/>, setter: setCash, color: "emerald", placeholder: "0.00" },
              { label: "Gold (Grams)", icon: <Coins size={22}/>, setter: setGoldWeight, color: "amber", placeholder: "0g" },
              { label: "Silver (Grams)", icon: <Landmark size={22}/>, setter: setSilverWeight, color: "slate", placeholder: "0g" },
              { label: "Debts & Liabilities", icon: <ArrowRight size={22}/>, setter: setDebts, color: "rose", placeholder: "0.00" },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
                <div className={`bg-${item.color}-50 text-${item.color}-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</label>
                <input 
                  type="number" 
                  onChange={(e) => item.setter(Math.max(0, Number(e.target.value)))}
                  className="w-full text-2xl font-bold outline-none mt-1 bg-transparent placeholder:text-slate-200 text-slate-700" 
                  placeholder={item.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* --- Right Side: Dashboard Summary --- */}
        <div className="lg:col-span-5">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-300 sticky top-28 border border-slate-800"
          >
            <div className="flex justify-between items-center mb-10">
               <div className="flex flex-col">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Calculated Payable</span>
                  <p className="text-emerald-400 text-[10px] font-medium mt-1 italic">● 2.5% of net wealth</p>
               </div>
               <div className="h-12 w-12 rounded-full border border-slate-700 flex items-center justify-center">
                  <Info size={18} className="text-slate-500" />
               </div>
            </div>
            
            <div className="mb-10">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-light text-slate-500">৳</span>
                <motion.span 
                  key={zakatAmount}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-7xl font-bold tracking-tight"
                >
                  {zakatAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </motion.span>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-slate-800">
               <div className="flex justify-between items-center p-4 bg-slate-800/40 rounded-2xl">
                  <span className="text-slate-400 text-sm italic font-medium text-xs">Threshold (Nisab)</span>
                  <span className="font-bold text-slate-200 text-sm">৳{nisabThreshold.toLocaleString()}</span>
               </div>
               
               <div className="flex justify-between items-center p-4 bg-slate-800/40 rounded-2xl">
                  <span className="text-slate-400 text-sm italic font-medium text-xs">Eligibility Status</span>
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={isZakatEligible ? "e" : "ne"}
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isZakatEligible ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}
                    >
                      {isZakatEligible ? "Eligible" : "Not Eligible"}
                    </motion.span>
                  </AnimatePresence>
               </div>
            </div>

            <button 
                onClick={handleDownload} 
                className="w-full mt-8 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20"
            >
              <Download size={18} /> DOWNLOAD SUMMARY
            </button>
            
            <p className="text-[10px] text-center mt-6 text-slate-500 font-medium tracking-tight">
                Privacy Guaranteed. We do not store your financial data.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}