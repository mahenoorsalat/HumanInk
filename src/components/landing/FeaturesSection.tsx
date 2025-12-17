// src/components/landing/FeaturesSection.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  Shield, 
  Palette, 
  FileCheck, 
  Fingerprint,
  Heart,
  Zap
} from "lucide-react";

// Simplified the Feature variants to be cleaner (removed Globe and Zap as they are implied by others)
const features = [
  {
    icon: Sparkles,
    title: "AI Text Humanizer",
    description: "Transform robotic AI text into naturally flowing, emotionally engaging human writing.",
  },
  {
    icon: Shield,
    title: "Undetectable AI",
    description: "Our engine crafts text that bypasses the most advanced AI detection tools with ease.",
  },
  {
    icon: Palette,
    title: "Tone Customization",
    description: "Select from 10+ tones: professional, friendly, emotional, Gen-Z, and more, to match your voice.",
  },
  {
    icon: Fingerprint,
    title: "Advanced Detection",
    description: "Detect AI-written content with 99.8% accuracy by identifying hidden AI writing patterns.",
  },
  {
    icon: FileCheck,
    title: "Grammar & Style Fixer",
    description: "Automatic correction and style enhancement for polished, professional-grade content.",
  },
  {
    icon: Heart,
    title: "Emotional Depth Score",
    description: "Analyze and enhance the emotional resonance of your content for better reader engagement.",
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description: "Get humanized content or detection analysis in seconds with our high-performance engine.",
  },
  {
    icon: Shield, // Reusing Shield for a security/trust feature
    title: "API Access (Business)",
    description: "Integrate our humanization and detection API directly into your workflows and applications.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative bg-background">
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Master Authentic Content
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete suite of tools designed for writers, students, businesses, and anyone who needs authentic, human-like content.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="default" // Use the default card for a cleaner look
              className="animate-fade-up hover:border-primary/50 hover:shadow-[0_0_40px_hsl(180,100%,50%,0.1)] transition-all duration-300" // Added a cleaner hover effect
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mr-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;