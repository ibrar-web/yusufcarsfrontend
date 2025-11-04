import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { Car, Menu, X, User, FileText, MessageSquare, Settings, LogOut, Bell, Package, History, MapPin, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { AdminSignupDialog } from "./admin-signup-dialog";
import { SupplierSignupDialog } from "./supplier-signup-dialog";
import { RoleSelectionDialog } from "./role-selection-dialog";
import { SignOutDialog } from "./signout-dialog";
import { toast } from "sonner@2.0.3";

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage?: string;
  sticky?: boolean;
  onSignupClick?: () => void;
  isAuthenticated?: boolean;
  onSignOut?: () => void;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  onTrackOrderClick?: () => void;
}

export function Header({ onNavigate, currentPage, sticky = true, onSignupClick, isAuthenticated = false, onSignOut, onProfileClick, onNotificationClick, onTrackOrderClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAdminSignup, setShowAdminSignup] = useState(false);
  const [showSupplierSignup, setShowSupplierSignup] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [postcode, setPostcode] = useState("");
  const [entryMethod, setEntryMethod] = useState("plate");
  const [manualVehicle, setManualVehicle] = useState({
    make: "",
    model: "",
    year: "",
    fuel: "",
  });
  
  // Mock notification counts - in real app these would come from props or state management
  const notificationCount = 3;
  const unreadMessages = 2;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRegistrationSubmit = () => {
    if (entryMethod === "plate") {
      if (!registrationNumber || registrationNumber.length < 6) {
        toast.error("Please enter a valid registration number");
        return;
      }
      if (!postcode.match(/^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i)) {
        toast.error("Please enter a valid UK postcode");
        return;
      }
    } else {
      if (!manualVehicle.make || !manualVehicle.model || !manualVehicle.year || !manualVehicle.fuel) {
        toast.error("Please fill in all vehicle details");
        return;
      }
      if (!postcode.match(/^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i)) {
        toast.error("Please enter a valid UK postcode");
        return;
      }
    }
    setShowRegistrationDialog(false);
    onNavigate("request-flow");
    if (entryMethod === "plate") {
      toast.success(`Vehicle ${registrationNumber} found`);
    } else {
      toast.success(`${manualVehicle.year} ${manualVehicle.make} ${manualVehicle.model} added`);
    }
    setRegistrationNumber("");
    setPostcode("");
    setManualVehicle({ make: "", model: "", year: "", fuel: "" });
  };

  const handleRoleSelection = (role: "user" | "supplier" | "admin") => {
    if (role === "user") {
      if (onSignupClick) {
        onSignupClick();
      } else {
        onNavigate("auth");
      }
    } else if (role === "supplier") {
      setShowSupplierSignup(true);
    } else if (role === "admin") {
      setShowAdminSignup(true);
    }
  };

  const navLinks = [
    { id: "nav-home", label: "Home", page: "home" },
    { id: "nav-how-it-works", label: "How It Works", page: "how-it-works" },
    { id: "nav-suppliers", label: "Suppliers", page: "suppliers" },
    { id: "nav-about", label: "About", page: "about" },
    { id: "nav-contact", label: "Contact", page: "contact" },
  ];

  // Check if we're on a portal page
  const isPortalPage = currentPage === "admin-dashboard" || currentPage === "supplier-dashboard";

  return (
    <header
      className={cn(
        "bg-white border-b border-border transition-all duration-300 z-50",
        sticky && "fixed top-0 left-0 right-0",
        scrolled && "shadow-md"
      )}
    >
      <div className="max-w-[1320px] mx-auto px-6">
        <div className={cn(
          "flex items-center justify-between transition-all duration-300",
          scrolled ? "h-16" : "h-20"
        )}>
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 group"
          >
            <div className={cn(
              "bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary-hover transition-all duration-300",
              scrolled ? "h-8 w-8" : "h-10 w-10"
            )}>
              <Car className={cn(
                "text-white transition-all duration-300",
                scrolled ? "h-5 w-5" : "h-6 w-6"
              )} />
            </div>
            <span className="font-['Inter'] font-bold text-xl text-ink">PartsQuote</span>
          </button>

          {/* Desktop Navigation - Hidden on portal pages */}
          {!isPortalPage && (
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.page)}
                  className={cn(
                    "font-['Roboto'] text-primary hover:text-subtle-ink transition-all duration-200 font-medium",
                    currentPage === link.page && "text-subtle-ink"
                  )}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}

          {/* Desktop Actions - Hidden on portal pages */}
          {!isPortalPage && (
            <div className="hidden lg:flex items-center gap-3">
            {!isAuthenticated ? (
              <Button 
                variant="outline" 
                onClick={() => setShowRoleSelection(true)}
                className="rounded-full"
              >
                Sign Up
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-lg gap-2 relative">
                    <User className="h-4 w-4" />
                    My Account
                    {notificationCount > 0 && (
                      <span className="absolute top-0 right-0 h-2 w-2 bg-[#F02801] rounded-full border-2 border-white"></span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  {/* Notifications Header */}
                  <div 
                    className="px-3 py-2 border-b border-[#E5E7EB] cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                    onClick={() => onNavigate("quotes")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-[#F02801]" />
                        <span className="font-['Inter'] font-semibold text-[#0F172A]" style={{ fontSize: "13px" }}>
                          Notifications
                        </span>
                      </div>
                      {notificationCount > 0 && (
                        <span className="bg-[#F02801] text-white px-2 py-0.5 rounded-full text-[10px] font-semibold">
                          {notificationCount}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Notification Items */}
                  <div className="py-1">
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => onTrackOrderClick?.()}>
                    <Package className="mr-2 h-4 w-4" />
                    Track Order
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate("chat")} className="relative">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Messages
                    {unreadMessages > 0 && (
                      <span className="ml-auto bg-[#F02801] text-white px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                        {unreadMessages}
                      </span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    onNavigate("history");
                    toast.success("Viewing order history");
                  }}>
                    <History className="mr-2 h-4 w-4" />
                    History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onProfileClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowSignOutDialog(true)} className="text-[#F02801]">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Dialog open={showRegistrationDialog} onOpenChange={setShowRegistrationDialog}>
              <DialogTrigger asChild>
                <Button 
                  className="rounded-full"
                  onClick={() => setShowRegistrationDialog(true)}
                >
                  Start Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-[#0F172A] border-[#334155]">
                <DialogHeader>
                  <DialogTitle className="font-['Inter'] text-white" style={{ fontSize: "28px" }}>Enter Your Vehicle Details</DialogTitle>
                  <DialogDescription className="font-['Roboto'] text-[#94A3B8]" style={{ fontSize: "15px" }}>
                    Tell us about your car to get started with your parts request
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mt-6">
                  <Tabs value={entryMethod} onValueChange={setEntryMethod} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-14 mb-8 bg-[#1E293B] border border-[#334155]">
                      <TabsTrigger 
                        value="plate" 
                        className="font-['Roboto'] font-medium data-[state=active]:bg-[#F02801] data-[state=active]:text-white text-[#94A3B8]"
                        style={{ fontSize: "15px" }}
                      >
                        Registration Number
                      </TabsTrigger>
                      <TabsTrigger 
                        value="manual" 
                        className="font-['Roboto'] font-medium data-[state=active]:bg-[#F02801] data-[state=active]:text-white text-[#94A3B8]"
                        style={{ fontSize: "15px" }}
                      >
                        Manual Entry
                      </TabsTrigger>
                    </TabsList>
                  
                    <TabsContent value="plate" className="space-y-6">
                      <div>
                        <Input
                          type="text"
                          value={registrationNumber}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                            setRegistrationNumber(value);
                          }}
                          placeholder="E.G. AB12 CDE"
                          maxLength={8}
                          className="h-20 text-[20px] text-center rounded-2xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] font-semibold tracking-wider text-white uppercase placeholder:text-[#64748B]"
                          style={{ letterSpacing: '0.2em' }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && postcode) {
                              handleRegistrationSubmit();
                            }
                          }}
                        />
                      </div>
                      
                      <div>
                        <Input
                          type="text"
                          value={postcode}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
                            setPostcode(value);
                          }}
                          placeholder="Postcode (e.g. SW1A 1AA)"
                          maxLength={8}
                          className="h-20 text-[16px] text-center rounded-xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-white placeholder:text-[#64748B]"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && registrationNumber) {
                              handleRegistrationSubmit();
                            }
                          }}
                        />
                      </div>
                    </TabsContent>
                  
                    <TabsContent value="manual" className="space-y-5">
                      <div>
                        <Select value={manualVehicle.make} onValueChange={(value) => setManualVehicle({ ...manualVehicle, make: value })}>
                          <SelectTrigger className="h-16 text-[16px] rounded-xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-white">
                            <SelectValue placeholder="Select Make" />
                          </SelectTrigger>
                          <SelectContent className="font-['Roboto'] bg-[#1E293B] border-[#334155]">
                            <SelectItem value="ford" className="text-[16px] text-white focus:bg-[#334155] focus:text-white">Ford</SelectItem>
                            <SelectItem value="vauxhall" className="text-[16px] text-white focus:bg-[#334155] focus:text-white">Vauxhall</SelectItem>
                            <SelectItem value="volkswagen" className="text-[16px] text-white focus:bg-[#334155] focus:text-white">Volkswagen</SelectItem>
                            <SelectItem value="bmw" className="text-[16px] text-white focus:bg-[#334155] focus:text-white">BMW</SelectItem>
                            <SelectItem value="mercedes" className="text-[16px] text-white focus:bg-[#334155] focus:text-white">Mercedes-Benz</SelectItem>
                            <SelectItem value="audi" className="text-[16px] text-white focus:bg-[#334155] focus:text-white">Audi</SelectItem>
                            <SelectItem value="toyota" className="text-[16px] text-white focus:bg-[#334155] focus:text-white">Toyota</SelectItem>
                            <SelectItem value="honda" className="text-[16px] text-white focus:bg-[#334155] focus:text-white">Honda</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Input
                          type="text"
                          placeholder="Model (e.g. Focus)"
                          value={manualVehicle.model}
                          onChange={(e) => setManualVehicle({ ...manualVehicle, model: e.target.value })}
                          className="h-16 text-[16px] rounded-xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-white placeholder:text-[#64748B]"
                        />
                      </div>
                      
                      <div>
                        <Select value={manualVehicle.year} onValueChange={(value) => setManualVehicle({ ...manualVehicle, year: value })}>
                          <SelectTrigger className="h-16 text-[16px] rounded-xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-white">
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent className="font-['Roboto'] bg-[#1E293B] border-[#334155] max-h-[300px]">
                            {Array.from({ length: 25 }, (_, i) => 2025 - i).map((year) => (
                              <SelectItem key={year} value={year.toString()} className="text-[16px] text-white focus:bg-[#334155] focus:text-white">
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Select value={manualVehicle.fuel} onValueChange={(value) => setManualVehicle({ ...manualVehicle, fuel: value })}>
                          <SelectTrigger className="h-16 text-[16px] rounded-xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-white">
                            <SelectValue placeholder="Fuel Type (Optional)" />
                          </SelectTrigger>
                          <SelectContent className="font-['Roboto'] bg-[#1E293B] border-[#334155]">
                            <SelectItem value="petrol" className="text-[16px] text-white focus:bg-[#334155] focus:text-white">Petrol</SelectItem>
                            <SelectItem value="diesel" className="text-[16px] text-white focus:bg-[#334155] focus:text-white">Diesel</SelectItem>
                            <SelectItem value="hybrid" className="text-[16px] text-white focus:bg-[#334155] focus:text-white">Hybrid</SelectItem>
                            <SelectItem value="electric" className="text-[16px] text-white focus:bg-[#334155] focus:text-white">Electric</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-3 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setShowRegistrationDialog(false)}
                      className="flex-1 h-14 rounded-full border-2 border-[#334155] hover:border-[#475569] font-['Roboto'] font-medium bg-[#1E293B] text-white hover:bg-[#334155]"
                      style={{ fontSize: "16px" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleRegistrationSubmit}
                      className="flex-1 h-14 rounded-full bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] font-semibold transition-all duration-300 shadow-lg shadow-[#F02801]/30"
                      style={{ fontSize: "16px" }}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          )}

          {/* Mobile Menu Button - Hidden on portal pages */}
          {!isPortalPage && (
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>

        {/* Mobile Menu - Hidden on portal pages */}
        {mobileMenuOpen && !isPortalPage && (
          <div className="lg:hidden py-4 border-t border-border slide-down">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.page);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "text-left py-2 text-subtle-ink hover:text-ink transition-colors",
                    currentPage === link.page && "text-primary font-medium"
                  )}
                >
                  {link.label}
                </button>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {!isAuthenticated ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowRoleSelection(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                ) : (
                  <>
                    <div className="pb-2 border-b border-border mb-2">
                      <p className="text-sm font-medium text-subtle-ink px-2">My Account</p>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        onNavigate("vehicle-confirmation");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      My Requests
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        onTrackOrderClick?.();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Track Order
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        onNavigate("chat");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        onProfileClick?.();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-[#F02801] hover:text-[#D22301] hover:bg-[#FEF2F2]"
                      onClick={() => {
                        setShowSignOutDialog(true);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                )}
                <Button
                  className="w-full"
                  onClick={() => {
                    onNavigate("request-flow");
                    setMobileMenuOpen(false);
                  }}
                >
                  Start Request
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Admin Signup Dialog */}
      <AdminSignupDialog
        open={showAdminSignup}
        onOpenChange={setShowAdminSignup}
        onSuccess={() => {
          toast.success("Admin access request submitted successfully! You'll receive an email once approved.");
          // Navigate to admin dashboard after successful signup
          setTimeout(() => {
            onNavigate("admin-dashboard");
          }, 1500);
        }}
      />

      {/* Supplier Signup Dialog */}
      <SupplierSignupDialog
        open={showSupplierSignup}
        onOpenChange={setShowSupplierSignup}
        onSuccess={() => {
          toast.success("Supplier registration submitted successfully! We'll contact you within 2-3 business days.");
          // Navigate to supplier dashboard after successful signup
          setTimeout(() => {
            onNavigate("supplier-dashboard");
          }, 1500);
        }}
      />

      {/* Role Selection Dialog */}
      <RoleSelectionDialog
        open={showRoleSelection}
        onOpenChange={setShowRoleSelection}
        onSelectRole={handleRoleSelection}
        onNavigate={onNavigate}
      />

      {/* Sign Out Confirmation Dialog */}
      <SignOutDialog
        open={showSignOutDialog}
        onOpenChange={setShowSignOutDialog}
        onConfirm={() => {
          if (onSignOut) {
            onSignOut();
          }
        }}
      />
    </header>
  );
}