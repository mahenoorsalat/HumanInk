import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface DetectionResult {
  score: number;
  analysis: string;
  indicators: string[];
}

export const useDetectAI = () => {
  const [isDetecting, setIsDetecting] = useState(false);

  const detect = async (text: string): Promise<DetectionResult | null> => {
    if (!text.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return null;
    }

    setIsDetecting(true);

    try {
      const { data, error } = await supabase.functions.invoke('detect-ai', {
        body: { text }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return {
        score: data.score,
        analysis: data.analysis,
        indicators: data.indicators
      };
    } catch (error) {
      console.error('Detection error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze text",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsDetecting(false);
    }
  };

  return { detect, isDetecting };
};
