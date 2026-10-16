"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler, HelpCircle, ShieldCheck, Thermometer } from "lucide-react";

interface RingSizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RING_SIZE_DATA = [
  { us: "4.0", diameter: "14.9 mm", circumference: "46.8 mm", uk: "H 1/2" },
  { us: "4.5", diameter: "15.3 mm", circumference: "48.0 mm", uk: "I 1/2" },
  { us: "5.0", diameter: "15.7 mm", circumference: "49.3 mm", uk: "J 1/2" },
  { us: "5.5", diameter: "16.1 mm", circumference: "50.6 mm", uk: "L" },
  { us: "6.0", diameter: "16.5 mm", circumference: "51.9 mm", uk: "L 1/2" },
  { us: "6.5", diameter: "16.9 mm", circumference: "53.1 mm", uk: "M 1/2" },
  { us: "7.0", diameter: "17.3 mm", circumference: "54.4 mm", uk: "N 1/2" },
  { us: "7.5", diameter: "17.7 mm", circumference: "55.7 mm", uk: "O 1/2" },
  { us: "8.0", diameter: "18.1 mm", circumference: "57.0 mm", uk: "P 1/2" },
  { us: "8.5", diameter: "18.5 mm", circumference: "58.3 mm", uk: "Q 1/2" },
  { us: "9.0", diameter: "18.9 mm", circumference: "59.5 mm", uk: "R 1/2" },
  { us: "9.5", diameter: "19.4 mm", circumference: "60.8 mm", uk: "S 1/2" },
  { us: "10.0", diameter: "19.8 mm", circumference: "62.1 mm", uk: "T 1/2" },
];

export function RingSizerModal({ isOpen, onClose }: RingSizerModalProps) {
  const [activeTab, setActiveTab] = useState<"table" | "guide" | "resizing">("table");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative z-10 w-full max-w-2xl bg-obsidian border border-neutral-800 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ring-sizer-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-neutral-950/80">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-sm bg-champagne/10 text-champagne border border-champagne/20">
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="ring-sizer-title" className="font-serif text-xl text-alabaster tracking-wide font-medium">
                    Atelier Ring Sizer & Guide
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-sans">
                    Standard US & British Imperial Dimensions
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-champagne transition-colors rounded-sm"
                aria-label="Close ring sizer modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-neutral-800 bg-neutral-950/40 text-xs font-sans">
              <button
                type="button"
                onClick={() => setActiveTab("table")}
                className={`flex-1 py-3 px-4 text-center border-b-2 uppercase tracking-wider transition-all ${
                  activeTab === "table"
                    ? "border-champagne text-champagne font-semibold bg-neutral-900/50"
                    : "border-transparent text-neutral-400 hover:text-alabaster"
                }`}
              >
                Conversion Table
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("guide")}
                className={`flex-1 py-3 px-4 text-center border-b-2 uppercase tracking-wider transition-all ${
                  activeTab === "guide"
                    ? "border-champagne text-champagne font-semibold bg-neutral-900/50"
                    : "border-transparent text-neutral-400 hover:text-alabaster"
                }`}
              >
                How to Measure
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("resizing")}
                className={`flex-1 py-3 px-4 text-center border-b-2 uppercase tracking-wider transition-all ${
                  activeTab === "resizing"
                    ? "border-champagne text-champagne font-semibold bg-neutral-900/50"
                    : "border-transparent text-neutral-400 hover:text-alabaster"
                }`}
              >
                Resizing Policy
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-neutral-300">
              {/* Tab 1: Conversion Table */}
              {activeTab === "table" && (
                <div className="space-y-4">
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    GTStyle sizes conform to official US standard jewelers&apos; mandrels. If your measurement falls between two sizes, we recommend selecting the larger size for comfort.
                  </p>
                  <div className="overflow-x-auto border border-neutral-800 rounded-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                        <tr>
                          <th className="py-2.5 px-4 font-medium text-champagne">US Size</th>
                          <th className="py-2.5 px-4 font-medium">Inside Diam.</th>
                          <th className="py-2.5 px-4 font-medium">Circumference</th>
                          <th className="py-2.5 px-4 font-medium">UK / AU Size</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900 font-mono">
                        {RING_SIZE_DATA.map((row) => (
                          <tr key={row.us} className="hover:bg-neutral-900/40 transition-colors">
                            <td className="py-2 px-4 font-semibold text-alabaster">{row.us}</td>
                            <td className="py-2 px-4 text-neutral-400">{row.diameter}</td>
                            <td className="py-2 px-4 text-neutral-400">{row.circumference}</td>
                            <td className="py-2 px-4 text-champagne font-sans">{row.uk}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: How to Measure at Home */}
              {activeTab === "guide" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-sm space-y-2">
                      <span className="font-mono text-champagne font-bold text-base">Step 01</span>
                      <h4 className="font-serif text-sm text-alabaster font-medium">Wrap Strip of Paper</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Wrap a non-stretchy strip of paper or string around the base of the designated finger.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-sm space-y-2">
                      <span className="font-mono text-champagne font-bold text-base">Step 02</span>
                      <h4 className="font-serif text-sm text-alabaster font-medium">Mark Intersection</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Mark where the paper overlaps comfortably over your knuckle. Ensure it slides smoothly.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-sm space-y-2">
                      <span className="font-mono text-champagne font-bold text-base">Step 03</span>
                      <h4 className="font-serif text-sm text-alabaster font-medium">Measure in Millimeters</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Lay the paper flat against a ruler. Find the circumference in mm and map to the table.
                      </p>
                    </div>
                  </div>

                  {/* Temperature Tip Callout */}
                  <div className="p-4 bg-neutral-950 border border-champagne/30 rounded-sm flex items-start space-x-3">
                    <Thermometer className="w-5 h-5 text-champagne flex-shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs">
                      <h5 className="font-semibold text-champagne-light">Atelier Temperature Guideline</h5>
                      <p className="text-neutral-400 leading-relaxed">
                        Measure fingers in the afternoon at comfortable room temperature. Cold fingers are typically half a size smaller, while extreme heat or sodium intake can cause temporary swelling.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Atelier Resizing Policy */}
              {activeTab === "resizing" && (
                <div className="space-y-5">
                  <div className="p-4 bg-champagne/10 border border-champagne/30 rounded-sm flex items-start space-x-3">
                    <ShieldCheck className="w-5 h-5 text-champagne flex-shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs">
                      <h4 className="font-semibold text-champagne-light">30-Day Complimentary Bespoke Resizing</h4>
                      <p className="text-neutral-300 leading-relaxed">
                        Every solitaire ring crafted at GTStyle includes one complimentary sizing adjustment within 30 days of armored delivery. Our master goldsmiths handle the alteration in our private studio without altering structural prong integrity.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-neutral-400 leading-relaxed">
                    <p>
                      <strong className="text-alabaster">Eternity Bands Notice:</strong> Unbroken full-eternity pavé bands (such as the Eternity Pavé Band) cannot be resized after casting due to the continuous diamond circumference. Please confirm sizing accurately or contact concierge for a complimentary plastic ring-gauge dispatch.
                    </p>
                    <p>
                      <strong className="text-alabaster">Concierge Assistance:</strong> If ordering as a surprise proposal, reach out to your personal concierge via WhatsApp for sizing advice based on height, frame, or existing jewelry photos.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-champagne text-xs uppercase tracking-widest font-semibold transition-colors rounded-sm"
              >
                Close Guide
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default RingSizerModal;
