import { useState } from "react";
import { Header } from "../components/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Separator } from "../components/ui/separator";
import {
  Users,
  Building2,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  MapPin,
  Mail,
  Phone,
  Calendar,
  FileText,
  Award,
  Activity,
  ShoppingCart,
  LayoutDashboard,
  FileWarning,
  Search,
  MessageSquare,
  Eye,
  Trash2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AdminDashboardPageProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalSuccessDialogOpen, setApprovalSuccessDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [userDetailsDialogOpen, setUserDetailsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [reportReviewDialogOpen, setReportReviewDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showAllSuppliers, setShowAllSuppliers] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState<"all" | "active" | "suspended">("all");
  const [supplierDetailsDialogOpen, setSupplierDetailsDialogOpen] = useState(false);
  const [selectedActiveSupplier, setSelectedActiveSupplier] = useState<any>(null);
  const [confirmUserActionDialogOpen, setConfirmUserActionDialogOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [inquiryDetailsDialogOpen, setInquiryDetailsDialogOpen] = useState(false);
  const [inquiryFilter, setInquiryFilter] = useState<"all" | "unread" | "read">("all");
  const [emailSentDialogOpen, setEmailSentDialogOpen] = useState(false);

  const stats = {
    pendingSuppliers: 8,
    activeSuppliers: 142,
    totalUsers: 3547,
    abuseReports: 3,
    monthlyRevenue: 24582,
    conversionRate: 68,
    totalQuotes: 1284,
    totalRequests: 892,
  };

  const [allUsers, setAllUsers] = useState([
    { id: "USR-001", name: "James Wilson", email: "james.wilson@email.co.uk", location: "London, SW1A 1AA", joinedDate: "2024-09-28", role: "Driver", status: "Active" },
    { id: "USR-002", name: "Emily Thompson", email: "emily.thompson@email.co.uk", location: "Manchester, M1 1AA", joinedDate: "2024-09-27", role: "Driver", status: "Active" },
    { id: "USR-003", name: "Oliver Davis", email: "oliver.davis@email.co.uk", location: "Birmingham, B1 1AA", joinedDate: "2024-09-27", role: "Driver", status: "Active" },
    { id: "USR-004", name: "Sophie Anderson", email: "sophie.anderson@email.co.uk", location: "Liverpool, L1 1AA", joinedDate: "2024-09-26", role: "Driver", status: "Active" },
    { id: "USR-005", name: "Harry Roberts", email: "harry.roberts@email.co.uk", location: "Leeds, LS1 1AA", joinedDate: "2024-09-26", role: "Driver", status: "Suspended" },
    { id: "USR-006", name: "Amelia Clark", email: "amelia.clark@email.co.uk", location: "Bristol, BS1 1AA", joinedDate: "2024-09-25", role: "Driver", status: "Active" },
    { id: "USR-007", name: "George Martin", email: "george.martin@email.co.uk", location: "Sheffield, S1 1AA", joinedDate: "2024-09-25", role: "Driver", status: "Active" },
    { id: "USR-008", name: "Isabella White", email: "isabella.white@email.co.uk", location: "Newcastle, NE1 1AA", joinedDate: "2024-09-24", role: "Driver", status: "Active" },
    { id: "USR-009", name: "Jack Thomas", email: "jack.thomas@email.co.uk", location: "Cardiff, CF1 1AA", joinedDate: "2024-09-24", role: "Driver", status: "Active" },
    { id: "USR-010", name: "Olivia Harris", email: "olivia.harris@email.co.uk", location: "Edinburgh, EH1 1AA", joinedDate: "2024-09-23", role: "Driver", status: "Active" },
    { id: "USR-011", name: "William Turner", email: "william.turner@email.co.uk", location: "Glasgow, G1 1AA", joinedDate: "2024-09-23", role: "Driver", status: "Active" },
    { id: "USR-012", name: "Charlotte Evans", email: "charlotte.evans@email.co.uk", location: "Nottingham, NG1 1AA", joinedDate: "2024-09-22", role: "Driver", status: "Active" },
    { id: "USR-013", name: "Thomas Moore", email: "thomas.moore@email.co.uk", location: "Leicester, LE1 1AA", joinedDate: "2024-09-22", role: "Driver", status: "Suspended" },
    { id: "USR-014", name: "Mia Robinson", email: "mia.robinson@email.co.uk", location: "Southampton, SO14 1AA", joinedDate: "2024-09-21", role: "Driver", status: "Active" },
    { id: "USR-015", name: "Daniel Walker", email: "daniel.walker@email.co.uk", location: "Oxford, OX1 1AA", joinedDate: "2024-09-21", role: "Driver", status: "Active" },
    { id: "USR-016", name: "Ella Hughes", email: "ella.hughes@email.co.uk", location: "Cambridge, CB1 1AA", joinedDate: "2024-09-20", role: "Driver", status: "Active" },
    { id: "USR-017", name: "Benjamin Wright", email: "benjamin.wright@email.co.uk", location: "Portsmouth, PO1 1AA", joinedDate: "2024-09-20", role: "Driver", status: "Active" },
    { id: "USR-018", name: "Grace Taylor", email: "grace.taylor@email.co.uk", location: "York, YO1 1AA", joinedDate: "2024-09-19", role: "Driver", status: "Active" },
    { id: "USR-019", name: "Lucas Green", email: "lucas.green@email.co.uk", location: "Coventry, CV1 1AA", joinedDate: "2024-09-19", role: "Driver", status: "Active" },
    { id: "USR-020", name: "Lily Hall", email: "lily.hall@email.co.uk", location: "Brighton, BN1 1AA", joinedDate: "2024-09-18", role: "Driver", status: "Active" },
    { id: "USR-021", name: "Noah Baker", email: "noah.baker@email.co.uk", location: "Derby, DE1 1AA", joinedDate: "2024-09-18", role: "Driver", status: "Active" },
    { id: "USR-022", name: "Freya King", email: "freya.king@email.co.uk", location: "Plymouth, PL1 1AA", joinedDate: "2024-09-17", role: "Driver", status: "Suspended" },
    { id: "USR-023", name: "Ethan Scott", email: "ethan.scott@email.co.uk", location: "Swansea, SA1 1AA", joinedDate: "2024-09-17", role: "Driver", status: "Active" },
    { id: "USR-024", name: "Ava Mitchell", email: "ava.mitchell@email.co.uk", location: "Reading, RG1 1AA", joinedDate: "2024-09-16", role: "Driver", status: "Active" },
    { id: "USR-025", name: "Alexander Ward", email: "alexander.ward@email.co.uk", location: "Wolverhampton, WV1 1AA", joinedDate: "2024-09-16", role: "Driver", status: "Active" },
    { id: "USR-026", name: "Poppy Foster", email: "poppy.foster@email.co.uk", location: "Aberdeen, AB10 1AA", joinedDate: "2024-09-15", role: "Driver", status: "Active" },
    { id: "USR-027", name: "Joshua Cooper", email: "joshua.cooper@email.co.uk", location: "Stoke, ST1 1AA", joinedDate: "2024-09-15", role: "Driver", status: "Active" },
    { id: "USR-028", name: "Scarlett Reed", email: "scarlett.reed@email.co.uk", location: "Hull, HU1 1AA", joinedDate: "2024-09-14", role: "Driver", status: "Active" },
    { id: "USR-029", name: "Samuel Morgan", email: "samuel.morgan@email.co.uk", location: "Preston, PR1 1AA", joinedDate: "2024-09-14", role: "Driver", status: "Active" },
    { id: "USR-030", name: "Ruby Barnes", email: "ruby.barnes@email.co.uk", location: "Norwich, NR1 1AA", joinedDate: "2024-09-13", role: "Driver", status: "Suspended" },
    { id: "USR-031", name: "Joseph Bell", email: "joseph.bell@email.co.uk", location: "Bournemouth, BH1 1AA", joinedDate: "2024-09-13", role: "Driver", status: "Active" },
    { id: "USR-032", name: "Daisy Wood", email: "daisy.wood@email.co.uk", location: "Sunderland, SR1 1AA", joinedDate: "2024-09-12", role: "Driver", status: "Active" },
    { id: "USR-033", name: "Henry Price", email: "henry.price@email.co.uk", location: "Dundee, DD1 1AA", joinedDate: "2024-09-12", role: "Driver", status: "Active" },
    { id: "USR-034", name: "Isabelle Cox", email: "isabelle.cox@email.co.uk", location: "Exeter, EX1 1AA", joinedDate: "2024-09-11", role: "Driver", status: "Active" },
    { id: "USR-035", name: "Charlie Watson", email: "charlie.watson@email.co.uk", location: "Ipswich, IP1 1AA", joinedDate: "2024-09-11", role: "Driver", status: "Active" },
    { id: "USR-036", name: "Florence Murphy", email: "florence.murphy@email.co.uk", location: "Middlesbrough, TS1 1AA", joinedDate: "2024-09-10", role: "Driver", status: "Active" },
    { id: "USR-037", name: "Alfie Collins", email: "alfie.collins@email.co.uk", location: "Warrington, WA1 1AA", joinedDate: "2024-09-10", role: "Driver", status: "Active" },
    { id: "USR-038", name: "Evie Russell", email: "evie.russell@email.co.uk", location: "Luton, LU1 1AA", joinedDate: "2024-09-09", role: "Driver", status: "Suspended" },
    { id: "USR-039", name: "Oscar Butler", email: "oscar.butler@email.co.uk", location: "Northampton, NN1 1AA", joinedDate: "2024-09-09", role: "Driver", status: "Active" },
    { id: "USR-040", name: "Chloe Gray", email: "chloe.gray@email.co.uk", location: "Bath, BA1 1AA", joinedDate: "2024-09-08", role: "Driver", status: "Active" },
    { id: "USR-041", name: "Leo Powell", email: "leo.powell@email.co.uk", location: "Cheltenham, GL50 1AA", joinedDate: "2024-09-08", role: "Driver", status: "Active" },
    { id: "USR-042", name: "Sienna James", email: "sienna.james@email.co.uk", location: "Gloucester, GL1 1AA", joinedDate: "2024-09-07", role: "Driver", status: "Active" },
    { id: "USR-043", name: "Freddie Hayes", email: "freddie.hayes@email.co.uk", location: "Salisbury, SP1 1AA", joinedDate: "2024-09-07", role: "Driver", status: "Active" },
    { id: "USR-044", name: "Sophia Bennett", email: "sophia.bennett@email.co.uk", location: "Worcester, WR1 1AA", joinedDate: "2024-09-06", role: "Driver", status: "Active" },
    { id: "USR-045", name: "Archie Richardson", email: "archie.richardson@email.co.uk", location: "Chester, CH1 1AA", joinedDate: "2024-09-06", role: "Driver", status: "Suspended" },
    { id: "USR-046", name: "Phoebe Ross", email: "phoebe.ross@email.co.uk", location: "Blackpool, FY1 1AA", joinedDate: "2024-09-05", role: "Driver", status: "Active" },
    { id: "USR-047", name: "Max Chapman", email: "max.chapman@email.co.uk", location: "Lancaster, LA1 1AA", joinedDate: "2024-09-05", role: "Driver", status: "Active" },
    { id: "USR-048", name: "Alice Jenkins", email: "alice.jenkins@email.co.uk", location: "Durham, DH1 1AA", joinedDate: "2024-09-04", role: "Driver", status: "Active" },
    { id: "USR-049", name: "Harrison Shaw", email: "harrison.shaw@email.co.uk", location: "Carlisle, CA1 1AA", joinedDate: "2024-09-04", role: "Driver", status: "Active" },
    { id: "USR-050", name: "Millie Palmer", email: "millie.palmer@email.co.uk", location: "Lincoln, LN1 1AA", joinedDate: "2024-09-03", role: "Driver", status: "Active" },
    { id: "USR-051", name: "Sebastian Fox", email: "sebastian.fox@email.co.uk", location: "Peterborough, PE1 1AA", joinedDate: "2024-09-03", role: "Driver", status: "Active" },
    { id: "USR-052", name: "Matilda Hunt", email: "matilda.hunt@email.co.uk", location: "Canterbury, CT1 1AA", joinedDate: "2024-09-02", role: "Driver", status: "Suspended" },
    { id: "USR-053", name: "Arthur Long", email: "arthur.long@email.co.uk", location: "Winchester, SO23 1AA", joinedDate: "2024-09-02", role: "Driver", status: "Active" },
    { id: "USR-054", name: "Rosie Mills", email: "rosie.mills@email.co.uk", location: "Stirling, FK8 1AA", joinedDate: "2024-09-01", role: "Driver", status: "Active" },
    { id: "USR-055", name: "Theodore Ellis", email: "theodore.ellis@email.co.uk", location: "Inverness, IV1 1AA", joinedDate: "2024-09-01", role: "Driver", status: "Active" },
    { id: "USR-056", name: "Maya Richards", email: "maya.richards@email.co.uk", location: "Truro, TR1 1AA", joinedDate: "2024-08-31", role: "Driver", status: "Active" },
    { id: "USR-057", name: "Louis Carter", email: "louis.carter@email.co.uk", location: "Hereford, HR1 1AA", joinedDate: "2024-08-31", role: "Driver", status: "Active" },
    { id: "USR-058", name: "Violet Dixon", email: "violet.dixon@email.co.uk", location: "Shrewsbury, SY1 1AA", joinedDate: "2024-08-30", role: "Driver", status: "Active" },
    { id: "USR-059", name: "Jacob Marshall", email: "jacob.marshall@email.co.uk", location: "Bangor, LL57 1AA", joinedDate: "2024-08-30", role: "Driver", status: "Active" },
    { id: "USR-060", name: "Harriet Hunter", email: "harriet.hunter@email.co.uk", location: "Newport, NP20 1AA", joinedDate: "2024-08-29", role: "Driver", status: "Suspended" },
    { id: "USR-061", name: "Edward Webb", email: "edward.webb@email.co.uk", location: "Wrexham, LL11 1AA", joinedDate: "2024-08-29", role: "Driver", status: "Active" },
    { id: "USR-062", name: "Elsie Harvey", email: "elsie.harvey@email.co.uk", location: "Colchester, CO1 1AA", joinedDate: "2024-08-28", role: "Driver", status: "Active" },
    { id: "USR-063", name: "Finley Stevens", email: "finley.stevens@email.co.uk", location: "Chelmsford, CM1 1AA", joinedDate: "2024-08-28", role: "Driver", status: "Active" },
    { id: "USR-064", name: "Penelope Grant", email: "penelope.grant@email.co.uk", location: "Maidstone, ME14 1AA", joinedDate: "2024-08-27", role: "Driver", status: "Active" },
    { id: "USR-065", name: "Zachary Mason", email: "zachary.mason@email.co.uk", location: "Guildford, GU1 1AA", joinedDate: "2024-08-27", role: "Driver", status: "Active" },
    { id: "USR-066", name: "Jasmine Armstrong", email: "jasmine.armstrong@email.co.uk", location: "Southend, SS1 1AA", joinedDate: "2024-08-26", role: "Driver", status: "Active" },
    { id: "USR-067", name: "Liam Howard", email: "liam.howard@email.co.uk", location: "Slough, SL1 1AA", joinedDate: "2024-08-26", role: "Driver", status: "Active" },
    { id: "USR-068", name: "Esme Fuller", email: "esme.fuller@email.co.uk", location: "Basildon, SS14 1AA", joinedDate: "2024-08-25", role: "Driver", status: "Suspended" },
    { id: "USR-069", name: "Isaac Barnes", email: "isaac.barnes@email.co.uk", location: "Basingstoke, RG21 1AA", joinedDate: "2024-08-25", role: "Driver", status: "Active" },
    { id: "USR-070", name: "Layla Spencer", email: "layla.spencer@email.co.uk", location: "Crawley, RH10 1AA", joinedDate: "2024-08-24", role: "Driver", status: "Active" },
    { id: "USR-071", name: "Reuben Owen", email: "reuben.owen@email.co.uk", location: "Harrogate, HG1 1AA", joinedDate: "2024-08-24", role: "Driver", status: "Active" },
    { id: "USR-072", name: "Emilia Stone", email: "emilia.stone@email.co.uk", location: "Watford, WD17 1AA", joinedDate: "2024-08-23", role: "Driver", status: "Active" },
    { id: "USR-073", name: "Cameron Gardner", email: "cameron.gardner@email.co.uk", location: "Stevenage, SG1 1AA", joinedDate: "2024-08-23", role: "Driver", status: "Active" },
    { id: "USR-074", name: "Maisie Knight", email: "maisie.knight@email.co.uk", location: "St Albans, AL1 1AA", joinedDate: "2024-08-22", role: "Driver", status: "Active" },
    { id: "USR-075", name: "Dylan Simpson", email: "dylan.simpson@email.co.uk", location: "Hemel Hempstead, HP1 1AA", joinedDate: "2024-08-22", role: "Driver", status: "Suspended" },
    { id: "USR-076", name: "Amelie West", email: "amelie.west@email.co.uk", location: "High Wycombe, HP11 1AA", joinedDate: "2024-08-21", role: "Driver", status: "Active" },
    { id: "USR-077", name: "Adam Pearce", email: "adam.pearce@email.co.uk", location: "Aylesbury, HP20 1AA", joinedDate: "2024-08-21", role: "Driver", status: "Active" },
    { id: "USR-078", name: "Aurora Cole", email: "aurora.cole@email.co.uk", location: "Milton Keynes, MK9 1AA", joinedDate: "2024-08-20", role: "Driver", status: "Active" },
    { id: "USR-079", name: "Jude Duncan", email: "jude.duncan@email.co.uk", location: "Wigan, WN1 1AA", joinedDate: "2024-08-20", role: "Driver", status: "Active" },
    { id: "USR-080", name: "Arabella Holmes", email: "arabella.holmes@email.co.uk", location: "Bolton, BL1 1AA", joinedDate: "2024-08-19", role: "Driver", status: "Active" },
    { id: "USR-081", name: "Felix Patterson", email: "felix.patterson@email.co.uk", location: "Stockport, SK1 1AA", joinedDate: "2024-08-19", role: "Driver", status: "Active" },
    { id: "USR-082", name: "Beatrice Fletcher", email: "beatrice.fletcher@email.co.uk", location: "Rochdale, OL16 1AA", joinedDate: "2024-08-18", role: "Driver", status: "Suspended" },
    { id: "USR-083", name: "Tobias Boyd", email: "tobias.boyd@email.co.uk", location: "Oldham, OL1 1AA", joinedDate: "2024-08-18", role: "Driver", status: "Active" },
    { id: "USR-084", name: "Imogen Palmer", email: "imogen.palmer@email.co.uk", location: "Burnley, BB11 1AA", joinedDate: "2024-08-17", role: "Driver", status: "Active" },
    { id: "USR-085", name: "Caleb Riley", email: "caleb.riley@email.co.uk", location: "Blackburn, BB1 1AA", joinedDate: "2024-08-17", role: "Driver", status: "Active" },
    { id: "USR-086", name: "Darcie Ford", email: "darcie.ford@email.co.uk", location: "Huddersfield, HD1 1AA", joinedDate: "2024-08-16", role: "Driver", status: "Active" },
    { id: "USR-087", name: "Elliot Pierce", email: "elliot.pierce@email.co.uk", location: "Bradford, BD1 1AA", joinedDate: "2024-08-16", role: "Driver", status: "Active" },
    { id: "USR-088", name: "Iris Berry", email: "iris.berry@email.co.uk", location: "Wakefield, WF1 1AA", joinedDate: "2024-08-15", role: "Driver", status: "Active" },
    { id: "USR-089", name: "Nathan Lane", email: "nathan.lane@email.co.uk", location: "Doncaster, DN1 1AA", joinedDate: "2024-08-15", role: "Driver", status: "Active" },
    { id: "USR-090", name: "Bonnie Francis", email: "bonnie.francis@email.co.uk", location: "Rotherham, S60 1AA", joinedDate: "2024-08-14", role: "Driver", status: "Suspended" },
    { id: "USR-091", name: "Austin Grant", email: "austin.grant@email.co.uk", location: "Barnsley, S70 1AA", joinedDate: "2024-08-14", role: "Driver", status: "Active" },
    { id: "USR-092", name: "Ivy Chapman", email: "ivy.chapman@email.co.uk", location: "Chesterfield, S40 1AA", joinedDate: "2024-08-13", role: "Driver", status: "Active" },
    { id: "USR-093", name: "Jayden Wells", email: "jayden.wells@email.co.uk", location: "Mansfield, NG18 1AA", joinedDate: "2024-08-13", role: "Driver", status: "Active" },
    { id: "USR-094", name: "Orla Hunt", email: "orla.hunt@email.co.uk", location: "Grimsby, DN31 1AA", joinedDate: "2024-08-12", role: "Driver", status: "Active" },
    { id: "USR-095", name: "Blake Douglas", email: "blake.douglas@email.co.uk", location: "Scunthorpe, DN15 1AA", joinedDate: "2024-08-12", role: "Driver", status: "Active" },
    { id: "USR-096", name: "Lottie Simpson", email: "lottie.simpson@email.co.uk", location: "Telford, TF1 1AA", joinedDate: "2024-08-11", role: "Driver", status: "Active" },
    { id: "USR-097", name: "Ezra Ferguson", email: "ezra.ferguson@email.co.uk", location: "Nuneaton, CV10 1AA", joinedDate: "2024-08-11", role: "Driver", status: "Active" },
    { id: "USR-098", name: "Willow Davies", email: "willow.davies@email.co.uk", location: "Eastbourne, BN21 1AA", joinedDate: "2024-08-10", role: "Driver", status: "Suspended" },
    { id: "USR-099", name: "Kai Henderson", email: "kai.henderson@email.co.uk", location: "Hastings, TN34 1AA", joinedDate: "2024-08-10", role: "Driver", status: "Active" },
  ]);

  const [allSuppliers] = useState([
    { id: "SUP-001", name: "AutoParts Direct Ltd", location: "London", rating: 4.8, quotes: 234, status: "Active", joined: "2023-08-12", categories: ["Engine", "Brakes"], email: "contact@autopartsdirect.co.uk", phone: "020 1234 5678", businessAddress: "45 High Street, London, E1 6AN", registrationNumber: "12345678", vatNumber: "GB123456789", yearsInBusiness: 8, description: "Leading supplier of quality automotive parts with 8 years of experience serving the UK market.", appliedDate: "2023-07-15", docsComplete: true },
    { id: "SUP-002", name: "BrakeMasters UK", location: "Manchester", rating: 4.9, quotes: 189, status: "Active", joined: "2023-09-20", categories: ["Brakes", "Suspension"], email: "info@brakemasters.co.uk", phone: "0161 234 5678", businessAddress: "78 Market Street, Manchester, M1 1PW", registrationNumber: "87654321", vatNumber: "GB987654321", yearsInBusiness: 12, description: "Specialist brake and suspension parts supplier with nationwide delivery.", appliedDate: "2023-08-28", docsComplete: true },
    { id: "SUP-003", name: "Engine Experts Ltd", location: "Birmingham", rating: 4.7, quotes: 156, status: "Active", joined: "2023-10-05", categories: ["Engine", "Electrical"], email: "sales@engineexperts.co.uk", phone: "0121 345 6789", businessAddress: "23 Station Road, Birmingham, B2 4QA", registrationNumber: "23456789", vatNumber: "GB234567890", yearsInBusiness: 15, description: "Expert engine and electrical parts supplier with comprehensive stock.", appliedDate: "2023-09-12", docsComplete: true },
    { id: "SUP-004", name: "CarCare Solutions", location: "Leeds", rating: 4.6, quotes: 145, status: "Active", joined: "2023-11-15", categories: ["Bodywork", "Interior"], email: "hello@carcaresolutions.co.uk", phone: "0113 456 7890", businessAddress: "56 Main Avenue, Leeds, LS1 5DL", registrationNumber: "34567890", vatNumber: "GB345678901", yearsInBusiness: 6, description: "Quality bodywork and interior parts for all vehicle makes and models.", appliedDate: "2023-10-20", docsComplete: true },
    { id: "SUP-005", name: "Suspension Pro", location: "Bristol", rating: 4.8, quotes: 178, status: "Active", joined: "2024-01-08", categories: ["Suspension", "Brakes"], email: "contact@suspensionpro.co.uk", phone: "0117 567 8901", businessAddress: "89 Park Lane, Bristol, BS1 5TR", registrationNumber: "45678901", vatNumber: "GB456789012", yearsInBusiness: 10, description: "Professional suspension and brake specialists with fast delivery service.", appliedDate: "2023-12-10", docsComplete: true },
    { id: "SUP-006", name: "Transmission Specialists", location: "Glasgow", rating: 4.7, quotes: 167, status: "Active", joined: "2024-01-22", categories: ["Engine", "Transmission"], email: "info@transmissionspecialists.co.uk", phone: "0141 234 5678", businessAddress: "34 Industrial Way, Glasgow, G2 1AA", registrationNumber: "56789012", vatNumber: "GB567890123", yearsInBusiness: 9, description: "Specialist transmission and engine parts with expert technical support.", appliedDate: "2023-12-28", docsComplete: true },
    { id: "SUP-007", name: "EcoParts Ltd", location: "Edinburgh", rating: 4.9, quotes: 201, status: "Active", joined: "2024-02-05", categories: ["Electrical", "Engine"], email: "sales@ecoparts.co.uk", phone: "0131 345 6789", businessAddress: "12 Green Street, Edinburgh, EH2 2BB", registrationNumber: "67890123", vatNumber: "GB678901234", yearsInBusiness: 5, description: "Eco-friendly and sustainable automotive parts supplier.", appliedDate: "2024-01-10", docsComplete: true },
    { id: "SUP-008", name: "Performance Parts Pro", location: "Liverpool", rating: 4.6, quotes: 134, status: "Active", joined: "2024-02-18", categories: ["Engine", "Brakes"], email: "contact@performancepartspro.co.uk", phone: "0151 456 7890", businessAddress: "67 Motor Lane, Liverpool, L2 3CC", registrationNumber: "78901234", vatNumber: "GB789012345", yearsInBusiness: 7, description: "High-performance parts for all makes and models.", appliedDate: "2024-01-25", docsComplete: true },
    { id: "SUP-009", name: "Classic Car Components", location: "Oxford", rating: 4.8, quotes: 198, status: "Active", joined: "2024-03-02", categories: ["Bodywork", "Interior"], email: "hello@classiccarcomponents.co.uk", phone: "01865 567 8901", businessAddress: "89 Heritage Road, Oxford, OX3 4DD", registrationNumber: "89012345", vatNumber: "GB890123456", yearsInBusiness: 14, description: "Specialist in classic and vintage car parts.", appliedDate: "2024-02-08", docsComplete: true },
    { id: "SUP-010", name: "TyreTech Solutions", location: "Cardiff", rating: 4.7, quotes: 176, status: "Active", joined: "2024-03-15", categories: ["Suspension", "Brakes"], email: "info@tyretech.co.uk", phone: "029 2034 5678", businessAddress: "45 Valley Street, Cardiff, CF4 5EE", registrationNumber: "90123456", vatNumber: "GB901234567", yearsInBusiness: 11, description: "Comprehensive tyre and suspension solutions.", appliedDate: "2024-02-20", docsComplete: true },
    { id: "SUP-011", name: "AutoElectric UK", location: "Newcastle", rating: 4.9, quotes: 212, status: "Active", joined: "2024-03-28", categories: ["Electrical", "Interior"], email: "sales@autoelectric.co.uk", phone: "0191 678 9012", businessAddress: "23 Circuit Avenue, Newcastle, NE5 6FF", registrationNumber: "01234567", vatNumber: "GB012345678", yearsInBusiness: 8, description: "Electrical systems and interior components specialist.", appliedDate: "2024-03-05", docsComplete: true },
    { id: "SUP-012", name: "BodyShop Supplies", location: "Southampton", rating: 4.6, quotes: 143, status: "Active", joined: "2024-04-10", categories: ["Bodywork", "Interior"], email: "contact@bodyshopsupplies.co.uk", phone: "023 8012 3456", businessAddress: "78 Marine Drive, Southampton, SO6 7GG", registrationNumber: "12345670", vatNumber: "GB123456780", yearsInBusiness: 6, description: "Complete bodywork and paint supplies for professionals.", appliedDate: "2024-03-18", docsComplete: true },
    { id: "SUP-013", name: "Diesel Parts Direct", location: "Nottingham", rating: 4.8, quotes: 187, status: "Active", joined: "2024-04-23", categories: ["Engine", "Electrical"], email: "info@dieselpartsdirect.co.uk", phone: "0115 234 5678", businessAddress: "34 Commerce Road, Nottingham, NG7 8HH", registrationNumber: "23456701", vatNumber: "GB234567801", yearsInBusiness: 13, description: "Specialist diesel engine parts and components.", appliedDate: "2024-04-01", docsComplete: true },
    { id: "SUP-014", name: "Continental Auto Parts", location: "Leicester", rating: 4.7, quotes: 165, status: "Active", joined: "2024-05-06", categories: ["Engine", "Brakes"], email: "sales@continentalauto.co.uk", phone: "0116 345 6789", businessAddress: "56 International Way, Leicester, LE8 9II", registrationNumber: "34567012", vatNumber: "GB345670812", yearsInBusiness: 10, description: "European and continental car parts specialist.", appliedDate: "2024-04-15", docsComplete: true },
    { id: "SUP-015", name: "QuickFit Components", location: "Sheffield", rating: 4.9, quotes: 223, status: "Active", joined: "2024-05-19", categories: ["Suspension", "Brakes"], email: "contact@quickfit.co.uk", phone: "0114 456 7890", businessAddress: "12 Speed Lane, Sheffield, S9 0JJ", registrationNumber: "45670123", vatNumber: "GB456701823", yearsInBusiness: 7, description: "Fast-fit components with same-day delivery options.", appliedDate: "2024-04-28", docsComplete: true },
    { id: "SUP-016", name: "Heritage Motors Supply", location: "Cambridge", rating: 4.6, quotes: 131, status: "Active", joined: "2024-06-01", categories: ["Engine", "Interior"], email: "hello@heritagemotors.co.uk", phone: "01223 567 8901", businessAddress: "89 Scholar Road, Cambridge, CB0 1KK", registrationNumber: "56701234", vatNumber: "GB567012834", yearsInBusiness: 16, description: "Classic and modern parts with heritage expertise.", appliedDate: "2024-05-10", docsComplete: true },
    { id: "SUP-017", name: "Commercial Vehicle Parts", location: "Portsmouth", rating: 4.8, quotes: 194, status: "Active", joined: "2024-06-14", categories: ["Engine", "Suspension"], email: "info@commercialvehicleparts.co.uk", phone: "023 9234 5678", businessAddress: "45 Dock Street, Portsmouth, PO1 2LL", registrationNumber: "67012345", vatNumber: "GB670123845", yearsInBusiness: 9, description: "Specialist in commercial and heavy vehicle parts.", appliedDate: "2024-05-23", docsComplete: true },
    { id: "SUP-018", name: "Motorsport Components", location: "Coventry", rating: 4.7, quotes: 172, status: "Active", joined: "2024-06-27", categories: ["Engine", "Brakes"], email: "sales@motorsportcomponents.co.uk", phone: "024 7678 9012", businessAddress: "23 Racing Circuit, Coventry, CV2 3MM", registrationNumber: "70123456", vatNumber: "GB701234856", yearsInBusiness: 11, description: "High-performance motorsport parts and accessories.", appliedDate: "2024-06-05", docsComplete: true },
    { id: "SUP-019", name: "Green Auto Solutions", location: "Brighton", rating: 4.9, quotes: 208, status: "Active", joined: "2024-07-10", categories: ["Electrical", "Engine"], email: "contact@greenautosolutions.co.uk", phone: "01273 890 1234", businessAddress: "67 Coastal Road, Brighton, BN3 4NN", registrationNumber: "01234568", vatNumber: "GB012345687", yearsInBusiness: 5, description: "Sustainable and eco-friendly automotive solutions.", appliedDate: "2024-06-18", docsComplete: true },
    { id: "SUP-020", name: "Precision Engineering Parts", location: "Norwich", rating: 4.6, quotes: 148, status: "Active", joined: "2024-07-23", categories: ["Engine", "Suspension"], email: "info@precisionengineering.co.uk", phone: "01603 012 3456", businessAddress: "34 Technical Avenue, Norwich, NR4 5OO", registrationNumber: "12345608", vatNumber: "GB123456087", yearsInBusiness: 12, description: "Precision-engineered parts for demanding applications.", appliedDate: "2024-07-01", docsComplete: true },
    { id: "SUP-021", name: "Budget Auto Parts", location: "Plymouth", rating: 4.7, quotes: 181, status: "Active", joined: "2024-08-05", categories: ["Brakes", "Suspension"], email: "sales@budgetautoparts.co.uk", phone: "01752 123 4567", businessAddress: "78 Harbour Way, Plymouth, PL5 6PP", registrationNumber: "23456018", vatNumber: "GB234560187", yearsInBusiness: 8, description: "Affordable quality parts without compromise.", appliedDate: "2024-07-14", docsComplete: true },
    { id: "SUP-022", name: "Premium Vehicle Components", location: "Derby", rating: 4.8, quotes: 195, status: "Active", joined: "2024-08-18", categories: ["Interior", "Bodywork"], email: "contact@premiumvehicle.co.uk", phone: "01332 234 5678", businessAddress: "12 Luxury Lane, Derby, DE6 7QQ", registrationNumber: "34560128", vatNumber: "GB345601287", yearsInBusiness: 10, description: "Premium-grade vehicle components and accessories.", appliedDate: "2024-07-27", docsComplete: true },
    { id: "SUP-023", name: "Fleet Parts Specialist", location: "Wolverhampton", rating: 4.9, quotes: 217, status: "Active", joined: "2024-09-01", categories: ["Engine", "Electrical"], email: "info@fleetparts.co.uk", phone: "01902 345 6789", businessAddress: "56 Industrial Park, Wolverhampton, WV7 8RR", registrationNumber: "45601238", vatNumber: "GB456012387", yearsInBusiness: 14, description: "Fleet management and bulk supply specialist.", appliedDate: "2024-08-10", docsComplete: true },
    { id: "SUP-024", name: "Hybrid Tech Parts", location: "Reading", rating: 4.7, quotes: 169, status: "Active", joined: "2024-09-14", categories: ["Electrical", "Engine"], email: "sales@hybridtechparts.co.uk", phone: "0118 456 7890", businessAddress: "89 Future Drive, Reading, RG8 9SS", registrationNumber: "56012348", vatNumber: "GB560123487", yearsInBusiness: 6, description: "Specialist in hybrid and electric vehicle components.", appliedDate: "2024-08-23", docsComplete: true },
    { id: "SUP-025", name: "Classic British Motors", location: "Bath", rating: 4.8, quotes: 192, status: "Active", joined: "2024-09-27", categories: ["Engine", "Interior"], email: "contact@classicbritish.co.uk", phone: "01225 567 8901", businessAddress: "23 Heritage Street, Bath, BA9 0TT", registrationNumber: "60123458", vatNumber: "GB601234587", yearsInBusiness: 18, description: "Authentic British classic car parts and restoration.", appliedDate: "2024-09-05", docsComplete: true },
    { id: "SUP-026", name: "4x4 Parts Centre", location: "Exeter", rating: 4.6, quotes: 156, status: "Active", joined: "2024-10-10", categories: ["Suspension", "Engine"], email: "info@4x4parts.co.uk", phone: "01392 678 9012", businessAddress: "45 Off-Road Way, Exeter, EX0 1UU", registrationNumber: "01234598", vatNumber: "GB012345987", yearsInBusiness: 9, description: "Specialist 4x4 and off-road vehicle parts.", appliedDate: "2024-09-18", docsComplete: true },
    { id: "SUP-027", name: "Van Parts Direct", location: "Stoke-on-Trent", rating: 4.9, quotes: 226, status: "Active", joined: "2024-10-23", categories: ["Engine", "Brakes"], email: "sales@vanpartsdirect.co.uk", phone: "01782 789 0123", businessAddress: "67 Commercial Road, Stoke-on-Trent, ST1 2VV", registrationNumber: "12345098", vatNumber: "GB123450987", yearsInBusiness: 11, description: "Complete van parts and accessories supplier.", appliedDate: "2024-10-01", docsComplete: true },
    { id: "SUP-028", name: "European Car Specialists", location: "Milton Keynes", rating: 4.7, quotes: 173, status: "Active", joined: "2024-11-05", categories: ["Electrical", "Brakes"], email: "contact@europeancar.co.uk", phone: "01908 890 1234", businessAddress: "34 Continental Avenue, Milton Keynes, MK2 3WW", registrationNumber: "23450198", vatNumber: "GB234501987", yearsInBusiness: 13, description: "European vehicle parts import specialist.", appliedDate: "2024-10-14", docsComplete: true },
    { id: "SUP-029", name: "Performance Tuning Parts", location: "Bournemouth", rating: 4.8, quotes: 189, status: "Active", joined: "2024-11-18", categories: ["Engine", "Electrical"], email: "info@performancetuning.co.uk", phone: "01202 012 3456", businessAddress: "78 Speed Street, Bournemouth, BH3 4XX", registrationNumber: "34501298", vatNumber: "GB345012987", yearsInBusiness: 7, description: "Performance tuning and modification parts.", appliedDate: "2024-10-27", docsComplete: true },
    { id: "SUP-030", name: "Safety First Auto Parts", location: "Sunderland", rating: 4.9, quotes: 211, status: "Active", joined: "2024-12-01", categories: ["Brakes", "Suspension"], email: "sales@safetyfirst.co.uk", phone: "0191 123 4567", businessAddress: "12 Protection Road, Sunderland, SR4 5YY", registrationNumber: "45012398", vatNumber: "GB450123987", yearsInBusiness: 10, description: "Safety-focused brake and suspension specialists.", appliedDate: "2024-11-10", docsComplete: true },
  ]);

  const pendingSuppliers = [
    { id: "SUP-P01", name: "Quality Motors Ltd", location: "Liverpool", email: "info@qualitymotors.co.uk", phone: "0151 234 5678", categories: ["Engine", "Brakes", "Suspension"], appliedDate: "2024-10-25", docsComplete: true, businessAddress: "12 Commercial Road, Liverpool, L1 2AB", registrationNumber: "56789012", vatNumber: "GB567890123", yearsInBusiness: 5, description: "Established supplier specialising in quality engine and brake components." },
    { id: "SUP-P02", name: "Fast Parts Supply", location: "Sheffield", email: "sales@fastparts.co.uk", phone: "0114 345 6789", categories: ["Electrical", "Interior"], appliedDate: "2024-10-24", docsComplete: false, businessAddress: "34 Industrial Estate, Sheffield, S1 3CD", registrationNumber: "67890123", vatNumber: "GB678901234", yearsInBusiness: 3, description: "Fast delivery electrical and interior parts supplier." },
    { id: "SUP-P03", name: "Premium Auto Parts", location: "Newcastle", email: "contact@premiumauto.co.uk", phone: "0191 456 7890", categories: ["Bodywork", "Engine"], appliedDate: "2024-10-23", docsComplete: true, businessAddress: "67 Trading Way, Newcastle, NE1 4EF", registrationNumber: "78901234", vatNumber: "GB789012345", yearsInBusiness: 7, description: "Premium quality bodywork and engine parts distributor." },
  ];

  const abuseReports = [
    { id: "REP-001", reportedBy: "John Smith", reportedUser: "AutoParts Direct Ltd", reason: "Late delivery and poor communication with customer", status: "Under Review", date: "2024-10-26", severity: "Low" },
    { id: "REP-002", reportedBy: "Sarah Jones", reportedUser: "BrakeMasters UK", reason: "Poor quality parts that failed after installation", status: "Resolved", date: "2024-10-25", severity: "Medium" },
    { id: "REP-003", reportedBy: "Mike Brown", reportedUser: "Engine Experts Ltd", reason: "Incorrect parts sent despite correct specification", status: "Under Review", date: "2024-10-24", severity: "High" },
  ];

  const weeklyData = [
    { week: "Week 1", users: 245, suppliers: 12, quotes: 156 },
    { week: "Week 2", users: 298, suppliers: 15, quotes: 189 },
    { week: "Week 3", users: 312, suppliers: 18, quotes: 203 },
    { week: "Week 4", users: 356, suppliers: 21, quotes: 234 },
  ];

  const categoryData = [
    { category: "Engine", requests: 234, avgPrice: 245 },
    { category: "Brakes", requests: 189, avgPrice: 128 },
    { category: "Suspension", requests: 156, avgPrice: 198 },
    { category: "Electrical", requests: 145, avgPrice: 89 },
    { category: "Bodywork", requests: 98, avgPrice: 312 },
  ];

  const revenueData = [
    { week: "Week 1", commission: 2450, fees: 890 },
    { week: "Week 2", commission: 2980, fees: 1020 },
    { week: "Week 3", commission: 3120, fees: 1150 },
    { week: "Week 4", commission: 3560, fees: 1280 },
  ];

  const handleToggleUserStatus = (userId: string) => {
    setAllUsers(users => 
      users.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === "Active" ? "Suspended" : "Active" }
          : user
      )
    );
  };

  // Filter users based on search query and status
  const filteredUsers = allUsers.filter(user => {
    // Filter by search query
    const matchesSearch = !userSearch || (() => {
      const searchLower = userSearch.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.location.toLowerCase().includes(searchLower) ||
        user.id.toLowerCase().includes(searchLower)
      );
    })();
    
    // Filter by status
    const matchesStatus = 
      userStatusFilter === "all" ||
      (userStatusFilter === "active" && user.status === "Active") ||
      (userStatusFilter === "suspended" && user.status === "Suspended");
    
    return matchesSearch && matchesStatus;
  });

  const inquiries = [
    { 
      id: "INQ-001", 
      name: "Sarah Thompson", 
      email: "sarah.thompson@email.co.uk", 
      subject: "Question about supplier verification", 
      message: "Hello, I would like to know more about how you verify your suppliers. What checks do you perform before approving a new supplier on the platform?",
      date: "2024-11-01",
      time: "14:32",
      status: "New",
      category: "General Enquiry"
    },
    { 
      id: "INQ-002", 
      name: "Michael Brown", 
      email: "michael.brown@email.co.uk", 
      subject: "Partnership opportunity", 
      message: "I represent a large automotive parts distributor and we're interested in partnering with your platform. Could we arrange a call to discuss this further?",
      date: "2024-10-31",
      time: "10:15",
      status: "Responded",
      category: "Business Partnership"
    },
    { 
      id: "INQ-003", 
      name: "Emma Wilson", 
      email: "emma.wilson@email.co.uk", 
      subject: "Technical support needed", 
      message: "I'm having trouble uploading photos when requesting a quote. The upload button doesn't seem to be working properly. Can you help?",
      date: "2024-10-30",
      time: "16:48",
      status: "New",
      category: "Technical Support"
    },
    { 
      id: "INQ-004", 
      name: "James Parker", 
      email: "james.parker@email.co.uk", 
      subject: "Feedback on platform", 
      message: "Just wanted to say the platform is brilliant! Found exactly what I needed within hours. The comparison feature is especially useful. Keep up the great work!",
      date: "2024-10-29",
      time: "09:22",
      status: "Responded",
      category: "Feedback"
    },
    { 
      id: "INQ-005", 
      name: "Charlotte Davies", 
      email: "charlotte.davies@email.co.uk", 
      subject: "Delivery tracking question", 
      message: "How can I track my delivery once I've purchased a part? I can't seem to find the tracking information in my account.",
      date: "2024-10-28",
      time: "11:55",
      status: "New",
      category: "General Enquiry"
    },
    { 
      id: "INQ-006", 
      name: "Robert Anderson", 
      email: "robert.anderson@email.co.uk", 
      subject: "Request for invoice", 
      message: "Could you please send me a VAT invoice for my recent purchase (Order #12345)? I need it for my business records.",
      date: "2024-10-27",
      time: "13:40",
      status: "Responded",
      category: "Billing"
    },
    { 
      id: "INQ-007", 
      name: "Lucy Martin", 
      email: "lucy.martin@email.co.uk", 
      subject: "Account deletion request", 
      message: "I would like to delete my account and all associated data. Please confirm how to proceed with this request.",
      date: "2024-10-26",
      time: "15:18",
      status: "New",
      category: "Account Management"
    },
    { 
      id: "INQ-008", 
      name: "David Taylor", 
      email: "david.taylor@email.co.uk", 
      subject: "Question about returns policy", 
      message: "What is your returns policy if the part I receive is not the correct one? Do suppliers handle returns individually or is there a platform-wide policy?",
      date: "2024-10-25",
      time: "08:45",
      status: "Responded",
      category: "Returns & Refunds"
    }
  ];

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "suppliers", label: "Suppliers", icon: Building2 },
    { id: "inquiries", label: "Inquiries", icon: MessageSquare },
    { id: "reports", label: "Reports", icon: FileWarning },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEF3F2] via-white to-[#FEF3F2]">
      <Header onNavigate={onNavigate} currentPage="admin-dashboard" />

      <div className="flex mt-[72px]">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-[#E5E7EB] min-h-[calc(100vh-72px)] bg-gradient-to-b from-[#FEF3F2] to-[#FEE2E2]/50 sticky top-[72px] h-[calc(100vh-72px)]">
          <div className="p-6">
            <h2 className="font-['Inter'] text-[#0F172A] mb-1">Admin Dashboard</h2>
            <p className="text-sm text-[#475569] font-['Roboto']">Platform management</p>
          </div>
          
          <nav className="px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-full mb-1 transition-all font-['Roboto'] ${
                    isActive
                      ? "bg-[#F02801] text-white"
                      : "text-[#475569] hover:bg-white/60"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                  <span>{item.label}</span>
                  {item.id === "suppliers" && pendingSuppliers.length > 0 && (
                    <Badge className="ml-auto bg-[#F02801] text-white hover:bg-[#F02801] border-0 h-5 w-5 p-0 flex items-center justify-center font-['Roboto']">
                      {pendingSuppliers.length}
                    </Badge>
                  )}
                  {item.id === "inquiries" && inquiries.filter(i => i.status === "New").length > 0 && (
                    <Badge className="ml-auto border-0 h-5 w-5 p-0 flex items-center justify-center font-['Roboto']">
                      {inquiries.filter(i => i.status === "New").length}
                    </Badge>
                  )}
                  {item.id === "reports" && abuseReports.filter(r => r.status === "Under Review").length > 0 && (
                    <Badge className="ml-auto border-0 h-5 w-5 p-0 flex items-center justify-center font-['Roboto']">
                      {abuseReports.filter(r => r.status === "Under Review").length}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto p-8 pt-12">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FEE2E2] via-[#FEF3F2] to-white border-2 border-[#F02801]/20 p-4 md:p-5 shadow-[0_0_24px_rgba(240,40,1,0.12)]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F02801]/10 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F59E0B]/10 rounded-full -ml-12 -mb-12" />
                  <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl mb-1 text-[#0F172A] font-['Inter'] font-bold">Overview</h1>
                    <p className="text-base md:text-lg text-[#475569] font-['Roboto']">Platform performance and key metrics</p>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-[#FEE2E2] to-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#F02801]/10 rounded-full -mr-16 -mt-16" />
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#7F1D1D] mb-1 font-['Roboto'] font-medium">Active Suppliers</p>
                          <p className="text-3xl font-['Inter'] font-bold text-[#0F172A]">{stats.activeSuppliers}</p>
                        </div>
                        <div className="h-14 w-14 rounded-xl bg-[#F02801] flex items-center justify-center shadow-lg shadow-[#F02801]/30">
                          <Building2 className="h-7 w-7 text-white" strokeWidth={2} />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-3 text-sm text-[#22C55E] font-['Roboto'] font-medium">
                        <TrendingUp className="h-4 w-4" />
                        <span>+12 this month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-[#DBEAFE] to-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/10 rounded-full -mr-16 -mt-16" />
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#1E40AF] mb-1 font-['Roboto'] font-medium">Total Users</p>
                          <p className="text-3xl font-['Inter'] font-bold text-[#0F172A]">{stats.totalUsers.toLocaleString()}</p>
                        </div>
                        <div className="h-14 w-14 rounded-xl bg-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#3B82F6]/30">
                          <Users className="h-7 w-7 text-white" strokeWidth={2} />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-3 text-sm text-[#22C55E] font-['Roboto'] font-medium">
                        <TrendingUp className="h-4 w-4" />
                        <span>+234 this month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-[#FEF3C7] to-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/10 rounded-full -mr-16 -mt-16" />
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[#92400E] mb-1 font-['Roboto'] font-medium">Total Quotes</p>
                          <p className="text-3xl font-['Inter'] font-bold text-[#0F172A]">{stats.totalQuotes.toLocaleString()}</p>
                        </div>
                        <div className="h-14 w-14 rounded-xl bg-[#F59E0B] flex items-center justify-center shadow-lg shadow-[#F59E0B]/30">
                          <ShoppingCart className="h-7 w-7 text-white" strokeWidth={2} />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-3 text-sm text-[#22C55E] font-['Roboto'] font-medium">
                        <TrendingUp className="h-4 w-4" />
                        <span>+89 this month</span>
                      </div>
                    </CardContent>
                  </Card>


                </div>

                {/* Analytics Charts */}
                <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
                  <CardHeader className="pb-6">
                    <CardTitle className="font-['Inter'] text-[#0F172A]">Platform Activity</CardTitle>
                    <CardDescription className="font-['Roboto'] text-[#475569]">Weekly user and supplier growth</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis 
                          dataKey="week" 
                          stroke="#475569" 
                          style={{ fontFamily: 'Roboto', fontSize: '12px' }}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#475569" 
                          style={{ fontFamily: 'Roboto', fontSize: '12px' }}
                          tickLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB', 
                            borderRadius: '12px',
                            fontFamily: 'Roboto',
                            boxShadow: '0 4px 24px rgba(15,23,42,0.08)'
                          }} 
                        />
                        <Legend wrapperStyle={{ fontFamily: 'Roboto', fontSize: '14px', paddingTop: '20px' }} />
                        <Line type="monotone" dataKey="users" stroke="#F02801" strokeWidth={3} name="Users" dot={{ fill: '#F02801', r: 4 }} />
                        <Line type="monotone" dataKey="suppliers" stroke="#22C55E" strokeWidth={3} name="Suppliers" dot={{ fill: '#22C55E', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Category Performance */}
                <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
                  <CardHeader className="pb-6">
                    <CardTitle className="font-['Inter'] text-[#0F172A]">Category Performance</CardTitle>
                    <CardDescription className="font-['Roboto'] text-[#475569]">Most requested parts by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {categoryData.map((cat) => {
                        const maxRequests = Math.max(...categoryData.map(c => c.requests));
                        const percentage = (cat.requests / maxRequests) * 100;
                        return (
                          <div key={cat.category}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-['Roboto'] text-[#0F172A]">{cat.category}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-[#475569] font-['Roboto']">{cat.requests} requests</span>
                                <span className="text-sm text-[#0F172A] font-['Roboto'] min-w-[60px] text-right">£{cat.avgPrice} avg</span>
                              </div>
                            </div>
                            <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#F02801] rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="space-y-6">
                  {/* Section Header */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#DBEAFE] via-[#EFF6FF] to-white border-2 border-[#3B82F6]/20 p-6 shadow-[0_0_24px_rgba(59,130,246,0.12)]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/10 rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F02801]/10 rounded-full -ml-12 -mb-12" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl bg-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#3B82F6]/30">
                          <Users className="h-7 w-7 text-white" strokeWidth={2} />
                        </div>
                        <div>
                          <h2 className="text-2xl mb-1 text-[#0F172A] font-['Inter'] font-bold">All Users</h2>
                          <p className="text-base text-[#475569] font-['Roboto']">{allUsers.length} total users registered</p>
                        </div>
                      </div>
                      <Button className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] shadow-md rounded-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                  </div>

                  {/* Search Bar and Filters */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#475569]" />
                      <Input
                        type="text"
                        placeholder="Search users by name, email, location or ID..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-12 h-12 border-[#E5E7EB] focus:border-[#F02801] focus:ring-[#F02801] rounded-xl font-['Roboto'] text-[#0F172A] placeholder:text-[#94A3B8] w-full"
                      />
                      {userSearch && (
                        <button
                          onClick={() => setUserSearch("")}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#475569] hover:text-[#F02801] transition-colors"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    <div className="inline-flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-full border border-[#E5E7EB]">
                      <button
                        onClick={() => setUserStatusFilter("all")}
                        className={`px-5 py-2.5 rounded-full font-['Roboto'] transition-all duration-200 ${
                          userStatusFilter === "all"
                            ? "bg-white text-[#0F172A] shadow-sm"
                            : "text-[#475569] hover:text-[#0F172A]"
                        }`}
                      >
                        All Users
                      </button>
                      <button
                        onClick={() => setUserStatusFilter("active")}
                        className={`px-5 py-2.5 rounded-full font-['Roboto'] transition-all duration-200 flex items-center gap-2 ${
                          userStatusFilter === "active"
                            ? "bg-white text-[#0F172A] shadow-sm"
                            : "text-[#475569] hover:text-[#0F172A]"
                        }`}
                      >
                        <div className={`h-2 w-2 rounded-full ${
                          userStatusFilter === "active" ? "bg-[#22C55E]" : "bg-[#94A3B8]"
                        }`} />
                        Active
                      </button>
                      <button
                        onClick={() => setUserStatusFilter("suspended")}
                        className={`px-5 py-2.5 rounded-full font-['Roboto'] transition-all duration-200 flex items-center gap-2 ${
                          userStatusFilter === "suspended"
                            ? "bg-white text-[#0F172A] shadow-sm"
                            : "text-[#475569] hover:text-[#0F172A]"
                        }`}
                      >
                        <div className={`h-2 w-2 rounded-full ${
                          userStatusFilter === "suspended" ? "bg-[#F02801]" : "bg-[#94A3B8]"
                        }`} />
                        Suspended
                      </button>
                    </div>
                  </div>

                  {/* User Table */}
                  <>
                    <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-[#F1F5F9] hover:bg-[#F1F5F9] border-b border-[#E5E7EB]">
                            <TableHead className="font-['Inter'] text-[#0F172A]">User</TableHead>
                            <TableHead className="font-['Inter'] text-[#0F172A]">Email</TableHead>
                            <TableHead className="font-['Inter'] text-[#0F172A]">Location</TableHead>
                            <TableHead className="font-['Inter'] text-[#0F172A]">Joined</TableHead>
                            <TableHead className="font-['Inter'] text-[#0F172A]">Status</TableHead>
                            <TableHead className="font-['Inter'] text-[#0F172A] text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.length > 0 ? (
                            (showAllUsers ? filteredUsers : filteredUsers.slice(0, 4)).map((user) => {
                              return (
                                <TableRow 
                                  key={user.id}
                                  className="hover:bg-[#FEF2F2] transition-colors border-b border-[#F1F5F9] last:border-0"
                                >
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <span className="text-white font-['Inter'] text-sm">{user.name.split(' ').map(n => n[0]).join('')}</span>
                                      </div>
                                      <div>
                                        <p className="font-['Inter'] text-[#0F172A]">{user.name}</p>
                                        <p className="text-xs text-[#475569] font-['Roboto']">{user.id}</p>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="font-['Roboto'] text-[#0F172A]">{user.email}</TableCell>
                                  <TableCell className="font-['Roboto'] text-[#0F172A]">{user.location}</TableCell>
                                  <TableCell className="font-['Roboto'] text-[#0F172A]">{user.joinedDate}</TableCell>
                                  <TableCell>
                                    <Badge 
                                      className={`font-['Roboto'] px-2 py-0.5 ${
                                        user.status === "Active" 
                                          ? "bg-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7] border-[#22C55E]" 
                                          : user.status === "Suspended"
                                          ? "bg-[#FEE2E2] text-[#7F1D1D] hover:bg-[#FEE2E2] border-[#F02801]"
                                          : "bg-[#F1F5F9] text-[#475569] hover:bg-[#F1F5F9] border-[#CBD5E1]"
                                      }`}
                                    >
                                      {user.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="font-['Roboto'] rounded-full border-[#E5E7EB] hover:border-[#F02801] hover:bg-[#FEF3F2] hover:text-[#F02801]"
                                        onClick={() => {
                                          setSelectedUser(user);
                                          setUserDetailsDialogOpen(true);
                                        }}
                                      >
                                        Details
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-12">
                                <div className="flex flex-col items-center gap-3">
                                  <Search className="h-12 w-12 text-[#CBD5E1]" />
                                  <p className="text-[#475569] font-['Roboto']">No users found matching "{userSearch}"</p>
                                  <Button
                                    variant="outline"
                                    onClick={() => setUserSearch("")}
                                    className="border-[#E5E7EB] hover:border-[#F02801] hover:bg-[#FEF3F2] hover:text-[#F02801] font-['Roboto'] rounded-full"
                                  >
                                    Clear Search
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {!showAllUsers && filteredUsers.length > 4 && (
                      <div className="flex justify-center pt-2">
                        <Button 
                          variant="outline"
                          onClick={() => setShowAllUsers(true)}
                          className="border-[#E5E7EB] hover:border-[#F02801] hover:bg-[#FEF3F2] hover:text-[#F02801] font-['Roboto'] rounded-full"
                        >
                          View All Users ({filteredUsers.length - 4} more)
                        </Button>
                      </div>
                    )}
                  </>
                </div>
              </div>
            )}

            {/* Suppliers Tab */}
            {activeTab === "suppliers" && (
              <div className="space-y-8">
                {/* Section Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FEF3C7] via-[#FEF9C3] to-white border-2 border-[#F59E0B]/20 p-6 shadow-[0_0_24px_rgba(245,158,11,0.12)]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/10 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F02801]/10 rounded-full -ml-12 -mb-12" />
                  <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl mb-1 text-[#0F172A] font-['Inter'] font-bold">Supplier Management</h1>
                    <p className="text-base md:text-lg text-[#475569] font-['Roboto']">{pendingSuppliers.length} pending approvals • {allSuppliers.length} active suppliers</p>
                  </div>
                </div>

                {/* Pending Suppliers Section */}
                <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
                  <CardHeader className="pb-4 border-b border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-['Inter'] text-[#0F172A]">Pending Approvals</CardTitle>
                      <Badge className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-[#F59E0B] px-3 py-1 font-['Roboto']">
                        {pendingSuppliers.length} pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div>
                      {pendingSuppliers.map((supplier, index) => (
                        <div 
                          key={supplier.id} 
                          className={`flex items-center gap-4 px-6 py-4 hover:bg-[#F1F5F9] transition-all ${index !== pendingSuppliers.length - 1 ? 'border-b border-[#E5E7EB]' : ''}`}
                        >
                          {/* Name & ID */}
                          <div className="flex-1 min-w-[200px]">
                            <h3 className="font-['Inter'] text-[#0F172A]">{supplier.name}</h3>
                            <p className="text-sm text-[#475569] font-['Roboto']">ID: {supplier.id}</p>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2 min-w-[140px]">
                            <MapPin className="h-4 w-4 text-[#475569]" />
                            <span className="text-sm text-[#475569] font-['Roboto']">{supplier.location}</span>
                          </div>

                          {/* Applied Date */}
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <Calendar className="h-4 w-4 text-[#475569]" />
                            <span className="text-sm text-[#475569] font-['Roboto']">{supplier.appliedDate}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-9 px-4"
                              onClick={() => {
                                setSelectedSupplier(supplier);
                                setReviewDialogOpen(true);
                              }}
                            >
                              <FileText className="h-3.5 w-3.5 mr-1" />
                              Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Active Suppliers Table */}
                <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
                  <CardHeader className="pb-4 border-b border-[#E5E7EB] bg-gradient-to-br from-[#DCFCE7] via-[#F0FDF4] to-white">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-[#22C55E] flex items-center justify-center shadow-sm">
                        <CheckCircle className="h-6 w-6 text-white" strokeWidth={2} />
                      </div>
                      <div>
                        <CardTitle className="font-['Inter'] text-[#0F172A]">Active Suppliers</CardTitle>
                        <CardDescription className="font-['Roboto'] text-[#475569]">Approved suppliers on the platform</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                      <Input
                        type="text"
                        placeholder="Search suppliers by name, location or ID..."
                        value={supplierSearch}
                        onChange={(e) => setSupplierSearch(e.target.value)}
                        className="pl-12 h-12 border-[#E5E7EB] focus:border-[#F02801] focus:ring-[#F02801] rounded-xl font-['Roboto'] text-[#0F172A] placeholder:text-[#94A3B8] max-w-md"
                      />
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-[#E5E7EB]">
                          <TableHead className="font-['Inter'] text-[#0F172A]">Supplier</TableHead>
                          <TableHead className="font-['Inter'] text-[#0F172A]">Location</TableHead>
                          <TableHead className="font-['Inter'] text-[#0F172A]">Rating</TableHead>
                          <TableHead className="font-['Inter'] text-[#0F172A]">Quotes</TableHead>
                          <TableHead className="font-['Inter'] text-[#0F172A]">Joined</TableHead>
                          <TableHead className="font-['Inter'] text-[#0F172A]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(showAllSuppliers 
                          ? allSuppliers.filter((supplier) => 
                              supplier.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                              supplier.location.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                              supplier.id.toLowerCase().includes(supplierSearch.toLowerCase())
                            )
                          : allSuppliers
                              .filter((supplier) => 
                                supplier.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                                supplier.location.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                                supplier.id.toLowerCase().includes(supplierSearch.toLowerCase())
                              )
                              .slice(0, 10)
                        ).map((supplier) => (
                          <TableRow key={supplier.id} className="border-b border-[#E5E7EB]/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0">
                                  <Building2 className="h-5 w-5 text-white" strokeWidth={2} />
                                </div>
                                <div>
                                  <p className="font-['Inter'] font-medium text-[#0F172A]">{supplier.name}</p>
                                  <p className="text-sm text-[#475569] font-['Roboto']">{supplier.id}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-[#475569] font-['Roboto']">{supplier.location}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Award className="h-4 w-4 text-[#F59E0B]" />
                                <span className="font-['Roboto'] text-[#0F172A]">{supplier.rating}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-[#475569] font-['Roboto']">{supplier.quotes}</TableCell>
                            <TableCell className="text-[#475569] font-['Roboto']">{supplier.joined}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-9 px-4"
                                onClick={() => {
                                  setSelectedActiveSupplier(supplier);
                                  setSupplierDetailsDialogOpen(true);
                                }}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {!showAllSuppliers && allSuppliers.filter((supplier) => 
                      supplier.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                      supplier.location.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                      supplier.id.toLowerCase().includes(supplierSearch.toLowerCase())
                    ).length > 10 && (
                      <div className="flex justify-center pt-6 border-t border-[#E5E7EB] mt-6">
                        <Button
                          onClick={() => setShowAllSuppliers(true)}
                          className="bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-11 px-8"
                        >
                          View More Suppliers ({allSuppliers.filter((supplier) => 
                            supplier.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                            supplier.location.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                            supplier.id.toLowerCase().includes(supplierSearch.toLowerCase())
                          ).length - 10} more)
                        </Button>
                      </div>
                    )}
                    {showAllSuppliers && (
                      <div className="flex justify-center pt-6 border-t border-[#E5E7EB] mt-6">
                        <Button
                          onClick={() => setShowAllSuppliers(false)}
                          variant="outline"
                          className="border-[#E5E7EB] hover:border-[#F02801] hover:bg-[#FEF3F2] hover:text-[#F02801] font-['Roboto'] rounded-full h-11 px-8"
                        >
                          Show Less
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Inquiries Tab */}
            {activeTab === "inquiries" && (
              <div className="space-y-8">
                {/* Section Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#DBEAFE] via-[#EFF6FF] to-white border-2 border-[#3B82F6]/20 p-6 shadow-[0_0_24px_rgba(59,130,246,0.12)]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/10 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F02801]/10 rounded-full -ml-12 -mb-12" />
                  <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl mb-1 text-[#0F172A] font-['Inter'] font-bold">Customer Inquiries</h1>
                    <p className="text-base md:text-lg text-[#475569] font-['Roboto']">{inquiries.filter(i => i.status === "New").length} new inquiries awaiting response</p>
                  </div>
                </div>

                {/* Inquiries List */}
                <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
                  <CardHeader className="pb-4 border-b border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-['Inter'] text-[#0F172A]">All Inquiries</CardTitle>
                        <CardDescription className="font-['Roboto'] text-[#475569]">Messages from customers and potential partners</CardDescription>
                      </div>
                      {/* Filter Tabs */}
                      <div className="inline-flex p-1 bg-[#F1F5F9] rounded-xl">
                        <button
                          onClick={() => setInquiryFilter("all")}
                          className={`relative px-6 py-2.5 rounded-lg font-['Roboto'] transition-all duration-200 ${
                            inquiryFilter === "all"
                              ? "bg-white text-[#0F172A] shadow-sm"
                              : "text-[#475569] hover:text-[#0F172A]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            All
                            <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-md font-['Roboto'] transition-all duration-200 ${
                              inquiryFilter === "all"
                                ? "bg-[#F02801] text-white"
                                : "bg-[#E5E7EB] text-[#475569]"
                            }`}>
                              {inquiries.length}
                            </span>
                          </span>
                        </button>
                        <button
                          onClick={() => setInquiryFilter("unread")}
                          className={`relative px-6 py-2.5 rounded-lg font-['Roboto'] transition-all duration-200 ${
                            inquiryFilter === "unread"
                              ? "bg-white text-[#0F172A] shadow-sm"
                              : "text-[#475569] hover:text-[#0F172A]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            Unread
                            <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-md font-['Roboto'] transition-all duration-200 ${
                              inquiryFilter === "unread"
                                ? "bg-[#F02801] text-white"
                                : "bg-[#E5E7EB] text-[#475569]"
                            }`}>
                              {inquiries.filter(i => i.status === "New").length}
                            </span>
                          </span>
                        </button>
                        <button
                          onClick={() => setInquiryFilter("read")}
                          className={`relative px-6 py-2.5 rounded-lg font-['Roboto'] transition-all duration-200 ${
                            inquiryFilter === "read"
                              ? "bg-white text-[#0F172A] shadow-sm"
                              : "text-[#475569] hover:text-[#0F172A]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            Read
                            <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-md font-['Roboto'] transition-all duration-200 ${
                              inquiryFilter === "read"
                                ? "bg-[#F02801] text-white"
                                : "bg-[#E5E7EB] text-[#475569]"
                            }`}>
                              {inquiries.filter(i => i.status === "Responded").length}
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div>
                      {(() => {
                        const filteredInquiries = inquiries.filter(inquiry => {
                          if (inquiryFilter === "all") return true;
                          if (inquiryFilter === "unread") return inquiry.status === "New";
                          if (inquiryFilter === "read") return inquiry.status === "Responded";
                          return true;
                        });
                        return filteredInquiries.map((inquiry, index) => (
                        <div 
                          key={inquiry.id} 
                          className={`grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-6 px-5 py-3.5 hover:bg-[#F9FAFB] transition-colors cursor-pointer ${index !== filteredInquiries.length - 1 ? 'border-b border-[#E5E7EB]' : ''}`}
                          onClick={() => {
                            setSelectedInquiry(inquiry);
                            setInquiryDetailsDialogOpen(true);
                          }}
                        >
                          {/* Status Indicator */}
                          <div className="flex items-center gap-3">
                            <div className={`h-2 w-2 rounded-full ${
                              inquiry.status === "New" ? "bg-[#3B82F6]" : "bg-[#22C55E]"
                            }`} />
                            <Badge 
                              className={`border-0 font-['Roboto'] ${
                                inquiry.status === "New"
                                  ? "bg-[#EFF6FF] text-[#3B82F6] hover:bg-[#EFF6FF]"
                                  : "bg-[#F0FDF4] text-[#22C55E] hover:bg-[#F0FDF4]"
                              }`}
                            >
                              {inquiry.status}
                            </Badge>
                          </div>

                          {/* Inquiry Details */}
                          <div className="min-w-0">
                            <p className="font-['Inter'] text-[#0F172A] truncate mb-0.5">{inquiry.subject}</p>
                            <div className="flex items-center gap-2 text-sm text-[#475569] font-['Roboto']">
                              <span className="truncate">{inquiry.name}</span>
                              <span className="text-[#CBD5E1]">•</span>
                              <span className="truncate">{inquiry.email}</span>
                            </div>
                          </div>

                          {/* Category */}
                          <Badge variant="outline" className="border-[#E5E7EB] text-[#475569] font-['Roboto'] whitespace-nowrap">
                            {inquiry.category}
                          </Badge>

                          {/* Date & Time */}
                          <div className="flex flex-col items-end gap-0.5 text-sm text-[#475569] font-['Roboto'] whitespace-nowrap">
                            <span>{inquiry.date}</span>
                            <span className="text-xs">{inquiry.time}</span>
                          </div>

                          {/* Action */}

                        </div>
                      ));
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && (
              <div className="space-y-8">
                {/* Section Header */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FEE2E2] via-[#FEF3F2] to-white border-2 border-[#F02801]/20 p-6 shadow-[0_0_24px_rgba(240,40,1,0.12)]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#F02801]/10 rounded-full -mr-16 -mt-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F59E0B]/10 rounded-full -ml-12 -mb-12" />
                  <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl mb-1 text-[#0F172A] font-['Inter'] font-bold">Abuse Reports</h1>
                    <p className="text-base md:text-lg text-[#475569] font-['Roboto']">{abuseReports.filter(r => r.status === "Under Review").length} reports under review</p>
                  </div>
                </div>

                {/* Reports Grid */}
                <Card className="border border-[#E5E7EB] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
                  <CardHeader className="pb-4 border-b border-[#E5E7EB]">
                    <CardTitle className="font-['Inter'] text-[#0F172A]">All Reports</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div>
                      {abuseReports.map((report, index) => (
                        <div 
                          key={report.id} 
                          className={`flex items-center gap-4 px-5 py-4 hover:bg-[#F1F5F9] transition-all ${index !== abuseReports.length - 1 ? 'border-b border-[#E5E7EB]' : ''}`}
                        >
                          {/* Alert Icon */}
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F1F5F9]">
                              <AlertTriangle className="h-5 w-5 text-[#64748B]" />
                            </div>
                          </div>

                          {/* Report Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-['Inter'] text-[#0F172A]">Report {report.id}</h3>
                              <span className="text-[#94A3B8] font-['Roboto']">•</span>
                              <span className="text-[#475569] font-['Roboto']">{report.reportedUser}</span>
                            </div>
                            <p className="text-sm text-[#475569] font-['Roboto'] mb-1">{report.reason}</p>
                            <div className="flex items-center gap-4 text-xs text-[#94A3B8] font-['Roboto']">
                              <span>Reported by {report.reportedBy}</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {report.date}
                              </span>
                            </div>
                          </div>

                          {/* Severity Badge */}
                          <div className="flex-shrink-0">
                            <Badge 
                              className={`font-['Roboto'] px-3 py-1.5 ${
                                report.severity === "High" 
                                  ? "bg-[#FEE2E2] text-[#7F1D1D] hover:bg-[#FEE2E2] border-[#F02801]"
                                  : report.severity === "Medium"
                                  ? "bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-[#F59E0B]"
                                  : "bg-[#DBEAFE] text-[#1E3A8A] hover:bg-[#DBEAFE] border-[#3B82F6]"
                              }`}
                            >
                              {report.severity}
                            </Badge>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {report.status === "Under Review" ? (
                              <Button
                                size="sm"
                                className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-['Roboto'] rounded-full h-9 px-4"
                                onClick={() => {
                                  setSelectedReport(report);
                                  setReportReviewDialogOpen(true);
                                }}
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                                Resolved
                              </Button>
                            ) : (
                              <div className="flex items-center gap-1.5 h-9 px-4 bg-[#22C55E] text-white font-['Roboto'] rounded-full">
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span>Resolved</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Supplier Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl border-[#E5E7EB] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">Supplier Application Review</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              Review supplier details and documentation before approval
            </DialogDescription>
          </DialogHeader>

          {selectedSupplier && (
            <div className="space-y-6 mt-2">
              {/* Supplier Header */}
              <div className="bg-gradient-to-br from-[#FEE2E2] via-[#FEF3F2] to-white p-6 rounded-xl border-2 border-[#F02801]/20">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#F02801]/30">
                    <Building2 className="h-8 w-8 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-['Inter'] text-[#0F172A] mb-1">{selectedSupplier.name}</h3>
                    <p className="text-sm text-[#475569] font-['Roboto'] mb-3">{selectedSupplier.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSupplier.categories.map((cat: string) => (
                        <Badge key={cat} variant="outline" className="font-['Roboto'] border-[#F02801] text-[#F02801] bg-[#FEF3F2]">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="space-y-4">
                <h4 className="font-['Inter'] text-[#0F172A]">Business Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3 mb-3">
                      <MapPin className="h-4 w-4 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Business Address</p>
                        <p className="font-['Roboto'] text-[#0F172A]">{selectedSupplier.businessAddress}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3 mb-3">
                      <Mail className="h-4 w-4 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Email</p>
                        <p className="font-['Roboto'] text-[#0F172A]">{selectedSupplier.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3 mb-3">
                      <Phone className="h-4 w-4 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Phone</p>
                        <p className="font-['Roboto'] text-[#0F172A]">{selectedSupplier.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3 mb-3">
                      <FileText className="h-4 w-4 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Registration Number</p>
                        <p className="font-['Roboto'] text-[#0F172A]">{selectedSupplier.registrationNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3 mb-3">
                      <FileText className="h-4 w-4 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">VAT Number</p>
                        <p className="font-['Roboto'] text-[#0F172A]">{selectedSupplier.vatNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3 mb-3">
                      <Calendar className="h-4 w-4 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Years in Business</p>
                        <p className="font-['Roboto'] text-[#0F172A]">{selectedSupplier.yearsInBusiness} years</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentation Status */}
              <div className={`p-4 rounded-xl border-2 ${
                selectedSupplier.docsComplete 
                  ? 'bg-[#DCFCE7] border-[#22C55E]/30' 
                  : 'bg-[#FEF3F2] border-[#F02801]/30'
              }`}>
                <p className="text-sm text-[#475569] font-['Roboto'] mb-2">Documentation Status</p>
                <div className="flex items-center gap-2">
                  {selectedSupplier.docsComplete ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-[#22C55E]" />
                      <span className="font-['Roboto'] text-[#0F172A]">All documents verified</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 text-[#F02801]" />
                      <span className="font-['Roboto'] text-[#0F172A]">Missing documents - please review</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline"
                  className="flex-1 border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] font-['Roboto'] rounded-full h-11"
                  onClick={() => setReviewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2] hover:text-[#DC2626] font-['Roboto'] rounded-full h-11"
                  onClick={() => setReviewDialogOpen(false)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white font-['Roboto'] rounded-full h-11"
                  onClick={() => {
                    setReviewDialogOpen(false);
                    setApprovalDialogOpen(true);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Confirmation Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="max-w-md border-[#E5E7EB] bg-white">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">Confirm Supplier Approval</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              Are you sure you want to approve this supplier?
            </DialogDescription>
          </DialogHeader>

          {selectedSupplier && (
            <div className="space-y-4">
              <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-['Inter'] text-[#0F172A] mb-1">{selectedSupplier.name}</p>
                    <p className="text-sm text-[#475569] font-['Roboto']">{selectedSupplier.location}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  className="flex-1 border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] font-['Roboto'] rounded-full h-11"
                  onClick={() => setApprovalDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-11"
                  onClick={() => {
                    setApprovalDialogOpen(false);
                    setApprovalSuccessDialogOpen(true);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Approval
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Success Dialog */}
      <Dialog open={approvalSuccessDialogOpen} onOpenChange={setApprovalSuccessDialogOpen}>
        <DialogContent className="max-w-md border-[#E5E7EB] bg-white">
          <DialogHeader className="sr-only">
            <DialogTitle>Supplier Approved</DialogTitle>
            <DialogDescription>
              The supplier has been successfully approved
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-[#DCFCE7] border-2 border-[#22C55E] flex items-center justify-center mx-auto shadow-lg shadow-[#22C55E]/20">
              <CheckCircle className="h-8 w-8 text-[#22C55E]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-['Inter'] text-[#0F172A] mb-2">Supplier Approved</h3>
              <p className="text-sm text-[#475569] font-['Roboto']">
                {selectedSupplier?.name} has been successfully approved and notified via email.
              </p>
            </div>
            <Button 
              className="w-full bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-11"
              onClick={() => setApprovalSuccessDialogOpen(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={userDetailsDialogOpen} onOpenChange={setUserDetailsDialogOpen}>
        <DialogContent className="max-w-lg border border-[#334155] bg-[#1E293B]">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-white">User Details</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#CBD5E1]">
              View user information and account status
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 mt-2">
              {/* User Header */}
              <div className="bg-gradient-to-br from-[#1E40AF]/20 via-[#1E40AF]/10 to-transparent p-6 rounded-xl border border-[#3B82F6]/30">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white font-['Inter'] text-xl">
                      {selectedUser.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-['Inter'] text-white">{selectedUser.name}</h3>
                      <Badge 
                        className={`font-['Roboto'] ${
                          selectedUser.status === "Active" 
                            ? "bg-[#166534]/30 text-[#86EFAC] hover:bg-[#166534]/30 border-[#22C55E]" 
                            : "bg-[#7F1D1D]/30 text-[#FCA5A5] hover:bg-[#7F1D1D]/30 border-[#F02801]"
                        }`}
                      >
                        {selectedUser.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#CBD5E1] font-['Roboto']">{selectedUser.id}</p>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Email Address</p>
                  <p className="font-['Roboto'] text-[#E2E8F0]">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Location</p>
                  <p className="font-['Roboto'] text-[#E2E8F0]">{selectedUser.location}</p>
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Role</p>
                  <p className="font-['Roboto'] text-[#E2E8F0]">{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Member Since</p>
                  <p className="font-['Roboto'] text-[#E2E8F0]">{selectedUser.joinedDate}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline"
                  className="flex-1 border-[#475569] bg-transparent text-[#CBD5E1] hover:bg-[#334155] hover:text-white font-['Roboto']"
                  onClick={() => setUserDetailsDialogOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  className={`flex-1 font-['Roboto'] ${
                    selectedUser.status === "Active"
                      ? "bg-[#EF4444] hover:bg-[#DC2626] text-white"
                      : "bg-[#22C55E] hover:bg-[#16A34A] text-white"
                  }`}
                  onClick={() => {
                    handleToggleUserStatus(selectedUser.id);
                    setUserDetailsDialogOpen(false);
                  }}
                >
                  {selectedUser.status === "Active" ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Suspend User
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate User
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Active Supplier Details Dialog - Dark Theme */}
      <Dialog open={supplierDetailsDialogOpen} onOpenChange={setSupplierDetailsDialogOpen}>
        <DialogContent className="max-w-2xl border border-[#334155] bg-[#1E293B] max-h-[90vh] overflow-y-auto pt-8">
          <DialogHeader className="mb-2">
            <DialogTitle className="font-['Inter'] text-white">Supplier Details</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#CBD5E1]">
              Complete information about this supplier
            </DialogDescription>
          </DialogHeader>

          {selectedActiveSupplier && (
            <div className="space-y-4 mt-4">
              {/* Supplier Header */}
              <div className="bg-gradient-to-br from-[#7F1D1D]/20 via-[#7F1D1D]/10 to-transparent p-6 rounded-xl border border-[#F02801]/30">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Building2 className="h-8 w-8 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-['Inter'] text-white">{selectedActiveSupplier.name}</h3>
                      <Badge className="bg-[#166534]/30 text-[#86EFAC] hover:bg-[#166534]/30 border-[#22C55E] font-['Roboto']">
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-[#CBD5E1] font-['Roboto'] mb-2">{selectedActiveSupplier.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedActiveSupplier.categories.map((cat: string) => (
                        <Badge key={cat} variant="outline" className="font-['Roboto'] border-[#F02801] text-[#FCA5A5] bg-[#7F1D1D]/20">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-[#F59E0B]" />
                    <span className="text-sm text-[#94A3B8] font-['Roboto']">Rating</span>
                  </div>
                  <p className="font-['Inter'] text-white">{selectedActiveSupplier.rating}/5.0</p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-[#22C55E]" />
                    <span className="text-sm text-[#94A3B8] font-['Roboto']">Quotes</span>
                  </div>
                  <p className="font-['Inter'] text-white">{selectedActiveSupplier.quotes}</p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-[#3B82F6]" />
                    <span className="text-sm text-[#94A3B8] font-['Roboto']">Joined</span>
                  </div>
                  <p className="font-['Inter'] text-white">{selectedActiveSupplier.joined}</p>
                </div>
              </div>

              {/* Business Details */}
              <div className="bg-[#0F172A] p-5 rounded-xl border border-[#334155]">
                <h4 className="font-['Inter'] text-white mb-4">Business Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Business Address</p>
                      <p className="font-['Roboto'] text-[#E2E8F0]">{selectedActiveSupplier.businessAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Email</p>
                      <p className="font-['Roboto'] text-[#E2E8F0]">{selectedActiveSupplier.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Phone</p>
                      <p className="font-['Roboto'] text-[#E2E8F0]">{selectedActiveSupplier.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Registration Number</p>
                      <p className="font-['Roboto'] text-[#E2E8F0]">{selectedActiveSupplier.registrationNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">VAT Number</p>
                      <p className="font-['Roboto'] text-[#E2E8F0]">{selectedActiveSupplier.vatNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1">Years in Business</p>
                      <p className="font-['Roboto'] text-[#E2E8F0]">{selectedActiveSupplier.yearsInBusiness} years</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentation Status */}
              <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
                <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-2">Documentation Status</p>
                <div className="flex items-center gap-2">
                  {selectedActiveSupplier.docsComplete ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-[#86EFAC]" />
                      <span className="font-['Roboto'] text-[#86EFAC]">All documents verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-[#FCA5A5]" />
                      <span className="font-['Roboto'] text-[#FCA5A5]">Missing documents</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline"
                  className="flex-1 border-[#475569] bg-transparent text-[#CBD5E1] hover:bg-[#334155] hover:text-white font-['Roboto']"
                  onClick={() => setSupplierDetailsDialogOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto']"
                  onClick={() => {
                    onNavigate('supplier-profile');
                    setSupplierDetailsDialogOpen(false);
                  }}
                >
                  View Full Profile
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Review Dialog - Dark Theme */}
      <Dialog open={reportReviewDialogOpen} onOpenChange={setReportReviewDialogOpen}>
        <DialogContent className="max-w-lg border border-[#334155] bg-[#1E293B]">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-white">Report Details</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#CBD5E1]">
              Review abuse report and take appropriate action
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 mt-2">
              {/* Report Header */}
              <div className="bg-gradient-to-br from-[#92400E]/20 via-[#92400E]/10 to-transparent p-4 rounded-xl border border-[#F59E0B]/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-lg">
                      <AlertTriangle className="h-5 w-5 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-['Inter'] font-medium text-white">{selectedReport.id}</h3>
                      <p className="text-sm text-[#CBD5E1] font-['Roboto']">{selectedReport.date}</p>
                    </div>
                  </div>
                  <Badge 
                    className={`font-['Roboto'] px-2 py-0.5 ${
                      selectedReport.status === "Under Review"
                        ? "bg-[#92400E]/30 text-[#FCD34D] hover:bg-[#92400E]/30 border-[#F59E0B]" 
                        : "bg-[#166534]/30 text-[#86EFAC] hover:bg-[#166534]/30 border-[#22C55E]"
                    }`}
                  >
                    {selectedReport.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-['Roboto'] text-[#CBD5E1]">Severity:</span>
                  <Badge 
                    className={`font-['Roboto'] ${
                      selectedReport.severity === "High" 
                        ? "bg-[#7F1D1D]/30 text-[#FCA5A5] hover:bg-[#7F1D1D]/30 border-[#F02801]"
                        : selectedReport.severity === "Medium"
                        ? "bg-[#92400E]/30 text-[#FCD34D] hover:bg-[#92400E]/30 border-[#F59E0B]"
                        : "bg-[#1E40AF]/30 text-[#93C5FD] hover:bg-[#1E40AF]/30 border-[#3B82F6]"
                    }`}
                  >
                    {selectedReport.severity}
                  </Badge>
                </div>
              </div>

              {/* Report Information */}
              <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155] space-y-3">
                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1.5">Reported User</p>
                  <div className="flex items-center gap-2 p-2.5 bg-[#1E293B] rounded-lg border border-[#334155]">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-white" strokeWidth={2} />
                    </div>
                    <p className="font-['Inter'] text-white">{selectedReport.reportedUser}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1.5">Reported By</p>
                  <div className="flex items-center gap-2 p-2.5 bg-[#1E293B] rounded-lg border border-[#334155]">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" strokeWidth={2} />
                    </div>
                    <p className="font-['Inter'] text-white">{selectedReport.reportedBy}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-[#94A3B8] font-['Roboto'] mb-1.5">Reason for Report</p>
                  <div className="p-3 bg-[#1E293B] rounded-lg border border-[#334155]">
                    <p className="font-['Roboto'] text-[#E2E8F0] leading-relaxed">{selectedReport.reason}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex-1 border-[#475569] bg-transparent text-[#CBD5E1] hover:bg-[#334155] hover:text-white font-['Roboto']"
                  onClick={() => setReportReviewDialogOpen(false)}
                >
                  Close
                </Button>
                {selectedReport.status === "Under Review" && (
                  <Button 
                    size="sm"
                    className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white font-['Roboto']"
                    onClick={() => {
                      // Handle resolve action
                      setReportReviewDialogOpen(false);
                    }}
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <Dialog open={userDetailsDialogOpen} onOpenChange={setUserDetailsDialogOpen}>
        <DialogContent className="max-w-2xl border-[#E5E7EB] bg-white">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">User Details</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              View and manage user information
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 mt-2">
              {/* User Header */}
              <div className="bg-gradient-to-br from-[#FEF3F2] via-[#FEF3F2] to-white p-6 rounded-xl border-2 border-[#F02801]/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white font-['Inter'] text-xl">{selectedUser.name.split(' ').map((n: string) => n[0]).join('')}</span>
                    </div>
                    <div>
                      <h3 className="font-['Inter'] text-[#0F172A] mb-1">{selectedUser.name}</h3>
                      <p className="text-sm text-[#475569] font-['Roboto']">{selectedUser.id}</p>
                    </div>
                  </div>
                  <Badge 
                    className={`font-['Roboto'] px-3 py-1 ${
                      selectedUser.status === "Active" 
                        ? "bg-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7] border-[#22C55E]" 
                        : selectedUser.status === "Suspended"
                        ? "bg-[#FEE2E2] text-[#7F1D1D] hover:bg-[#FEE2E2] border-[#F02801]"
                        : "bg-[#F1F5F9] text-[#475569] hover:bg-[#F1F5F9] border-[#CBD5E1]"
                    }`}
                  >
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>

              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-[#475569]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Email Address</p>
                  </div>
                  <p className="font-['Inter'] text-[#0F172A]">{selectedUser.email}</p>
                </div>

                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-[#475569]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Location</p>
                  </div>
                  <p className="font-['Inter'] text-[#0F172A]">{selectedUser.location}</p>
                </div>

                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-[#475569]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Joined Date</p>
                  </div>
                  <p className="font-['Inter'] text-[#0F172A]">{selectedUser.joinedDate}</p>
                </div>

                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-[#475569]" />
                    <p className="text-sm text-[#475569] font-['Roboto']">Role</p>
                  </div>
                  <p className="font-['Inter'] text-[#0F172A]">{selectedUser.role}</p>
                </div>
              </div>

              {/* Activity Summary */}
              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB]">
                <h4 className="font-['Inter'] text-[#0F172A] mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#F02801]" />
                  Activity Summary
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-[#F1F5F9] rounded-lg">
                    <p className="text-2xl font-['Inter'] text-[#F02801] mb-1">12</p>
                    <p className="text-xs text-[#475569] font-['Roboto']">Total Requests</p>
                  </div>
                  <div className="text-center p-3 bg-[#F1F5F9] rounded-lg">
                    <p className="text-2xl font-['Inter'] text-[#F02801] mb-1">8</p>
                    <p className="text-xs text-[#475569] font-['Roboto']">Quotes Received</p>
                  </div>
                  <div className="text-center p-3 bg-[#F1F5F9] rounded-lg">
                    <p className="text-2xl font-['Inter'] text-[#F02801] mb-1">5</p>
                    <p className="text-xs text-[#475569] font-['Roboto']">Orders Placed</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline"
                  className="flex-1 border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] font-['Roboto'] rounded-full h-11"
                  onClick={() => setUserDetailsDialogOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  className={`flex-1 font-['Roboto'] rounded-full h-11 ${
                    selectedUser.status === "Active"
                      ? "bg-[#EF4444] hover:bg-[#DC2626] text-white"
                      : "bg-[#22C55E] hover:bg-[#16A34A] text-white"
                  }`}
                  onClick={() => {
                    setConfirmUserActionDialogOpen(true);
                  }}
                >
                  {selectedUser.status === "Active" ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Suspend User
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate User
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Inquiry Details Dialog */}
      <Dialog open={inquiryDetailsDialogOpen} onOpenChange={setInquiryDetailsDialogOpen}>
        <DialogContent className="max-w-3xl border border-[#E5E7EB] bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">Inquiry Details</DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              View and respond to customer inquiry
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-6 mt-2">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <Badge 
                  className={`px-4 py-1.5 font-['Roboto'] border-0 ${
                    selectedInquiry.status === "New"
                      ? "bg-[#EFF6FF] text-[#3B82F6] hover:bg-[#EFF6FF]"
                      : "bg-[#F0FDF4] text-[#22C55E] hover:bg-[#F0FDF4]"
                  }`}
                >
                  {selectedInquiry.status}
                </Badge>
                <Badge variant="outline" className="px-4 py-1.5 border-[#E5E7EB] text-[#475569] font-['Roboto']">
                  {selectedInquiry.category}
                </Badge>
              </div>

              {/* Inquiry ID and Date */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Inquiry ID</p>
                  <p className="font-['Inter'] text-[#0F172A]">{selectedInquiry.id}</p>
                </div>
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Received</p>
                  <p className="font-['Roboto'] text-[#0F172A]">{selectedInquiry.date} at {selectedInquiry.time}</p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="space-y-4">
                <h4 className="font-['Inter'] text-[#0F172A]">Customer Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3">
                      <Users className="h-4 w-4 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Name</p>
                        <p className="font-['Roboto'] text-[#0F172A]">{selectedInquiry.name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-[#F02801] mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-[#475569] font-['Roboto'] mb-1">Email</p>
                        <p className="font-['Roboto'] text-[#0F172A] break-all">{selectedInquiry.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <h4 className="font-['Inter'] text-[#0F172A]">Subject</h4>
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <p className="font-['Roboto'] text-[#0F172A]">{selectedInquiry.subject}</p>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <h4 className="font-['Inter'] text-[#0F172A]">Message</h4>
                <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                  <p className="font-['Roboto'] text-[#0F172A] leading-relaxed whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-['Roboto'] rounded-full h-11"
                  onClick={() => {
                    setEmailSentDialogOpen(true);
                    window.location.href = `mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject}`;
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Reply via Email
                </Button>
                {selectedInquiry.status === "New" && (
                  <Button 
                    className="flex-1 bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-11"
                    onClick={() => {
                      setInquiryDetailsDialogOpen(false);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Responded
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Sent Confirmation Dialog */}
      <Dialog open={emailSentDialogOpen} onOpenChange={setEmailSentDialogOpen}>
        <DialogContent className="max-w-md border-[#334155] bg-[#0F172A]">
          <DialogHeader className="sr-only">
            <DialogTitle>Email Client Opened</DialogTitle>
            <DialogDescription>
              Your email client has been opened to send a reply
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="h-24 w-24 rounded-full bg-[#1E293B] border-2 border-[#3B82F6] flex items-center justify-center mx-auto shadow-lg shadow-[#3B82F6]/30">
              <Mail className="h-12 w-12 text-[#3B82F6]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-['Inter'] text-white mb-2">Email Client Opened</h3>
              <p className="text-sm text-[#94A3B8] font-['Roboto']">
                Your default email client has been opened to send a reply to {selectedInquiry?.name}.
              </p>
            </div>
            <Button 
              className="w-full bg-[#F02801] hover:bg-[#D22301] text-white font-['Roboto'] rounded-full h-11"
              onClick={() => setEmailSentDialogOpen(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm User Action Dialog */}
      <Dialog open={confirmUserActionDialogOpen} onOpenChange={setConfirmUserActionDialogOpen}>
        <DialogContent className="max-w-md border-[#E5E7EB] bg-white">
          <DialogHeader>
            <DialogTitle className="font-['Inter'] text-[#0F172A]">
              {selectedUser?.status === "Active" ? "Suspend User" : "Activate User"}
            </DialogTitle>
            <DialogDescription className="font-['Roboto'] text-[#475569]">
              {selectedUser?.status === "Active" 
                ? "Are you sure you want to suspend this user? They will no longer be able to access the platform."
                : "Are you sure you want to activate this user? They will be able to access the platform again."
              }
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 mt-2">
              {/* User Info */}
              <div className="bg-[#F1F5F9] p-4 rounded-xl border border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F02801] to-[#D22301] flex items-center justify-center shadow-sm flex-shrink-0">
                    <span className="text-white font-['Inter'] text-sm">{selectedUser.name.split(' ').map((n: string) => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="font-['Inter'] text-[#0F172A]">{selectedUser.name}</p>
                    <p className="text-sm text-[#475569] font-['Roboto']">{selectedUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              {selectedUser.status === "Active" && (
                <div className="bg-[#FEF3F2] p-4 rounded-xl border-2 border-[#F02801]/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-[#F02801] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-['Inter'] text-[#7F1D1D] mb-1">Warning</p>
                      <p className="text-sm text-[#475569] font-['Roboto']">
                        Suspending this user will immediately revoke their access. Any active quotes or requests will remain visible but they won't be able to create new ones.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline"
                  className="flex-1 border-[#E5E7EB] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] font-['Roboto'] rounded-full h-11"
                  onClick={() => setConfirmUserActionDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className={`flex-1 font-['Roboto'] rounded-full h-11 ${
                    selectedUser.status === "Active"
                      ? "bg-[#EF4444] hover:bg-[#DC2626] text-white"
                      : "bg-[#22C55E] hover:bg-[#16A34A] text-white"
                  }`}
                  onClick={() => {
                    handleToggleUserStatus(selectedUser.id);
                    setConfirmUserActionDialogOpen(false);
                    setUserDetailsDialogOpen(false);
                  }}
                >
                  {selectedUser.status === "Active" ? (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Confirm Suspend
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirm Activate
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminDashboardPage;
