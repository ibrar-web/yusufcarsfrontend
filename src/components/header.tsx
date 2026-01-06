"use client";

import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import {
  Menu,
  X,
  User,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  History,
  Aperture,
  Blocks,
  ShoppingCart,
} from "lucide-react";
import { useState, useEffect, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { AdminSignInDialog } from "./auth/admin-signup-dialog";
import { RoleSelectionDialog } from "./auth/role-selection-dialog";
import { SignOutDialog } from "./signout-dialog";
import { toast } from "sonner";
import { SignInDialog } from "@/components/auth/signin-dialog";
import { SignupDialog } from "@/components/auth/signup-dialog";
import { ProfileDialog } from "@/components/profile-dialog";
import { NotificationDialog } from "@/components/notification-dialog";
import { OrderConfirmationDialog } from "@/components/order/order-confirmation-dialog";
import { TrackOrderDialog } from "@/components/order/track-order-dialog";
import { useAppStore, pageToPath } from "@/stores/app-store";
import { useAppState } from "@/hooks/use-app-state";
import { UserRole } from "@/utils/api";
import Link from "next/link";
import Image from "next/image";
import {
  loadCartSummary,
  subscribeToCartUpdates,
  type CartSummary,
} from "@/utils/cart-storage";
import type { Page } from "@/stores/app-store";
import { siteConfig } from "@/lib/seo";

type HeaderProps = {
  sticky?: boolean;
};

const PATH_TO_PAGE: Array<{
  match: (pathname: string) => boolean;
  page: string;
}> = [
  { match: (path) => path === "/", page: "home" },
  { match: (path) => path.startsWith("/car-quote"), page: "car-quote" },
  {
    match: (path) => path.startsWith("/vehicle-maintenance"),
    page: "vehicle-maintenance",
  },
  {
    match: (path) =>
      path.startsWith("/marketplace") || path.startsWith("/services"),
    page: "marketplace",
  },
  { match: (path) => path.startsWith("/how-it-works"), page: "how-it-works" },
  {
    match: (path) => path.includes("supplier") && !path.startsWith("/supplier"),
    page: "suppliers",
  },
  {
    match: (path) => path.startsWith("/parts-selection"),
    page: "parts-selection",
  },
  { match: (path) => path.startsWith("/request-flow"), page: "request-flow" },
  { match: (path) => path.startsWith("/cart"), page: "cart" },
  { match: (path) => path.startsWith("/contact"), page: "contact" },
  { match: (path) => path.startsWith("/about"), page: "about" },
  { match: (path) => path.startsWith("/products"), page: "products" },
  { match: (path) => path.startsWith("/admin"), page: "admin-dashboard" },
  { match: (path) => path.startsWith("/supplier"), page: "supplier-dashboard" },
  { match: (path) => path.startsWith("/user"), page: "user-portal" },
];

function resolveCurrentPage(pathname: string) {
  const entry = PATH_TO_PAGE.find(({ match }) => match(pathname));
  return entry?.page;
}

export function Header({ sticky = true }: HeaderProps = {}) {
  const {
    handleNavigate,
    isAuthenticated: appIsAuthenticated,
    userRole,
    handleSignOut,
    openProfileDialog,
    handleAuthSuccess,
  } = useAppState();
  const pathname = usePathname() ?? "/";
  const currentPage = resolveCurrentPage(pathname);
  const {
    signupDialogOpen,
    setSignupDialogOpen,
    profileDialogOpen,
    setProfileDialogOpen,
    notificationDialogOpen,
    setNotificationDialogOpen,
    orderConfirmationDialogOpen,
    setOrderConfirmationDialogOpen,
    trackOrderDialogOpen,
    setTrackOrderDialogOpen,
    quoteNotifications,
    confirmedOrderDetails,
  } = useAppStore();
  const navigate = handleNavigate;
  const authenticated = appIsAuthenticated;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAdminSignup, setShowAdminSignin] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("");
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
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    vehicle: null,
    services: [],
  });

  // Mock notification counts - in real app these would come from props or state management
  const notificationCount = 3;
  const unreadMessages = 2;
  const isAdmin = userRole === "admin";
  const isSupplier = userRole === "supplier";
  const hasDashboardRole = isAdmin || isSupplier;
  const cartItemCount =
    (cartSummary.vehicle ? 1 : 0) +
    (Array.isArray(cartSummary.services) ? cartSummary.services.length : 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateCartSummary = () => setCartSummary(loadCartSummary());
    updateCartSummary();
    const unsubscribe = subscribeToCartUpdates(updateCartSummary);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const openSignIn = () => setShowSignIn(true);
    window.addEventListener("request-sign-in", openSignIn);
    return () => window.removeEventListener("request-sign-in", openSignIn);
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
      if (
        !manualVehicle.make ||
        !manualVehicle.model ||
        !manualVehicle.year ||
        !manualVehicle.fuel
      ) {
        toast.error("Please fill in all vehicle details");
        return;
      }
      if (!postcode.match(/^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i)) {
        toast.error("Please enter a valid UK postcode");
        return;
      }
    }
    setShowRegistrationDialog(false);
    navigate("request-flow");
    if (entryMethod === "plate") {
      toast.success(`Vehicle ${registrationNumber} found`);
    } else {
      toast.success(
        `${manualVehicle.year} ${manualVehicle.make} ${manualVehicle.model} added`
      );
    }
    setRegistrationNumber("");
    setPostcode("");
    setManualVehicle({ make: "", model: "", year: "", fuel: "" });
  };

  const handleRoleSelection = (role: "user" | "supplier" | "admin") => {
    try {
      // console.log("role :", role);
      setSelectedRole(role);

      if (role === "user" || role === "supplier") {
        setShowSignIn(true);
      }

      if (role === "admin") {
        setShowAdminSignin(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignupClick = () => {
    try {
      console.log("sing up cliked :");
      if (selectedRole == "user") setSignupDialogOpen(true);
      else if (selectedRole == "supplier") navigate("supplier-onboarding");
    } catch (error) {}
  };
  const navLinks: Array<{ id: string; label: string; page: Page }> = [
    { id: "nav-home", label: "Home", page: "home" },
    { id: "nav-how-it-works", label: "How It Works", page: "how-it-works" },
    { id: "nav-suppliers", label: "Suppliers", page: "suppliers" },
    { id: "nav-blog", label: "Blog", page: "blogs" },
    { id: "nav-about", label: "About", page: "about" },
    { id: "nav-contact", label: "Contact", page: "contact" },
  ];

  // Check if we're on a portal page
  const isPortalPage =
    currentPage === "admin-dashboard" || currentPage === "supplier-dashboard";

  const handleNavLink = (
    event: MouseEvent<HTMLAnchorElement>,
    page: Page,
    options: { closeMenu?: boolean } = {}
  ) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    navigate(page);
    if (options.closeMenu) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={cn(
        "bg-white border-b border-border transition-all duration-300 z-50",
        sticky && "fixed top-0 left-0 right-0",
        scrolled && "shadow-md"
      )}
    >
      <div className="max-w-[1320px] mx-auto px-6">
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-300",
            scrolled ? "h-16" : "h-20"
          )}
        >
          {/* Logo */}
          <Link
            href={pageToPath("home")}
            onClick={(event) => handleNavLink(event, "home")}
            className="flex items-center gap-2 hover:opacity-80 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center justify-center rounded-lg bg-primary/5 p-1">
              <Image
                src="/partsquote-logo.svg"
                alt={`${siteConfig.name} logo`}
                width={scrolled ? 32 : 40}
                height={scrolled ? 32 : 40}
                priority
              />
            </div>
            <span className="font-['Inter'] font-bold text-xl text-ink">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on portal pages */}
          {!isPortalPage && (
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={pageToPath(link.page)}
                  onClick={(event) => handleNavLink(event, link.page)}
                  className={cn(
                    "font-['Roboto'] text-primary hover:text-subtle-ink transition-all duration-200 font-medium  cursor-pointer",
                    currentPage === link.page && "text-subtle-ink"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Desktop Actions - Hidden on portal pages */}
          {!isPortalPage && (
            <div className="hidden lg:flex items-center gap-3">
              {!authenticated ? (
                <Button
                  variant="outline"
                  onClick={() => setShowRoleSelection(true)}
                  className="rounded-full  cursor-pointer"
                >
                  Sign In
                </Button>
              ) : hasDashboardRole ? (
                <Button
                  variant="outline"
                  className="rounded-lg gap-2 relative  cursor-pointer"
                  onClick={() =>
                    hasDashboardRole &&
                    navigate(isAdmin ? "admin-dashboard" : "supplier-dashboard")
                  }
                >
                  <User className="h-4 w-4" />
                  {isAdmin ? "Admin Dashboard" : "Supplier Dashboard"}
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-[#F02801] rounded-full border-2 border-white"></span>
                  )}
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-lg gap-2 relative cursor-pointer"
                    >
                      <User className="h-4 w-4" />
                      My Account
                      {notificationCount > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 bg-[#F02801] rounded-full border-2 border-white"></span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    {/* Notifications Header */}
                    <Link
                      className="px-3 py-2 border-b border-[#E5E7EB] cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                      href={"/user/quotes"}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-[#F02801]" />
                          <span
                            className="font-['Inter'] font-semibold text-[#0F172A]"
                            style={{ fontSize: "13px" }}
                          >
                            Notifications
                          </span>
                        </div>
                        {notificationCount > 0 && (
                          <span className="bg-[#F02801] text-white px-2 py-0.5 rounded-full text-[10px] font-semibold">
                            {notificationCount}
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Notification Items */}
                    <div className="py-1"></div>

                    <DropdownMenuSeparator />

                    <Link href="/user/orders" className="cursor-pointer">
                      <DropdownMenuItem className="cursor-pointer">
                        <Blocks className="mr-2 h-4 w-4" />
                        My Orders
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/user/chat">
                      <DropdownMenuItem className="relative cursor-pointer">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Messages
                        {unreadMessages > 0 && (
                          <span className="ml-auto bg-[#F02801] text-white px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                            {unreadMessages}
                          </span>
                        )}
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/services">
                      <DropdownMenuItem className="cursor-pointer">
                        <Aperture className="mr-2 h-4 w-4" />
                        Services
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/user/history">
                      <DropdownMenuItem className="cursor-pointer">
                        <History className="mr-2 h-4 w-4" />
                        History
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onClick={openProfileDialog}
                      className="cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowSignOutDialog(true)}
                      className="text-[#F02801] cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button
                variant="outline"
                className="rounded-full gap-2 cursor-pointer"
                onClick={() => navigate("cart")}
              >
                <ShoppingCart className="h-4 w-4" />
                Cart
                {cartItemCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-[#F02801] text-white text-[11px] font-semibold leading-none">
                    {cartItemCount}
                  </span>
                )}
              </Button>
              <Dialog
                open={showRegistrationDialog}
                onOpenChange={setShowRegistrationDialog}
              >
                <DialogTrigger asChild>
                  {/* <Button
                    className="rounded-full"
                    onClick={() => setShowRegistrationDialog(true)}
                  >
                    Start Request
                  </Button> */}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-[#0F172A] border-[#334155]">
                  <DialogHeader>
                    <DialogTitle
                      className="font-['Inter'] text-white"
                      style={{ fontSize: "28px" }}
                    >
                      Enter Your Vehicle Details
                    </DialogTitle>
                    <DialogDescription
                      className="font-['Roboto'] text-[#94A3B8]"
                      style={{ fontSize: "15px" }}
                    >
                      Tell us about your car to get started with your parts
                      request
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-6">
                    <Tabs
                      value={entryMethod}
                      onValueChange={setEntryMethod}
                      className="w-full"
                    >
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
                              const value = e.target.value
                                .toUpperCase()
                                .replace(/[^A-Z0-9]/g, "");
                              setRegistrationNumber(value);
                            }}
                            placeholder="E.G. AB12 CDE"
                            maxLength={8}
                            className="h-20 text-[20px] text-center rounded-2xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] font-semibold tracking-wider text-white uppercase placeholder:text-[#64748B]"
                            style={{ letterSpacing: "0.2em" }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && postcode) {
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
                              const value = e.target.value
                                .toUpperCase()
                                .replace(/[^A-Z0-9\s]/g, "");
                              setPostcode(value);
                            }}
                            placeholder="Postcode (e.g. SW1A 1AA)"
                            maxLength={8}
                            className="h-20 text-[16px] text-center rounded-xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-white placeholder:text-[#64748B]"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && registrationNumber) {
                                handleRegistrationSubmit();
                              }
                            }}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="manual" className="space-y-5">
                        <div>
                          <Select
                            value={manualVehicle.make}
                            onValueChange={(value) =>
                              setManualVehicle({
                                ...manualVehicle,
                                make: value,
                              })
                            }
                          >
                            <SelectTrigger className="h-16 text-[16px] rounded-xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-white">
                              <SelectValue placeholder="Select Make" />
                            </SelectTrigger>
                            <SelectContent className="font-['Roboto'] bg-[#1E293B] border-[#334155]">
                              <SelectItem
                                value="ford"
                                className="text-[16px] text-white focus:bg-[#334155] focus:text-white"
                              >
                                Ford
                              </SelectItem>
                              <SelectItem
                                value="vauxhall"
                                className="text-[16px] text-white focus:bg-[#334155] focus:text-white"
                              >
                                Vauxhall
                              </SelectItem>
                              <SelectItem
                                value="volkswagen"
                                className="text-[16px] text-white focus:bg-[#334155] focus:text-white"
                              >
                                Volkswagen
                              </SelectItem>
                              <SelectItem
                                value="bmw"
                                className="text-[16px] text-white focus:bg-[#334155] focus:text-white"
                              >
                                BMW
                              </SelectItem>
                              <SelectItem
                                value="mercedes"
                                className="text-[16px] text-white focus:bg-[#334155] focus:text-white"
                              >
                                Mercedes-Benz
                              </SelectItem>
                              <SelectItem
                                value="audi"
                                className="text-[16px] text-white focus:bg-[#334155] focus:text-white"
                              >
                                Audi
                              </SelectItem>
                              <SelectItem
                                value="toyota"
                                className="text-[16px] text-white focus:bg-[#334155] focus:text-white"
                              >
                                Toyota
                              </SelectItem>
                              <SelectItem
                                value="honda"
                                className="text-[16px] text-white focus:bg-[#334155] focus:text-white"
                              >
                                Honda
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Input
                            type="text"
                            placeholder="Model (e.g. Focus)"
                            value={manualVehicle.model}
                            onChange={(e) =>
                              setManualVehicle({
                                ...manualVehicle,
                                model: e.target.value,
                              })
                            }
                            className="h-16 text-[16px] rounded-xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-white placeholder:text-[#64748B]"
                          />
                        </div>

                        <div>
                          <Select
                            value={manualVehicle.year}
                            onValueChange={(value) =>
                              setManualVehicle({
                                ...manualVehicle,
                                year: value,
                              })
                            }
                          >
                            <SelectTrigger className="h-16 text-[16px] rounded-xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-white">
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent className="font-['Roboto'] bg-[#1E293B] border-[#334155] max-h-[300px]">
                              {Array.from(
                                { length: 25 },
                                (_, i) => 2025 - i
                              ).map((year) => (
                                <SelectItem
                                  key={year}
                                  value={year.toString()}
                                  className="text-[16px] text-white focus:bg-[#334155] focus:text-white"
                                >
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Select
                            value={manualVehicle.fuel}
                            onValueChange={(value) =>
                              setManualVehicle({
                                ...manualVehicle,
                                fuel: value,
                              })
                            }
                          >
                            <SelectTrigger className="h-16 text-[16px] rounded-xl border-2 border-[#334155] bg-[#1E293B] hover:border-[#475569] focus:border-[#F02801] focus:ring-4 focus:ring-[#F02801]/20 transition-all duration-200 font-['Roboto'] text-white">
                              <SelectValue placeholder="Fuel Type (Optional)" />
                            </SelectTrigger>
                            <SelectContent className="font-['Roboto'] bg-[#1E293B] border-[#334155]">
                              <SelectItem
                                value="petrol"
                                className="text-[16px] text-white focus:bg-[#334155] focus:text-white"
                              >
                                Petrol
                              </SelectItem>
                              <SelectItem
                                value="diesel"
                                className="text-[16px] text-white focus:bg-[#334155] focus:text-white"
                              >
                                Diesel
                              </SelectItem>
                              <SelectItem
                                value="hybrid"
                                className="text-[16px] text-white focus:bg-[#334155] focus:text-white"
                              >
                                Hybrid
                              </SelectItem>
                              <SelectItem
                                value="electric"
                                className="text-[16px] text-white focus:bg-[#334155] focus:text-white"
                              >
                                Electric
                              </SelectItem>
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
            <div className="flex items-center gap-2 lg:hidden">
              <button
                className="relative p-2 rounded-full border border-border text-subtle-ink hover:text-ink hover:border-ink transition-colors"
                onClick={() => navigate("cart")}
                aria-label="Open cart summary"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 text-[10px] rounded-full bg-[#F02801] text-white font-semibold leading-none flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button
                className="p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu - Hidden on portal pages */}
        {mobileMenuOpen && !isPortalPage && (
          <div className="lg:hidden py-4 border-t border-border slide-down">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={pageToPath(link.page)}
                  onClick={(event) =>
                    handleNavLink(event, link.page, { closeMenu: true })
                  }
                  className={cn(
                    "text-left py-2 text-subtle-ink hover:text-ink transition-colors",
                    currentPage === link.page && "text-primary font-medium"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => {
                    navigate("cart");
                    setMobileMenuOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    View Cart
                  </span>
                  {cartItemCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-[#F02801] text-white text-[11px] font-semibold leading-none">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
                {!authenticated ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowRoleSelection(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                ) : hasDashboardRole ? (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate(
                          isAdmin ? "admin-dashboard" : "supplier-dashboard"
                        );
                        setMobileMenuOpen(false);
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      {isAdmin ? "Admin Dashboard" : "Supplier Dashboard"}
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
                ) : (
                  <>
                    <div className="pb-2 border-b border-border mb-2">
                      <p className="text-sm font-medium text-subtle-ink px-2">
                        My Account
                      </p>
                    </div>
                    <Link
                      href={"/user/quotes"}
                      className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-subtle-ink hover:bg-[#F1F5F9] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-[#F02801]" />
                        <span
                          className="font-['Inter'] font-semibold text-[#0F172A]"
                          style={{ fontSize: "13px" }}
                        >
                          Notifications
                        </span>
                      </div>
                      {notificationCount > 0 && (
                        <span className="bg-[#F02801] text-white px-2 py-0.5 rounded-full text-[10px] font-semibold">
                          {notificationCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      href={"/user/orders"}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-subtle-ink hover:bg-[#F1F5F9] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Blocks className="h-4 w-4" />
                      My Orders
                    </Link>
                    <Link
                      href={"/user/chat"}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-subtle-ink hover:bg-[#F1F5F9] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Messages
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        openProfileDialog();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Link
                      href={"/services"}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-subtle-ink hover:bg-[#F1F5F9] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Aperture className="h-4 w-4" />
                      Services
                    </Link>
                    <Link
                      href={"/user/history"}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-subtle-ink hover:bg-[#F1F5F9] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <History className="h-4 w-4" />
                      History
                    </Link>
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
                    navigate("request-flow");
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
      <AdminSignInDialog
        open={showAdminSignup}
        onOpenChange={setShowAdminSignin}
        onSuccess={() => {
          setTimeout(() => {
            navigate("admin-dashboard");
          });
        }}
      />

      {/* Role Selection Dialog */}
      <RoleSelectionDialog
        open={showRoleSelection}
        onOpenChange={setShowRoleSelection}
        onSelectRole={handleRoleSelection}
        onNavigate={navigate}
      />

      <SignupDialog
        open={signupDialogOpen}
        onOpenChange={setSignupDialogOpen}
        onSignInClick={() => {
          setSignupDialogOpen(false);
          setShowSignIn(true);
        }}
        setSignupDialogOpen={setSignupDialogOpen}
        onSuccess={handleAuthSuccess}
      />

      <SignInDialog
        open={showSignIn}
        onOpenChange={setShowSignIn}
        onSignUpClick={handleSignupClick}
        onSuccess={handleAuthSuccess}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
      />

      <ProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      />

      <NotificationDialog
        open={notificationDialogOpen}
        onOpenChange={setNotificationDialogOpen}
        quoteNotifications={quoteNotifications}
        onNavigate={navigate}
      />

      <OrderConfirmationDialog
        open={orderConfirmationDialogOpen}
        onOpenChange={setOrderConfirmationDialogOpen}
        orderDetails={confirmedOrderDetails}
        onNavigate={navigate}
        onTrackOrder={() => {
          setOrderConfirmationDialogOpen(false);
          setTrackOrderDialogOpen(true);
        }}
      />

      <TrackOrderDialog
        open={trackOrderDialogOpen}
        onOpenChange={setTrackOrderDialogOpen}
        orderDetails={confirmedOrderDetails}
        onNavigate={navigate}
      />

      {/* Sign Out Confirmation Dialog */}
      <SignOutDialog
        open={showSignOutDialog}
        onOpenChange={setShowSignOutDialog}
        onConfirm={handleSignOut}
      />
    </header>
  );
}
