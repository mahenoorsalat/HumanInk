import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Shield, FileText, Bot, User, CheckCircle2, Wand2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-24">
      {/* Background Grid and Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-4 py-20 text-center">
        
        {/* Main Heading & Description */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
          Unlocking Human Potential With{" "}
          <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Generative AI
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Transforming robotic AI text into naturally flowing, emotionally engaging human writing and providing reliable AI detection.
        </p>

        {/* The large white card */}
        <Card className="max-w-6xl mx-auto text-left shadow-2xl overflow-hidden border-muted/40">
            <CardContent className="p-0">
                
                {/* Tabs / Header of Card */}
                <div className="flex flex-wrap gap-2 p-4 border-b border-border/50 bg-muted/20 items-center">
                   <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full bg-red-400/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                      <div className="w-3 h-3 rounded-full bg-green-400/80" />
                   </div>
                   <div className="ml-4 flex gap-4 text-sm font-medium">
                    <button className="flex items-center gap-2 text-primary">
                        <Sparkles className="h-4 w-4" /> Humanizer
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Shield className="h-4 w-4" /> Detector
                    </button>
                    <Badge variant="secondary" className="text-xs">v2.0 Active</Badge>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
                    {/* Left Side: Text Content */}
                    <div className="order-2 md:order-1">
                        <h2 className="text-3xl font-bold mb-4">
                            HumanInk Advanced Engine.
                        </h2>
                        <p className="text-muted-foreground mb-8 leading-relaxed">
                            Our advanced text-to-human engine rewrites your AI content, excelling in natural flow, emotional depth, and offering undetectable, high-quality humanized text.
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" className="rounded-full px-8" asChild>
                                <Link to="/app">
                                    Start Humanizing
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
                                <Link to="/app">
                                    Try Demo
                                </Link>
                            </Button>
                        </div>
                    </div>
                    
                    {/* Right Side: Bento Grid Visuals (Replacing Images) */}
                    <div className="order-1 md:order-2 grid grid-cols-2 grid-rows-2 gap-4 h-[400px]">
                        
                        {/* Cell 1: The Transformation (Tall Left) */}
                        <div className="col-span-1 row-span-2 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10 p-6 flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-primary/20" />
                            
                            <div className="space-y-2 relative z-10">
                                <div className="p-3 bg-background rounded-xl w-fit shadow-sm">
                                    <Bot className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="h-12 w-0.5 bg-gradient-to-b from-border to-primary ml-6 my-2" />
                                <div className="p-3 bg-primary text-primary-foreground rounded-xl w-fit shadow-lg scale-110 transition-transform duration-500 group-hover:scale-125">
                                    <User className="h-6 w-6" />
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="font-semibold text-lg">AI to Human</h3>
                                <p className="text-sm text-muted-foreground mt-1">Seamlessly converting robotic patterns into natural language.</p>
                            </div>

                            {/* Decorative Wave SVG */}
                            <svg className="absolute bottom-0 right-0 opacity-20 text-primary w-full h-24" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
                            </svg>
                        </div>

                        {/* Cell 2: Detection Shield (Top Right) */}
                        <div className="col-span-1 row-span-1 rounded-2xl bg-green-500/5 border border-green-500/20 p-5 flex flex-col justify-center items-center relative overflow-hidden">
                             {/* Scanning Line Animation */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-[scan_3s_ease-in-out_infinite]" />
                            
                            <div className="relative">
                                <Shield className="h-12 w-12 text-green-600 dark:text-green-400 mb-2" />
                                <CheckCircle2 className="h-5 w-5 text-green-600 bg-background rounded-full absolute -bottom-1 -right-1 border-2 border-background" />
                            </div>
                            <div className="text-center mt-2">
                                <span className="font-bold text-green-700 dark:text-green-300">100% Human</span>
                            </div>
                        </div>

                        {/* Cell 3: Smart Writing (Bottom Right) */}
                        <div className="col-span-1 row-span-1 rounded-2xl bg-purple-500/5 border border-purple-500/20 p-5 flex flex-col justify-center items-start relative overflow-hidden group hover:bg-purple-500/10 transition-colors">
                            <div className="absolute top-2 right-2">
                                <Wand2 className="h-5 w-5 text-purple-500 animate-pulse" />
                            </div>
                            
                            <div className="space-y-2 w-full">
                                {/* Skeleton Text Effect */}
                                <div className="h-2 w-3/4 bg-purple-200 dark:bg-purple-900/50 rounded-full" />
                                <div className="h-2 w-full bg-purple-200 dark:bg-purple-900/50 rounded-full" />
                                <div className="h-2 w-1/2 bg-purple-300 dark:bg-purple-700/50 rounded-full" />
                            </div>
                            
                            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-purple-700 dark:text-purple-300">
                                <Sparkles className="h-3 w-3" />
                                <span>Tone Enhancement</span>
                            </div>
                        </div>

                    </div>
                </div>

            </CardContent>
        </Card>
      </div>
      
      {/* Add custom keyframe for the scanner if not in global css */}
      <style>{`
        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;