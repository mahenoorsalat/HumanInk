import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

interface DetectionResultProps {
  score: number | null;
  analysis?: string;
  indicators?: string[];
  isLoading: boolean;
}

const DetectionResult = ({ score, analysis, indicators, isLoading }: DetectionResultProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">Analyzing content...</span>
        </div>
      </div>
    );
  }

  if (score === null) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Shield className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-muted-foreground">
          Paste text and click "Detect AI" to analyze
        </p>
      </div>
    );
  }

  const isHuman = score < 30;
  const isMixed = score >= 30 && score < 70;
  const isAI = score >= 70;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">AI Detection Score</span>
        <Badge 
          variant={isHuman ? "success" : isAI ? "destructive" : "warning"}
        >
          {isHuman ? "Likely Human" : isAI ? "Likely AI" : "Mixed"}
        </Badge>
      </div>

      {/* Score Meter */}
    <div className="space-y-2">
        <div className="h-4 rounded-full bg-secondary overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-out",
              // isHuman (low score) uses emerald-500, isAI (high score) uses destructive (red)
              isHuman ? "bg-emerald-500" : isAI ? "bg-destructive" : "bg-amber-500"
            )}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Human</span>
          <span className="font-mono font-bold text-foreground text-lg">{score}%</span>
          <span>AI</span>
        </div>
      </div>

      {/* Result Message */}
     <div className={cn(
        "flex items-start gap-3 p-4 rounded-lg",
        // isHuman uses emerald-500/10 border, isAI uses destructive/10 border
        isHuman ? "bg-emerald-500/10 border border-emerald-500/20" :
        isAI ? "bg-destructive/10 border border-destructive/20" :
        "bg-amber-500/10 border border-amber-500/20"
      )}>
        {isHuman ? (
          <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
        ) : isAI ? (
          <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        )}
        <div>
          <p className="font-medium">
            {isHuman && "This content appears to be human-written"}
            {isMixed && "This content shows mixed signals"}
            {isAI && "This content appears to be AI-generated"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {analysis || (
              isHuman ? "Our analysis indicates natural writing patterns consistent with human authorship." :
              isMixed ? "The content has elements of both human and AI writing. Consider running it through our humanizer." :
              "High probability of AI-generated content detected. Use our humanizer to make it more natural."
            )}
          </p>
        </div>
      </div>

      {/* Indicators */}
      {indicators && indicators.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">Detected Patterns</span>
          <ul className="space-y-1">
            {indicators.map((indicator, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                {indicator}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DetectionResult;
