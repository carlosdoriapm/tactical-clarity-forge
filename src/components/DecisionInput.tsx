
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface DecisionInputProps {
  onSubmit: (decision: string) => void;
  maxLength?: number;
  disabled?: boolean;
}

const DecisionInput: React.FC<DecisionInputProps> = ({
  onSubmit,
  maxLength = 350,
  disabled = false,
}) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <div
      className="relative w-full max-w-xl mx-auto p-6 rounded-2xl backdrop-blur-sm bg-white/10 shadow-lg transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
      aria-label="Scenario Input"
    >
      <textarea
        className="w-full bg-transparent resize-none text-white placeholder:text-white/60 border-none focus:ring-2 focus:ring-cyan-400/40 focus:outline-none leading-6 rounded-lg p-4 text-base min-h-[96px] max-h-48 mb-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={maxLength}
        placeholder="Describe your strategic decision..."
        aria-label="Describe your decision scenario"
        disabled={disabled}
      />
      <div className="flex items-center justify-between mt-1">
        <span className="invisible select-none">.</span>
        <span className="text-xs text-white/70 ml-auto" aria-live="polite">
          {value.length}/{maxLength}
        </span>
      </div>
      <Button
        disabled={disabled || value.length === 0}
        onClick={handleSubmit}
        className="absolute bottom-6 right-6 px-6 py-2 bg-cyan-500 text-white rounded-lg shadow-md transition transform active:scale-97 hover:-translate-y-1 hover:shadow-lg focus:outline-none disabled:opacity-40"
        style={{
          opacity: disabled || value.length === 0 ? 0.4 : 1,
          pointerEvents: disabled || value.length === 0 ? 'none' : 'auto'
        }}
        aria-label="Visualize Timeline"
      >
        Analyze
      </Button>
    </div>
  );
};

export default DecisionInput;
