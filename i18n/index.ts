import { Language } from "@/types";

type TranslationKeys = {
  // Nav / Tabs
  home: string;
  search: string;
  requests: string;
  messages: string;
  profile: string;
  dashboard: string;
  jobs: string;
  earnings: string;
  // Common
  welcome: string;
  greeting: string;
  loading: string;
  retry: string;
  cancel: string;
  confirm: string;
  submit: string;
  save: string;
  next: string;
  skip: string;
  back: string;
  done: string;
  getStarted: string;
  logOut: string;
  settings: string;
  // Auth
  signIn: string;
  signUp: string;
  forgotPassword: string;
  verifyOtp: string;
  enterOtp: string;
  postJob: string;
  findArtisan: string;
  topRated: string;
  recentlyUsed: string;
  noRequests: string;
  postFirstJob: string;
  requestSubmitted: string;
  seeMatched: string;
  matchedArtisans: string;
  bookNow: string;
  newRequests: string;
  activeJobs: string;
  yourRating: string;
  totalEarnings: string;
  goOnline: string;
  goOffline: string;
  acceptJob: string;
  declineJob: string;
  requested: string;
  matched: string;
  scheduled: string;
  inProgress: string;
  completed: string;
  cancelled: string;
  onboard1Title: string;
  onboard1Desc: string;
  onboard2Title: string;
  onboard2Desc: string;
  onboard3Title: string;
  onboard3Desc: string;
  iNeedArtisan: string;
  iAmArtisan: string;
  clientDesc: string;
  artisanDesc: string;
  language: string;
  notifications: string;
  helpSupport: string;
  noMessages: string;
  noResults: string;
  offline: string;
  networkError: string;
  emptyList: string;
  // New
  verificationStatus: string;
  pendingReview: string;
  verifiedAccount: string;
  earningsHistory: string;
  withdrawMoney: string;
  locationDetails: string;
  state: string;
  city: string;
  area: string;
};

const en: TranslationKeys = {
  home: "Home",
  search: "Search",
  requests: "Bookings",
  messages: "Messages",
  profile: "Profile",
  dashboard: "Dashboard",
  jobs: "Jobs",
  earnings: "Earnings",
  welcome: "Welcome to Loom",
  greeting: "Hello!",
  loading: "Loading...",
  retry: "Try again",
  cancel: "Cancel",
  confirm: "Confirm",
  submit: "Submit",
  save: "Save",
  next: "Next",
  skip: "Skip",
  back: "Back",
  done: "Done",
  getStarted: "Get Started",
  logOut: "Log Out",
  settings: "Settings",
  signIn: "Sign In",
  signUp: "Sign Up",
  forgotPassword: "Forgot Password?",
  verifyOtp: "Verify Code",
  enterOtp: "Enter the code we sent",
  postJob: "What do you need help with?",
  findArtisan: "Find an artisan",
  topRated: "Top rated artisan",
  recentlyUsed: "Recently used",
  noRequests: "No bookings found",
  postFirstJob: "Post your first request to get started!",
  requestSubmitted: "Request submitted!",
  seeMatched: "See matches",
  matchedArtisans: "Matched Artisans",
  bookNow: "Book Now",
  newRequests: "New Requests",
  activeJobs: "Active Jobs",
  yourRating: "Your Rating",
  totalEarnings: "Total Earnings",
  goOnline: "Go Online",
  goOffline: "Go Offline",
  acceptJob: "Accept Job",
  declineJob: "Decline Job",
  requested: "Requested",
  matched: "Matched",
  scheduled: "Scheduled",
  inProgress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  onboard1Title: "Reliable Artisans",
  onboard1Desc: "Connect with verified artisans in your neighborhood.",
  onboard2Title: "Easy Requesting",
  onboard2Desc: "Describe what you need in plain English or Pidgin.",
  onboard3Title: "Safe & Secure",
  onboard3Desc: "Every artisan is vetted and rated by people like you.",
  iNeedArtisan: "I need an artisan",
  iAmArtisan: "I am an artisan",
  clientDesc: "Find skilled people to help with your tasks",
  artisanDesc: "Offer your services and grow your business",
  language: "Language",
  notifications: "Notifications",
  helpSupport: "Help & Support",
  noMessages: "No messages yet",
  noResults: "No results found",
  offline: "You're offline",
  networkError: "Connection error. Please check your network.",
  emptyList: "The list is empty",
  verificationStatus: "Verification Status",
  pendingReview: "Pending Review",
  verifiedAccount: "Verified Account",
  earningsHistory: "Earnings History",
  withdrawMoney: "Withdraw Money",
  locationDetails: "Location Details",
  state: "State",
  city: "City",
  area: "Area / Neighborhood",
};

const pidgin: TranslationKeys = {
  home: "Loom",
  search: "Look",
  requests: "Work",
  messages: "Gists",
  profile: "Me",
  dashboard: "Loom",
  jobs: "Work",
  earnings: "Money",
  welcome: "Loom don show!",
  greeting: "How far!",
  loading: "Wait small...",
  retry: "Try again",
  cancel: "Comot am",
  confirm: "Correct",
  submit: "Send am",
  save: "Save am",
  next: "Next",
  skip: "Pass",
  back: "Go back",
  done: "E don set",
  getStarted: "Make we start",
  logOut: "Comot",
  settings: "Set Up",
  signIn: "Enter",
  signUp: "Join",
  forgotPassword: "You forget?",
  verifyOtp: "Check Code",
  enterOtp: "Drop the code wey we send",
  postJob: "Wetin dey occur?",
  findArtisan: "Find person",
  topRated: "Best people",
  recentlyUsed: "People you use before",
  noRequests: "Nothing here",
  postFirstJob: "Post work make we start!",
  requestSubmitted: "E don go!",
  seeMatched: "See who dey ready",
  matchedArtisans: "People for you",
  bookNow: "Hire am",
  newRequests: "New work",
  activeJobs: "Work wey dey go",
  yourRating: "Your Stars",
  totalEarnings: "Total Money",
  goOnline: "I dey!",
  goOffline: "I don close",
  acceptJob: "Take am",
  declineJob: "No do",
  requested: "You ask",
  matched: "Found",
  scheduled: "Book am",
  inProgress: "Doing it",
  completed: "E don finish",
  cancelled: "No do again",
  onboard1Title: "Find correct people for your area",
  onboard1Desc: "Find person wey go fix your things sharp-sharp.",
  onboard2Title: "Talk your way",
  onboard2Desc: "Pidgin or English, use any one.",
  onboard3Title: "Correct People",
  onboard3Desc: "Every person get stars from real people. No shaking!",
  iNeedArtisan: "I need help",
  iAmArtisan: "I want work",
  clientDesc: "Find correct person for any work",
  artisanDesc: "Show people wetin you fit do make dem pay",
  language: "Language",
  notifications: "Pings",
  helpSupport: "Help",
  noMessages: "No gist yet",
  noResults: "Nothing dey",
  offline: "No net",
  networkError: "Network fall. Check your data.",
  emptyList: "Nothing dey here yet",
  verificationStatus: "Check my level",
  pendingReview: "Dem dey check am",
  verifiedAccount: "I don verified",
  earningsHistory: "How I make money",
  withdrawMoney: "Collect money",
  locationDetails: "Where I dey",
  state: "State",
  city: "City",
  area: "Area",
};

const yoruba: TranslationKeys = {
  home: "Ilé",
  search: "Wádìí",
  requests: "Àwọn Ìbéèrè",
  messages: "Àwọn Ìfiránṣẹ́",
  profile: "Profaili",
  dashboard: "Dashboard",
  jobs: "Iṣẹ́",
  earnings: "Owó",
  welcome: "Ẹ kú àbọ̀ sí Loom",
  greeting: "Ẹ kú ìrọ̀lẹ́",
  loading: "Ó ń gbéwọlé...",
  retry: "Tún gbìyànjú",
  cancel: "Fagilé",
  confirm: "Jẹ́rìísí",
  submit: "Firánṣẹ́",
  save: "Tọ́jú",
  next: "Tó kàn",
  skip: "Fò",
  back: "Padà",
  done: "Ó parí",
  getStarted: "Jẹ́ ká bẹ̀rẹ̀",
  logOut: "Jáde",
  settings: "Ètò",
  signIn: "Wọlé",
  signUp: "Forúkọsílẹ̀",
  forgotPassword: "Ṣé o gbàgbé ọ̀rọ̀ aṣínà?",
  verifyOtp: "Ṣe àyẹ̀wò kóòdù",
  enterOtp: "Tẹ kóòdù oníhàá mẹ́fà tí a fi ránṣẹ́ sí fóònù rẹ",
  postJob: "Fi iṣẹ́ sílẹ̀",
  findArtisan: "Wá oníṣẹ́ ọwọ́",
  topRated: "Àwọn tó dára jù nítòsí rẹ",
  recentlyUsed: "Àwọn tó ṣẹ̀ṣẹ̀ lò",
  noRequests: "Kò sí ìbéèrè kankan",
  postFirstJob: "Fi iṣẹ́ àkọ́kọ́ rẹ sílẹ̀!",
  requestSubmitted: "Ìbéèrè ti firánṣẹ́!",
  seeMatched: "Wo àwọn oníṣẹ́ ọwọ́",
  matchedArtisans: "Àwọn Oníṣẹ́ Ọwọ́",
  bookNow: "Ṣètò báyìí",
  newRequests: "Àwọn Ìbéèrè Tuntun",
  activeJobs: "Iṣẹ́ Tó Ń Lọ",
  yourRating: "Ìgbéléwọ̀n Rẹ",
  totalEarnings: "Àpapọ̀ Owó",
  goOnline: "Lọ Online",
  goOffline: "Lọ Offline",
  acceptJob: "Gba Iṣẹ́",
  declineJob: "Kọ̀",
  requested: "Ti béèrè",
  matched: "Ti bá mu",
  scheduled: "Ti ṣètò",
  inProgress: "Ó ń lọ lọ́wọ́",
  completed: "Ó parí",
  cancelled: "Ti fagilé",
  onboard1Title: "Wá àwọn oníṣẹ́ ọwọ́ nítòsí rẹ",
  onboard1Desc: "Sopọ̀ pẹ̀lú àwọn oníṣẹ́ ọwọ́ tó dára nítòsí rẹ.",
  onboard2Title: "Fi ìbéèrè sílẹ̀ lédè Gẹ̀ẹ́sì tàbí Pidgin",
  onboard2Desc: "Ṣàpèjúwe iṣẹ́ rẹ ní èdè tí o fẹ́.",
  onboard3Title: "Profaili tí a ti ṣàyẹ̀wò & ìgbéléwọ̀n",
  onboard3Desc: "Gbogbo oníṣẹ́ ọwọ́ ni wọ́n ní ìgbéléwọ̀n.",
  iNeedArtisan: "Mo nílò oníṣẹ́ ọwọ́",
  iAmArtisan: "Oníṣẹ́ ọwọ́ ni mí",
  clientDesc: "Wá oníṣẹ́ ọwọ́ tó dára nítòsí rẹ",
  artisanDesc: "Fi ọgbọ́n rẹ hàn kí àwọn ènìyàn lè pè ẹ́",
  language: "Èdè",
  notifications: "Ìfitónilétí",
  helpSupport: "Ìrànlọ́wọ́",
  noMessages: "Kò sí ìfiránṣẹ́",
  noResults: "Kò sí èsì kankan",
  offline: "O kò sí lórí ayélujára",
  networkError: "Nǹkan kan ti ṣẹlẹ̀. Ṣàyẹ̀wò ìsopọ̀ rẹ.",
  emptyList: "Kò sí ohunkóhun níbí",
  verificationStatus: "Ipò Àyẹ̀wò",
  pendingReview: "Ìyẹ̀wò lọ lọ́wọ́",
  verifiedAccount: "Àpamọ́ tí a ti ṣàyẹ̀wò",
  earningsHistory: "Ìtàn Owó",
  withdrawMoney: "Gba Owó Jáde",
  locationDetails: "Ibi tí a wà",
  state: "Ìpínlẹ̀",
  city: "Ìlú",
  area: "Agbègbè",
};

const hausa: TranslationKeys = {
  home: "Gida",
  search: "Bincika",
  requests: "Littattafai",
  messages: "Saƙonni",
  profile: "Bayanan sirri",
  dashboard: "Dashboard",
  jobs: "Ayyuka",
  earnings: "Kudin shiga",
  welcome: "Barka da zuwa Loom",
  greeting: "Sannu!",
  loading: "An loda...",
  retry: "Sake gwadawa",
  cancel: "Soke",
  confirm: "Tabbatar",
  submit: "Aika",
  save: "Ajiye",
  next: "Gaba",
  skip: "Tsallake",
  back: "Baya",
  done: "An gama",
  getStarted: "Fara",
  logOut: "Fita",
  settings: "Saituna",
  signIn: "Shiga",
  signUp: "Yi rijista",
  forgotPassword: "Ka manta kalmar sirri?",
  verifyOtp: "Tabbatar da lamba",
  enterOtp: "Shigar da lambar da muka aika",
  postJob: "Me kake buƙatar taimako da shi?",
  findArtisan: "Nemo ƙwararren ma'aikaci",
  topRated: "Kwararrun ma'aikata",
  recentlyUsed: "Ayyukan baya",
  noRequests: "Ba a sami littattafai ba",
  postFirstJob: "Aika buƙatarka ta farko!",
  requestSubmitted: "An aika buƙata!",
  seeMatched: "Duba wadanda suka dace",
  matchedArtisans: "Ma'aikata da suka dace",
  bookNow: "Yi rajista yanzu",
  newRequests: "Sabbin buƙatu",
  activeJobs: "Ayyukan yanzu",
  yourRating: "Kimar ku",
  totalEarnings: "Jimlar kudin shiga",
  goOnline: " Shiga yanar gizo",
  goOffline: "Fita daga yanar gizo",
  acceptJob: "Karɓi aiki",
  declineJob: "Ki aiki",
  requested: "An nema",
  matched: "An dace",
  scheduled: "An tsara",
  inProgress: "Ana kan yi",
  completed: "An gama",
  cancelled: "An soke",
  onboard1Title: "Kwararrun ma'aikata",
  onboard1Desc: "Haɗa tare da ƙwararrun ma'aikata a unguwarku.",
  onboard2Title: "Neman aiki mai sauƙi",
  onboard2Desc: "Bayyana abin da kuke buƙata cikin Turanci ko Pidgin.",
  onboard3Title: "Amintacce & Kyauta",
  onboard3Desc: "Kowane ƙwararren ma'aikaci an duba shi.",
  iNeedArtisan: "Ina buƙatar ma'aikaci",
  iAmArtisan: "Ni ƙwararren ma'aikaci ne",
  clientDesc: "Nemo mutane don taimaka muku",
  artisanDesc: "Ba da ayyukanku kuma ku haɓaka kasuwancinku",
  language: "Harshe",
  notifications: "Sanarwa",
  helpSupport: "Taimako",
  noMessages: "Babu saƙonni tukunna",
  noResults: "Ba a sami sakamako ba",
  offline: "Ba ka kan yanar gizo",
  networkError: "Matsalar hanyar yanar gizo.",
  emptyList: "Babu komai",
  verificationStatus: "Matsayin tabbatarwa",
  pendingReview: "Ana bitar",
  verifiedAccount: "Asusu da aka tabbatar",
  earningsHistory: "Tarihin kudin shiga",
  withdrawMoney: "Cire kudi",
  locationDetails: "Bayanin wuri",
  state: "Jiha",
  city: "Gari",
  area: "Unguwa",
};

const igbo: TranslationKeys = {
  home: "Ụlọ",
  search: "Chọọ",
  requests: "Akwụkwọ",
  messages: "Ozi",
  profile: "Profaịlụ",
  dashboard: "Dashboard",
  jobs: "Ọrụ",
  earnings: "Ego",
  welcome: "Nnọọ na Loom",
  greeting: "Nnọọ!",
  loading: "Na-ebu...",
  retry: "Nwaa ọzọ",
  cancel: "Kagbuo",
  confirm: "Kwado",
  submit: "Ziga",
  save: "Chekwaa",
  next: "Na-esote",
  skip: "Mafere",
  back: "Azụ",
  done: "Emechara",
  getStarted: "Malite",
  logOut: "Pụọ",
  settings: "Ntọala",
  signIn: "Banye",
  signUp: "Debanye aha",
  forgotPassword: "Chefuru paswọọdụ?",
  verifyOtp: "Nyochaa koodu",
  enterOtp: "Tinye koodu anyị zigara",
  postJob: "Gịnị ka ị chọrọ enyemaka?",
  findArtisan: "Chọọ onye ọrụ ọkachamara",
  topRated: "Ndị ọrụ kacha mma",
  recentlyUsed: "Onyejere mbụ",
  noRequests: "Ahụghị akwụkwọ ọ bụla",
  postFirstJob: "Ziga arịrịọ mbụ gị!",
  requestSubmitted: "Arịrịọ zitere!",
  seeMatched: "Hụ ndị dabara adaba",
  matchedArtisans: "Ndị ọrụ dabara adaba",
  bookNow: "Debanye aha ugbu a",
  newRequests: "Arịrịọ ọhụrụ",
  activeJobs: "Ọrụ na-aga n'ihu",
  yourRating: "Rating gị",
  totalEarnings: "Ego niile",
  goOnline: "Banye online",
  goOffline: "Pụọ na online",
  acceptJob: "Nabata ọrụ",
  declineJob: "Jụọ ọrụ",
  requested: "Arịrịọ",
  matched: "Dabara",
  scheduled: "Haziri",
  inProgress: "Na-aga n'ihu",
  completed: "Emechara",
  cancelled: "Kagbuo",
  onboard1Title: "Ndị ọrụ ọkachamara",
  onboard1Desc: "Soro ndị ọrụ ọkachamara na mpaghara gị kwurịta okwu.",
  onboard2Title: "Arịrịọ dị mfe",
  onboard2Desc: "Kowaa ihe ị chọrọ n'asụsü Bekee ma ọ bụ Pidgin.",
  onboard3Title: "Nchekwa & Amamihe",
  onboard3Desc: "A na-enyocha onye ọrụ ọ bụla.",
  iNeedArtisan: "Achọrọ m onye ọrụ",
  iAmArtisan: "Abụ m onye ọrụ ọkachamara",
  clientDesc: "Chọọ ndị mmadụ nwere ike inyere gị aka",
  artisanDesc: "nye aka ọrụ gị ma too azụmahịa gị",
  language: "Asụsụ",
  notifications: "Ịma ọkwa",
  helpSupport: "Enyemaka",
  noMessages: "Enweghị ozi ọ bụla",
  noResults: "Ahụghị ihe ọ bụla",
  offline: "Ị nọghị na online",
  networkError: "Nsogbu network. Lelee data gị.",
  emptyList: "Enweghị ihe ọ bụla ebe a",
  verificationStatus: "Ọkwa nyocha",
  pendingReview: "Na-enyocha",
  verifiedAccount: "Akaụntụ enyochara",
  earningsHistory: "Akụkọ ego",
  withdrawMoney: "Wepụ ego",
  locationDetails: "Nkọwa ebe",
  state: "Steeti",
  city: "Obodo",
  area: "Mpaghara",
};

const translations: Record<Language, TranslationKeys> = { en, pidgin, yoruba, hausa, igbo };

export function t(key: keyof TranslationKeys, lang: Language = "en"): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}

export const languageNames: Record<Language, string> = {
  en: "English",
  pidgin: "Pidgin",
  yoruba: "Yorùbá",
  hausa: "Hausa",
  igbo: "Igbo",
};

export type { TranslationKeys };
