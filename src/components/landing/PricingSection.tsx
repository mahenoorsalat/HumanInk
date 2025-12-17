import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PricingSection = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setUserProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setUserProfile(data);
  };

  const handleCheckout = async (plan: any) => {
    if (plan.priceId === "free") {
      navigate(session ? "/app" : "/auth");
      return;
    }

    setLoading(plan.priceId);

    try {
      if (!session) {
        toast({ title: "Account required", description: "Please log in to upgrade." });
        navigate("/auth");
        return;
      }

      // 1. Create Order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: plan.priceId, amount: plan.amount },
      });

      if (orderError) throw orderError;

      // 2. Open Razorpay
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) throw new Error("Razorpay SDK failed to load");

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "HumanInk AI",
        description: `Upgrade to ${plan.name}`,
        order_id: orderData.orderId,
        
        handler: async function (response: any) {
          console.log("Payment successful", response);
          toast({ title: "Verifying Payment...", description: "Please wait..." });

          try {
            // 3. Verify Payment & Update DB
            const { error: verifyError } = await supabase.functions.invoke('verify-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                priceId: plan.priceId,
                user_id: session.user.id // Pass user ID explicitly
              }
            });

            if (verifyError) throw verifyError;

            toast({ title: "Success!", description: "Account upgraded!" });
            
            // 4. FORCE RELOAD TO UPDATE DASHBOARD
            window.location.href = "/app"; 

          } catch (err: any) {
            console.error("Verification failed", err);
            // Even if verification fails on frontend, check if DB updated.
            // If it persists, just redirecting might show the updated state if webhook fired.
            toast({ 
              variant: "destructive", 
              title: "Verification Error", 
              description: "Please check your dashboard." 
            });
            window.location.href = "/app";
          }
        },
        prefill: { email: session.user.email },
        theme: { color: "#9b87f5" },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to start payment.",
      });
    } finally {
      setLoading(null);
    }
  };

  const getButtonText = (plan: any) => {
    if (loading === plan.priceId) return "Processing...";
    if (plan.priceId === "free") return "Get Started";
    if (userProfile?.subscription_tier === plan.priceId.split('_')[0]) {
      return "Current Plan";
    }
    return `Upgrade (${plan.price})`;
  };

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Demo version to try HumanInk",
      features: [
        "1,000 words/month",
        "Basic humanization",
        "AI detection",
        "Standard support",
      ],
      featured: false,
      priceId: "free",
      amount: 0, 
    },
    {
      name: "Pro",
      price: "₹1,599",
      period: "per month",
      description: "For professionals and creators",
      features: [
        "50,000 words/month",
        "Advanced humanization",
        "99.8% accurate detection",
        "Priority support",
        "All tone options",
      ],
      featured: true,
      priceId: "pro_monthly", 
      amount: 1599, 
    },
    {
      name: "Business",
      price: "₹6,499",
      period: "per month",
      description: "For teams and enterprises",
      features: [
        "Unlimited words",
        "Maximum humanization level",
        "All tones + custom presets",
        "Faster processing",
        "Priority support",
      ],
      featured: false,
      priceId: "business_monthly",
      amount: 6499, 
    },
  ];

  return (
    <section id="pricing" className="py-24 relative bg-background">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="glow" className="mb-4">Pricing</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              variant={plan.featured ? "pricing-featured" : "pricing"}
              className="animate-fade-up relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="shadow-button">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-extrabold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">/{plan.period}</span>
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={plan.featured ? "hero" : "outline"} 
                  size="lg"
                  className="w-full"
                  onClick={() => handleCheckout(plan)}
                  disabled={!!loading || userProfile?.subscription_tier === plan.priceId.split('_')[0]}
                >
                  {loading === plan.priceId ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    getButtonText(plan)
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;