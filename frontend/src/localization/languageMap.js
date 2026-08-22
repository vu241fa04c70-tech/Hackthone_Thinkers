// Centralized Regional Languages & Locales Configuration
// Supports all 22 Official Scheduled Languages of India + English (23 Languages Total)

export const SUPPORTED_LANGUAGES = {
  en: { code: 'en', name: 'English', subName: 'English', locale: 'en-IN', flag: '🌐', isRTL: false, greeting: 'English language selected. Welcome!' },
  hi: { code: 'hi', name: 'हिन्दी', subName: 'Hindi', locale: 'hi-IN', flag: '🇮🇳', isRTL: false, greeting: 'हिंदी भाषा चुनी गई। नमस्ते!' },
  bn: { code: 'bn', name: 'বাংলা', subName: 'Bengali', locale: 'bn-IN', flag: '🇮🇳', isRTL: false, greeting: 'বাংলা ভাষা নির্বাচিত হয়েছে। নমস্কার!' },
  te: { code: 'te', name: 'తెలుగు', subName: 'Telugu', locale: 'te-IN', flag: '🌾', isRTL: false, greeting: 'తెలుగు భాష ఎంచుకున్నారు. నమస్కారం!' },
  ta: { code: 'ta', name: 'தமிழ்', subName: 'Tamil', locale: 'ta-IN', flag: '🇮🇳', isRTL: false, greeting: 'தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டது. வணக்கம்!' },
  kn: { code: 'kn', name: 'ಕನ್ನಡ', subName: 'Kannada', locale: 'kn-IN', flag: '🇮🇳', isRTL: false, greeting: 'ಕನ್ನಡ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ. ನಮಸ್ಕಾರ!' },
  ml: { code: 'ml', name: 'മലയാളം', subName: 'Malayalam', locale: 'ml-IN', flag: '🇮🇳', isRTL: false, greeting: 'മലയാളം ഭാഷ തിരഞ്ഞെടുത്തു. നമസ്കാരം!' },
  gu: { code: 'gu', name: 'ગુજરાતી', subName: 'Gujarati', locale: 'gu-IN', flag: '🇮🇳', isRTL: false, greeting: 'ગુજરાતી ભાષા પસંદ કરી છે. નમસ્તે!' },
  mr: { code: 'mr', name: 'मराठी', subName: 'Marathi', locale: 'mr-IN', flag: '🇮🇳', isRTL: false, greeting: 'मराठी भाषा निवडली आहे. नमस्कार!' },
  or: { code: 'or', name: 'ଓଡ଼ିଆ', subName: 'Odia', locale: 'or-IN', flag: '🇮🇳', isRTL: false, greeting: 'ଓଡ଼ିଆ ଭାଷା ଚୟନ କରାଯାଇଛି। ନମସ୍କାର!' },
  pa: { code: 'pa', name: 'ਪੰਜਾਬੀ', subName: 'Punjabi', locale: 'pa-IN', flag: '🇮🇳', isRTL: false, greeting: 'ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਚੁਣੀ ਗਈ ਹੈ। ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ!' },
  as: { code: 'as', name: 'অসমীয়া', subName: 'Assamese', locale: 'as-IN', flag: '🇮🇳', isRTL: false, greeting: 'অসমীয়া ভাষা নিৰ্বাচন কৰা হৈছে। নমস্কাৰ!' },
  ur: { code: 'ur', name: 'اردو', subName: 'Urdu', locale: 'ur-IN', flag: '🌙', isRTL: true, greeting: 'اردو زبان منتخب کی گئی۔ خوش آمدید!' },
  sa: { code: 'sa', name: 'संस्कृतम्', subName: 'Sanskrit', locale: 'sa-IN', flag: '🔱', isRTL: false, greeting: 'संस्कृतभाषा चीता। नमोनमः!' },
  kok: { code: 'kok', name: 'कोंकणी', subName: 'Konkani', locale: 'kok-IN', flag: '🇮🇳', isRTL: false, greeting: 'कोंकणी भास विंचल्या. नमस्कार!' },
  ne: { code: 'ne', name: 'नेपाली', subName: 'Nepali', locale: 'ne-NP', flag: '🇳🇵', isRTL: false, greeting: 'नेपाली भाषा चयन गरियो। नमस्ते!' },
  doi: { code: 'doi', name: 'डोगरी', subName: 'Dogri', locale: 'doi-IN', flag: '🏔️', isRTL: false, greeting: 'डोगरी भासा चुनी गेई। नमस्ते!' },
  mai: { code: 'mai', name: 'मैथिली', subName: 'Maithili', locale: 'mai-IN', flag: '🌾', isRTL: false, greeting: 'मैथिली भाषा चुनल गेल। प्रणाम!' },
  ks: { code: 'ks', name: 'كأشُر / कश्मीरी', subName: 'Kashmiri', locale: 'ks-IN', flag: '🏔️', isRTL: true, greeting: 'کأشُر زَبانہِ لٔگؠ وِچَھن۔ آدا ب!' },
  mni: { code: 'mni', name: 'ꯃꯤꯇꯩꯂꯣꯟ / मणिपुरी', subName: 'Manipuri', locale: 'mni-IN', flag: '⛰️', isRTL: false, greeting: 'मणिपुरी लोल खनख्रे। खुरुमजरी!' },
  brx: { code: 'brx', name: 'बोड़ो', subName: 'Bodo', locale: 'brx-IN', flag: '🌿', isRTL: false, greeting: 'बोड़ो राव सायखनाय जाबाय। खुलुमबाय!' },
  sat: { code: 'sat', name: 'ᱥᱟᱱᱛᱟᱲᱤ', subName: 'Santali', locale: 'sat-IN', flag: '🏹', isRTL: false, greeting: 'ᱥᱟᱱᱛᱟᱲᱤ ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ ᱮᱱᱟ᱾ ᱡᱚᱦᱟᱨ!' },
  sd: { code: 'sd', name: 'سنڌي / सिंधी', subName: 'Sindhi', locale: 'sd-IN', flag: '🕌', isRTL: true, greeting: 'سنڌي ٻولي چونڊجي وئي. جوڙيو!' }
};

export const getLocaleForLang = (langCode) => {
  return SUPPORTED_LANGUAGES[langCode]?.locale || 'en-IN';
};

export const isRTLLanguage = (langCode) => {
  return !!SUPPORTED_LANGUAGES[langCode]?.isRTL;
};
