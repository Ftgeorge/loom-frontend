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
  // Client
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
  // Artisan
  newRequests: string;
  activeJobs: string;
  yourRating: string;
  totalEarnings: string;
  goOnline: string;
  goOffline: string;
  acceptJob: string;
  declineJob: string;
  // Status
  requested: string;
  matched: string;
  scheduled: string;
  inProgress: string;
  completed: string;
  cancelled: string;
  // Onboarding
  onboard1Title: string;
  onboard1Desc: string;
  onboard2Title: string;
  onboard2Desc: string;
  onboard3Title: string;
  onboard3Desc: string;
  // Role
  iNeedArtisan: string;
  iAmArtisan: string;
  clientDesc: string;
  artisanDesc: string;
  // Misc
  language: string;
  notifications: string;
  helpSupport: string;
  noMessages: string;
  noResults: string;
  offline: string;
  networkError: string;
  emptyList: string;
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
  findArtisan: "Find a professional",
  topRated: "Top rated professionals",
  recentlyUsed: "Recently used",
  noRequests: "No bookings found",
  postFirstJob: "Post your first request to get started!",
  requestSubmitted: "Request submitted!",
  seeMatched: "See matches",
  matchedArtisans: "Matched Professionals",
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
  onboard1Title: "Reliable Professionals",
  onboard1Desc: "Connect with verified professionals in your neighborhood.",
  onboard2Title: "Easy Requesting",
  onboard2Desc: "Describe what you need in plain English or Pidgin.",
  onboard3Title: "Safe & Secure",
  onboard3Desc: "Every professional is vetted and rated by people like you.",
  iNeedArtisan: "I need a professional",
  iAmArtisan: "I am a professional",
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
  retry: "Tún gbìyànjú",
  cancel: "Comot am",
  confirm: "Correct",
  submit: "Send am",
  save: "Save am",
  next: "Next",
  skip: "Pass",
  back: "Padà",
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
  onboard1Title: "Find correct people nítòsí rẹ",
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
};

const translations: Record<Language, TranslationKeys> = { en, pidgin, yoruba };

export function t(key: keyof TranslationKeys, lang: Language = "en"): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}

export const languageNames: Record<Language, string> = {
  en: "English",
  pidgin: "Pidgin",
  yoruba: "Yorùbá",
};

export type { TranslationKeys };
