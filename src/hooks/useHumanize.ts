import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useHumanize = () => {
  const [isHumanizing, setIsHumanizing] = useState(false);

  const humanize = async (text: string, tone: string): Promise<string | null> => {
    if (!text.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter some text to humanize.",
        variant: "destructive",
      });
      return null;
    }

    setIsHumanizing(true);

    try {
      const { data, error } = await supabase.functions.invoke('humanize-text', {
        body: { text, tone }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Text humanized!",
        description: "Your content has been transformed.",
      });

      return data.humanizedText;
    } catch (error) {
      console.error('Humanization error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to humanize text",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsHumanizing(false);
    }
  };

  return { humanize, isHumanizing };
};
