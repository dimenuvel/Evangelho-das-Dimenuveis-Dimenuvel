import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Radio } from 'lucide-react';

interface DialogueModalProps {
  speaker: string;
  quote: string;
  onClose: () => void;
  confirmLabel?: string;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({
  speaker,
  quote,
  onClose,
  confirmLabel = 'The Spiral Abides',
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-lg bg-[#080216] border-2 border-cyan-400 rounded-lg p-5 shadow-[0_0_25px_rgba(0,240,255,0.35)] relative overflow-hidden"
      >
        {/* Retro Arcade Bracket Accents */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-yellow-400" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-yellow-400" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-yellow-400" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-yellow-400" />

        {/* Header: Incoming Audio Transmission */}
        <div className="flex items-center gap-3 mb-3.5 border-b border-cyan-500/30 pb-3">
          <div className="w-10 h-10 rounded bg-[#100326] border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.4)]">
            <Radio className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-widest text-cyan-400 font-arcade">
              ▲ INCOMING COSMIC TRANSMISSION ▲
            </span>
            <h3 className="text-sm font-arcade font-bold text-yellow-300 flex items-center gap-2 pt-0.5">
              {speaker}
            </h3>
          </div>
        </div>

        {/* Narrative Dialogue Terminal */}
        <div className="bg-[#0e0422] border border-pink-500/40 rounded p-3.5 mb-5 text-slate-100 text-xs sm:text-sm leading-relaxed font-tech relative shadow-inner">
          <span className="text-pink-400 font-arcade text-[10px] mr-1">&gt;</span>
          "{quote}"
          <span className="inline-block w-2 h-4 bg-cyan-400 ml-1.5 animate-pulse align-middle" />
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-arcade font-bold text-[10px] rounded border border-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            [ {confirmLabel} ]
          </button>
        </div>
      </motion.div>
    </div>
  );
};

