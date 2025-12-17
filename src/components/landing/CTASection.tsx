// src/components/landing/CTASection.tsx

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card"; // Import Card

const CTASection = () => {
  return (
    <section className="py-24 relative bg-background">
      <div className="container relative z-10 mx-auto px-4 text-center">
        <Card variant="glow" className="max-w-4xl mx-auto p-12 shadow-2xl"> {/* Wrap in a Card for focus */}
          <CardContent className="p-0">
            <div className="flex justify-center mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 animate-float">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-3xl mx-auto">
              Ready to Transform Your Content?
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of writers, students, and businesses who trust HumanInk AI for authentic, human-like content.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/app">
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl">
                Schedule Demo
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • 1,000 free words • Cancel anytime
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;