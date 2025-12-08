import { useState } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { 
  Search, 
  MessageSquare, 
  CheckCircle, 
  Car, 
  Clock,
  Users,
  Star,
  TrendingUp,
  Play,
  Shield,
  Package,
  HeadphonesIcon,
  Lock,
  FileText,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Mail,
  Link as LinkIcon,
  ClipboardList,
  Wrench,
  BadgeCheck
} from "lucide-react";

interface HowItWorksPageProps {
  onNavigate: (page: string) => void;
}

export function HowItWorksPage({ onNavigate }: HowItWorksPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Getting started");
  const [selectedTopic, setSelectedTopic] = useState("Popular");
  const [expandAll, setExpandAll] = useState(false);
  const [helpfulAnswers, setHelpfulAnswers] = useState<Record<string, boolean | null>>({});

  const steps = [
    {
      number: "01",
      icon: ClipboardList,
      title: "Enter Vehicle Details",
      description: "Use your reg or select make/model/year. We auto-detect fitment.",
      checklist: [
        "UK reg lookup (e.g., AB12 CDE)",
        "Manual make/model/year selection",
        "Automatic fitment verification"
      ],
      color: "#EF4444",
      bgColor: "#FEE2E2",
      bgImage: "https://images.unsplash.com/photo-1609465397944-be1ce3ebda61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBkYXNoYm9hcmQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTkzMjExODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      number: "02",
      icon: Wrench,
      title: "Describe the Part",
      description: "Pick a category or search by name/part number. Add notes or photos.",
      checklist: [
        "Browse by category or search",
        "Add photos or technical details",
        "Specify new, used, or OEM"
      ],
      color: "#EF4444",
      bgColor: "#FEE2E2",
      bgImage: "https://images.unsplash.com/photo-1653491887161-aaf72d4514f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBlbmdpbmUlMjBkZXRhaWx8ZW58MXx8fHwxNzU5NDAzNjUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      number: "03",
      icon: BadgeCheck,
      title: "Compare & Book",
      description: "Get quotes, chat securely, accept one, and schedule delivery or collection.",
      checklist: [
        "Compare quotes side-by-side",
        "Message suppliers directly",
        "Book delivery or collection"
      ],
      color: "#EF4444",
      bgColor: "#FEE2E2",
      bgImage: "https://images.unsplash.com/photo-1758563920433-027318cc48a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBicmFrZSUyMHBhcnRzfGVufDF8fHx8MTc1OTM4ODI2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  const kpis = [
    {
      icon: Clock,
      value: "~9 min",
      label: "First quote",
      color: "#EF4444",
      bgColor: "#FEE2E2",
    },
    {
      icon: Users,
      value: "2,500+",
      label: "Verified suppliers",
      color: "#22C55E",
      bgColor: "#DCFCE7",
    },
    {
      icon: Star,
      value: "4.9★",
      label: "Average rating",
      color: "#F59E0B",
      bgColor: "#FEF3C7",
    },
    {
      icon: TrendingUp,
      value: "100K+",
      label: "Parts quoted",
      color: "#3B82F6",
      bgColor: "#DBEAFE",
    },
  ];

  const topics = [
    "Popular",
    "Getting started",
    "Quotes",
    "Delivery",
    "Payments",
    "Warranty",
    "Privacy"
  ];

  const categories = [
    { id: "getting-started", label: "Getting started", icon: Play },
    { id: "parts-fitment", label: "Parts & fitment", icon: Package },
    { id: "quotes-messaging", label: "Quotes & messaging", icon: MessageSquare },
    { id: "delivery-collection", label: "Delivery & collection", icon: Car },
    { id: "payments-refunds", label: "Payments & refunds", icon: Shield },
    { id: "warranty-returns", label: "Warranty & returns", icon: CheckCircle },
    { id: "account-privacy", label: "Account & privacy", icon: Lock }
  ];

  const featuredFAQs = [
    {
      question: "Is it free to request quotes?",
      answer: "Yes! Requesting quotes is completely free. You only pay when you accept a quote."
    },
    {
      question: "How long do I wait for quotes?",
      answer: "Most requests receive their first quote within 9 minutes on average."
    },
    {
      question: "Can I choose used or new parts?",
      answer: "Absolutely! Specify your preference when creating a request."
    }
  ];

  const faqsByCategory: Record<string, Array<{
    question: string;
    answer: string;
    callout?: { type: 'info' | 'warning'; text: string };
  }>> = {
    "Getting started": [
      {
        question: "Is it free to request quotes?",
        answer: "Yes, absolutely! Requesting quotes on PartsQuote is completely free for drivers. You only pay when you accept a quote and purchase a part from a supplier. There are no hidden fees or subscription costs.",
        callout: {
          type: 'info',
          text: "Pro tip: The more detailed your request, the more accurate quotes you'll receive."
        }
      },
      {
        question: "Do I need to create an account?",
        answer: "While you can browse without an account, creating one allows you to save requests, track quotes, and message suppliers directly. Sign up takes less than 60 seconds."
      },
      {
        question: "What information do I need to provide?",
        answer: "You'll need your vehicle registration or make/model/year, plus details about the part you need. Photos are optional but help suppliers provide accurate quotes."
      }
    ],
    "Parts & fitment": [
      {
        question: "Can I request used or new parts?",
        answer: "You can request both! When describing your part requirement, you can specify whether you need new, used, or OEM parts. Suppliers will indicate the condition in their quotes, along with warranty information."
      },
      {
        question: "How do I know the part will fit my car?",
        answer: "We use your registration or vehicle details to auto-verify fitment. Suppliers also check compatibility before quoting. If unsure, message the supplier directly before accepting."
      },
      {
        question: "What if I'm not sure which part I need?",
        answer: "Describe the problem or symptoms in your request. Many suppliers can diagnose the issue and suggest the right part. You can also upload photos to help."
      }
    ],
    "Quotes & messaging": [
      {
        question: "How long does it take to receive quotes?",
        answer: "Most requests receive their first quote within 9 minutes on average. You'll typically receive 3-8 quotes within the first hour, though this varies by part and location."
      },
      {
        question: "Can I negotiate prices?",
        answer: "Yes! Use our secure messaging system to discuss pricing, delivery options, or part condition with suppliers. Many are happy to negotiate, especially for bulk orders."
      },
      {
        question: "What if I receive no quotes?",
        answer: "This is rare but can happen for very specialist parts. Try broadening your search area or consider alternative part numbers. Our support team can also help find suppliers."
      }
    ],
    "Delivery & collection": [
      {
        question: "What are typical delivery times?",
        answer: "Delivery times vary by supplier and part availability. Most suppliers offer next-day or 2-3 day delivery options. You'll see estimated delivery times in each quote before accepting. Many also offer collection from their premises.",
        callout: {
          type: 'info',
          text: "Express delivery is available from select suppliers for urgent requests."
        }
      },
      {
        question: "Can I collect parts in person?",
        answer: "Many suppliers offer free collection from their premises. Check the delivery options in each quote to see if collection is available."
      },
      {
        question: "Do delivery costs vary?",
        answer: "Yes, delivery charges depend on the supplier, part size, and your location. All costs are clearly shown in the quote before you accept."
      }
    ],
    "Payments & refunds": [
      {
        question: "When do I pay?",
        answer: "Payment is handled directly with the supplier after you accept their quote. Most accept card payments, bank transfer, or PayPal. Payment terms are confirmed during checkout."
      },
      {
        question: "Are payments secure?",
        answer: "All suppliers on our platform must meet strict security standards. We recommend using secure payment methods like card or PayPal for buyer protection."
      },
      {
        question: "What's your refund policy?",
        answer: "Refund policies are set by individual suppliers and displayed in their quotes. Most offer returns within 14-30 days for unused parts. Always check the supplier's policy before accepting."
      }
    ],
    "Warranty & returns": [
      {
        question: "What warranty do parts come with?",
        answer: "Warranty terms are provided by individual suppliers and displayed in each quote. Most new parts come with 12-month warranties, while used parts typically have 30-90 day warranties. Always check the warranty details before accepting a quote.",
        callout: {
          type: 'warning',
          text: "Keep your purchase receipt and warranty documentation safe."
        }
      },
      {
        question: "Can I return a part if it doesn't fit?",
        answer: "Return policies vary by supplier. Most accept returns of unused parts within 14-30 days. Check the supplier's return policy in their quote before purchasing."
      },
      {
        question: "What if the part arrives damaged?",
        answer: "Contact the supplier immediately with photos. Most will arrange collection and replacement at no extra cost. Our support team can help resolve any issues."
      }
    ],
    "Account & privacy": [
      {
        question: "How is my data protected?",
        answer: "We take your privacy seriously and are fully GDPR compliant. Your vehicle and contact details are only shared with suppliers when you request a quote. We never sell your data to third parties. Read our full Privacy Policy for more information."
      },
      {
        question: "Can I delete my account?",
        answer: "Yes, you can delete your account at any time from your settings. All your data will be permanently removed within 30 days, except where required by law."
      },
      {
        question: "Who can see my requests?",
        answer: "Only verified suppliers in your selected location can see your requests. Your personal details are never publicly visible."
      }
    ]
  };

  const currentFAQs = faqsByCategory[selectedCategory] || faqsByCategory["Getting started"];

  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={onNavigate} currentPage="how-it-works" />

      {/* Hero Section */}
      <section className="relative bg-white pt-24 pb-16 overflow-hidden border-b border-[#E5E7EB]">
        <div 
          className="absolute inset-0 opacity-30"
          style={{ 
            backgroundImage: `url(https://images.unsplash.com/photo-1734530901192-4b7217b00724?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBwYXJ0cyUyMGVuZ2luZXxlbnwxfHx8fDE3NTk0MDA2ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.8)'
          }}
        />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-[#FEE2E2] text-[#EF4444] border-0 rounded-full px-4 py-2 mb-6">
              </Badge>
              
              <h1 className="font-['Inter'] font-bold text-[#0F172A] mb-6" style={{ fontSize: '48px', lineHeight: 1.2 }}>
                Get the Right Part in 3 Steps
              </h1>
              
              <p className="font-['Roboto'] text-[#64748B] mb-8" style={{ fontSize: '18px', lineHeight: 1.6 }}>
                Use your reg or vehicle details, compare quotes, and book—fast.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => onNavigate("vehicle-confirmation")}
                  className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold px-8 py-6 rounded-full shadow-lg shadow-[#EF4444]/30 transition-all h-auto"
                >
                  Start your request
                </Button>
              </div>
            </div>

            {/* Right Side Illustration */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-br from-[#EF4444]/10 to-[#F59E0B]/10 rounded-3xl blur-3xl"></div>
                <Card className="relative bg-white border-2 border-[#E5E7EB] rounded-3xl overflow-hidden">
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section - Zigzag */}
      {/* Steps Section - Horizontal Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* 3 Cards in One Row */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <Card 
                  key={index}
                  className="border border-[#E5E7EB] overflow-hidden transition-all duration-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] flex flex-col relative h-full min-h-[420px]"
                  style={{ 
                    borderRadius: '16px',
                    backgroundImage: `url(${step.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/85 via-[#0F172A]/75 to-[#EF4444]/60 z-10"></div>

                  {/* Content */}
                  <CardContent className="p-6 flex-1 flex flex-col relative z-20 justify-center text-center items-center">
                    <h3 className="font-['Inter'] font-semibold text-white mb-3" style={{ fontSize: '20px', lineHeight: 1.3 }}>
                      {step.title}
                    </h3>
                    
                    <p className="font-['Roboto'] text-white/90 mb-4" style={{ fontSize: '14px', lineHeight: 1.6 }}>
                      {step.description}
                    </p>
                    
                    {/* Mini Checklist */}
                    <div className="space-y-2.5 w-full">
                      {step.checklist.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 justify-center">
                          <div className="w-4 h-4 rounded-full bg-[#22C55E] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-white fill-white" />
                          </div>
                          <span className="font-['Roboto'] text-white text-left" style={{ fontSize: '13px', lineHeight: 1.5 }}>
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Micro-Demo Strip (after all 3 steps) */}
          <div className="mt-12">
            <Card 
              className="bg-white border border-[#E5E7EB] overflow-hidden transition-all duration-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)]"
              style={{ borderRadius: '16px' }}
            >
              <CardContent className="py-6 md:py-8 lg:py-10 px-0 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
                <div className="max-w-[1200px] mx-auto px-6">
                  <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
                    {/* Left: Title + Copy + CTAs */}
                    <div className="flex flex-col justify-center h-full">
                      {/* H2 Title */}
                      <h2 className="font-['Inter'] font-semibold text-white mb-3" style={{ fontSize: '40px', lineHeight: 1.2 }}>
                        See it in 60 seconds
                      </h2>

                      {/* Subcopy */}
                      <p className="font-['Roboto'] text-white/70 mb-6" style={{ fontSize: '18px', lineHeight: 1.6 }}>
                        Request, compare quotes, then chat & book—here's the flow.
                      </p>

                      {/* CTA Group */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold px-10 py-5 rounded-full transition-all duration-200 h-auto min-h-[60px] shadow-lg shadow-[#EF4444]/30 focus:ring-2 focus:ring-[#EF4444] focus:ring-offset-2"
                          style={{ fontSize: '19px' }}
                        >
                          <Play className="h-6 w-6 mr-2" />
                          Play demo
                        </Button>
                      </div>
                    </div>

                    {/* Right: Car Image */}
                    <div className="relative flex items-center justify-center h-full">
                      <div className="relative w-full max-w-lg mx-auto">
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#EF4444]/30 to-[#F59E0B]/30 rounded-3xl blur-3xl"></div>
                        
                        {/* Car Image */}
                        <div className="relative overflow-hidden rounded-2xl py-8">
                          <img 
                            src="https://images.unsplash.com/photo-1730542254054-b13c967dad56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBzaWRlJTIwdmlld3xlbnwxfHx8fDE3NTkzNjA2NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                            alt="Car demonstration"
                            className="w-full h-auto object-cover rounded-[20px]"
                          />
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Bar - KPI Cards */}
      <section className="py-16 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Section Heading */}
          <div className="mb-10">
            <h2 className="font-['Inter'] font-semibold text-[#0F172A] mb-2" style={{ fontSize: '36px', lineHeight: 1.2 }}>
              Trusted by thousands
            </h2>
            <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '18px', lineHeight: 1.6 }}>
              Join the UK's fastest-growing car parts marketplace
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon;
              return (
                <div 
                  key={index} 
                  className="relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 group"
                  style={{ 
                    background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
                  }}
                >
                  {/* Background Icon */}
                  <div className="absolute top-2 right-2 opacity-50 group-hover:opacity-70 transition-opacity">
                    <Icon className="h-20 w-20 text-[#EF4444]" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 4px 8px rgba(239, 68, 68, 0.3))' }} />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md bg-[#EF4444]"
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="font-['Inter'] font-bold text-white mb-1" style={{ fontSize: '32px', lineHeight: 1 }}>
                      {kpi.value}
                    </div>
                    <p className="font-['Roboto'] font-medium text-white/70" style={{ fontSize: '13px' }}>
                      {kpi.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Help Centre / FAQ */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="bg-[#EF4444]/10 text-[#EF4444] border-0 rounded-full px-4 py-2 mb-4">
              <span className="font-['Roboto'] font-medium" style={{ fontSize: '13px' }}>Help & FAQs</span>
            </Badge>
            <h2 className="font-['Inter'] font-semibold text-[#0F172A] mb-3" style={{ fontSize: '36px', lineHeight: 1.2 }}>
              Frequently Asked Questions
            </h2>
            <p className="font-['Roboto'] text-[#64748B] mb-6" style={{ fontSize: '18px', lineHeight: 1.6 }}>
              Find answers fast or contact our team.
            </p>

            {/* Search Bar */}
            <div className="max-w-[720px] mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]" />
                <Input
                  type="text"
                  placeholder="Search FAQs (e.g., delivery, warranty, used parts)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 pr-4 font-['Roboto'] text-[#0F172A] border-[#E5E7EB] rounded-[14px] focus:ring-2 focus:ring-[#EF4444] focus:border-[#EF4444]"
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>

            {/* Topic Chips */}
            <div className="flex gap-2 justify-center flex-wrap md:flex-nowrap overflow-x-auto scrollbar-hide pb-2">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-4 py-2 rounded-full font-['Roboto'] font-medium transition-all whitespace-nowrap ${
                    selectedTopic === topic
                      ? 'bg-[#EF4444] text-white shadow-md'
                      : 'bg-white text-[#64748B] border border-[#E5E7EB] hover:border-[#EF4444] hover:text-[#EF4444]'
                  }`}
                  style={{ fontSize: '14px', minHeight: '44px' }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mt-12">
            <div className="space-y-8">
              {/* Expand/Collapse Control */}
              <div className="flex justify-end">
                <button
                  onClick={() => setExpandAll(!expandAll)}
                  className="font-['Roboto'] font-medium text-[#EF4444] hover:text-[#DC2626] transition-colors"
                  style={{ fontSize: '14px' }}
                >
                  {expandAll ? 'Collapse all' : 'Expand all'}
                </button>
              </div>

              {/* FAQ Accordion */}
              <div className="space-y-4">
                {currentFAQs.map((faq, index) => {
                  const itemId = `faq-${selectedCategory}-${index}`;
                  const isHelpful = helpfulAnswers[itemId];

                  return (
                    <Card
                      key={index}
                      className="bg-white border border-[#E5E7EB] rounded-[16px] hover:shadow-md transition-all group"
                    >
                      <Accordion type="single" collapsible defaultValue={expandAll ? itemId : undefined}>
                        <AccordionItem value={itemId} className="border-0">
                          <AccordionTrigger className="px-6 py-5 hover:no-underline group/trigger">
                            <div className="flex items-center justify-between w-full pr-4">
                              <span className="font-['Inter'] font-semibold text-[#0F172A] group-hover/trigger:text-[#EF4444] transition-colors text-left" style={{ fontSize: '16px', lineHeight: 1.4 }}>
                                {faq.question}
                              </span>
                              <span
                                className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 cursor-pointer"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    await navigator.clipboard.writeText(window.location.href + '#' + itemId);
                                  } catch (err) {
                                    // Silently fail if clipboard is not available
                                    console.log('Clipboard not available');
                                  }
                                }}
                              >
                                <LinkIcon className="h-4 w-4 text-[#64748B] hover:text-[#EF4444]" />
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="space-y-4">
                              <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '16px', lineHeight: 1.6 }}>
                                {faq.answer}
                              </p>

                              {/* Callout */}
                              {faq.callout && (
                                <div
                                  className={`flex items-start gap-3 p-4 rounded-lg ${
                                    faq.callout.type === 'info'
                                      ? 'bg-[#EFF6FF] border border-[#BFDBFE]'
                                      : 'bg-[#FEF3C7] border border-[#FDE68A]'
                                  }`}
                                >
                                  <AlertCircle
                                    className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                                      faq.callout.type === 'info' ? 'text-[#3B82F6]' : 'text-[#F59E0B]'
                                    }`}
                                  />
                                  <p
                                    className={`font-['Roboto'] ${
                                      faq.callout.type === 'info' ? 'text-[#1E40AF]' : 'text-[#92400E]'
                                    }`}
                                    style={{ fontSize: '14px', lineHeight: 1.5 }}
                                  >
                                    {faq.callout.text}
                                  </p>
                                </div>
                              )}

                              {/* Helpfulness Controls */}
                              <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                                <div className="flex items-center gap-2">
                                  <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '14px' }}>
                                    Was this helpful?
                                  </span>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setHelpfulAnswers({ ...helpfulAnswers, [itemId]: true })}
                                      className={`px-3 py-1.5 rounded-full font-['Roboto'] font-medium transition-all flex items-center gap-1 ${
                                        isHelpful === true
                                          ? 'bg-[#EF4444] text-white'
                                          : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E5E7EB]'
                                      }`}
                                      style={{ fontSize: '13px', minHeight: '32px' }}
                                    >
                                      <ThumbsUp className="h-3.5 w-3.5" />
                                      Yes
                                    </button>
                                    <button
                                      onClick={() => setHelpfulAnswers({ ...helpfulAnswers, [itemId]: false })}
                                      className={`px-3 py-1.5 rounded-full font-['Roboto'] font-medium transition-all flex items-center gap-1 ${
                                        isHelpful === false
                                          ? 'bg-[#64748B] text-white'
                                          : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E5E7EB]'
                                      }`}
                                      style={{ fontSize: '13px', minHeight: '32px' }}
                                    >
                                      <ThumbsDown className="h-3.5 w-3.5" />
                                      No
                                    </button>
                                  </div>
                                </div>
                                <button
                                  className="font-['Roboto'] text-[#64748B] hover:text-[#EF4444] transition-colors"
                                  style={{ fontSize: '13px' }}
                                >
                                  Report an issue
                                </button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </Card>
                  );
                })}
              </div>

              {/* Contact CTA */}
              <Card
                className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-0 rounded-[16px]"
              >
                <CardContent className="p-8 text-center">
                  <h3 className="font-['Inter'] font-semibold text-white mb-2" style={{ fontSize: '24px', lineHeight: 1.3 }}>
                    Need more help?
                  </h3>
                  <p className="font-['Roboto'] text-white/70 mb-6" style={{ fontSize: '16px', lineHeight: 1.6 }}>
                    Chat with support or send us a message.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold px-6 py-3 rounded-full transition-all h-auto min-h-[48px] shadow-lg shadow-[#EF4444]/30"
                      style={{ fontSize: '16px' }}
                    >
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Start chat
                    </Button>
                    <Button
                      onClick={() => onNavigate("contact")}
                      className="border-2 border-white text-white hover:bg-white hover:text-[#0F172A] font-['Roboto'] font-semibold px-6 py-3 rounded-full transition-all h-auto min-h-[48px] bg-transparent"
                      style={{ fontSize: '16px' }}
                    >
                      <Mail className="h-5 w-5 mr-2" />
                      Email support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile Category Chips */}
          <div className="lg:hidden flex gap-2 overflow-x-auto scrollbar-hide pb-2 mt-8">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.label;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.label)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-['Roboto'] font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#EF4444] text-white shadow-md'
                      : 'bg-white text-[#64748B] border border-[#E5E7EB] hover:border-[#EF4444]'
                  }`}
                  style={{ fontSize: '14px', minHeight: '44px' }}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Panel */}
      <section className="py-20 bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="font-['Inter'] font-bold text-[#0F172A] mb-4" style={{ fontSize: '40px', lineHeight: 1.2 }}>
            Ready to find your part?
          </h2>
          <p className="font-['Roboto'] text-[#64748B] max-w-2xl mx-auto mb-8" style={{ fontSize: '18px', lineHeight: 1.6 }}>
            Join thousands of UK drivers who save time and money on car parts with PartsQuote
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate("")}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold px-12 py-6 rounded-full shadow-lg shadow-[#EF4444]/30 transition-all h-auto"
            >
              Start request
            </Button>
            <Button
              onClick={() => onNavigate("supplier-onboarding")}
              variant="outline"
              className="border-2 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white font-['Roboto'] font-semibold px-12 py-6 rounded-full transition-all h-auto"
            >
              Become a supplier
            </Button>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}