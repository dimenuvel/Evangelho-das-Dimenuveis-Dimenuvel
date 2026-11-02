import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Compass, Shield, Skull, Sun } from 'lucide-react';
import { getCodexEntries, CodexEntry } from '../data/codex';
import { SupportedLanguage } from '../types/game';

interface CodexModalProps {
  language: SupportedLanguage;
  onClose: () => void;
}

export const CodexModal: React.FC<CodexModalProps> = ({ language, onClose }) => {
  const isPt = language === 'pt';
  const entries = getCodexEntries(language);
  const [activeCategory, setActiveCategory] = useState<CodexEntry['category']>('layers');
  const [selectedEntryId, setSelectedEntryId] = useState<string>('layer_silence');

  const filteredEntries = entries.filter((e) => e.category === activeCategory);
  const currentEntry = entries.find((e) => e.id === selectedEntryId) || filteredEntries[0] || entries[0];

  const categories = [
    { id: 'layers', label: isPt ? 'Dimenúveis' : 'Dimenuous Layers', icon: Compass },
    { id: 'towers', label: isPt ? 'Torres' : 'Towers', icon: Shield },
    { id: 'enemies', label: isPt ? 'Distorções' : 'Distortions', icon: Skull },
    { id: 'philosophy', label: isPt ? 'Abidar' : 'Abide', icon: BookOpen },
    { id: 'dude', label: isPt ? 'O Cara' : 'The Dude', icon: Sun },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl h-[90vh] max-h-[680px] bg-[#070114] border-2 border-cyan-400 rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.3)] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b-2 border-cyan-500/40 bg-[#0f0326] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#160438] border border-cyan-400 flex items-center justify-center text-cyan-300">
              <BookOpen className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-pink-400 font-arcade block">
                {isPt ? 'ARQUIVO CÓSMICO DOS ABIDANTES' : 'ARCHIVE OF THE LAST ABIDERS'}
              </span>
              <h2 className="text-sm font-arcade font-bold text-yellow-300 pt-0.5">
                {isPt ? 'O CÓDICE DAS DIMENÚVEIS' : 'THE CODEX OF THE DIMENUOUS'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex px-4 pt-2.5 gap-1.5 border-b border-cyan-500/30 bg-[#0c021f] overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  const firstInCat = entries.find((e) => e.category === cat.id);
                  if (firstInCat) setSelectedEntryId(firstInCat.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-arcade rounded-t transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#150530] text-yellow-300 border-t-2 border-yellow-400 shadow-[0_0_10px_rgba(255,230,0,0.2)]'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Split Pane */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#090218]">
          {/* Left entry list */}
          <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-cyan-500/20 p-2.5 overflow-y-auto space-y-1">
            {filteredEntries.map((entry) => {
              const isSelected = currentEntry.id === entry.id;
              return (
                <button
                  key={entry.id}
                  onClick={() => setSelectedEntryId(entry.id)}
                  className={`w-full text-left p-2.5 rounded transition-all flex flex-col gap-0.5 ${
                    isSelected
                      ? 'bg-cyan-950/40 border border-cyan-400 text-cyan-200'
                      : 'hover:bg-white/5 border border-transparent text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[9px] sm:text-[10px] font-arcade font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                      {entry.title}
                    </span>
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-tech whitespace-nowrap overflow-hidden text-ellipsis">{entry.subtitle}</span>
                </button>
              );
            })}
          </div>

          {/* Right Detail Pane */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto bg-[#0a021c]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentEntry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                {/* Header */}
                <div className="space-y-1 border-b border-cyan-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 text-[9px] font-arcade uppercase tracking-wider rounded font-bold"
                      style={{
                        backgroundColor: `${currentEntry.color}25`,
                        color: currentEntry.color,
                        border: `1px solid ${currentEntry.color}`,
                      }}
                    >
                      {currentEntry.badge}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-arcade font-bold text-white pt-1">
                    {currentEntry.title}
                  </h3>
                  <p className="text-xs font-tech text-cyan-300/80">{currentEntry.subtitle}</p>
                </div>

                {/* Paragraphs */}
                <div className="space-y-2.5">
                  {currentEntry.content.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-xs sm:text-sm text-slate-200 leading-relaxed font-tech bg-[#12042b] p-3 rounded border border-pink-500/20"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Quote if available */}
                {currentEntry.quote && (
                  <div className="p-3 bg-gradient-to-r from-yellow-500/10 to-transparent border-l-4 border-yellow-400 rounded-r">
                    <p className="text-xs sm:text-sm italic font-tech text-yellow-200/95 leading-relaxed">
                      "{currentEntry.quote}"
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

