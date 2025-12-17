import { cn } from "@/lib/utils";

const tones = [
  { id: "professional", label: "Professional", emoji: "💼" },
  { id: "friendly", label: "Friendly", emoji: "😊" },
  { id: "emotional", label: "Emotional", emoji: "💫" },
  { id: "comedic", label: "Comedic", emoji: "😂" },
  { id: "academic", label: "Academic", emoji: "📚" },
  { id: "casual", label: "Casual", emoji: "✌️" },
  { id: "genz", label: "Gen-Z", emoji: "🔥" },
  { id: "formal", label: "Formal", emoji: "🎩" },
  { id: "persuasive", label: "Persuasive", emoji: "🎯" },
  { id: "storytelling", label: "Storytelling", emoji: "📖" },
];

interface ToneSelectorProps {
  selectedTone: string;
  onSelectTone: (tone: string) => void;
}

const ToneSelector = ({ selectedTone, onSelectTone }: ToneSelectorProps) => {
  return (
    <div className="space-y-3">
      <span className="text-sm font-medium text-muted-foreground">Select Tone</span>
      <div className="flex flex-wrap gap-2">
        {tones.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onSelectTone(tone.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              selectedTone === tone.id
                ? "bg-primary text-primary-foreground shadow-button"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <span>{tone.emoji}</span>
            <span>{tone.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToneSelector;
