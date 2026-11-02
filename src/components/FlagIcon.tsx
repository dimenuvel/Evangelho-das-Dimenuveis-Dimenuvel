import React from 'react';
import { SupportedLanguage } from '../types/game';

interface FlagIconProps {
  language: SupportedLanguage;
  className?: string;
}

export const FlagIcon: React.FC<FlagIconProps> = ({ language, className = 'w-5 h-3.5' }) => {
  if (language === 'pt') {
    // Brazil Flag (for Portuguese)
    return (
      <svg
        viewBox="0 0 24 16"
        className={`${className} inline-block shrink-0 rounded-[2px] shadow-sm overflow-hidden`}
        aria-label="Português"
      >
        <rect width="24" height="16" fill="#009739" />
        <polygon points="12,2 22,8 12,14 2,8" fill="#fedd00" />
        <circle cx="12" cy="8" r="3.6" fill="#012169" />
        <path d="M 8.8,8.2 Q 12,6.4 15.2,8.2" fill="none" stroke="#ffffff" strokeWidth="0.8" />
      </svg>
    );
  }

  // USA Flag (for English)
  return (
    <svg
      viewBox="0 0 24 16"
      className={`${className} inline-block shrink-0 rounded-[2px] shadow-sm overflow-hidden`}
      aria-label="English"
    >
      <rect width="24" height="16" fill="#b22234" />
      <rect y="1.23" width="24" height="1.23" fill="#ffffff" />
      <rect y="3.69" width="24" height="1.23" fill="#ffffff" />
      <rect y="6.15" width="24" height="1.23" fill="#ffffff" />
      <rect y="8.61" width="24" height="1.23" fill="#ffffff" />
      <rect y="11.07" width="24" height="1.23" fill="#ffffff" />
      <rect y="13.53" width="24" height="1.23" fill="#ffffff" />
      <rect width="10" height="8.61" fill="#3c3b6e" />
      <circle cx="2" cy="2" r="0.6" fill="#ffffff" />
      <circle cx="5" cy="2" r="0.6" fill="#ffffff" />
      <circle cx="8" cy="2" r="0.6" fill="#ffffff" />
      <circle cx="3.5" cy="4.3" r="0.6" fill="#ffffff" />
      <circle cx="6.5" cy="4.3" r="0.6" fill="#ffffff" />
      <circle cx="2" cy="6.6" r="0.6" fill="#ffffff" />
      <circle cx="5" cy="6.6" r="0.6" fill="#ffffff" />
      <circle cx="8" cy="6.6" r="0.6" fill="#ffffff" />
    </svg>
  );
};
