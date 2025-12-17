// src/components/landing/HowItWorksSection.tsx

import { Badge } from "@/components/ui/badge";

const steps = [
  {
    step: "01",
    title: "Paste Your Text",
    description: "Simply paste your AI-generated content or any text you want to analyze or transform.",
  },
  {
    step: "02",
    title: "Choose Your Action",
    description: "Select whether you want to humanize the text, detect AI content, or leverage the style rewriter.",
  },
  {
    step: "03",
    title: "Customize Your Tone",
    description: "Pick from 10+ tone and style options to perfectly match your brand voice or personal style.",
  },
  {
    step: "04",
    title: "Generate & Deploy",
    description: "Receive your humanized content or detection analysis in seconds, ready for use.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background"> {/* Changed background */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="glow" className="mb-4">
            Process
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            A Simple Path to Authentic Content
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your content in four quick steps. No complex setup, just results.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12"> {/* Increased gap for cleaner spacing */}
            {steps.map((item, index) => (
              <div 
                key={item.step}
                className="relative flex gap-6 animate-fade-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex-shrink-0">
                  {/* Styling adjusted for a clean, numbered badge look */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/30">
                    <span className="text-md font-bold text-primary font-mono">{item.step}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;