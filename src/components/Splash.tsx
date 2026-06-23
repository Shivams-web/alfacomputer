import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Monitor, GraduationCap, Sparkles } from "lucide-react";

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 120); // slight pause at 100%
          return 100;
        }
        return prev + 10;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-between min-h-[580px] h-full bg-white px-6 py-12 relative overflow-hidden select-none">
      {/* Decorative clean light green vector grids */}
      <div className="absolute top-[-50px] left-[-50px] w-48 h-48 rounded-full bg-[#8BC34A]/10 blur-2xl" />
      <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 rounded-full bg-[#689F38]/10 blur-3xl" />

      {/* Top Section - Decorative Shield/Tag */}
      <div className="z-10 bg-[#8BC34A]/10 border border-[#8BC34A]/20 px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-[#689F38] animate-pulse" />
        <span className="text-[11px] font-mono font-semibold text-[#689F38] uppercase tracking-wider">
          Premium EdTech Hub
        </span>
      </div>

      {/* Main Logo & Institute Branding - Aligned with Reference Image Smiley Icon */}
      <div className="flex flex-col items-center justify-center flex-grow z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-6"
        >
          {/* Outer Ring */}
          <div className="w-28 h-28 rounded-full bg-[#8BC34A]/15 flex items-center justify-center p-2.5 shadow-xl shadow-[#8BC34A]/10 relative">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#8BC34A]/30 animate-spin-slow" />
            
            {/* Mascot Smiley Circular Base from Reference Image */}
            <div className="w-full h-full rounded-full bg-[#8BC34A] flex flex-col items-center justify-center shadow-lg transform transition hover:scale-105 duration-300">
              {/* Custom SVG Smiling Mascot - (•‿•) style inline vector */}
              <svg viewBox="0 0 100 100" className="w-16 h-16 fill-white">
                {/* Eyes */}
                <circle cx="33" cy="40" r="6" />
                <circle cx="67" cy="40" r="6" />
                {/* Cheeks */}
                <circle cx="22" cy="52" r="5" className="fill-[#8BC34A]/30 opacity-70" />
                <circle cx="78" cy="52" r="5" className="fill-[#8BC34A]/30 opacity-70" />
                {/* Broad Happy Mouth */}
                <path d="M25,55 Q50,85 75,55 C70,72 30,72 25,55 Z" />
                {/* Cute Teeth */}
                <path d="M42,57 L46,57 L46,60 L42,60 Z" />
                <path d="M54,57 L58,57 L58,60 L54,60 Z" />
              </svg>
            </div>
          </div>

          {/* Miniature Floating Icon */}
          <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md border border-gray-100">
            <div className="bg-[#689F38] text-white p-1.5 rounded-full">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
        </motion.div>

        {/* Title Name & Description using Spaces Grotesk or Custom Display */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center px-4"
        >
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none mb-1">
            THE CURIOUS ALFA
          </h1>
          <p className="text-[#689F38] font-semibold text-xs tracking-widest uppercase mb-3">
            Tech Computer Institute
          </p>
          <div className="w-10 h-1 bg-[#8BC34A] mx-auto rounded-full mb-3" />
          <p className="text-gray-500 text-xs px-2 leading-relaxed">
            Leading computer literacy through modern assessment frameworks, live classrooms and dynamic digital platforms.
          </p>
        </motion.div>
      </div>

      {/* Bottom Loading Progress Container */}
      <div className="w-full max-w-[280px] z-10 flex flex-col items-center">
        <div className="flex justify-between items-center w-full mb-1 px-1">
          <span className="text-[10px] font-mono text-gray-400 font-semibold uppercase tracking-wider">
            Initializing Services
          </span>
          <span className="text-[10px] font-mono text-[#689F38] font-bold">
            {progress}%
          </span>
        </div>
        
        {/* Customized Progress Bar matched to Reference Green design */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-100">
          <motion.div
            className="h-full bg-gradient-to-r from-[#8BC34A] to-[#689F38] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Subtitle Footer */}
        <div className="mt-8 flex items-center gap-1 text-[10px] text-gray-400">
          <Monitor className="w-3 h-3 text-[#8BC34A]" />
          <span>Approved CCC Assessment Center</span>
        </div>
      </div>
    </div>
  );
}
