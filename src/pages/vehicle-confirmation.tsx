import { Header } from "../components/header";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Car, CheckCircle, XCircle } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface VehicleConfirmationPageProps {
  onNavigate: (page: string) => void;
  vehicleData?: {
    make: string;
    model: string;
    year: string;
    registrationNumber?: string;
  };
}

export function VehicleConfirmationPage({ 
  onNavigate, 
  vehicleData = { make: "Volkswagen", model: "Golf", year: "2018" } 
}: VehicleConfirmationPageProps) {
  
  const handleYes = () => {
    onNavigate("parts-selection");
  };

  const handleNo = () => {
    onNavigate("home");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={onNavigate} currentPage="vehicle-confirmation" />

      <div className="max-w-[1000px] mx-auto px-6 pt-32 pb-16 min-h-[calc(100vh-80px)] flex flex-col justify-center">
        {/* Dark Card with Background */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 fade-in-up">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1609465397944-be1ce3ebda61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBpbnRlcmlvciUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NTkyMzg1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Luxury car interior"
              className="w-full h-full object-cover opacity-20"
              style={{ filter: 'blur(4px)' }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/95 via-[#1E293B]/90 to-[#0F172A]/95"></div>
          </div>

          {/* Decorative gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-hover to-primary z-10"></div>
          
          <div className="relative z-10 px-24 py-12">
            {/* Background Image for Content Section */}
            <div className="absolute inset-0 z-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1756990688487-38fea20c395b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzcG9ydHMlMjBjYXIlMjBzaWRlJTIwdmlld3xlbnwxfHx8fDE3NTkyMzI1MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Luxury sports car"
                className="w-full h-full object-cover opacity-5"
                style={{ filter: 'blur(1px)' }}
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/20 to-transparent"></div>
            </div>

            {/* Icon & Question */}
            <div className="relative z-10 text-center mb-8">
              <h1 className="font-['Inter'] font-bold text-white/80" style={{ fontSize: '32px', lineHeight: '1.2' }}>
                Is This Your Vehicle?
              </h1>
            </div>

            {/* Vehicle Info Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1E293B]/60 to-[#0F172A]/70 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/5">
              {/* Background Image for Vehicle Info Card */}
              <div className="absolute inset-0 z-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1578148211838-491f3014dfc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBlbmdpbmUlMjBkZXRhaWx8ZW58MXx8fHwxNzU5MzA3MDI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Car engine detail"
                  className="w-full h-full object-cover opacity-10"
                  style={{ filter: 'blur(2px)' }}
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B]/90 to-[#0F172A]/95"></div>
              </div>

              {/* Vehicle Name */}
              <div className="relative z-10 text-center mb-6">
                <div className="inline-block px-4 py-1 bg-primary/15 rounded-full mb-3 border border-primary/20">
                  <p className="font-['Roboto'] text-xs text-primary/90 font-semibold uppercase tracking-wider">
                    Confirmed Details
                  </p>
                </div>
                <h2 className="font-['Inter'] font-bold text-white/70" style={{ fontSize: '28px', lineHeight: '1.3' }}>
                  {vehicleData.year} {vehicleData.make} {vehicleData.model}
                </h2>
              </div>

              {/* Detail Grid */}
              <div className="relative z-10 grid grid-cols-3 gap-3">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                  <div className="relative text-center p-5 bg-[#0F172A]/40 backdrop-blur-sm rounded-xl shadow-sm border border-white/[0.03] hover:border-primary/20 transition-all">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-2 border border-primary/20">
                      <Car className="h-4 w-4 text-primary/80" />
                    </div>
                    <p className="font-['Roboto'] text-xs text-white/40 uppercase tracking-wider mb-1">Make</p>
                    <p className="font-['Inter'] font-bold text-white/70" style={{ fontSize: '16px' }}>
                      {vehicleData.make}
                    </p>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                  <div className="relative text-center p-5 bg-[#0F172A]/40 backdrop-blur-sm rounded-xl shadow-sm border border-white/[0.03] hover:border-primary/20 transition-all">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-2 border border-primary/20">
                      <Car className="h-4 w-4 text-primary/80" />
                    </div>
                    <p className="font-['Roboto'] text-xs text-white/40 uppercase tracking-wider mb-1">Model</p>
                    <p className="font-['Inter'] font-bold text-white/70" style={{ fontSize: '16px' }}>
                      {vehicleData.model}
                    </p>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                  <div className="relative text-center p-5 bg-[#0F172A]/40 backdrop-blur-sm rounded-xl shadow-sm border border-white/[0.03] hover:border-primary/20 transition-all">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-2 border border-primary/20">
                      <Car className="h-4 w-4 text-primary/80" />
                    </div>
                    <p className="font-['Roboto'] text-xs text-white/40 uppercase tracking-wider mb-1">Year</p>
                    <p className="font-['Inter'] font-bold text-white/70" style={{ fontSize: '16px' }}>
                      {vehicleData.year}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleNo}
                variant="outline"
                className="flex-1 h-14 border-2 border-white/10 hover:bg-white/5 hover:border-white/20 text-white/70 hover:text-white/90 font-['Roboto'] font-medium rounded-full transition-all duration-300 group relative overflow-hidden backdrop-blur-sm"
                style={{ fontSize: '15px' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <XCircle className="mr-2 h-5 w-5 text-white/60 group-hover:text-white/80 transition-colors relative z-10" />
                <span className="relative z-10 text-[rgba(0,0,0,0.7)]">No, Go Back</span>
              </Button>
              
              <Button
                onClick={() => onNavigate("products")}
                className="flex-1 h-14 bg-primary hover:bg-primary-hover text-white font-['Roboto'] font-semibold rounded-full transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
                style={{ fontSize: '15px' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <CheckCircle className="mr-2 h-5 w-5 relative z-10" />
                <span className="relative z-10">Yes, Continue</span>
              </Button>
            </div>

            {/* Helper Text */}
            <p className="relative z-10 text-center mt-6 font-['Roboto'] text-sm text-white/40">
              Confirm your vehicle to proceed to parts selection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}