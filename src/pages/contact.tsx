import { useState } from "react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Copy, Navigation, Info, Upload, X, MessageCircle, ExternalLink, ArrowLeft } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ContactPageProps {
  onNavigate: (page: string) => void;
  onSignupClick?: () => void;
}

export function ContactPage({ onNavigate, onSignupClick }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    urgency: "normal",
    message: "",
    gdprConsent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.gdprConsent) {
      toast.error("Please agree to be contacted regarding your enquiry.");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Message sent successfully!");
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, JPG, and PNG files are allowed");
        return;
      }
      setUploadedFile(file);
      toast.success("File uploaded successfully");
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hello@partsquote.co.uk");
      toast.success("Email copied to clipboard");
    } catch (err) {
      // Fallback: just show the email in a toast
      toast.info("Email: hello@partsquote.co.uk");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      urgency: "normal",
      message: "",
      gdprConsent: false,
    });
    setUploadedFile(null);
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header onNavigate={onNavigate} currentPage="contact" onSignupClick={onSignupClick} />

      {/* Back Button Bar */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-6">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 py-4 text-[#64748B] hover:text-[#F02801] transition-colors duration-200 group"
          >
            <ArrowLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="font-['Roboto'] font-medium" style={{ fontSize: '15px' }}>
              Back to Home
            </span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section 
        className="relative pt-40 pb-32 overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1709715357479-591f9971fb05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHN1cHBvcnQlMjBvZmZpY2V8ZW58MXx8fHwxNzU5NzQzMjg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/95 via-[#1E293B]/90 to-[#0F172A]/95" />
        
        {/* Content */}
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <Badge className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full px-4 py-2 mb-6">
            <span className="font-['Inter'] font-medium" style={{ fontSize: '14px' }}>Support</span>
          </Badge>
          <h1 className="font-['Inter'] font-semibold text-white mb-4" style={{ fontSize: '56px', lineHeight: 1.2 }}>
            Contact Us
          </h1>
          <p className="font-['Roboto'] text-white/80 max-w-2xl" style={{ fontSize: '20px', lineHeight: 1.6 }}>
            We usually reply within a few hours. Choose the best way to reach us.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Contact Method Tiles - Horizontal at Top */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {/* Phone Tile */}
                <Card className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-0 rounded-[16px] hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#EF4444]/10 rounded-full blur-3xl"></div>
                  <CardContent className="p-8 relative z-10">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                      style={{ backgroundColor: '#EF4444' }}
                    >
                      <Phone className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-['Inter'] font-semibold text-white text-center mb-3" style={{ fontSize: '16px' }}>
                      Phone
                    </h3>
                    <p className="font-['Roboto'] text-white/80 text-center mb-6" style={{ fontSize: '15px' }}>
                      +44 20 1234 5678
                    </p>
                    <Button 
                      onClick={() => {
                        const text = '+44 20 1234 5678';
                        const textarea = document.createElement('textarea');
                        textarea.value = text;
                        textarea.style.position = 'fixed';
                        textarea.style.opacity = '0';
                        document.body.appendChild(textarea);
                        textarea.select();
                        try {
                          document.execCommand('copy');
                          toast.success('Phone number copied to clipboard');
                        } catch (err) {
                          toast.error('Failed to copy phone number');
                        }
                        document.body.removeChild(textarea);
                      }}
                      className="w-full bg-transparent border-2 border-white/20 text-white hover:bg-white/10 rounded-full h-auto py-3 flex items-center justify-center gap-2"
                      style={{ fontSize: '14px' }}
                    >
                      <Copy className="h-4.5 w-4.5" />
                      Copy number
                    </Button>
                  </CardContent>
                </Card>

                {/* Email Tile */}
                <Card className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-0 rounded-[16px] hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/10 rounded-full blur-3xl"></div>
                  <CardContent className="p-8 relative z-10">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                      style={{ backgroundColor: '#3B82F6' }}
                    >
                      <Mail className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-['Inter'] font-semibold text-white text-center mb-3" style={{ fontSize: '16px' }}>
                      Email
                    </h3>
                    <p className="font-['Roboto'] text-white/80 text-center mb-6" style={{ fontSize: '15px' }}>
                      hello@partsquote.co.uk
                    </p>
                    <Button 
                      onClick={copyEmail}
                      className="w-full border-2 border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full h-auto py-3"
                      style={{ fontSize: '14px' }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy email
                    </Button>
                  </CardContent>
                </Card>

                {/* Address Tile */}
                <Card className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-0 rounded-[16px] hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/10 rounded-full blur-3xl"></div>
                  <CardContent className="p-8 relative z-10">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                      style={{ backgroundColor: '#22C55E' }}
                    >
                      <MapPin className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="font-['Inter'] font-semibold text-white text-center mb-3" style={{ fontSize: '16px' }}>
                      Address
                    </h3>
                    <p className="font-['Roboto'] text-white/80 text-center mb-6" style={{ fontSize: '15px', lineHeight: 1.4 }}>
                      123 Auto Street, London EC1A 1BB
                    </p>
                    <Button 
                      onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=123+Auto+Street+London+EC1A+1BB', '_blank')}
                      className="w-full border-2 border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full h-auto py-3"
                      style={{ fontSize: '14px' }}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Get directions
                    </Button>
                  </CardContent>
                </Card>
          </div>

          {/* SLA Strip - Full Width */}
          <Card className="bg-white border border-[#E5E7EB] rounded-[16px] mb-12">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-['Inter'] font-semibold text-[#0F172A] mb-1" style={{ fontSize: '16px' }}>
                      Service Level Agreement
                    </h4>
                    <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '14px' }}>
                      Our commitment to you
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '14px' }}>Avg response:</span>
                    <Badge className="bg-[#F8FAFC] border border-[#E5E7EB] text-[#0F172A] rounded-full">
                      <Clock className="h-3 w-3 mr-1" />
                      <span className="font-['Roboto'] font-semibold" style={{ fontSize: '13px' }}>~2h</span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '14px' }}>Live chat:</span>
                    <Badge className="bg-[#F8FAFC] border border-[#E5E7EB] text-[#0F172A] rounded-full">
                      <MessageCircle className="h-3 w-3 mr-1" />
                      <span className="font-['Roboto'] font-semibold" style={{ fontSize: '13px' }}>9:00–18:00</span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '14px' }}>Emergency:</span>
                    <Badge className="bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-full">
                      <Phone className="h-3 w-3 mr-1" />
                      <span className="font-['Roboto'] font-semibold" style={{ fontSize: '13px' }}>24/7</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Message Form - Centered with Max Width */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-sm">
              <CardContent className="p-8 md:p-10">
                  {!isSuccess ? (
                    <>
                      <h2 className="font-['Inter'] font-semibold text-[#0F172A] mb-6" style={{ fontSize: '24px' }}>
                        Send Us a Message
                      </h2>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                          <Label htmlFor="name" className="font-['Roboto'] text-[#0F172A] mb-2 block">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="John Smith"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="font-['Roboto'] border-[#E5E7EB] rounded-[16px] h-12 focus:ring-2 focus:ring-[#EF4444]"
                            required
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <Label htmlFor="email" className="font-['Roboto'] text-[#0F172A] mb-2 block">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="font-['Roboto'] border-[#E5E7EB] rounded-[16px] h-12 focus:ring-2 focus:ring-[#EF4444]"
                            required
                          />
                        </div>

                        {/* Subject */}
                        <div>
                          <Label htmlFor="subject" className="font-['Roboto'] text-[#0F172A] mb-2 block">
                            Subject *
                          </Label>
                          <Select
                            value={formData.subject}
                            onValueChange={(value) => setFormData({ ...formData, subject: value })}
                            required
                          >
                            <SelectTrigger className="font-['Roboto'] border-[#E5E7EB] rounded-[16px] h-12">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="quotes">Quotes</SelectItem>
                              <SelectItem value="supplier-onboarding">Supplier Onboarding</SelectItem>
                              <SelectItem value="payments">Payments</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Urgency Segmented Control */}
                        <div>
                          <Label className="font-['Roboto'] text-[#0F172A] mb-2 block">
                            Urgency
                          </Label>
                          <div className="inline-flex rounded-full bg-[#F8FAFC] p-1 border border-[#E5E7EB]">
                            {['low', 'normal', 'high'].map((level) => (
                              <button
                                key={level}
                                type="button"
                                onClick={() => setFormData({ ...formData, urgency: level })}
                                className={`px-6 py-2 rounded-full font-['Roboto'] font-medium transition-all ${
                                  formData.urgency === level
                                    ? 'bg-white text-[#0F172A] shadow-sm'
                                    : 'text-[#64748B] hover:text-[#0F172A]'
                                }`}
                                style={{ fontSize: '14px', minHeight: '44px' }}
                              >
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Message */}
                        <div>
                          <Label htmlFor="message" className="font-['Roboto'] text-[#0F172A] mb-2 block">
                            Message *
                          </Label>
                          <Textarea
                            id="message"
                            placeholder="Tell us how we can help you..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="font-['Roboto'] border-[#E5E7EB] rounded-[16px] min-h-32 focus:ring-2 focus:ring-[#EF4444]"
                            rows={6}
                            required
                          />
                        </div>

                        {/* Attachment */}
                        <div>
                          <Label className="font-['Roboto'] text-[#0F172A] mb-2 block">
                            Attachment (optional)
                          </Label>
                          {!uploadedFile ? (
                            <label 
                              htmlFor="file-upload"
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#E5E7EB] rounded-[16px] cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                            >
                              <Upload className="h-8 w-8 text-[#64748B] mb-2" />
                              <p className="font-['Roboto'] text-[#64748B] mb-1" style={{ fontSize: '14px' }}>
                                Drop files here or click to upload
                              </p>
                              <p className="font-['Roboto'] text-[#94A3B8]" style={{ fontSize: '12px' }}>
                                PDF, JPG, PNG (max 10MB)
                              </p>
                              <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileUpload}
                              />
                            </label>
                          ) : (
                            <div className="flex items-center justify-between p-4 border border-[#E5E7EB] rounded-[16px] bg-[#F8FAFC]">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 flex items-center justify-center">
                                  <CheckCircle className="h-5 w-5 text-[#EF4444]" />
                                </div>
                                <div>
                                  <p className="font-['Roboto'] font-medium text-[#0F172A]" style={{ fontSize: '14px' }}>
                                    {uploadedFile.name}
                                  </p>
                                  <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '12px' }}>
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={removeFile}
                                className="p-2 hover:bg-white rounded-lg transition-colors"
                              >
                                <X className="h-4 w-4 text-[#64748B]" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* GDPR Checkbox */}
                        <div className="flex items-start gap-3 p-4 bg-[#F8FAFC] rounded-[16px]">
                          <Checkbox
                            id="gdpr"
                            checked={formData.gdprConsent}
                            onCheckedChange={(checked) => setFormData({ ...formData, gdprConsent: checked as boolean })}
                            className="mt-0.5"
                          />
                          <label htmlFor="gdpr" className="font-['Roboto'] text-[#64748B] cursor-pointer" style={{ fontSize: '13px', lineHeight: 1.5 }}>
                            I agree to be contacted regarding my enquiry. *
                          </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <Button
                            type="submit"
                            disabled={isSubmitting || !formData.gdprConsent}
                            className="flex-1 bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold px-8 py-3 rounded-full shadow-lg shadow-[#EF4444]/30 transition-all h-auto disabled:opacity-50"
                            style={{ fontSize: '16px' }}
                          >
                            {isSubmitting ? (
                              <>Sending...</>
                            ) : (
                              <>
                                <Send className="h-5 w-5 mr-2" />
                                Send message
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="border-2 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white font-['Roboto'] font-semibold px-8 py-3 rounded-full transition-all h-auto"
                            style={{ fontSize: '16px' }}
                          >
                            <MessageCircle className="h-5 w-5 mr-2" />
                            Open live chat
                          </Button>
                        </div>
                      </form>
                    </>
                  ) : (
                    // Success State
                    <div className="py-12 text-center">
                      <div className="w-20 h-20 rounded-full bg-[#22C55E]/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-[#22C55E]" />
                      </div>
                      <h3 className="font-['Inter'] font-semibold text-[#0F172A] mb-3" style={{ fontSize: '24px' }}>
                        Message Sent!
                      </h3>
                      <p className="font-['Roboto'] text-[#64748B] mb-8 max-w-md mx-auto" style={{ fontSize: '16px', lineHeight: 1.6 }}>
                        Thank you for contacting us. We've received your message and will respond within 2 hours during business hours.
                      </p>
                      <div className="space-y-3">
                        <Button
                          onClick={resetForm}
                          className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold px-8 py-3 rounded-full"
                          style={{ fontSize: '16px' }}
                        >
                          Send another message
                        </Button>
                        <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '14px' }}>
                          Reference number: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>

          {/* Map Strip */}
          <div className="mt-12">
            <Card className="bg-white border border-[#E5E7EB] rounded-[16px] overflow-hidden">
              <div className="grid md:grid-cols-2">
                {/* Map Placeholder */}
                <div className="h-80 bg-gradient-to-br from-[#F8FAFC] to-[#E5E7EB] flex items-center justify-center relative">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.4086349632494!2d-0.1277583!3d51.5074456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b900d26973%3A0x4291f3172409ea92!2sLondon%20EC1A%201BB!5e0!3m2!1sen!2suk!4v1234567890"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-white/90 backdrop-blur-sm border-0 text-[#0F172A] px-4 py-2">
                      <MapPin className="h-3.5 w-3.5 mr-1.5 text-[#EF4444]" />
                      <span className="font-['Roboto']" style={{ fontSize: '13px' }}>PartsQuote HQ — London</span>
                    </Badge>
                  </div>
                </div>

                {/* Location Details */}
                <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-8">
                  <h3 className="font-['Inter'] font-semibold text-white mb-4" style={{ fontSize: '20px' }}>
                    Visit Our Office
                  </h3>
                  <p className="font-['Roboto'] text-white/80 mb-6" style={{ fontSize: '16px', lineHeight: 1.6 }}>
                    123 Auto Street, London EC1A 1BB, United Kingdom
                  </p>

                  <div className="flex gap-3 mb-6">
                    <Button
                      className="border-2 border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full"
                      style={{ fontSize: '14px' }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Google Maps
                    </Button>
                    <Button
                      className="border-2 border-white/20 bg-transparent text-white hover:bg-white/10 rounded-full"
                      style={{ fontSize: '14px' }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apple Maps
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#22C55E] flex-shrink-0 mt-1" />
                      <p className="font-['Roboto'] text-white/80" style={{ fontSize: '14px' }}>
                        Free parking available
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#22C55E] flex-shrink-0 mt-1" />
                      <p className="font-['Roboto'] text-white/80" style={{ fontSize: '14px' }}>
                        Wheelchair accessible
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-[#22C55E] flex-shrink-0 mt-1" />
                      <p className="font-['Roboto'] text-white/80" style={{ fontSize: '14px' }}>
                        5 min walk from King's Cross Station
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>


        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6">
          <Card
            className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-0 rounded-[16px] shadow-2xl"
          >
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="font-['Inter'] font-semibold text-white mb-3" style={{ fontSize: '32px', lineHeight: 1.2 }}>
                Prefer to talk?
              </h2>
              <p className="font-['Roboto'] text-white/80 max-w-2xl mx-auto mb-8" style={{ fontSize: '18px', lineHeight: 1.6 }}>
                Our support team is available Mon–Fri, 9:00–18:00. Get instant help or schedule a call.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setIsChatOpen(true)}
                  className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-['Roboto'] font-semibold px-8 py-4 rounded-full transition-all h-auto shadow-lg shadow-[#EF4444]/30"
                  style={{ fontSize: '16px' }}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Start live chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />

      {/* Live Chat Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white border-0 rounded-[16px] p-0 overflow-hidden">
          <DialogHeader className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-6 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#F02801] flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="font-['Inter'] font-semibold text-white" style={{ fontSize: '18px' }}>
                    Live Chat Support
                  </DialogTitle>
                  <DialogDescription className="font-['Roboto'] text-white/70" style={{ fontSize: '14px' }}>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse"></span>
                      Online - Usually replies in ~2 minutes
                    </span>
                  </DialogDescription>
                </div>
              </div>
              <Button
                onClick={() => setIsChatOpen(false)}
                variant="ghost"
                className="w-8 h-8 p-0 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          {/* Chat Messages Area */}
          <div className="p-6 space-y-4 min-h-[300px] max-h-[400px] overflow-y-auto bg-[#F8FAFC]">
            {/* Support Message */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F02801] flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-[12px] p-4 shadow-sm border border-[#E5E7EB]">
                  <p className="font-['Roboto'] text-[#0F172A]" style={{ fontSize: '14px', lineHeight: 1.5 }}>
                    Hello! 👋 Welcome to PartsQuote support. How can we help you today?
                  </p>
                </div>
                <p className="font-['Roboto'] text-[#64748B] mt-1.5 ml-2" style={{ fontSize: '12px' }}>
                  Just now
                </p>
              </div>
            </div>

            {/* Quick Reply Options */}
            <div className="pl-11 space-y-2">
              <p className="font-['Roboto'] text-[#64748B]" style={{ fontSize: '13px' }}>
                Quick replies:
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setChatMessage("I need help with a quote")}
                  variant="outline"
                  className="border-2 border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9] hover:border-[#F02801] hover:text-[#F02801] rounded-full h-auto py-2 px-4 font-['Roboto']"
                  style={{ fontSize: '13px' }}
                >
                  Help with a quote
                </Button>
                <Button
                  onClick={() => setChatMessage("How do I track my order?")}
                  variant="outline"
                  className="border-2 border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9] hover:border-[#F02801] hover:text-[#F02801] rounded-full h-auto py-2 px-4 font-['Roboto']"
                  style={{ fontSize: '13px' }}
                >
                  Track order
                </Button>
                <Button
                  onClick={() => setChatMessage("Supplier question")}
                  variant="outline"
                  className="border-2 border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9] hover:border-[#F02801] hover:text-[#F02801] rounded-full h-auto py-2 px-4 font-['Roboto']"
                  style={{ fontSize: '13px' }}
                >
                  Supplier question
                </Button>
              </div>
            </div>
          </div>

          {/* Chat Input Area */}
          <div className="p-4 bg-white border-t border-[#E5E7EB]">
            <div className="flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border-2 border-[#E5E7EB] rounded-full px-4 font-['Roboto'] focus:border-[#F02801] focus:ring-[#F02801]"
                style={{ fontSize: '14px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && chatMessage.trim()) {
                    toast.success("Message sent! A support agent will respond shortly.");
                    setChatMessage("");
                  }
                }}
              />
              <Button
                onClick={() => {
                  if (chatMessage.trim()) {
                    toast.success("Message sent! A support agent will respond shortly.");
                    setChatMessage("");
                  }
                }}
                disabled={!chatMessage.trim()}
                className="bg-[#F02801] hover:bg-[#D22301] text-white rounded-full w-12 h-12 p-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="font-['Roboto'] text-[#64748B] text-center mt-3" style={{ fontSize: '12px' }}>
              Typical response time: 2 minutes • Mon–Fri, 9:00–18:00
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
