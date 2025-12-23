import { useState, useEffect, useRef } from "react";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";
import { Target, Eye, Heart, Users, TrendingUp, Award, Shield, Play, MapPin } from "lucide-react";

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const [activeYear, setActiveYear] = useState("2022");
  const timelineRef = useRef<HTMLDivElement>(null);
  const milestoneRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Vehicle registration dialog state
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [postcode, setPostcode] = useState("");
  const values = [
    {
      icon: Target,
      title: "Customer-Focused",
      description: "We put drivers first, ensuring they get the best prices and quality parts from trusted suppliers.",
      color: "#EF4444",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Every supplier is verified, and all transactions are secured to protect both drivers and businesses.",
      color: "#3B82F6",
    },
    {
      icon: Heart,
      title: "Community-Driven",
      description: "We're building a marketplace that benefits local businesses and supports the automotive community.",
      color: "#F59E0B",
    },
  ];

  const team = [
    {
      name: "James Anderson",
      role: "Founder & CEO",
      bio: "Former automotive engineer with 15 years of experience in the UK car parts industry.",
      initials: "JA",
      gradient: "from-[#EF4444] to-[#DC2626]",
      image: "https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYWxlJTIwaGVhZHNob3R8ZW58MXx8fHwxNzU5NzM3Nzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "Sarah Thompson",
      role: "Head of Operations",
      bio: "Supply chain specialist focused on connecting suppliers with customers efficiently.",
      initials: "ST",
      gradient: "from-[#3B82F6] to-[#2563EB]",
      image: "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5NjQxNTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "Michael Chen",
      role: "Head of Technology",
      bio: "Tech leader passionate about building platforms that solve real-world problems.",
      initials: "MC",
      gradient: "from-[#22C55E] to-[#16A34A]",
      image: "https://images.unsplash.com/photo-1629507208649-70919ca33793?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTcwNTc5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "Emma Davis",
      role: "Customer Success",
      bio: "Dedicated to ensuring every customer has the best experience on our platform.",
      initials: "ED",
      gradient: "from-[#F59E0B] to-[#D97706]",
      image: "https://images.unsplash.com/photo-1706824261828-6127b3beb64d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBmZW1hbGUlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NTk3Mzc3OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
  ];

  const milestones = [
    {
      year: "2022",
      month: "Sept",
      title: "PartsQuote Founded",
      description: "Launched with a simple mission: make finding quality car parts fast, fair, and transparent for UK drivers. Started with 50 verified suppliers across England.",
      icon: Target,
      image: "https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhhbmRzaGFrZSUyMHBhcnRuZXJzaGlwfGVufDF8fHx8MTc1OTcwNzUwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stat: {
        value: "50",
        label: "Initial suppliers"
      }
    },
    {
      year: "2023",
      month: "June",
      title: "1,000 Suppliers Joined",
      description: "Crossed a major milestone with verified suppliers across every region of the United Kingdom, from London to Glasgow.",
      icon: Users,
      image: "https://images.unsplash.com/photo-1758795115256-62672df7a1d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwd29ya3Nob3AlMjBzdXBwbGllcnxlbnwxfHx8fDE3NTk3MzgzMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stat: {
        value: "1,000+",
        label: "Verified suppliers"
      },
      location: "UK-wide"
    },
    {
      year: "2024",
      month: "March",
      title: "100,000 Quotes Processed",
      description: "Reached six figures in quotes processed, helping drivers save an average of £127 per part compared to traditional dealers.",
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1548287233-af744a9ba268?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0cyUyMHdhcmVob3VzZXxlbnwxfHx8fDE3NTk3MzgzMjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stat: {
        value: "100K+",
        label: "Parts quoted"
      }
    },
    {
      year: "2025",
      month: "Jan",
      title: "Chat & Booking Launched",
      description: "Introduced real-time messaging and instant booking features, reducing transaction time from days to minutes.",
      icon: Award,
      image: "https://images.unsplash.com/photo-1599256871787-737fd3315df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pYyUyMHRvb2xzJTIwZXF1aXBtZW50fGVufDF8fHx8MTc1OTczODMyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stat: {
        value: "~9 min",
        label: "First quote"
      }
    },
  ];

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      Object.entries(milestoneRefs.current).forEach(([year, ref]) => {
        if (ref) {
          const { offsetTop, offsetHeight } = ref;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveYear(year);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToYear = (year: string) => {
    const element = milestoneRefs.current[year];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveYear(year);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-24 md:pt-28 md:pb-28 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1759419281419-b04552b2691a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0cyUyMGF1dG9tb3RpdmUlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NTk3MzkwMDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Automotive workshop"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/95 via-[#1E293B]/90 to-[#0F172A]/95 z-10"></div>
        
        {/* Content */}
        <div className="max-w-[1200px] mx-auto px-6 relative z-20">
          <h1 className="font-['Inter'] font-bold text-white mb-8" style={{ fontSize: '64px', lineHeight: 1.1 }}>
            Connecting Drivers with <br />Trusted Car Parts Suppliers
          </h1>
          <p className="font-['Roboto'] text-white/80 max-w-2xl mb-8" style={{ fontSize: '22px', lineHeight: 1.6 }}>
            We're on a mission to make finding quality car parts simple, transparent, and affordable for every UK driver.
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => setRegistrationDialogOpen(true)}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold px-12 py-3 rounded-full transition-all text-lg h-auto shadow-lg shadow-[#EF4444]/30 min-w-[180px]"
            >
              Get Started
            </Button>
            <Button
              onClick={() => onNavigate("how-it-works")}
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#0F172A] font-['Roboto'] font-semibold px-12 py-3 rounded-full transition-all text-lg h-auto min-w-[180px]"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-6 items-stretch">
            {/* Mission Card */}
            <div className="relative group h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#EF4444]/20 to-[#F59E0B]/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Card className="relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-0 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#EF4444]/10 rounded-full blur-3xl"></div>
                <CardContent className="p-6 relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#EF4444] rounded-xl blur-lg opacity-50"></div>
                      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center shadow-lg">
                        <Target className="h-6 w-6 text-white" strokeWidth={2.5} />
                      </div>
                    </div>
                    <h2 className="font-['Inter'] font-bold text-white" style={{ fontSize: '28px', lineHeight: 1.2 }}>
                      Our Mission
                    </h2>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <p className="font-['Roboto'] text-white/90" style={{ fontSize: '15px', lineHeight: 1.6 }}>
                      PartsQuote was born from a simple frustration: finding quality car parts at fair prices shouldn't require hours of phone calls and research.
                    </p>
                    <p className="font-['Roboto'] text-white/80" style={{ fontSize: '15px', lineHeight: 1.6 }}>
                      We built a marketplace that connects UK drivers with verified local suppliers, making it easy to compare quotes, read reviews, and get the parts you need quickly and affordably.
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="font-['Roboto'] font-medium text-white" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                      Serving <span className="text-[#EF4444]">thousands of drivers</span> and <span className="text-[#EF4444]">2,500+ suppliers</span> across the UK.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vision Card */}
            <div className="relative group h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Card className="relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-0 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] h-full flex flex-col">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#3B82F6]/10 rounded-full blur-3xl"></div>
                <CardContent className="p-6 relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#3B82F6] rounded-xl blur-lg opacity-50"></div>
                      <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center shadow-lg">
                        <Eye className="h-6 w-6 text-white" strokeWidth={2.5} />
                      </div>
                    </div>
                    <h2 className="font-['Inter'] font-bold text-white" style={{ fontSize: '28px', lineHeight: 1.2 }}>
                      Our Vision
                    </h2>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <p className="font-['Roboto'] text-white/90" style={{ fontSize: '15px', lineHeight: 1.6 }}>
                      We envision a future where every driver in the UK has instant access to competitive quotes from trusted local suppliers for any car part they need.
                    </p>
                    <p className="font-['Roboto'] text-white/80" style={{ fontSize: '15px', lineHeight: 1.6 }}>
                      By combining technology with the expertise of local automotive businesses, we're building a platform that benefits everyone: drivers save money and time, while suppliers grow their customer base and revenue.
                    </p>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                      <div className="font-['Inter'] font-bold text-white mb-0.5" style={{ fontSize: '20px' }}>
                        100K+
                      </div>
                      <div className="font-['Roboto'] text-white/70" style={{ fontSize: '12px' }}>
                        Parts quoted
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                      <div className="font-['Inter'] font-bold text-white mb-0.5" style={{ fontSize: '20px' }}>
                        4.9★
                      </div>
                      <div className="font-['Roboto'] text-white/70" style={{ fontSize: '12px' }}>
                        Average rating
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-['Inter'] font-semibold text-[#0F172A] mb-4" style={{ fontSize: '40px', lineHeight: 1.2 }}>
              Our Values
            </h2>
            <p className="font-['Roboto'] text-[#64748B] max-w-2xl mx-auto" style={{ fontSize: '18px', lineHeight: 1.6 }}>
              These principles guide everything we do at PartsQuote
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="relative group">
                  <div 
                    className="absolute inset-0 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle, ${value.color}30, transparent)` }}
                  ></div>
                  <Card className="relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-0 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] h-full">
                    <div 
                      className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                      style={{ backgroundColor: value.color }}
                    ></div>
                    <CardContent className="p-6 text-center relative z-10">
                      <div className="relative inline-block mb-4">
                        <div 
                          className="absolute inset-0 rounded-xl blur-lg opacity-50"
                          style={{ backgroundColor: value.color }}
                        ></div>
                        <div 
                          className="relative w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: value.color }}
                        >
                          <Icon className="h-7 w-7 text-white" strokeWidth={2.5} />
                        </div>
                      </div>
                      <h3 className="font-['Inter'] font-semibold text-white mb-2" style={{ fontSize: '20px', lineHeight: 1.3 }}>
                        {value.title}
                      </h3>
                      <p className="font-['Roboto'] text-white/80" style={{ fontSize: '15px', lineHeight: 1.6 }}>
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-['Inter'] font-semibold text-[#0F172A] mb-4" style={{ fontSize: '40px', lineHeight: 1.2 }}>
              Meet Our Team
            </h2>
            <p className="font-['Roboto'] text-[#64748B] max-w-2xl mx-auto" style={{ fontSize: '18px', lineHeight: 1.6 }}>
              Passionate experts dedicated to revolutionizing the car parts marketplace
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="relative group">
                <Card className="relative bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] h-full">
                  <CardContent className="p-6 text-center relative z-10">
                    <div className="relative inline-block mb-4">
                      <div className="relative w-28 h-28 rounded-2xl overflow-hidden ring-2 ring-[#E5E7EB]">
                        <ImageWithFallback
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="font-['Inter'] font-semibold text-[#0F172A] mb-1" style={{ fontSize: '18px', lineHeight: 1.3 }}>
                      {member.name}
                    </h3>
                    <p className="font-['Roboto'] font-medium text-[#EF4444] mb-3" style={{ fontSize: '13px' }}>
                      {member.role}
                    </p>
                    <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '13px', lineHeight: 1.6 }}>
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline - Our Journey */}
      <section className="py-20 bg-[#F8FAFC] relative">
        {/* Subtle mesh background */}
        <div className="absolute inset-0 bg-white"></div>
        
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-white border border-[#E5E7EB] text-[#64748B] rounded-full px-4 py-2 mb-4">
              <span className="font-['Roboto'] font-medium" style={{ fontSize: '14px' }}>About</span>
            </Badge>
            <h2 className="font-['Inter'] font-semibold text-[#0F172A] mb-3" style={{ fontSize: '40px', lineHeight: 1.2 }}>
              Our Journey
            </h2>
            <p className="font-['Roboto'] text-[#64748B] max-w-2xl mx-auto" style={{ fontSize: '18px', lineHeight: 1.6 }}>
              Key milestones that shaped PartsQuote.
            </p>
          </div>

          {/* Sticky Year Chips */}
          <div className="sticky top-20 z-30 mb-12 bg-[#FEE2E2]/90 backdrop-blur-xl py-4 -mx-6 px-6 border-y border-[#FECACA]/50">
            <div className="flex gap-3 justify-center flex-wrap">
              {milestones.map((milestone) => (
                <button
                  key={milestone.year}
                  onClick={() => scrollToYear(milestone.year)}
                  className={`px-8 py-2 rounded-full font-['Inter'] font-medium transition-all ${
                    activeYear === milestone.year
                      ? 'bg-[#EF4444] text-white shadow-lg shadow-[#EF4444]/30'
                      : 'bg-white text-[#64748B] border border-[#FECACA] hover:border-[#EF4444] hover:text-[#EF4444] hover:bg-white/80'
                  }`}
                  style={{ fontSize: '14px', minHeight: '44px' }}
                >
                  {milestone.year}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline with Side Rail */}
          <div className="relative" ref={timelineRef}>
            {/* Alternating Timeline Cards */}
            <div className="space-y-16">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                const isLeft = index % 2 === 0;

                return (
                  <div
                    key={milestone.year}
                    ref={(el) => {
                      milestoneRefs.current[milestone.year] = el;
                    }}
                    className={`grid lg:grid-cols-2 gap-8 items-center ${!isLeft ? 'lg:flex-row-reverse' : ''}`}
                  >
                    {/* Content Card */}
                    <div className={`${!isLeft ? 'lg:order-2' : ''}`}>
                      <Card className="bg-white border-0 rounded-[16px] hover:shadow-lg transition-all duration-300">
                        <div className="p-6 md:p-8">
                          {/* Year Chip */}
                          <Badge className="bg-[#FEE2E2] text-[#EF4444] border-0 rounded-full px-4 py-2 mb-4">
                            <span className="font-['Inter'] font-semibold text-[#F02801]" style={{ fontSize: '14px' }}>{milestone.year}</span>
                          </Badge>

                          {/* Title */}
                          <h3 className="font-['Inter'] font-semibold text-[#0F172A] mb-3" style={{ fontSize: '22px', lineHeight: 1.3 }}>
                            {milestone.title}
                          </h3>

                          {/* Description */}
                          <p className="font-['Roboto'] text-[#64748B] mb-4" style={{ fontSize: '16px', lineHeight: 1.6 }}>
                            {milestone.description}
                          </p>

                          {/* Evidence Row */}
                          <div className="flex items-center gap-4 pt-4 border-t border-[#E5E7EB]">
                            {milestone.stat && (
                              <div className="flex items-center gap-2 bg-[#F8FAFC] rounded-lg px-3 py-2">
                                <Icon className="h-4 w-4 text-[#EF4444]" />
                                <div>
                                  <div className="font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: '16px' }}>
                                    {milestone.stat.value}
                                  </div>
                                  <div className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '11px' }}>
                                    {milestone.stat.label}
                                  </div>
                                </div>
                              </div>
                            )}
                            {milestone.location && (
                              <div className="flex items-center gap-1 text-[#64748B]">
                                <MapPin className="h-3.5 w-3.5" />
                                <span className="font-['Roboto']" style={{ fontSize: '12px' }}>{milestone.location}</span>
                              </div>
                            )}
                            {/* Meta */}
                            <div className="ml-auto font-['Roboto'] text-[#94A3B8]" style={{ fontSize: '12px' }}>
                              Verified stat • {milestone.month} {milestone.year}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Media Slot */}
                    <div className={`${!isLeft ? 'lg:order-1' : ''}`}>
                      <div className="relative group aspect-video rounded-[16px] overflow-hidden shadow-lg">
                        <ImageWithFallback
                          src={milestone.image}
                          alt={milestone.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Play Overlay */}
                        <div className="absolute inset-0 bg-[#0F172A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                            <Play className="h-8 w-8 text-[#EF4444] ml-1" fill="#EF4444" />
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>
                );
              })}
            </div>
          </div>

          {/* Press Strip */}
          <div className="mt-16">
            <p className="font-['Roboto'] text-[#64748B] text-center mb-6" style={{ fontSize: '14px' }}>
              Featured in
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {['BBC', 'Guardian', 'Telegraph', 'AutoExpress', 'WhatCar?', 'Autotrader'].map((logo, idx) => (
                <div
                  key={idx}
                  className="group relative bg-white rounded-xl border-2 border-[#E5E7EB] hover:border-[#EF4444] transition-all duration-300 p-6 flex items-center justify-center min-h-[100px] cursor-pointer hover:shadow-lg hover:shadow-[#EF4444]/10"
                >
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#EF4444]/0 to-[#EF4444]/0 group-hover:from-[#EF4444]/5 group-hover:to-[#EF4444]/0 rounded-xl transition-all duration-300"></div>
                  
                  <span className="relative font-['Inter'] font-bold text-[#64748B] group-hover:text-[#EF4444] transition-colors duration-300" style={{ fontSize: '16px' }}>
                    {logo}
                  </span>
                </div>
              ))}
            </div>
          </div>


        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="font-['Inter'] font-bold text-white mb-6" style={{ fontSize: '40px', lineHeight: 1.2 }}>
            Join Our Mission
          </h2>
          <p className="font-['Roboto'] text-[#94A3B8] mb-8 max-w-2xl mx-auto" style={{ fontSize: '20px', lineHeight: 1.6 }}>
            Whether you're a driver looking for parts or a supplier ready to grow, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setRegistrationDialogOpen(true)}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold px-8 py-6 rounded-full transition-all text-lg h-auto shadow-lg shadow-[#EF4444]/30"
            >
              Find Parts
            </Button>
            <Button
              onClick={() => onNavigate("supplier-onboarding")}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold px-8 py-6 rounded-full shadow-lg shadow-[#EF4444]/30 transition-all text-lg h-auto"
            >
              Become a Supplier
            </Button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />

      {/* Vehicle Registration Dialog */}
      <Dialog open={registrationDialogOpen} onOpenChange={setRegistrationDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-white rounded-[24px] border-0 shadow-2xl">
          <div className="p-8">
            <DialogHeader className="space-y-2 mb-6">
              <DialogTitle className="font-['Inter'] font-bold text-[#0F172A]" style={{ fontSize: '28px', lineHeight: 1.2 }}>
                Get Started
              </DialogTitle>
              <DialogDescription className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '16px', lineHeight: 1.6 }}>
                Enter your vehicle registration to find the best quotes from trusted suppliers
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Registration Number Input */}
              <div>
                <label className="block mb-3 font-['Roboto'] font-medium text-[#475569]" style={{ fontSize: '14px' }}>
                  Vehicle Registration Number
                </label>
                <Input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                    setRegistrationNumber(value);
                  }}
                  placeholder="E.G. AB12 CDE"
                  maxLength={8}
                  className="h-14 text-center rounded-2xl border-2 border-[#CBD5E1] bg-white hover:border-[#94A3B8] focus:border-[#EF4444] focus:ring-4 focus:ring-[#EF4444]/20 transition-all duration-200 font-['Roboto'] font-semibold tracking-wider text-[#0F172A] uppercase placeholder:text-[#94A3B8]"
                  style={{ fontSize: '18px', letterSpacing: '0.2em' }}
                />
              </div>

              {/* Postcode Input */}
              <div>
                <label className="block mb-3 font-['Roboto'] font-medium text-[#475569]" style={{ fontSize: '14px' }}>
                  Your Postcode
                </label>
                <Input
                  type="text"
                  value={postcode}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
                    setPostcode(value);
                  }}
                  placeholder="E.G. SW1A 1AA"
                  maxLength={8}
                  className="h-14 text-center rounded-2xl border-2 border-[#CBD5E1] bg-white hover:border-[#94A3B8] focus:border-[#EF4444] focus:ring-4 focus:ring-[#EF4444]/20 transition-all duration-200 font-['Roboto'] text-[#0F172A] uppercase placeholder:text-[#94A3B8]"
                  style={{ fontSize: '16px' }}
                />
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => {
                  if (registrationNumber.length >= 6 && postcode.length >= 5) {
                    setRegistrationDialogOpen(false);
                    onNavigate("cart");
                  }
                }}
                disabled={registrationNumber.length < 6 || postcode.length < 5}
                className="w-full h-14 rounded-full font-['Roboto'] font-bold bg-gradient-to-r from-[#EF4444] to-[#FF5C39] hover:from-[#D22301] hover:to-[#EF4444] text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider shadow-lg shadow-[#EF4444]/30 hover:shadow-xl hover:shadow-[#EF4444]/40"
                style={{ fontSize: '16px' }}
              >
                Continue
              </Button>

              {/* Help Text */}
              <p className="text-center font-['Roboto'] text-[#94A3B8]" style={{ fontSize: '13px', lineHeight: 1.5 }}>
                We'll use your registration to identify your vehicle and find the best parts for you.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
