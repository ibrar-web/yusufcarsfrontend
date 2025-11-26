export interface SupplierStats {
  newRequests: number;
  quotesSent: number;
  conversionRate: number;
  avgResponseTime: string;
}

export interface SupplierRequest {
  id: string;
  customer: string;
  vehicle: string;
  registration: string;
  part: string;
  details: string;
  distance: number;
  status: "new" | "quoted";
  posted: string;
  timeRemaining?: number;
}

export interface SupplierQuote {
  id: string;
  requestId: string;
  customer: string;
  part: string;
  amount: number;
  status: "pending" | "accepted" | "declined" | "new" | "quoted";
  sentAt: string;
}

export interface SupplierMessage {
  id: string;
  customer: string;
  customerId: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  quoteId: string;
  part: string;
}

export interface QuotePerformancePoint {
  month: string;
  sent: number;
  accepted: number;
  revenue: number;
}

export interface CategoryBreakdownPoint {
  category: string;
  quotes: number;
  avgPrice: number;
}

export const supplierStats: SupplierStats = {
  newRequests: 12,
  quotesSent: 48,
  conversionRate: 32,
  avgResponseTime: "2.4 hours",
};

export const supplierRequests: SupplierRequest[] = [
  {
    id: "REQ-001",
    customer: "John Smith",
    vehicle: "2018 Ford Focus 1.0 EcoBoost",
    registration: "AB18 CDE",
    part: "Front Brake Pads",
    details: "Need replacement front brake pads, OEM or equivalent quality",
    distance: 2.3,
    status: "new",
    posted: "25 mins ago",
    timeRemaining: 20,
  },
  {
    id: "REQ-002",
    customer: "Sarah Johnson",
    vehicle: "2020 VW Golf 2.0 TDI",
    registration: "CD20 FGH",
    part: "Alternator",
    details: "Car not charging battery properly, suspect alternator failure",
    distance: 5.1,
    status: "new",
    posted: "1 hour ago",
    timeRemaining: -15,
  },
  {
    id: "REQ-006",
    customer: "James Patterson",
    vehicle: "2019 Honda Civic 1.6 i-DTEC",
    registration: "KL19 RST",
    part: "Timing Belt Kit",
    details: "Due for timing belt replacement, need complete kit with water pump",
    distance: 4.7,
    status: "new",
    posted: "35 mins ago",
    timeRemaining: 10,
  },
  {
    id: "REQ-003",
    customer: "Mike Williams",
    vehicle: "2016 BMW 3 Series 320d",
    registration: "EF16 IJK",
    part: "Engine Mount",
    details: "Excessive vibration, likely engine mount issue",
    distance: 3.8,
    status: "quoted",
    posted: "3 hours ago",
  },
  {
    id: "REQ-004",
    customer: "Emily Thompson",
    vehicle: "2019 Audi A4 2.0 TFSI",
    registration: "GH19 LMN",
    part: "Rear Shock Absorbers",
    details: "Bouncy ride and noise from rear suspension",
    distance: 4.2,
    status: "quoted",
    posted: "45 mins ago",
  },
  {
    id: "REQ-005",
    customer: "David Clark",
    vehicle: "2017 Mercedes C-Class 220d",
    registration: "IJ17 OPQ",
    part: "Starter Motor",
    details: "Car struggles to start, clicking noise when turning key",
    distance: 6.5,
    status: "quoted",
    posted: "2 hours ago",
  },
];

export const supplierQuotes: SupplierQuote[] = [
  {
    id: "Q-001",
    requestId: "REQ-003",
    customer: "Mike Williams",
    part: "Engine Mount",
    amount: 145.0,
    status: "pending",
    sentAt: "2 hours ago",
  },
  {
    id: "Q-002",
    requestId: "REQ-004",
    customer: "Emma Davis",
    part: "Fuel Pump",
    amount: 225.0,
    status: "accepted",
    sentAt: "1 day ago",
  },
  {
    id: "Q-003",
    requestId: "REQ-005",
    customer: "Tom Brown",
    part: "Timing Belt Kit",
    amount: 189.0,
    status: "declined",
    sentAt: "2 days ago",
  },
  {
    id: "Q-004",
    requestId: "REQ-007",
    customer: "Sarah Mitchell",
    part: "Radiator",
    amount: 312.0,
    status: "accepted",
    sentAt: "3 days ago",
  },
  {
    id: "Q-005",
    requestId: "REQ-008",
    customer: "James Cooper",
    part: "Clutch Kit",
    amount: 428.0,
    status: "pending",
    sentAt: "4 hours ago",
  },
  {
    id: "Q-006",
    requestId: "REQ-009",
    customer: "Lucy Bennett",
    part: "Headlight Assembly",
    amount: 167.0,
    status: "accepted",
    sentAt: "5 days ago",
  },
  {
    id: "Q-007",
    requestId: "REQ-010",
    customer: "Oliver Harris",
    part: "Turbocharger",
    amount: 895.0,
    status: "pending",
    sentAt: "6 hours ago",
  },
  {
    id: "Q-008",
    requestId: "REQ-011",
    customer: "Hannah Price",
    part: "Suspension Springs",
    amount: 256.0,
    status: "declined",
    sentAt: "1 week ago",
  },
];

export const supplierMessages: SupplierMessage[] = [
  {
    id: "MSG-001",
    customer: "Emma Wilson",
    customerId: "CUST-001",
    avatar: "EW",
    lastMessage: "Thanks for the quote! When can you deliver the brake pads?",
    timestamp: "2 hours ago",
    unread: 2,
    quoteId: "Q-001",
    part: "Front Brake Pads",
  },
  {
    id: "MSG-002",
    customer: "Sarah Mitchell",
    customerId: "CUST-004",
    avatar: "SM",
    lastMessage: "I've accepted your quote. What's the next step?",
    timestamp: "5 hours ago",
    unread: 1,
    quoteId: "Q-004",
    part: "Radiator",
  },
  {
    id: "MSG-003",
    customer: "James Cooper",
    customerId: "CUST-005",
    avatar: "JC",
    lastMessage: "Can you provide more details about the warranty?",
    timestamp: "Yesterday",
    unread: 0,
    quoteId: "Q-005",
    part: "Clutch Kit",
  },
  {
    id: "MSG-004",
    customer: "Lucy Bennett",
    customerId: "CUST-006",
    avatar: "LB",
    lastMessage: "Order received! Thank you for the quick delivery.",
    timestamp: "2 days ago",
    unread: 0,
    quoteId: "Q-006",
    part: "Headlight Assembly",
  },
  {
    id: "MSG-005",
    customer: "Oliver Harris",
    customerId: "CUST-007",
    avatar: "OH",
    lastMessage: "Is this a genuine or aftermarket turbocharger?",
    timestamp: "3 days ago",
    unread: 3,
    quoteId: "Q-007",
    part: "Turbocharger",
  },
  {
    id: "MSG-006",
    customer: "Tom Brown",
    customerId: "CUST-003",
    avatar: "TB",
    lastMessage: "Sorry, I found a better price elsewhere. Thanks anyway.",
    timestamp: "1 week ago",
    unread: 0,
    quoteId: "Q-003",
    part: "Timing Belt Kit",
  },
  {
    id: "MSG-007",
    customer: "Daniel Roberts",
    customerId: "CUST-008",
    avatar: "DR",
    lastMessage: "Do you offer fitting services or just supply the parts?",
    timestamp: "30 mins ago",
    unread: 1,
    quoteId: "Q-002",
    part: "Exhaust System",
  },
  {
    id: "MSG-008",
    customer: "Sophie Anderson",
    customerId: "CUST-009",
    avatar: "SA",
    lastMessage: "The shock absorbers arrived in perfect condition. Brilliant service!",
    timestamp: "4 days ago",
    unread: 0,
    quoteId: "Q-009",
    part: "Shock Absorbers",
  },
  {
    id: "MSG-009",
    customer: "Michael Davies",
    customerId: "CUST-010",
    avatar: "MD",
    lastMessage: "Could you confirm the part number for the oil filter?",
    timestamp: "1 hour ago",
    unread: 2,
    quoteId: "Q-010",
    part: "Oil Filter",
  },
  {
    id: "MSG-010",
    customer: "Rachel Green",
    customerId: "CUST-011",
    avatar: "RG",
    lastMessage: "Your quote is reasonable. I'll accept it shortly.",
    timestamp: "3 hours ago",
    unread: 1,
    quoteId: "Q-011",
    part: "Windscreen Wipers",
  },
  {
    id: "MSG-011",
    customer: "Peter Jones",
    customerId: "CUST-012",
    avatar: "PJ",
    lastMessage: "Do you have the alternator in stock right now?",
    timestamp: "6 hours ago",
    unread: 0,
    quoteId: "Q-012",
    part: "Alternator",
  },
  {
    id: "MSG-012",
    customer: "Katie Williams",
    customerId: "CUST-013",
    avatar: "KW",
    lastMessage: "Thanks! The spark plugs work perfectly.",
    timestamp: "Yesterday",
    unread: 0,
    quoteId: "Q-013",
    part: "Spark Plugs",
  },
  {
    id: "MSG-013",
    customer: "Andrew Taylor",
    customerId: "CUST-014",
    avatar: "AT",
    lastMessage: "Can you match a competitor's price for the same battery?",
    timestamp: "2 days ago",
    unread: 1,
    quoteId: "Q-014",
    part: "Car Battery",
  },
  {
    id: "MSG-014",
    customer: "Jennifer Clark",
    customerId: "CUST-015",
    avatar: "JC",
    lastMessage: "I need this urgently. How fast can you deliver?",
    timestamp: "3 days ago",
    unread: 3,
    quoteId: "Q-015",
    part: "Fuel Pump",
  },
  {
    id: "MSG-015",
    customer: "Robert Smith",
    customerId: "CUST-016",
    avatar: "RS",
    lastMessage: "The air filter quality exceeded my expectations!",
    timestamp: "5 days ago",
    unread: 0,
    quoteId: "Q-016",
    part: "Air Filter",
  },
  {
    id: "MSG-016",
    customer: "Helen Parker",
    customerId: "CUST-017",
    avatar: "HP",
    lastMessage: "Is installation included in the quoted price?",
    timestamp: "1 week ago",
    unread: 0,
    quoteId: "Q-017",
    part: "Serpentine Belt",
  },
  {
    id: "MSG-017",
    customer: "George Miller",
    customerId: "CUST-018",
    avatar: "GM",
    lastMessage: "Could you send photos of the actual part before I commit?",
    timestamp: "1 week ago",
    unread: 2,
    quoteId: "Q-018",
    part: "Catalytic Converter",
  },
  {
    id: "MSG-018",
    customer: "Amanda Hughes",
    customerId: "CUST-019",
    avatar: "AH",
    lastMessage: "Brilliant communication throughout. Highly recommend!",
    timestamp: "2 weeks ago",
    unread: 0,
    quoteId: "Q-019",
    part: "Wheel Bearings",
  },
  {
    id: "MSG-019",
    customer: "Christopher Lee",
    customerId: "CUST-020",
    avatar: "CL",
    lastMessage: "Are these brake discs compatible with my 2018 model?",
    timestamp: "2 weeks ago",
    unread: 1,
    quoteId: "Q-020",
    part: "Brake Discs",
  },
  {
    id: "MSG-020",
    customer: "Victoria White",
    customerId: "CUST-021",
    avatar: "VW",
    lastMessage: "The steering rack was perfect. Thank you so much!",
    timestamp: "3 weeks ago",
    unread: 0,
    quoteId: "Q-021",
    part: "Steering Rack",
  },
  {
    id: "MSG-021",
    customer: "Benjamin Scott",
    customerId: "CUST-022",
    avatar: "BS",
    lastMessage: "I've changed my mind. Can I cancel my order?",
    timestamp: "3 weeks ago",
    unread: 0,
    quoteId: "Q-022",
    part: "Engine Mount",
  },
  {
    id: "MSG-022",
    customer: "Charlotte Evans",
    customerId: "CUST-023",
    avatar: "CE",
    lastMessage: "Your prices are very competitive. I'll be ordering soon.",
    timestamp: "1 month ago",
    unread: 0,
    quoteId: "Q-023",
    part: "Thermostat",
  },
];

export type ChatMessageRecord = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

export const userChatMessages: ChatMessageRecord[] = [
  {
    id: "MSG-USER-001",
    chatId: "CHAT-001",
    senderId: "USER-001",
    content: "Hi! Thanks for sending the quote so quickly.",
    isRead: true,
    createdAt: "2025-11-25T10:00:00.000Z",
  },
  {
    id: "MSG-USER-002",
    chatId: "CHAT-001",
    senderId: "SUPPLIER-001",
    content: "You're welcome! Would you like us to fit the part as well?",
    isRead: true,
    createdAt: "2025-11-25T10:05:00.000Z",
  },
  {
    id: "MSG-USER-003",
    chatId: "CHAT-002",
    senderId: "SUPPLIER-003",
    content: "We have the radiator in stock and can deliver tomorrow.",
    isRead: false,
    createdAt: "2025-11-24T15:45:00.000Z",
  },
  {
    id: "MSG-USER-004",
    chatId: "CHAT-002",
    senderId: "USER-003",
    content: "Great, please confirm the delivery slot.",
    isRead: false,
    createdAt: "2025-11-24T15:50:00.000Z",
  },
  {
    id: "MSG-USER-005",
    chatId: "CHAT-003",
    senderId: "USER-004",
    content: "Can you share more details about warranty coverage?",
    isRead: true,
    createdAt: "2025-11-23T09:20:00.000Z",
  },
  {
    id: "MSG-USER-006",
    chatId: "CHAT-003",
    senderId: "SUPPLIER-004",
    content: "Absolutely, it includes 12 months parts and labour.",
    isRead: true,
    createdAt: "2025-11-23T09:22:00.000Z",
  },
];

export const supplierChatMessages: ChatMessageRecord[] = [
  {
    id: "MSG-SUP-001",
    chatId: "CHAT-010",
    senderId: "SUPPLIER-201",
    content: "Thanks for accepting the quote. When would you like to collect?",
    isRead: false,
    createdAt: "2025-11-25T11:05:00.000Z",
  },
  {
    id: "MSG-SUP-002",
    chatId: "CHAT-010",
    senderId: "USER-210",
    content: "Tomorrow morning works best for me.",
    isRead: false,
    createdAt: "2025-11-25T11:07:00.000Z",
  },
  {
    id: "MSG-SUP-003",
    chatId: "CHAT-012",
    senderId: "SUPPLIER-205",
    content: "Just a reminder that the alternator is ready for pickup.",
    isRead: true,
    createdAt: "2025-11-24T08:40:00.000Z",
  },
  {
    id: "MSG-SUP-004",
    chatId: "CHAT-014",
    senderId: "USER-230",
    content: "Appreciate the update. See you later today.",
    isRead: true,
    createdAt: "2025-11-24T16:10:00.000Z",
  },
  {
    id: "MSG-SUP-005",
    chatId: "CHAT-016",
    senderId: "SUPPLIER-220",
    content: "Would you like us to install the serpentine belt after delivery?",
    isRead: false,
    createdAt: "2025-11-23T13:55:00.000Z",
  },
  {
    id: "MSG-SUP-006",
    chatId: "CHAT-016",
    senderId: "USER-245",
    content: "Yes please, installation would be great.",
    isRead: false,
    createdAt: "2025-11-23T14:00:00.000Z",
  },
];

export const quotePerformanceData: QuotePerformancePoint[] = [
  { month: "Jan", sent: 35, accepted: 22, revenue: 3420 },
  { month: "Feb", sent: 42, accepted: 28, revenue: 4150 },
  { month: "Mar", sent: 38, accepted: 24, revenue: 3890 },
  { month: "Apr", sent: 45, accepted: 31, revenue: 4620 },
  { month: "May", sent: 52, accepted: 35, revenue: 5240 },
  { month: "Jun", sent: 48, accepted: 32, revenue: 4980 },
];

export const categoryBreakdownData: CategoryBreakdownPoint[] = [
  { category: "Engine", quotes: 24, avgPrice: 485 },
  { category: "Brakes", quotes: 18, avgPrice: 215 },
  { category: "Suspension", quotes: 15, avgPrice: 345 },
  { category: "Electrical", quotes: 12, avgPrice: 178 },
  { category: "Bodywork", quotes: 9, avgPrice: 520 },
];
