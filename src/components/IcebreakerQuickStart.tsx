
import { useState } from 'react';

const suggestions = [
  "Let's get started.",
  "I need help with…",
  "Here's where I'm stuck.",
  "I keep messing up…"
];

interface IcebreakerQuickStartProps {
  onSelect: (text: string) => void;
}

export default function IcebreakerQuickStart({ onSelect }: IcebreakerQuickStartProps) {
  const [used, setUsed] = useState(false);

  if (used) return null; // show once

  return (
    <div className="flex flex-wrap gap-2 mt-3 px-1">
      {suggestions.map((text, i) => (
        <button
          key={i}
          onClick={() => {
            onSelect(text);
            setUsed(true);
          }}
          className="text-sm bg-zinc-800 text-gray-300 border border-gray-600 px-3 py-1 rounded hover:bg-red-700 hover:text-white transition"
        >
          {text}
        </button>
      ))}
    </div>
  );
}
