import { useState } from "react";
import { HomePage } from "./pages/home";
import { RequestFlowPage } from "./pages/request-flow";
import { VehicleConfirmationPage } from "./pages/vehicle-confirmation";
import { PartsSelectionPage } from "./pages/parts-selection";
import { QuotesPage } from "./pages/quotes";
import { ChatPage } from "./pages/chat";
import { SupplierProfilePage } from "./pages/supplier-profile";
import { SupplierOnboardingPage } from "./pages/supplier-onboarding";
import { SupplierDashboardPage } from "./pages/supplier-dashboard";
import { AdminDashboardPage } from "./pages/admin-dashboard";
import { AuthPage } from "./pages/auth";
import { HowItWorksPage } from "./pages/how-it-works";
import { SuppliersPage } from "./pages/suppliers";
import { AboutPage } from "./pages/about";
import { ContactPage } from "./pages/contact";
import { ProductsPage } from "./pages/products";
import { SuppliersListPage } from "./pages/suppliers-list";
import { NotificationsPage } from "./pages/notifications";
import { HistoryPage } from "./pages/history";
import { Toaster } from "./components/ui/sonner";
import { SignupDialog } from "./components/signup-dialog";
import { SignInDialog } from "./components/signin-dialog";
import { ProfileDialog } from "./components/profile-dialog";
import { NotificationDialog } from "./components/notification-dialog";
import { OrderConfirmationDialog } from "./components/order-confirmation-dialog";
import { TrackOrderDialog } from "./components/track-order-dialog";

type Page =
  | "home"
  | "request-flow"
  | "vehicle-confirmation"
  | "parts-selection"
  | "quotes"
  | "chat"
  | "supplier-profile"
  | "supplier-onboarding"
  | "supplier-dashboard"
  | "admin-dashboard"
  | "auth"
  | "how-it-works"
  | "suppliers"
  | "suppliers-list"
  | "about"
  | "contact"
  | "products"
  | "notifications"
  | "history";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [navigationHistory, setNavigationHistory] = useState<Page[]>(["home"]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [signupDialogOpen, setSignupDialogOpen] = useState(false);
  const [signinDialogOpen, setSigninDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [orderConfirmationDialogOpen, setOrderConfirmationDialogOpen] = useState(false);
  const [trackOrderDialogOpen, setTrackOrderDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [confirmedOrderDetails, setConfirmedOrderDetails] = useState<{
    orderNumber: string;
    supplierName: string;
    partName: string;
    price: number;
    eta: string;
  } | null>(null);
  const [vehicleData, setVehicleData] = useState<{
    make: string;
    model: string;
    year: string;
    registrationNumber?: string;
  } | null>(null);
  const [selectedPartData, setSelectedPartData] = useState<{
    name: string;
    category: string;
    price: number;
    image: string;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quoteNotifications, setQuoteNotifications] = useState<{
    productName: string;
    productImage: string;
    quotes: Array<{
      id: string;
      supplierName: string;
      price: number;
      eta: string;
    }>;
  } | null>(null);

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleNavigate = (page: string, id?: string, vehicleInfo?: any, partData?: any, category?: string, quoteData?: any) => {
    let targetPage: Page;
    
    // Redirect request-flow to vehicle-confirmation for new flow
    if (page === "request-flow") {
      targetPage = "vehicle-confirmation";
      // Extract vehicle data from home page if available
      if (vehicleInfo) {
        setVehicleData(vehicleInfo);
      }
    } else {
      targetPage = page as Page;
    }
    
    setCurrentPage(targetPage);
    setNavigationHistory(prev => [...prev, targetPage]);
    
    if (id) {
      setSelectedSupplierId(id);
    }
    if (vehicleInfo) {
      setVehicleData(vehicleInfo);
    }
    if (partData) {
      setSelectedPartData(partData);
    }
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(null);
    }
    if (quoteData) {
      setQuoteNotifications(quoteData);
    }
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current page
      const previousPage = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentPage(previousPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // If no history, go to home
      setCurrentPage("home");
      setNavigationHistory(["home"]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStartChat = (quoteId: string, supplierId: string) => {
    setSelectedQuoteId(quoteId);
    setSelectedSupplierId(supplierId);
    setCurrentPage("chat");
  };

  return (
    <>
      {currentPage === "home" && (
        <HomePage 
          onNavigate={handleNavigate} 
          onSignupClick={() => setSignupDialogOpen(true)}
          isAuthenticated={isAuthenticated}
          onSignOut={handleSignOut}
          onProfileClick={() => setProfileDialogOpen(true)}
          onNotificationClick={() => setNotificationDialogOpen(true)}
          onTrackOrderClick={() => setTrackOrderDialogOpen(true)}
          quoteNotifications={quoteNotifications}
          onDismissNotifications={() => setQuoteNotifications(null)}
        />
      )}
      {currentPage === "request-flow" && (
        <RequestFlowPage 
          onNavigate={handleNavigate} 
          onSignupClick={() => setSignupDialogOpen(true)} 
        />
      )}
      {currentPage === "vehicle-confirmation" && (
        <VehicleConfirmationPage 
          onNavigate={handleNavigate} 
          vehicleData={vehicleData || undefined} 
          onSignupClick={() => setSignupDialogOpen(true)} 
        />
      )}
      {currentPage === "parts-selection" && (
        <PartsSelectionPage 
          onNavigate={handleNavigate} 
          vehicleData={vehicleData || undefined} 
          onSignupClick={() => setSignupDialogOpen(true)} 
        />
      )}
      {currentPage === "quotes" && (
        <QuotesPage 
          onNavigate={handleNavigate}
          onBack={handleBack}
          onStartChat={handleStartChat} 
          onSignupClick={() => setSignupDialogOpen(true)}
          onOrderConfirmed={(orderDetails) => {
            setConfirmedOrderDetails(orderDetails);
            setOrderConfirmationDialogOpen(true);
          }}
        />
      )}
      {currentPage === "chat" && (
        <ChatPage
          onNavigate={handleNavigate}
          onBack={handleBack}
          supplierId={selectedSupplierId}
          quoteId={selectedQuoteId}
          onSignupClick={() => setSignupDialogOpen(true)}
        />
      )}
      {currentPage === "supplier-profile" && (
        <SupplierProfilePage 
          onNavigate={handleNavigate} 
          supplierId={selectedSupplierId} 
          onSignupClick={() => setSignupDialogOpen(true)} 
        />
      )}
      {currentPage === "supplier-onboarding" && (
        <SupplierOnboardingPage 
          onNavigate={handleNavigate} 
          onSignupClick={() => setSignupDialogOpen(true)} 
        />
      )}
      {currentPage === "supplier-dashboard" && (
        <SupplierDashboardPage 
          onNavigate={handleNavigate} 
          onSignupClick={() => setSignupDialogOpen(true)} 
        />
      )}
      {currentPage === "admin-dashboard" && (
        <AdminDashboardPage 
          onNavigate={handleNavigate} 
          onSignupClick={() => setSignupDialogOpen(true)} 
        />
      )}
      {currentPage === "auth" && (
        <AuthPage 
          onNavigate={handleNavigate} 
          onSignupClick={() => setSignupDialogOpen(true)} 
        />
      )}
      {currentPage === "how-it-works" && (
        <HowItWorksPage 
          onNavigate={handleNavigate} 
          onSignupClick={() => setSignupDialogOpen(true)} 
        />
      )}
      {currentPage === "suppliers" && (
        <SuppliersPage 
          onNavigate={handleNavigate} 
          onSignupClick={() => setSignupDialogOpen(true)} 
        />
      )}
      {currentPage === "about" && (
        <AboutPage 
          onNavigate={handleNavigate} 
          onSignupClick={() => setSignupDialogOpen(true)} 
        />
      )}
      {currentPage === "contact" && (
        <ContactPage 
          onNavigate={handleNavigate} 
          onSignupClick={() => setSignupDialogOpen(true)} 
        />
      )}
      {currentPage === "products" && (
        <ProductsPage 
          onNavigate={handleNavigate}
          onBack={handleBack}
          onSignupClick={() => setSignupDialogOpen(true)}
          isAuthenticated={isAuthenticated}
          onSignOut={handleSignOut}
          onProfileClick={() => setProfileDialogOpen(true)}
          onNotificationClick={() => setNotificationDialogOpen(true)}
          onTrackOrderClick={() => setTrackOrderDialogOpen(true)}
          initialCategory={selectedCategory || undefined}
        />
      )}
      {currentPage === "suppliers-list" && (
        <SuppliersListPage 
          onNavigate={handleNavigate}
          onBack={handleBack}
          onSignupClick={() => setSignupDialogOpen(true)}
          isAuthenticated={isAuthenticated}
          onSignOut={handleSignOut}
          onProfileClick={() => setProfileDialogOpen(true)}
          onNotificationClick={() => setNotificationDialogOpen(true)}
          onTrackOrderClick={() => setTrackOrderDialogOpen(true)}
          partData={selectedPartData || undefined}
        />
      )}
      {currentPage === "notifications" && (
        <NotificationsPage 
          onNavigate={handleNavigate} 
          onSignupClick={() => setSignupDialogOpen(true)}
          isAuthenticated={isAuthenticated}
          onSignOut={handleSignOut}
          onProfileClick={() => setProfileDialogOpen(true)}
          onNotificationClick={() => setNotificationDialogOpen(true)}
          onTrackOrderClick={() => setTrackOrderDialogOpen(true)}
        />
      )}
      {currentPage === "history" && (
        <HistoryPage 
          onNavigate={handleNavigate} 
          onSignupClick={() => setSignupDialogOpen(true)}
          isAuthenticated={isAuthenticated}
          onSignOut={handleSignOut}
          onProfileClick={() => setProfileDialogOpen(true)}
          onNotificationClick={() => setNotificationDialogOpen(true)}
          onTrackOrderClick={() => setTrackOrderDialogOpen(true)}
        />
      )}
      
      <SignupDialog 
        open={signupDialogOpen} 
        onOpenChange={setSignupDialogOpen}
        onSignInClick={() => {
          setSignupDialogOpen(false);
          setSigninDialogOpen(true);
        }}
        onSuccess={handleAuthSuccess}
      />
      
      <SignInDialog 
        open={signinDialogOpen} 
        onOpenChange={setSigninDialogOpen}
        onSignUpClick={() => {
          setSigninDialogOpen(false);
          setSignupDialogOpen(true);
        }}
        onSuccess={handleAuthSuccess}
      />
      
      <ProfileDialog 
        open={profileDialogOpen} 
        onOpenChange={setProfileDialogOpen}
      />
      
      <NotificationDialog
        open={notificationDialogOpen}
        onOpenChange={setNotificationDialogOpen}
        quoteNotifications={quoteNotifications}
        onNavigate={handleNavigate}
      />
      
      <OrderConfirmationDialog
        open={orderConfirmationDialogOpen}
        onOpenChange={setOrderConfirmationDialogOpen}
        orderDetails={confirmedOrderDetails}
        onNavigate={handleNavigate}
        onTrackOrder={() => {
          setOrderConfirmationDialogOpen(false);
          setTrackOrderDialogOpen(true);
        }}
      />
      
      <TrackOrderDialog
        open={trackOrderDialogOpen}
        onOpenChange={setTrackOrderDialogOpen}
        orderDetails={confirmedOrderDetails}
        onNavigate={handleNavigate}
      />
      
      <Toaster />
    </>
  );
}