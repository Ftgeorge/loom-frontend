import type {
    AppNotification,
    Artisan,
    CategoryId,
    EarningsSummary,
    JobRequest,
    Message,
    MessageThread,
} from "@/types";

// ─── Helpers ────────────────────────────────────────────
const delay = (ms?: number) =>
  new Promise((r) => setTimeout(r, ms ?? 400 + Math.random() * 500));

const mayFail = () => Math.random() < 0.1;

async function mockFetch<T>(data: T): Promise<T> {
  await delay();
  if (mayFail()) throw new Error("Network request failed. Please try again.");
  return data;
}

// ─── Mock Artisans ──────────────────────────────────────
export const MOCK_ARTISANS: Artisan[] = [
  {
    id: "a1",
    name: "Chinedu Okafor",
    phone: "+2348012345001",
    avatar: undefined,
    skills: ["plumber"],
    rating: 4.8,
    reviewCount: 142,
    verified: true,
    distance: 1.2,
    availability: "online",
    priceRange: { min: 5000, max: 25000 },
    bio: "Expert plumber with 8 years experience. I fix all water and pipe problems. No job too small or big.",
    location: { area: "Wuse 2", city: "Abuja", state: "FCT" },
    serviceAreas: ["Wuse", "Garki", "Maitama", "Gwarinpa"],
    pricingStyle: "estimate",
    completedJobs: 230,
    joinedDate: "2022-03-15",
    reviews: [
      {
        id: "r1",
        clientName: "Ngozi A.",
        rating: 5,
        comment: "Very professional! Fixed my burst pipe in less than an hour.",
        tags: ["Professional", "Fast"],
        createdAt: "2025-12-10",
      },
      {
        id: "r2",
        clientName: "Emeka U.",
        rating: 4,
        comment: "Good work, but came a bit late. Still did a solid job.",
        tags: ["Affordable"],
        createdAt: "2025-11-22",
      },
      {
        id: "r3",
        clientName: "Aisha M.",
        rating: 5,
        comment: "The best plumber for Abuja! I dey recommend am.",
        tags: ["Professional", "Friendly"],
        createdAt: "2025-11-05",
      },
    ],
  },
  {
    id: "a2",
    name: "Funke Adeyemi",
    phone: "+2348012345002",
    avatar: undefined,
    skills: ["electrician"],
    rating: 4.6,
    reviewCount: 98,
    verified: true,
    distance: 2.5,
    availability: "online",
    priceRange: { min: 8000, max: 40000 },
    bio: "Licensed electrician. House wiring, fault tracing, generator repairs, and solar installation.",
    location: { area: "Garki", city: "Abuja", state: "FCT" },
    serviceAreas: ["Garki", "Wuse", "Asokoro", "Central Area"],
    pricingStyle: "estimate",
    completedJobs: 175,
    joinedDate: "2021-07-20",
    reviews: [
      {
        id: "r4",
        clientName: "Bola T.",
        rating: 5,
        comment: "She know her work well well! My light don dey work fine.",
        tags: ["Professional", "Fast"],
        createdAt: "2025-12-01",
      },
      {
        id: "r5",
        clientName: "Yusuf K.",
        rating: 4,
        comment: "Good electrician. Honest and reliable.",
        tags: ["Affordable", "Friendly"],
        createdAt: "2025-11-18",
      },
    ],
  },
  {
    id: "a3",
    name: "Adamu Bello",
    phone: "+2348012345003",
    avatar: undefined,
    skills: ["carpenter"],
    rating: 4.9,
    reviewCount: 67,
    verified: true,
    distance: 3.8,
    availability: "online",
    priceRange: { min: 15000, max: 80000 },
    bio: "Master carpenter. Kitchen cabinets, wardrobes, doors, furniture — any woodwork.",
    location: { area: "Gwarinpa", city: "Abuja", state: "FCT" },
    serviceAreas: ["Gwarinpa", "Kubwa", "Jabi", "Life Camp"],
    pricingStyle: "fixed",
    completedJobs: 110,
    joinedDate: "2023-01-10",
    reviews: [
      {
        id: "r6",
        clientName: "Chioma N.",
        rating: 5,
        comment: "Amazing craftsmanship! My wardrobe na masterpiece.",
        tags: ["Professional", "Fast"],
        createdAt: "2025-12-05",
      },
    ],
  },
  {
    id: "a4",
    name: "Blessing Eze",
    phone: "+2348012345004",
    avatar: undefined,
    skills: ["tailor"],
    rating: 4.7,
    reviewCount: 203,
    verified: true,
    distance: 0.8,
    availability: "online",
    priceRange: { min: 3000, max: 35000 },
    bio: "Fashion designer & tailor. Ankara, Aso-Oke, English wear, corporate styles. I sew am sharp!",
    location: { area: "Maitama", city: "Abuja", state: "FCT" },
    serviceAreas: ["Maitama", "Wuse 2", "Asokoro", "Garki"],
    pricingStyle: "fixed",
    completedJobs: 380,
    joinedDate: "2020-06-15",
    reviews: [
      {
        id: "r7",
        clientName: "Sandra O.",
        rating: 5,
        comment: "My agbada was perfect for the wedding!",
        tags: ["Professional", "Fast", "Affordable"],
        createdAt: "2025-12-15",
      },
      {
        id: "r8",
        clientName: "Kemi D.",
        rating: 5,
        comment: "Best tailor in Abuja. Always delivers on time.",
        tags: ["Professional", "Friendly"],
        createdAt: "2025-11-28",
      },
    ],
  },
  {
    id: "a5",
    name: "Ibrahim Musa",
    phone: "+2348012345005",
    avatar: undefined,
    skills: ["mechanic"],
    rating: 4.5,
    reviewCount: 156,
    verified: true,
    distance: 4.2,
    availability: "busy",
    priceRange: { min: 10000, max: 150000 },
    bio: "Auto mechanic. Toyota, Honda, Mercedes, any car. Engine, brake, AC, electrical — I dey fix all.",
    location: { area: "Nyanya", city: "Abuja", state: "FCT" },
    serviceAreas: ["Nyanya", "Karu", "Maraba", "Jikwoyi"],
    pricingStyle: "estimate",
    completedJobs: 290,
    joinedDate: "2019-11-01",
    reviews: [
      {
        id: "r9",
        clientName: "Tony M.",
        rating: 5,
        comment: "Fixed my Toyota Camry engine. Runs like new!",
        tags: ["Professional"],
        createdAt: "2025-12-08",
      },
    ],
  },
  {
    id: "a6",
    name: "Amina Suleiman",
    phone: "+2348012345006",
    avatar: undefined,
    skills: ["cleaning"],
    rating: 4.8,
    reviewCount: 89,
    verified: true,
    distance: 1.5,
    availability: "online",
    priceRange: { min: 5000, max: 20000 },
    bio: "Professional home and office cleaning. Deep clean, post-construction, fumigation.",
    location: { area: "Jabi", city: "Abuja", state: "FCT" },
    serviceAreas: ["Jabi", "Utako", "Wuse", "Life Camp"],
    pricingStyle: "fixed",
    completedJobs: 145,
    joinedDate: "2022-09-20",
    reviews: [
      {
        id: "r10",
        clientName: "Grace I.",
        rating: 5,
        comment: "My house was sparkling! Very thorough.",
        tags: ["Professional", "Friendly"],
        createdAt: "2025-12-12",
      },
    ],
  },
  {
    id: "a7",
    name: "Ogechi Nwankwo",
    phone: "+2348012345007",
    avatar: undefined,
    skills: ["hair_beauty"],
    rating: 4.9,
    reviewCount: 312,
    verified: true,
    distance: 2.0,
    availability: "online",
    priceRange: { min: 5000, max: 50000 },
    bio: "Hair stylist & makeup artist. Braids, weaving, locs, bridal makeup. Your beauty na my business!",
    location: { area: "Lekki", city: "Lagos", state: "Lagos" },
    serviceAreas: ["Lekki", "VI", "Ikoyi", "Ajah"],
    pricingStyle: "fixed",
    completedJobs: 520,
    joinedDate: "2020-02-14",
    reviews: [
      {
        id: "r11",
        clientName: "Adaeze K.",
        rating: 5,
        comment: "Ogechi is the GOAT! My knotless braids were perfect.",
        tags: ["Professional", "Fast", "Friendly"],
        createdAt: "2025-12-18",
      },
      {
        id: "r12",
        clientName: "Fatima B.",
        rating: 5,
        comment: "Best bridal makeup ever! Everyone was asking for her number.",
        tags: ["Professional"],
        createdAt: "2025-12-01",
      },
    ],
  },
  {
    id: "a8",
    name: "Segun Afolabi",
    phone: "+2348012345008",
    avatar: undefined,
    skills: ["ac_repair"],
    rating: 4.4,
    reviewCount: 76,
    verified: false,
    distance: 5.0,
    availability: "online",
    priceRange: { min: 8000, max: 45000 },
    bio: "AC repair and installation. Split unit, standing, window AC. Gas charging, servicing, repair.",
    location: { area: "Yaba", city: "Lagos", state: "Lagos" },
    serviceAreas: ["Yaba", "Surulere", "Ikeja", "Maryland"],
    pricingStyle: "estimate",
    completedJobs: 120,
    joinedDate: "2023-04-01",
    reviews: [
      {
        id: "r13",
        clientName: "Peter O.",
        rating: 4,
        comment: "Good job on my AC. It's cooling well now.",
        tags: ["Affordable"],
        createdAt: "2025-11-30",
      },
    ],
  },
  {
    id: "a9",
    name: "Yakubu Danjuma",
    phone: "+2348012345009",
    avatar: undefined,
    skills: ["plumber", "ac_repair"],
    rating: 4.3,
    reviewCount: 45,
    verified: true,
    distance: 3.0,
    availability: "offline",
    priceRange: { min: 5000, max: 30000 },
    bio: "Plumbing and AC works. Pipe fitting, water heater, bathroom installation, AC servicing.",
    location: { area: "PH GRA", city: "Port Harcourt", state: "Rivers" },
    serviceAreas: ["GRA", "Trans Amadi", "Rumuola", "Eliozu"],
    pricingStyle: "estimate",
    completedJobs: 80,
    joinedDate: "2023-08-15",
    reviews: [
      {
        id: "r14",
        clientName: "Osas E.",
        rating: 4,
        comment: "Decent work. Will use again.",
        tags: ["Affordable"],
        createdAt: "2025-11-15",
      },
    ],
  },
  {
    id: "a10",
    name: "Halima Abdullahi",
    phone: "+2348012345010",
    avatar: undefined,
    skills: ["tailor"],
    rating: 4.6,
    reviewCount: 134,
    verified: true,
    distance: 2.3,
    availability: "online",
    priceRange: { min: 4000, max: 25000 },
    bio: "Kaftan, agbada, senator styles. I make men and women fashion. Ready in 3-5 days.",
    location: { area: "Kubwa", city: "Abuja", state: "FCT" },
    serviceAreas: ["Kubwa", "Bwari", "Dutse", "Gwarinpa"],
    pricingStyle: "fixed",
    completedJobs: 200,
    joinedDate: "2021-01-20",
    reviews: [
      {
        id: "r15",
        clientName: "Mike A.",
        rating: 5,
        comment: "My senator style was fire! Got compliments everywhere.",
        tags: ["Professional", "Fast"],
        createdAt: "2025-12-03",
      },
    ],
  },
  {
    id: "a11",
    name: "Emeka Obi",
    phone: "+2348012345011",
    avatar: undefined,
    skills: ["electrician", "ac_repair"],
    rating: 4.7,
    reviewCount: 88,
    verified: true,
    distance: 1.8,
    availability: "online",
    priceRange: { min: 7000, max: 50000 },
    bio: "Electrical and AC specialist. Solar panel installation, inverter setup, and generator repairs.",
    location: { area: "Asokoro", city: "Abuja", state: "FCT" },
    serviceAreas: ["Asokoro", "Maitama", "Garki", "Central Area"],
    pricingStyle: "estimate",
    completedJobs: 160,
    joinedDate: "2021-05-10",
    reviews: [
      {
        id: "r16",
        clientName: "Uche N.",
        rating: 5,
        comment: "Installed my solar perfectly. Very knowledgeable!",
        tags: ["Professional", "Fast"],
        createdAt: "2025-12-14",
      },
    ],
  },
  {
    id: "a12",
    name: "Patience Okonkwo",
    phone: "+2348012345012",
    avatar: undefined,
    skills: ["cleaning", "hair_beauty"],
    rating: 4.5,
    reviewCount: 62,
    verified: false,
    distance: 3.5,
    availability: "online",
    priceRange: { min: 3000, max: 15000 },
    bio: "Cleaning and beauty services. Deep cleaning, laundry, makeup, gele tying for occasions.",
    location: { area: "Utako", city: "Abuja", state: "FCT" },
    serviceAreas: ["Utako", "Jabi", "Wuse", "Life Camp"],
    pricingStyle: "fixed",
    completedJobs: 95,
    joinedDate: "2023-02-28",
    reviews: [
      {
        id: "r17",
        clientName: "Joy O.",
        rating: 4,
        comment: "Good cleaning service. Affordable too.",
        tags: ["Affordable", "Friendly"],
        createdAt: "2025-11-25",
      },
    ],
  },
];

// ─── Mock Job Requests ──────────────────────────────────
export const MOCK_JOBS: JobRequest[] = [
  {
    id: "j1",
    clientId: "u1",
    clientName: "George",
    category: "plumber",
    description:
      "My kitchen sink pipe burst and water dey leak everywhere. I need urgent repair.",
    budget: 15000,
    urgency: "now",
    location: { area: "Wuse 2", city: "Abuja", state: "FCT" },
    status: "in_progress",
    artisanStatus: "in_progress",
    artisanId: "a1",
    artisanName: "Chinedu Okafor",
    createdAt: "2026-02-23T10:00:00Z",
    scheduledDate: "2026-02-23",
    scheduledTime: "14:00",
  },
  {
    id: "j2",
    clientId: "u1",
    clientName: "George",
    category: "electrician",
    description:
      "My socket dey spark, e no dey work again. All the sockets for living room.",
    budget: 20000,
    urgency: "today",
    location: { area: "Wuse 2", city: "Abuja", state: "FCT" },
    status: "matched",
    artisanId: "a2",
    artisanName: "Funke Adeyemi",
    createdAt: "2026-02-22T15:30:00Z",
  },
  {
    id: "j3",
    clientId: "u1",
    clientName: "George",
    category: "carpenter",
    description:
      "I need a custom wardrobe for my bedroom. 6 feet wide with mirror.",
    budget: 65000,
    urgency: "this_week",
    location: { area: "Gwarinpa", city: "Abuja", state: "FCT" },
    status: "submitted",
    createdAt: "2026-02-21T09:15:00Z",
  },
  {
    id: "j4",
    clientId: "u1",
    clientName: "George",
    category: "tailor",
    description:
      "I need 3 agbada sets for a wedding. White, cream, and navy blue.",
    budget: 45000,
    urgency: "this_week",
    location: { area: "Maitama", city: "Abuja", state: "FCT" },
    status: "completed",
    artisanId: "a4",
    artisanName: "Blessing Eze",
    createdAt: "2026-02-10T12:00:00Z",
    completedAt: "2026-02-18T16:00:00Z",
    scheduledDate: "2026-02-14",
    scheduledTime: "10:00",
  },
  {
    id: "j5",
    clientId: "u1",
    clientName: "George",
    category: "cleaning",
    description: "Deep cleaning for 4-bedroom flat. Post-renovation cleaning.",
    budget: 18000,
    urgency: "this_week",
    location: { area: "Jabi", city: "Abuja", state: "FCT" },
    status: "completed",
    artisanId: "a6",
    artisanName: "Amina Suleiman",
    createdAt: "2026-02-05T08:30:00Z",
    completedAt: "2026-02-07T18:00:00Z",
  },
  {
    id: "j6",
    clientId: "u1",
    clientName: "George",
    category: "mechanic",
    description: "My car AC no dey blow cold air. Toyota Corolla 2019.",
    budget: 25000,
    urgency: "today",
    location: { area: "Nyanya", city: "Abuja", state: "FCT" },
    status: "cancelled",
    createdAt: "2026-02-15T11:00:00Z",
  },
  {
    id: "j7",
    clientId: "c2",
    clientName: "Amaka Johnson",
    category: "electrician",
    description: "Need to install new wiring for a 3-bedroom apartment.",
    budget: 75000,
    urgency: "this_week",
    location: { area: "Garki", city: "Abuja", state: "FCT" },
    status: "submitted",
    createdAt: "2026-02-23T08:00:00Z",
  },
  {
    id: "j8",
    clientId: "c3",
    clientName: "Bayo Adebayo",
    category: "plumber",
    description: "Toilet dey leak for bathroom. Water everywhere.",
    budget: 10000,
    urgency: "now",
    location: { area: "Wuse 2", city: "Abuja", state: "FCT" },
    status: "submitted",
    createdAt: "2026-02-23T12:00:00Z",
  },
  {
    id: "j9",
    clientId: "c4",
    clientName: "Fatima Bello",
    category: "hair_beauty",
    description: "Bridal makeup and gele tying for my wedding on Saturday.",
    budget: 35000,
    urgency: "this_week",
    location: { area: "Maitama", city: "Abuja", state: "FCT" },
    status: "scheduled",
    artisanId: "a7",
    artisanName: "Ogechi Nwankwo",
    createdAt: "2026-02-20T10:00:00Z",
    scheduledDate: "2026-02-28",
    scheduledTime: "07:00",
  },
  {
    id: "j10",
    clientId: "c5",
    clientName: "Ikenna Eze",
    category: "ac_repair",
    description: "AC unit making noise and not cooling. 2HP LG split unit.",
    budget: 12000,
    urgency: "today",
    location: { area: "Asokoro", city: "Abuja", state: "FCT" },
    status: "submitted",
    createdAt: "2026-02-23T14:30:00Z",
  },
];

// ─── Mock Message Threads ───────────────────────────────
export const MOCK_THREADS: MessageThread[] = [
  {
    id: "t1",
    participantName: "Chinedu Okafor",
    participantRole: "artisan",
    lastMessage: "I dey come now. Give me 20 minutes.",
    lastMessageTime: "2026-02-23T13:45:00Z",
    unreadCount: 1,
    messages: [
      {
        id: "m1",
        threadId: "t1",
        senderId: "u1",
        text: "Good afternoon. When you fit come fix my pipe?",
        timestamp: "2026-02-23T13:30:00Z",
        read: true,
      },
      {
        id: "m2",
        threadId: "t1",
        senderId: "a1",
        text: "Good afternoon! I dey available now. Where you dey?",
        timestamp: "2026-02-23T13:32:00Z",
        read: true,
      },
      {
        id: "m3",
        threadId: "t1",
        senderId: "u1",
        text: "Wuse 2, close to Banex Plaza.",
        timestamp: "2026-02-23T13:35:00Z",
        read: true,
      },
      {
        id: "m4",
        threadId: "t1",
        senderId: "a1",
        text: "Okay, I know the area. Let me check my tools and head out.",
        timestamp: "2026-02-23T13:40:00Z",
        read: true,
      },
      {
        id: "m5",
        threadId: "t1",
        senderId: "a1",
        text: "I dey come now. Give me 20 minutes.",
        timestamp: "2026-02-23T13:45:00Z",
        read: false,
      },
    ],
  },
  {
    id: "t2",
    participantName: "Funke Adeyemi",
    participantRole: "artisan",
    lastMessage: "I go check the sockets tomorrow morning by 9am.",
    lastMessageTime: "2026-02-22T18:20:00Z",
    unreadCount: 0,
    messages: [
      {
        id: "m6",
        threadId: "t2",
        senderId: "u1",
        text: "Hello, my sockets no dey work. You fit help?",
        timestamp: "2026-02-22T17:00:00Z",
        read: true,
      },
      {
        id: "m7",
        threadId: "t2",
        senderId: "a2",
        text: "Yes of course! How many sockets and which area?",
        timestamp: "2026-02-22T17:10:00Z",
        read: true,
      },
      {
        id: "m8",
        threadId: "t2",
        senderId: "u1",
        text: "4 sockets for the living room. Wuse 2.",
        timestamp: "2026-02-22T17:15:00Z",
        read: true,
      },
      {
        id: "m9",
        threadId: "t2",
        senderId: "a2",
        text: "I go check the sockets tomorrow morning by 9am.",
        timestamp: "2026-02-22T18:20:00Z",
        read: true,
      },
    ],
  },
  {
    id: "t3",
    participantName: "Blessing Eze",
    participantRole: "artisan",
    lastMessage: "Your agbada don ready! Come pick am up.",
    lastMessageTime: "2026-02-18T14:00:00Z",
    unreadCount: 0,
    messages: [
      {
        id: "m10",
        threadId: "t3",
        senderId: "u1",
        text: "How far with my agbada? The wedding na this Saturday.",
        timestamp: "2026-02-17T10:00:00Z",
        read: true,
      },
      {
        id: "m11",
        threadId: "t3",
        senderId: "a4",
        text: "Almost done! Just doing the final embroidery.",
        timestamp: "2026-02-17T10:30:00Z",
        read: true,
      },
      {
        id: "m12",
        threadId: "t3",
        senderId: "a4",
        text: "Your agbada don ready! Come pick am up.",
        timestamp: "2026-02-18T14:00:00Z",
        read: true,
      },
    ],
  },
  {
    id: "t4",
    participantName: "Amaka Johnson",
    participantRole: "client",
    lastMessage: "When you go fit start the wiring?",
    lastMessageTime: "2026-02-23T09:00:00Z",
    unreadCount: 2,
    messages: [
      {
        id: "m13",
        threadId: "t4",
        senderId: "c2",
        text: "Good morning. I see your profile, you dey available for house wiring?",
        timestamp: "2026-02-23T08:30:00Z",
        read: true,
      },
      {
        id: "m14",
        threadId: "t4",
        senderId: "u1",
        text: "Yes, I dey available. Send me the details.",
        timestamp: "2026-02-23T08:45:00Z",
        read: true,
      },
      {
        id: "m15",
        threadId: "t4",
        senderId: "c2",
        text: "When you go fit start the wiring?",
        timestamp: "2026-02-23T09:00:00Z",
        read: false,
      },
    ],
  },
  {
    id: "t5",
    participantName: "Bayo Adebayo",
    participantRole: "client",
    lastMessage: "Please help, my toilet dey leak badly!",
    lastMessageTime: "2026-02-23T12:10:00Z",
    unreadCount: 1,
    messages: [
      {
        id: "m16",
        threadId: "t5",
        senderId: "c3",
        text: "Please help, my toilet dey leak badly!",
        timestamp: "2026-02-23T12:10:00Z",
        read: false,
      },
    ],
  },
  {
    id: "t6",
    participantName: "Amina Suleiman",
    participantRole: "artisan",
    lastMessage: "Thank you! Glad you liked the cleaning.",
    lastMessageTime: "2026-02-08T10:00:00Z",
    unreadCount: 0,
    messages: [
      {
        id: "m17",
        threadId: "t6",
        senderId: "u1",
        text: "Amina, the house is so clean! Thank you!",
        timestamp: "2026-02-08T09:00:00Z",
        read: true,
      },
      {
        id: "m18",
        threadId: "t6",
        senderId: "a6",
        text: "Thank you! Glad you liked the cleaning.",
        timestamp: "2026-02-08T10:00:00Z",
        read: true,
      },
    ],
  },
];

// ─── Mock Notifications ─────────────────────────────────
export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    type: "job_update",
    title: "Artisan on the way",
    body: "Chinedu Okafor is heading to your location now.",
    read: false,
    createdAt: "2026-02-23T13:50:00Z",
  },
  {
    id: "n2",
    type: "message",
    title: "New message",
    body: "Chinedu Okafor sent you a message.",
    read: false,
    createdAt: "2026-02-23T13:45:00Z",
  },
  {
    id: "n3",
    type: "job_update",
    title: "Artisan matched",
    body: "Funke Adeyemi has been matched to your electrician request.",
    read: true,
    createdAt: "2026-02-22T16:00:00Z",
  },
  {
    id: "n4",
    type: "booking",
    title: "Booking confirmed",
    body: "Your appointment with Funke Adeyemi is confirmed for tomorrow at 9am.",
    read: true,
    createdAt: "2026-02-22T18:30:00Z",
  },
  {
    id: "n5",
    type: "review",
    title: "Rate your artisan",
    body: "How was your experience with Blessing Eze? Leave a review!",
    read: false,
    createdAt: "2026-02-18T17:00:00Z",
  },
  {
    id: "n6",
    type: "job_update",
    title: "Job completed",
    body: "Your tailoring job with Blessing Eze has been marked as completed.",
    read: true,
    createdAt: "2026-02-18T16:00:00Z",
  },
  {
    id: "n7",
    type: "system",
    title: "Welcome to Loom!",
    body: "Start by posting your first job request or browsing artisans near you.",
    read: true,
    createdAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "n8",
    type: "job_update",
    title: "New job request",
    body: "A new plumber request is available in Wuse 2.",
    read: false,
    createdAt: "2026-02-23T12:05:00Z",
  },
  {
    id: "n9",
    type: "job_update",
    title: "New job request",
    body: "A new electrician request is available in Garki.",
    read: false,
    createdAt: "2026-02-23T08:10:00Z",
  },
  {
    id: "n10",
    type: "message",
    title: "New message",
    body: "Amaka Johnson sent you a message.",
    read: false,
    createdAt: "2026-02-23T09:05:00Z",
  },
  {
    id: "n11",
    type: "booking",
    title: "Job accepted",
    body: "You accepted the plumbing job from George.",
    read: true,
    createdAt: "2026-02-23T10:30:00Z",
  },
  {
    id: "n12",
    type: "job_update",
    title: "Job request cancelled",
    body: "George cancelled the mechanic job request.",
    read: true,
    createdAt: "2026-02-15T12:00:00Z",
  },
  {
    id: "n13",
    type: "system",
    title: "Complete your profile",
    body: "Add your skills and service areas to get more job requests.",
    read: true,
    createdAt: "2026-02-01T11:00:00Z",
  },
  {
    id: "n14",
    type: "review",
    title: "New review!",
    body: "Ngozi A. gave you a 5-star review. Keep it up!",
    read: true,
    createdAt: "2025-12-10T15:00:00Z",
  },
  {
    id: "n15",
    type: "job_update",
    title: "Cleaning job completed",
    body: "Your cleaning job with Amina Suleiman is complete.",
    read: true,
    createdAt: "2026-02-07T18:30:00Z",
  },
  {
    id: "n16",
    type: "message",
    title: "New message",
    body: "Bayo Adebayo sent you a message about an urgent leak.",
    read: false,
    createdAt: "2026-02-23T12:15:00Z",
  },
  {
    id: "n17",
    type: "job_update",
    title: "New AC repair request",
    body: "A new AC repair request is available in Asokoro.",
    read: false,
    createdAt: "2026-02-23T14:35:00Z",
  },
  {
    id: "n18",
    type: "system",
    title: "Verify your identity",
    body: "Upload your ID card to get the verified badge on your profile.",
    read: true,
    createdAt: "2026-02-02T10:00:00Z",
  },
  {
    id: "n19",
    type: "booking",
    title: "Schedule reminder",
    body: "Your bridal makeup appointment is in 5 days.",
    read: true,
    createdAt: "2026-02-23T08:00:00Z",
  },
  {
    id: "n20",
    type: "review",
    title: "Rate Amina Suleiman",
    body: "Share your experience with the cleaning service.",
    read: true,
    createdAt: "2026-02-08T09:00:00Z",
  },
];

// ─── Mock Earnings ──────────────────────────────────────
export const MOCK_EARNINGS: EarningsSummary = {
  totalEarnings: 485000,
  thisWeek: 45000,
  thisMonth: 125000,
  pendingPayments: 15000,
  weeklyData: [
    { day: "Mon", amount: 8000 },
    { day: "Tue", amount: 12000 },
    { day: "Wed", amount: 5000 },
    { day: "Thu", amount: 10000 },
    { day: "Fri", amount: 7000 },
    { day: "Sat", amount: 3000 },
    { day: "Sun", amount: 0 },
  ],
  transactions: [
    {
      id: "tx1",
      description: "Plumbing - George (Wuse 2)",
      amount: 15000,
      date: "2026-02-23",
      type: "credit",
      status: "pending",
    },
    {
      id: "tx2",
      description: "Electrical repair - Emeka O.",
      amount: 20000,
      date: "2026-02-21",
      type: "credit",
      status: "completed",
    },
    {
      id: "tx3",
      description: "Withdrawal to GTBank",
      amount: 30000,
      date: "2026-02-20",
      type: "debit",
      status: "completed",
    },
    {
      id: "tx4",
      description: "Pipe fitting - Sandra O.",
      amount: 12000,
      date: "2026-02-18",
      type: "credit",
      status: "completed",
    },
    {
      id: "tx5",
      description: "Withdrawal to GTBank",
      amount: 25000,
      date: "2026-02-15",
      type: "debit",
      status: "completed",
    },
    {
      id: "tx6",
      description: "Water heater install - Kemi D.",
      amount: 18000,
      date: "2026-02-12",
      type: "credit",
      status: "completed",
    },
    {
      id: "tx7",
      description: "Toilet repair - Bola T.",
      amount: 8000,
      date: "2026-02-10",
      type: "credit",
      status: "completed",
    },
    {
      id: "tx8",
      description: "Withdrawal to GTBank",
      amount: 20000,
      date: "2026-02-08",
      type: "debit",
      status: "completed",
    },
  ],
};

// ─── API Functions ──────────────────────────────────────

export async function fetchArtisans(filters?: {
  category?: CategoryId;
  minRating?: number;
  maxDistance?: number;
  search?: string;
}): Promise<Artisan[]> {
  let result = [...MOCK_ARTISANS];
  if (filters?.category)
    result = result.filter((a) => a.skills.includes(filters.category!));
  if (filters?.minRating)
    result = result.filter((a) => a.rating >= filters.minRating!);
  if (filters?.maxDistance)
    result = result.filter((a) => a.distance <= filters.maxDistance!);
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.bio.toLowerCase().includes(q) ||
        a.skills.some((s) => s.includes(q)),
    );
  }
  return mockFetch(result);
}

export async function fetchArtisanById(
  id: string,
): Promise<Artisan | undefined> {
  return mockFetch(MOCK_ARTISANS.find((a) => a.id === id));
}

export async function fetchJobs(status?: string): Promise<JobRequest[]> {
  let result = [...MOCK_JOBS];
  if (status && status !== "all") {
    if (status === "active")
      result = result.filter((j) =>
        ["submitted", "matched", "scheduled", "in_progress"].includes(j.status),
      );
    else if (status === "completed")
      result = result.filter((j) => j.status === "completed");
    else if (status === "cancelled")
      result = result.filter((j) => j.status === "cancelled");
    else result = result.filter((j) => j.status === status);
  }
  return mockFetch(result);
}

export async function fetchJobById(
  id: string,
): Promise<JobRequest | undefined> {
  return mockFetch(MOCK_JOBS.find((j) => j.id === id));
}

export async function fetchThreads(): Promise<MessageThread[]> {
  return mockFetch([...MOCK_THREADS]);
}

export async function fetchNotifications(): Promise<AppNotification[]> {
  return mockFetch([...MOCK_NOTIFICATIONS]);
}

export async function fetchEarnings(): Promise<EarningsSummary> {
  return mockFetch({ ...MOCK_EARNINGS });
}

export async function submitJobRequest(
  job: Omit<JobRequest, "id" | "createdAt" | "status">,
): Promise<JobRequest> {
  const newJob: JobRequest = {
    ...job,
    id: "j" + Date.now(),
    status: "submitted",
    createdAt: new Date().toISOString(),
  };
  MOCK_JOBS.unshift(newJob);
  return mockFetch(newJob);
}

export async function updateJobStatus(
  jobId: string,
  status: JobRequest["status"],
): Promise<JobRequest | undefined> {
  const job = MOCK_JOBS.find((j) => j.id === jobId);
  if (job) job.status = status;
  return mockFetch(job);
}

export async function sendMessage(
  threadId: string,
  text: string,
  senderId: string,
): Promise<Message> {
  const msg: Message = {
    id: "m" + Date.now(),
    threadId,
    senderId,
    text,
    timestamp: new Date().toISOString(),
    read: false,
  };
  const thread = MOCK_THREADS.find((t) => t.id === threadId);
  if (thread) {
    thread.messages.push(msg);
    thread.lastMessage = text;
    thread.lastMessageTime = msg.timestamp;
  }
  return mockFetch(msg);
}
