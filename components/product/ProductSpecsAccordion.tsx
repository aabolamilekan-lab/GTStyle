"use client";

import React, { useState } from "react";
import { Gem, Shield, PackageCheck, Award, CheckCircle2 } from "lucide-react";
import { DiamondCut, DiamondColor, DiamondClarity } from "@prisma/client";

interface ProductSpecsAccordionProps {
  specifications?: {
    gemstoneType?: string | null;
    caratTotalWeight?: unknown;
    cut?: DiamondCut | null;
    color?: DiamondColor | null;
    clarity?: DiamondClarity | null;
    certificateAgency?: string | null;
    certificateNumber?: string | null;
  } | null;
  productName: string;
}

export function ProductSpecsAccordion({
  specifications,
  productName,
}: ProductSpecsAccordionProps) {
  const [openSection, setOpenSection] = useState<string>("specs");

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? "" : id));
  };

  return (
    <div className="border-t border-neutral-800 divide-y divide-neutral-850 font-sans">
      {/* 1. The 4Cs Diamond & Gemstone Vault */}
      {specifications && (
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggleSection("specs")}
            className="w-full flex items-center justify-between text-left text-sm uppercase tracking-wider text-alabaster hover:text-champagne transition-colors py-2"
          >
            <div className="flex items-center space-x-2.5">
              <Gem className="w-4 h-4 text-champagne" />
              <span className="font-serif text-base font-medium tracking-wide">
                The 4Cs Gemological Vault
              </span>
            </div>
            <span className="text-champagne font-mono text-sm">
              {openSection === "specs" ? "−" : "+"}
            </span>
          </button>

          {openSection === "specs" && (
            <div className="pt-4 pb-2 space-y-6 text-xs text-neutral-300 animate-in fade-in duration-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Boolean(specifications.caratTotalWeight) && (
                  <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                      Carat Weight
                    </span>
                    <span className="font-mono text-sm text-alabaster font-semibold block mt-1">
                      {Number(specifications.caratTotalWeight).toFixed(2)} CT
                    </span>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      Guaranteed Minimum
                    </span>
                  </div>
                )}

                {specifications.cut && (
                  <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                      Cut Precision
                    </span>
                    <span className="font-mono text-sm text-alabaster font-semibold block mt-1">
                      {specifications.cut}
                    </span>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      Hearts & Arrows Symmetry
                    </span>
                  </div>
                )}

                {specifications.color && (
                  <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                      Color Grade
                    </span>
                    <span className="font-mono text-sm text-alabaster font-semibold block mt-1">
                      {specifications.color} Grade
                    </span>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      {specifications.color === "D" || specifications.color === "E" || specifications.color === "F"
                        ? "Colorless Tier"
                        : "Near Colorless"}
                    </span>
                  </div>
                )}

                {specifications.clarity && (
                  <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                      Clarity Grade
                    </span>
                    <span className="font-mono text-sm text-alabaster font-semibold block mt-1">
                      {specifications.clarity}
                    </span>
                    <span className="text-[10px] text-neutral-400 mt-0.5 block">
                      100% Eye-Clean
                    </span>
                  </div>
                )}
              </div>

              {/* Laboratory Tracking Dossier Badge */}
              {specifications.certificateAgency && (
                <div className="p-4 bg-champagne/10 border border-champagne/30 rounded-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-champagne font-semibold text-xs tracking-wider uppercase">
                      <Award className="w-4 h-4" />
                      <span>{specifications.certificateAgency} Laboratory Dossier</span>
                    </div>
                    <span className="font-mono text-xs text-champagne-light bg-obsidian/80 px-2 py-0.5 border border-champagne/40 rounded-sm">
                      #{specifications.certificateNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    Each GTStyle diamond is laser-inscribed on the girdle with its official laboratory tracking number matching its physical dossier. Every order includes the original laboratory certificate sealed in an archival sleeve.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. Metal Hallmarks & Atelier Dimensions */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection("hallmarks")}
          className="w-full flex items-center justify-between text-left text-sm uppercase tracking-wider text-alabaster hover:text-champagne transition-colors py-2"
        >
          <div className="flex items-center space-x-2.5">
            <Shield className="w-4 h-4 text-champagne" />
            <span className="font-serif text-base font-medium tracking-wide">
              Metal Hallmarks & Dimensions
            </span>
          </div>
          <span className="text-champagne font-mono text-sm">
            {openSection === "hallmarks" ? "−" : "+"}
          </span>
        </button>

        {openSection === "hallmarks" && (
          <div className="pt-4 pb-2 space-y-4 text-xs text-neutral-400 leading-relaxed animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-sm space-y-1">
                <span className="text-alabaster font-medium block">Purity Hallmarks:</span>
                <p className="text-neutral-400">
                  Laser stamped with the official Nigerian Atelier & European purity marks: <strong className="text-champagne">AU 750</strong> for 18K Solid Gold and <strong className="text-champagne">PT 950</strong> for Solid Platinum.
                </p>
              </div>

              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-sm space-y-1">
                <span className="text-alabaster font-medium block">Ergonomic Comfort-Fit:</span>
                <p className="text-neutral-400">
                  Engineered with an inner domed curvature ensuring effortless 24/7 wearability without skin abrasion.
                </p>
              </div>
            </div>

            <ul className="space-y-1.5 list-disc list-inside text-[11px] text-neutral-400 pt-1">
              <li>Band thickness: 1.8mm to 2.2mm structural knife-edge or round wire shank.</li>
              <li>Setting: Microscope micro-claw / knife-edge 6-prong head cast in one seamless piece.</li>
              <li>Alloy origin: 100% ethically recycled solid precious metals, nickel-free and hypoallergenic.</li>
            </ul>
          </div>
        )}
      </div>

      {/* 3. Insured Armored Transit & Signature Packaging */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggleSection("transit")}
          className="w-full flex items-center justify-between text-left text-sm uppercase tracking-wider text-alabaster hover:text-champagne transition-colors py-2"
        >
          <div className="flex items-center space-x-2.5">
            <PackageCheck className="w-4 h-4 text-champagne" />
            <span className="font-serif text-base font-medium tracking-wide">
              Insured Armored Transit & Packaging
            </span>
          </div>
          <span className="text-champagne font-mono text-sm">
            {openSection === "transit" ? "−" : "+"}
          </span>
        </button>

        {openSection === "transit" && (
          <div className="pt-4 pb-2 space-y-4 text-xs text-neutral-400 leading-relaxed animate-in fade-in duration-200">
            <div className="space-y-2">
              <h5 className="font-medium text-alabaster">Signature Atelier Unboxing Package:</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center space-x-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                  <span>Handcrafted Midnight Velvet Presentation Box</span>
                </div>
                <div className="flex items-center space-x-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                  <span>Travel Leather Protective Atelier Pouch</span>
                </div>
                <div className="flex items-center space-x-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                  <span>Physical Embossed Certificate of Authenticity</span>
                </div>
                <div className="flex items-center space-x-2 p-2.5 bg-neutral-950 border border-neutral-800 rounded-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-champagne flex-shrink-0" />
                  <span>Microfiber Lens & Ultrasonic Cleaning Care Guide</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 pt-1">
              All GTStyle deliveries are dispatched via dedicated armored courier requiring verification and direct physical handover across Lagos, Abuja, Port Harcourt, and nationwide.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductSpecsAccordion;
