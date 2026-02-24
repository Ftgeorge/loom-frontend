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
  requests: "Requests",
  messages: "Messages",
  profile: "Profile",
  dashboard: "Dashboard",
  jobs: "Jobs",
  earnings: "Earnings",
  welcome: "Welcome to Loom",
  greeting: "Good evening",
  loading: "Loading...",
  retry: "Retry",
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
  verifyOtp: "Verify OTP",
  enterOtp: "Enter the 6-digit code sent to your phone",
  postJob: "Post a Job Request",
  findArtisan: "Find an Artisan",
  topRated: "Top Rated Near You",
  recentlyUsed: "Recently Used",
  noRequests: "No requests yet",
  postFirstJob: "Post your first job to get started!",
  requestSubmitted: "Request Submitted!",
  seeMatched: "See Matched Artisans",
  matchedArtisans: "Matched Artisans",
  bookNow: "Book Now",
  newRequests: "New Requests",
  activeJobs: "Active Jobs",
  yourRating: "Your Rating",
  totalEarnings: "Total Earnings",
  goOnline: "Go Online",
  goOffline: "Go Offline",
  acceptJob: "Accept Job",
  declineJob: "Decline",
  requested: "Requested",
  matched: "Matched",
  scheduled: "Scheduled",
  inProgress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  onboard1Title: "Find trusted artisans near you",
  onboard1Desc:
    "Connect with verified plumbers, electricians, tailors, and more in your area.",
  onboard2Title: "Post requests in English or Pidgin",
  onboard2Desc:
    "Describe your job in the language you're most comfortable with.",
  onboard3Title: "Verified profiles & ratings you can trust",
  onboard3Desc: "Every artisan is rated by real customers. No wahala!",
  iNeedArtisan: "I need an artisan",
  iAmArtisan: "I'm an artisan",
  clientDesc: "Find skilled artisans near you for any job",
  artisanDesc: "Showcase your skills and get booked by clients",
  language: "Language",
  notifications: "Notifications",
  helpSupport: "Help & Support",
  noMessages: "No messages yet",
  noResults: "No results found",
  offline: "You're offline",
  networkError: "Something went wrong. Check your connection.",
  emptyList: "Nothing here yet",
};

const pidgin: TranslationKeys = {
  home: "Home",
  search: "Search",
  requests: "Requests",
  messages: "Messages",
  profile: "Profile",
  dashboard: "Dashboard",
  jobs: "Jobs",
  earnings: "Earnings",
  welcome: "Welcome to Loom",
  greeting: "How you dey",
  loading: "E dey load...",
  retry: "Try Again",
  cancel: "Cancel am",
  confirm: "Confirm am",
  submit: "Send am",
  save: "Save am",
  next: "Next",
  skip: "Skip",
  back: "Go Back",
  done: "Done",
  getStarted: "Make We Start",
  logOut: "Comot",
  settings: "Settings",
  signIn: "Enter",
  signUp: "Register",
  forgotPassword: "You forget password?",
  verifyOtp: "Verify Code",
  enterOtp: "Put the 6-digit code wey dem send to your phone",
  postJob: "Post Work Request",
  findArtisan: "Find Worker",
  topRated: "Best Workers Near You",
  recentlyUsed: "Recently Used",
  noRequests: "No request yet o",
  postFirstJob: "Post your first work make we start!",
  requestSubmitted: "Request Don Submit!",
  seeMatched: "See Workers Wey Fit",
  matchedArtisans: "Workers Wey Fit",
  bookNow: "Book Now",
  newRequests: "New Requests",
  activeJobs: "Active Jobs",
  yourRating: "Your Rating",
  totalEarnings: "Total Money",
  goOnline: "Go Online",
  goOffline: "Go Offline",
  acceptJob: "Accept Work",
  declineJob: "No Want",
  requested: "Requested",
  matched: "Matched",
  scheduled: "Scheduled",
  inProgress: "E Dey Happen",
  completed: "E Don Finish",
  cancelled: "Cancelled",
  onboard1Title: "Find trusted workers near you",
  onboard1Desc:
    "Connect with verified plumbers, electricians, tailors and plenty more for your area.",
  onboard2Title: "Post requests for Pidgin or English",
  onboard2Desc: "Describe your work the way wey sweet you.",
  onboard3Title: "Verified profiles & ratings wey you fit trust",
  onboard3Desc: "Every worker get rating from real customers. No wahala!",
  iNeedArtisan: "I need worker",
  iAmArtisan: "I be worker",
  clientDesc: "Find oga workers near you for any kain work",
  artisanDesc: "Show your skills make clients book you",
  language: "Language",
  notifications: "Notifications",
  helpSupport: "Help & Support",
  noMessages: "No message yet",
  noResults: "Nothing dey here",
  offline: "You no dey online",
  networkError: "Something spoil. Check your network.",
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
