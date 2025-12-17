import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import TextEditor from "@/components/app/TextEditor";
import ToneSelector from "@/components/app/ToneSelector";
import DetectionResult from "@/components/app/DetectionResult";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Shield, Loader2, Crown, ArrowUpCircle } from "lucide-react";
import { useHumanize } from "@/hooks/useHumanize";
import { useDetectAI, DetectionResult as DetectionResultType } from "@/hooks/useDetectAI";
import { supabase } from "@/integrations/supabase/client";

const AppDashboard = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [detectionResult, setDetectionResult] = useState<DetectionResultType | null>(null);
  const [activeTab, setActiveTab] = useState("humanize");
  const [userPlan, setUserPlan] = useState<string>("free");

  const { humanize, isHumanizing } = useHumanize();
  const { detect, isDetecting } = useDetectAI();

  // Fetch user plan on mount
  useEffect(() => {
    const fetchPlan = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', session.user.id)
          .single();
        
        if (data?.subscription_tier) {
          setUserPlan(data.subscription_tier);
        }
      }
    };
    fetchPlan();
  }, []);

  const handleHumanize = async () => {
    const result = await humanize(inputText, selectedTone);
    if (result) {
      setOutputText(result);
    }
  };

  const handleDetect = async () => {
    const result = await detect(inputText);
    if (result) {
      setDetectionResult(result);
    }
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

  const getPlanDetails = () => {
    switch(userPlan) {
      case 'pro': return { name: 'Pro Plan', limit: '50,000 words', color: 'text-purple-400' };
      case 'business': return { name: 'Business Plan', limit: 'Unlimited words', color: 'text-amber-400' };
      default: return { name: 'Free Plan', limit: '1,000 words/month', color: 'text-muted-foreground' };
    }
  };

  const planDetails = getPlanDetails();

  const handleUpgrade = () => {
    // Navigate to pricing section on home page
    window.location.href = "/#pricing";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Human<span className="text-primary">Ink</span> Studio
            </h1>
            <p className="text-muted-foreground">
              Transform AI text or detect AI-generated content with precision.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-secondary/30 px-4 py-2 rounded-full border border-white/5">
              <Crown className={`h-4 w-4 ${planDetails.color}`} />
              <span className="font-semibold text-sm">{planDetails.name}</span>
            </div>

            {/* UPGRADE BUTTON: Only shows if user is on FREE plan */}
            {userPlan === 'free' && (
              <Button 
                onClick={handleUpgrade} 
                variant="default" 
                size="sm"
                className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0"
              >
                <ArrowUpCircle className="h-4 w-4" />
                Upgrade Now
              </Button>
            )}
          </div>
        </div>

        {/* ... Rest of the tabs (Humanize / Detect) ... */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger value="humanize" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Humanize
            </TabsTrigger>
            <TabsTrigger value="detect" className="gap-2">
              <Shield className="h-4 w-4" />
              Detect AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="humanize" className="space-y-6">
            <Card variant="glass" className="p-6">
              <ToneSelector 
                selectedTone={selectedTone} 
                onSelectTone={setSelectedTone} 
              />
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card variant="glass" className="p-6">
                <TextEditor
                  value={inputText}
                  onChange={setInputText}
                  placeholder="Paste your AI-generated text here..."
                  label="Input Text"
                />
              </Card>

              <Card variant="glass" className="p-6">
                <TextEditor
                  value={outputText}
                  onChange={setOutputText}
                  placeholder="Your humanized text will appear here..."
                  label="Humanized Output"
                  readOnly
                />
              </Card>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="font-mono">
                  {wordCount} words
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Limit: {planDetails.limit}
                </span>
              </div>
              <Button
                variant="hero"
                size="lg"
                onClick={handleHumanize}
                disabled={isHumanizing || !inputText.trim()}
              >
                {isHumanizing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Humanizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Humanize Text
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="detect" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card variant="glass" className="p-6">
                <TextEditor
                  value={inputText}
                  onChange={setInputText}
                  placeholder="Paste text to analyze for AI detection..."
                  label="Text to Analyze"
                />
              </Card>

              <Card variant="glass" className="p-6">
                <CardContent className="p-0">
                  <DetectionResult 
                    score={detectionResult?.score ?? null}
                    analysis={detectionResult?.analysis}
                    indicators={detectionResult?.indicators}
                    isLoading={isDetecting} 
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="font-mono">
                  {wordCount} words
                </Badge>
                <span className="text-sm text-muted-foreground">
                  99.8% detection accuracy
                </span>
              </div>
              <Button
                variant="hero"
                size="lg"
                onClick={handleDetect}
                disabled={isDetecting || !inputText.trim()}
              >
                {isDetecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Detect AI Content
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AppDashboard;