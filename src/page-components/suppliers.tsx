import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  FileText, 
  MessageSquare, 
  CheckCircle, 
  BadgeCheck, 
  Clock, 
  Shield,
  TrendingUp,
  Users,
  Star
} from "lucide-react";

interface SuppliersPageProps {
  onNavigate: (page: string) => void;
}

export function SuppliersPage({ onNavigate }: SuppliersPageProps) {
  const supplierSteps = [
    {
      icon: FileText,
      title: "Create Your Profile",
      description: "Sign up in minutes and add your business details, service areas, and parts categories you supply.",
      color: "#EF4444",
    },
    {
      icon: MessageSquare,
      title: "Receive Qualified Requests",
      description: "Get notified when local drivers need parts you supply. Review request details before responding.",
      color: "#3B82F6",
    },
    {
      icon: CheckCircle,
      title: "Quote & Get Paid",
      description: "Send competitive quotes, chat with customers, and get paid securely through our platform.",
      color: "#22C55E",
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Grow Your Business",
      description: "Access thousands of active customers looking for parts in your area.",
      gradient: "from-[#EF4444] to-[#DC2626]",
    },
    {
      icon: BadgeCheck,
      title: "Build Trust with Verification",
      description: "Get verified and display your badge to increase customer confidence.",
      gradient: "from-[#22C55E] to-[#16A34A]",
    },
    {
      icon: Clock,
      title: "Pay Only for Leads",
      description: "No upfront fees. Only pay £3.50 when you accept a qualified lead.",
      gradient: "from-[#3B82F6] to-[#2563EB]",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Safe payment processing and GDPR-compliant data protection.",
      gradient: "from-[#8B5CF6] to-[#7C3AED]",
    },
  ];

  const testimonials = [
    {
      name: "James Turner",
      location: "Birmingham",
      company: "Motor Factor UK",
      quote: "We've increased our monthly revenue by 40% since joining. The platform is incredibly easy to use and the leads are high quality.",
      rating: 5,
    },
    {
      name: "Sarah Mitchell",
      location: "Manchester",
      company: "AutoParts Direct Ltd",
      quote: "PartsQuote brings us 3–5 qualified jobs weekly. Game changer for our business.",
      rating: 5,
    },
    {
      name: "Emma Wilson",
      location: "Bristol",
      company: "Bristol Auto Supplies",
      quote: "Simple onboarding, fair pricing, and consistent quality leads. PartsQuote has transformed how we find new customers.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] pt-32 pb-32 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: `url(https://images.unsplash.com/photo-1758381358962-efc41be53986?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBwYXJ0c3xlbnwxfHx8fDE3NTkzMTAxNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`,
            backgroundSize: '120%',
            backgroundPosition: 'left center'
          }}
        />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-['Inter'] font-bold text-white mb-6" style={{ fontSize: '48px', lineHeight: 1.2 }}>
                Join as a Supplier
              </h1>
              <p className="font-['Roboto'] text-[#94A3B8] mb-8" style={{ fontSize: '20px', lineHeight: 1.6 }}>
                Receive qualified leads from local drivers actively looking for the parts you supply. Grow your business with PartsQuote.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => onNavigate("supplier-onboarding")}
                  className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold px-6 py-3 rounded-full shadow-lg shadow-[#EF4444]/30 transition-all h-auto"
                >
                  Become a Supplier
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works for Suppliers */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-16">
            <h2 className="font-['Inter'] font-semibold text-[#0F172A] mb-4" style={{ fontSize: '40px', lineHeight: 1.2 }}>
              How It Works
            </h2>
            <p className="font-['Roboto'] text-[#64748B] max-w-2xl" style={{ fontSize: '18px', lineHeight: 1.6 }}>
              Start receiving qualified leads in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {supplierSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="bg-[#0F172A] border border-[#1E293B] rounded-2xl hover:shadow-lg transition-all">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <div 
                        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
                        style={{ backgroundColor: `${step.color}25` }}
                      >
                        <Icon className="h-10 w-10" style={{ color: step.color }} />
                      </div>
                    </div>
                    <h3 className="font-['Inter'] font-semibold text-white mb-3" style={{ fontSize: '22px' }}>
                      {step.title}
                    </h3>
                    <p className="font-['Roboto'] text-[#94A3B8]" style={{ fontSize: '16px', lineHeight: 1.6 }}>
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-16">
            <h2 className="font-['Inter'] font-semibold text-[#0F172A] mb-4" style={{ fontSize: '40px', lineHeight: 1.2 }}>
              Why Join PartsQuote?
            </h2>
            <p className="font-['Roboto'] text-[#64748B] max-w-2xl" style={{ fontSize: '18px', lineHeight: 1.6 }}>
              Join thousands of verified suppliers growing their business on the UK's trusted car parts marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className={`bg-gradient-to-br ${benefit.gradient} border-0 rounded-2xl hover:shadow-lg transition-all`}>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-['Inter'] font-semibold text-white mb-2" style={{ fontSize: '22px' }}>
                          {benefit.title}
                        </h3>
                        <p className="font-['Roboto'] text-white/90" style={{ fontSize: '16px', lineHeight: 1.6 }}>
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Hero */}
          <div className="mb-12">
            <Badge className="bg-[#FFF5F5] text-[#EF4444] border border-[#EF4444]/20 rounded-full px-4 py-2 mb-6">
              <span className="font-['Roboto'] font-medium" style={{ fontSize: '14px' }}>For Suppliers</span>
            </Badge>
            <h2 className="font-['Inter'] font-semibold text-[#0F172A] mb-4" style={{ fontSize: '48px', lineHeight: 1.2 }}>
              What Suppliers Say
            </h2>
            <p className="font-['Roboto'] text-[#64748B] max-w-2xl mb-6" style={{ fontSize: '16px', lineHeight: 1.6 }}>
              Real results from verified UK suppliers using PartsQuote.
            </p>
            
            {/* Proof Chips */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="bg-white border-[#E5E7EB] rounded-full px-4 py-2">
                <Users className="h-4 w-4 mr-2 text-[#EF4444]" />
                <span className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: '14px' }}>2,500+ verified suppliers</span>
              </Badge>
              <Badge variant="outline" className="bg-white border-[#E5E7EB] rounded-full px-4 py-2">
                <Clock className="h-4 w-4 mr-2 text-[#EF4444]" />
                <span className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: '14px' }}>Avg first request ~9 min</span>
              </Badge>
              <Badge variant="outline" className="bg-white border-[#E5E7EB] rounded-full px-4 py-2">
                <Star className="h-4 w-4 mr-2 text-[#F59E0B] fill-[#F59E0B]" />
                <span className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: '14px' }}>4.9★ rating</span>
              </Badge>
            </div>
          </div>

          {/* Featured + KPI Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Featured Testimonial */}
            <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center flex-shrink-0">
                    <span className="font-['Inter'] font-bold text-white" style={{ fontSize: '16px' }}>JT</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-['Inter'] font-semibold text-[#0F172A] mb-0.5" style={{ fontSize: '16px' }}>
                      James Turner
                    </p>
                    <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '13px' }}>Motor Factor UK</p>
                    <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '13px' }}>Birmingham</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                  <span className="font-['Inter'] font-semibold text-[#0F172A] ml-2" style={{ fontSize: '13px' }}>Excellent</span>
                </div>
                
                <p className="font-['Roboto'] text-[#0F172A] mb-4" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                  "We've increased our monthly revenue by 40% since joining. The platform is incredibly easy to use and the leads are high quality. PartsQuote has transformed how we find new customers."
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-[#22C55E]/10 text-[#22C55E] border-0 rounded-full px-2.5 py-0.5">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span style={{ fontSize: '11px' }}>Verified</span>
                  </Badge>
                  <Badge variant="outline" className="border-[#E5E7EB] rounded-full px-2.5 py-0.5">
                    <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '11px' }}>Brakes</span>
                  </Badge>
                  <Badge variant="outline" className="border-[#E5E7EB] rounded-full px-2.5 py-0.5">
                    <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '11px' }}>Engine</span>
                  </Badge>
                </div>
                
                <p className="font-['Roboto'] text-[#94A3B8]" style={{ fontSize: '11px' }}>
                  Verified purchase — Sept 2025
                </p>
              </CardContent>
            </Card>

            {/* KPI Stats Card */}
            <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-['Inter'] font-semibold text-[#0F172A] mb-4" style={{ fontSize: '18px' }}>
                  Platform Performance
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '13px' }}>Avg jobs/week</span>
                      <span className="font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: '20px' }}>12.5</span>
                    </div>
                    <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#EF4444] to-[#DC2626] rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '13px' }}>Lead acceptance rate</span>
                      <span className="font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: '20px' }}>68%</span>
                    </div>
                    <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '13px' }}>Avg response time</span>
                      <span className="font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: '20px' }}>9 min</span>
                    </div>
                    <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-[#E5E7EB]">
                    <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '11px', lineHeight: 1.5 }}>
                      Based on 2,500+ verified suppliers across the UK
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Grid of Testimonials */}
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {testimonials.map((testimonial, index) => {
              const initials = testimonial.name.split(' ').map(n => n[0]).join('');
              return (
                <Card key={index} className="bg-white border border-[#E5E7EB] rounded-2xl hover:shadow-lg transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-2.5 mb-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center flex-shrink-0">
                        <span className="font-['Inter'] font-bold text-white" style={{ fontSize: '13px' }}>
                          {initials}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-['Inter'] font-semibold text-[#0F172A] mb-0.5" style={{ fontSize: '13px' }}>
                          {testimonial.name}
                        </p>
                        <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '11px' }}>{testimonial.company}</p>
                        <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '11px' }}>{testimonial.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-0.5 mb-2.5">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                      ))}
                    </div>
                    
                    <p className="font-['Roboto'] text-[#0F172A] mb-2.5" style={{ fontSize: '13px', lineHeight: 1.6 }}>
                      "{testimonial.quote}"
                    </p>
                    
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline" className="border-[#E5E7EB] rounded-full px-2 py-0.5">
                        <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '10px' }}>Brakes</span>
                      </Badge>
                      <Badge variant="outline" className="border-[#E5E7EB] rounded-full px-2 py-0.5">
                        <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '10px' }}>Engine</span>
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Trust Strip */}
          <div className="mb-12 py-12 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0]">
            <div className="text-center mb-8">
              <Badge className="bg-white text-[#475569] border-[#E2E8F0] mb-4 font-['Roboto']" style={{ fontSize: '12px' }}>
                TRUSTED PARTNERS
              </Badge>
              <h3 className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: '24px', lineHeight: 1.3 }}>
                Leading Suppliers Across the UK
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto px-6">
              {["Motor Factor UK", "AutoParts Direct", "Bristol Auto", "London Parts", "Manchester Motors", "UK Supplies"].map((logo, i) => (
                <div key={i} className="bg-white rounded-xl p-4 flex items-center justify-center gap-2 border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors">
                  <BadgeCheck className="h-4 w-4 text-[#64748B] flex-shrink-0" />
                  <span className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: '14px' }}>
                    {logo}
                  </span>
                </div>
              ))}
            </div>
          </div>


        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="font-['Inter'] font-bold text-white mb-6" style={{ fontSize: '40px', lineHeight: 1.2 }}>
            Ready to Grow Your Business?
          </h2>
          <p className="font-['Roboto'] text-[#94A3B8] mb-8 max-w-2xl mx-auto" style={{ fontSize: '20px', lineHeight: 1.6 }}>
            Join 2,500+ verified suppliers already growing their business on PartsQuote
          </p>
          <Button
            onClick={() => onNavigate("supplier-onboarding")}
            className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold px-12 py-4 rounded-full shadow-lg shadow-[#EF4444]/30 transition-all text-lg h-auto"
          >
            Become a Supplier
          </Button>
          <p className="font-['Roboto'] text-sm text-[#94A3B8] mt-4">
            Free to join. Start receiving requests today.
          </p>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
