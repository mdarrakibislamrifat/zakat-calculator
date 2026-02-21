"use client";
import { useState, useEffect } from "react";
import { Coins, Wallet, Landmark, Info, ArrowRight, Download, Calculator, TrendingUp, ChevronDown, Repeat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

export default function ZakatCalculator() {
  // --- States ---
  const [rates, setRates] = useState({ gold: 9500, silver: 125 });
  const [cash, setCash] = useState<number>(0);
  const [goldWeight, setGoldWeight] = useState<number>(0);
  const [silverWeight, setSilverWeight] = useState<number>(0);
  const [debts, setDebts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Custom Settings (Carat & Units)
  const [goldCarat, setGoldCarat] = useState<number>(22);
  const [silverUnit, setSilverUnit] = useState<"gram" | "vori">("gram");

  // --- Real-time Price Fetching ---
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

  // --- Calculations ---
  // ১ ভরি = ১১.৬৬ গ্রাম
  const VORI_TO_GRAM = 11.66;
  
  // Gold Adjustment
  const adjustedGoldPrice = (rates.gold / 24) * goldCarat;
  const totalGoldValue = goldWeight * adjustedGoldPrice;

  // Silver Adjustment
  const actualSilverWeightGrams = silverUnit === "vori" ? silverWeight * VORI_TO_GRAM : silverWeight;
  const totalSilverValue = actualSilverWeightGrams * rates.silver;

  const totalAssets = cash + totalGoldValue + totalSilverValue;
  const netWealth = totalAssets - debts;
  
  // Nisab based on 52.5 Tola (612.36g) Silver
  const nisabThreshold = rates.silver * 612.36; 
  const isZakatEligible = netWealth >= nisabThreshold;
  const zakatAmount = isZakatEligible ? netWealth * 0.025 : 0;

  // --- PDF Export ---
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Pabitra - Zakat Summary", 20, 20);
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.line(20, 35, 190, 35);
    
    doc.text(`Cash & Savings: BDT ${cash.toLocaleString()}`, 20, 50);
    doc.text(`Gold: ${goldWeight}g (${goldCarat}K) - Value: BDT ${totalGoldValue.toFixed(0)}`, 20, 60);
    doc.text(`Silver: ${silverWeight}${silverUnit} - Value: BDT ${totalSilverValue.toFixed(0)}`, 20, 70);
    doc.text(`Total Liabilities: BDT ${debts.toLocaleString()}`, 20, 80);
    
    doc.setFontSize(14);
    doc.setTextColor(16, 78, 59);
    doc.text(`Net Wealth: BDT ${netWealth.toLocaleString()}`, 20, 100);
    doc.text(`Total Zakat Payable (2.5%): BDT ${zakatAmount.toLocaleString()}`, 20, 110);
    
    doc.save("Pabitra_Zakat_Summary.pdf");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20 selection:bg-emerald-100">
      
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto p-4 md:p-6 flex justify-between items-center bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-xl shadow-lg flex items-center justify-center text-white">
            <Calculator size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Pabitra<span className="text-emerald-600">.ly</span></h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Islamic Finance Tool</p>
          </div>
        </div>
        
        <div className="hidden md:flex gap-4">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400">GOLD 24K</span>
                <span className="text-sm font-bold text-slate-700">৳{rates.gold.toLocaleString()}</span>
                <TrendingUp size={14} className="text-emerald-500" />
            </div>
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400">SILVER</span>
                <span className="text-sm font-bold text-slate-700">৳{rates.silver.toLocaleString()}</span>
                <TrendingUp size={14} className="text-emerald-500" />
            </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-12 grid lg:grid-cols-12 gap-12">
        
        {/* Left Side: Inputs */}
        <div className="lg:col-span-7">
          <header className="mb-10">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-extrabold text-slate-900 leading-tight">
              আপনার জাকাতের সঠিক <br/><span className="text-emerald-600 italic">হিসাব করুন।</span>
            </motion.h2>
          </header>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Cash */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm focus-within:ring-2 ring-emerald-500/20 transition-all">
              <div className="bg-emerald-50 text-emerald-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4"><Wallet size={20}/></div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">নগদ টাকা ও সঞ্চয় (BDT)</label>
              <input type="number" onChange={(e) => setCash(Math.max(0, Number(e.target.value)))} className="w-full text-2xl font-bold outline-none mt-1" placeholder="0.00" />
            </div>

            {/* Gold */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm focus-within:ring-2 ring-amber-500/20 transition-all">
              <div className="flex justify-between items-center mb-4">
                <div className="bg-amber-50 text-amber-600 w-10 h-10 rounded-xl flex items-center justify-center"><Coins size={20}/></div>
                <select value={goldCarat} onChange={(e) => setGoldCarat(Number(e.target.value))} className="bg-slate-100 text-[10px] font-bold px-2 py-1 rounded-lg outline-none cursor-pointer">
                  <option value={24}>24K Pure</option>
                  <option value={22}>22K Standard</option>
                  <option value={21}>21K Jewelry</option>
                  <option value={18}>18K</option>
                </select>
              </div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">স্বর্ণের পরিমাণ (Grams)</label>
              <input type="number" onChange={(e) => setGoldWeight(Math.max(0, Number(e.target.value)))} className="w-full text-2xl font-bold outline-none mt-1" placeholder="0g" />
              <p className="text-[9px] text-amber-600 font-bold mt-2 uppercase tracking-tighter">Adjusted Rate: ৳{adjustedGoldPrice.toFixed(0)}/g</p>
            </div>

            {/* Silver */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm focus-within:ring-2 ring-slate-500/20 transition-all">
              <div className="flex justify-between items-center mb-4">
                <div className="bg-slate-50 text-slate-600 w-10 h-10 rounded-xl flex items-center justify-center"><Landmark size={20}/></div>
                <button 
                  onClick={() => setSilverUnit(silverUnit === "gram" ? "vori" : "gram")}
                  className="bg-slate-100 text-[10px] font-bold px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-slate-200 transition-colors"
                >
                  <Repeat size={10} /> UNIT: {silverUnit.toUpperCase()}
                </button>
              </div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">রুপার পরিমাণ ({silverUnit})</label>
              <input type="number" onChange={(e) => setSilverWeight(Math.max(0, Number(e.target.value)))} className="w-full text-2xl font-bold outline-none mt-1" placeholder={`0 ${silverUnit}`} />
            </div>

            {/* Debts */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm focus-within:ring-2 ring-rose-500/20 transition-all">
              <div className="bg-rose-50 text-rose-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4"><ArrowRight size={20} className="rotate-45"/></div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-rose-400">ঋণ ও দায়-দেনা (-)</label>
              <input type="number" onChange={(e) => setDebts(Math.max(0, Number(e.target.value)))} className="w-full text-2xl font-bold outline-none mt-1 text-rose-700" placeholder="0.00" />
            </div>
          </div>
        </div>

        {/* Right Side: Summary Card */}
        <div className="lg:col-span-5">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-28 border border-slate-800">
            <div className="flex justify-between items-start mb-8">
               <div>
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Total Zakat Payable</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-light text-slate-600">৳</span>
                    <motion.span key={zakatAmount} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-6xl font-bold tracking-tighter">
                      {zakatAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </motion.span>
                  </div>
               </div>
               <Info size={20} className="text-slate-700" />
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-800">
               <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl">
                  <span className="text-slate-400 text-xs italic">Nisab Threshold (52.5 Tola)</span>
                  <span className="font-bold text-slate-200 text-sm">৳{nisabThreshold.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl">
                  <span className="text-slate-400 text-xs italic">Net Wealth</span>
                  <span className="font-bold text-emerald-400 text-sm">৳{netWealth.toLocaleString()}</span>
               </div>
            </div>

            <div className={`mt-6 p-4 rounded-2xl text-center border ${isZakatEligible ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
               <span className="text-[10px] font-black uppercase tracking-widest">
                {isZakatEligible ? "● You are eligible for Zakat" : "● Below Nisab Threshold"}
               </span>
            </div>

            <button onClick={handleDownload} className="w-full mt-8 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/20 active:scale-95">
              <Download size={18} /> DOWNLOAD SUMMARY
            </button>
            
            <p className="text-[9px] text-center mt-6 text-slate-600 font-medium uppercase tracking-tighter">
              Zakat is 2.5% of your total net wealth after one lunar year.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}