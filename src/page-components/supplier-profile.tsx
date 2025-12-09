import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { Progress } from "../components/ui/progress";
import {
  MapPin,
  Star,
  Clock,
  Shield,
  Award,
  Phone,
  Mail,
  Navigation,
  CheckCircle,
  Package,
  Wrench,
  Car,
} from "lucide-react";

interface SupplierProfilePageProps {
  onNavigate: (page: string) => void;
  supplierId: string | null;
}

export function SupplierProfilePage({ onNavigate, supplierId }: SupplierProfilePageProps) {
  // Mock supplier data
  const supplier = {
    id: supplierId || "1",
    name: "AutoParts Direct",
    rating: 4.8,
    reviewCount: 256,
    distance: 2.3,
    verified: true,
    responseTime: "2 hours",
    description:
      "Family-run business serving the local community for over 20 years. We specialise in quality car parts with competitive prices and expert advice.",
    address: "45 High Street, Birmingham, B1 1AA",
    phone: "0121 234 5678",
    email: "info@autopartsdirect.co.uk",
    openingHours: {
      weekday: "Mon-Fri: 8:00 AM - 6:00 PM",
      saturday: "Saturday: 9:00 AM - 4:00 PM",
      sunday: "Sunday: Closed",
    },
    specialties: ["Engine Parts", "Brakes", "Suspension", "Electrical", "Bodywork"],
    stats: {
      totalQuotes: 1847,
      completedJobs: 1523,
      responseRate: 98,
      onTimeDelivery: 96,
    },
  };

  const reviews = [
    {
      id: 1,
      author: "John Smith",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Excellent service! Found the exact part I needed at a great price. Quick delivery and very helpful staff.",
      verified: true,
    },
    {
      id: 2,
      author: "Sarah Johnson",
      rating: 5,
      date: "1 month ago",
      comment:
        "Really impressed with the quality of parts and competitive pricing. Will definitely use again.",
      verified: true,
    },
    {
      id: 3,
      author: "Mike Williams",
      rating: 4,
      date: "2 months ago",
      comment:
        "Good selection of parts and knowledgeable staff. Delivery was slightly delayed but they kept me informed.",
      verified: true,
    },
  ];

  const policies = [
    {
      title: "Returns Policy",
      content: "30-day returns on unused parts in original packaging. Restocking fee may apply.",
    },
    {
      title: "Warranty",
      content: "12-month warranty on all new parts. 6-month warranty on reconditioned parts.",
    },
    {
      title: "Delivery",
      content: "Free local delivery within 10 miles. Next-day delivery available for most parts.",
    },
    {
      title: "Payment",
      content: "We accept all major credit/debit cards, bank transfer, and cash on collection.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <Avatar className="h-24 w-24 rounded-xl">
                <AvatarFallback className="rounded-xl bg-primary text-white text-3xl">
                  {supplier.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl">{supplier.name}</h1>
                      {supplier.verified && (
                        <Badge variant="default" className="bg-success">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-subtle-ink mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-medium text-ink">{supplier.rating}</span>
                        <span>({supplier.reviewCount} reviews)</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {supplier.distance} miles away
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Avg. response: {supplier.responseTime}
                      </div>
                    </div>
                    <p className="text-subtle-ink max-w-2xl">{supplier.description}</p>
                  </div>

                  <div className="flex flex-col gap-2 lg:min-w-[200px]">
                    <Button onClick={() => onNavigate("request-flow")} size="lg">
                      Request a Quote
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Navigation className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <div className="text-2xl font-semibold text-ink">{supplier.stats.totalQuotes}</div>
                    <div className="text-sm text-subtle-ink">Total Quotes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-ink">
                      {supplier.stats.completedJobs}
                    </div>
                    <div className="text-sm text-subtle-ink">Completed Jobs</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-ink">
                      {supplier.stats.responseRate}%
                    </div>
                    <div className="text-sm text-subtle-ink">Response Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-ink">
                      {supplier.stats.onTimeDelivery}%
                    </div>
                    <div className="text-sm text-subtle-ink">On-Time Delivery</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-[600px] grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="parts">Parts Focus</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-subtle-ink mt-0.5" />
                    <div>
                      <div className="font-medium mb-1">Address</div>
                      <div className="text-sm text-subtle-ink">{supplier.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-subtle-ink mt-0.5" />
                    <div>
                      <div className="font-medium mb-1">Phone</div>
                      <div className="text-sm text-subtle-ink">{supplier.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-subtle-ink mt-0.5" />
                    <div>
                      <div className="font-medium mb-1">Email</div>
                      <div className="text-sm text-subtle-ink">{supplier.email}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Opening Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-subtle-ink" />
                    <div className="text-sm">
                      <div className="font-medium">{supplier.openingHours.weekday}</div>
                      <div className="text-subtle-ink mt-1">{supplier.openingHours.saturday}</div>
                      <div className="text-subtle-ink mt-1">{supplier.openingHours.sunday}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Specialties</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {supplier.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="px-4 py-2">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Parts Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { name: "Engine Parts", icon: Wrench, availability: 95 },
                    { name: "Brakes & Suspension", icon: Package, availability: 92 },
                    { name: "Electrical Components", icon: Award, availability: 88 },
                    { name: "Bodywork & Panels", icon: Car, availability: 85 },
                  ].map((category) => (
                    <div key={category.name} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <category.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-subtle-ink">
                            {category.availability}% availability
                          </div>
                        </div>
                      </div>
                      <Progress value={category.availability} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{review.author.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.author}</span>
                          {review.verified && (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-subtle-ink">{review.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-warning text-warning"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-subtle-ink">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="policies" className="space-y-4">
            {policies.map((policy) => (
              <Card key={policy.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{policy.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-subtle-ink">{policy.content}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
