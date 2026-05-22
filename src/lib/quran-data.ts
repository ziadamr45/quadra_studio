export interface Surah {
  id: number;
  name: string;
  nameEn: string;
  ayahs: number;
  type: "meccan" | "medinan";
}

export interface Reader {
  id: string;
  name: string;
  nameEn: string;
  recitationId: number; // Quran.com recitation ID
  qualities: { label: string; bitrate: string; audioId: string }[];
}

export const surahs: Surah[] = [
  { id: 1, name: "الفاتحة", nameEn: "Al-Fatiha", ayahs: 7, type: "meccan" },
  { id: 2, name: "البقرة", nameEn: "Al-Baqara", ayahs: 286, type: "medinan" },
  { id: 3, name: "آل عمران", nameEn: "Aal-Imran", ayahs: 200, type: "medinan" },
  { id: 4, name: "النساء", nameEn: "An-Nisa", ayahs: 176, type: "medinan" },
  { id: 5, name: "المائدة", nameEn: "Al-Ma'ida", ayahs: 120, type: "medinan" },
  { id: 6, name: "الأنعام", nameEn: "Al-An'am", ayahs: 165, type: "meccan" },
  { id: 7, name: "الأعراف", nameEn: "Al-A'raf", ayahs: 206, type: "meccan" },
  { id: 8, name: "الأنفال", nameEn: "Al-Anfal", ayahs: 75, type: "medinan" },
  { id: 9, name: "التوبة", nameEn: "At-Tawba", ayahs: 129, type: "medinan" },
  { id: 10, name: "يونس", nameEn: "Yunus", ayahs: 109, type: "meccan" },
  { id: 11, name: "هود", nameEn: "Hud", ayahs: 123, type: "meccan" },
  { id: 12, name: "يوسف", nameEn: "Yusuf", ayahs: 111, type: "meccan" },
  { id: 13, name: "الرعد", nameEn: "Ar-Ra'd", ayahs: 43, type: "medinan" },
  { id: 14, name: "إبراهيم", nameEn: "Ibrahim", ayahs: 52, type: "meccan" },
  { id: 15, name: "الحجر", nameEn: "Al-Hijr", ayahs: 99, type: "meccan" },
  { id: 16, name: "النحل", nameEn: "An-Nahl", ayahs: 128, type: "meccan" },
  { id: 17, name: "الإسراء", nameEn: "Al-Isra", ayahs: 111, type: "meccan" },
  { id: 18, name: "الكهف", nameEn: "Al-Kahf", ayahs: 110, type: "meccan" },
  { id: 19, name: "مريم", nameEn: "Maryam", ayahs: 98, type: "meccan" },
  { id: 20, name: "طه", nameEn: "Ta-Ha", ayahs: 135, type: "meccan" },
  { id: 21, name: "الأنبياء", nameEn: "Al-Anbiya", ayahs: 112, type: "meccan" },
  { id: 22, name: "الحج", nameEn: "Al-Hajj", ayahs: 78, type: "medinan" },
  { id: 23, name: "المؤمنون", nameEn: "Al-Mu'minun", ayahs: 118, type: "meccan" },
  { id: 24, name: "النور", nameEn: "An-Nur", ayahs: 64, type: "medinan" },
  { id: 25, name: "الفرقان", nameEn: "Al-Furqan", ayahs: 77, type: "meccan" },
  { id: 26, name: "الشعراء", nameEn: "Ash-Shu'ara", ayahs: 227, type: "meccan" },
  { id: 27, name: "النمل", nameEn: "An-Naml", ayahs: 93, type: "meccan" },
  { id: 28, name: "القصص", nameEn: "Al-Qasas", ayahs: 88, type: "meccan" },
  { id: 29, name: "العنكبوت", nameEn: "Al-Ankabut", ayahs: 69, type: "meccan" },
  { id: 30, name: "الروم", nameEn: "Ar-Rum", ayahs: 60, type: "meccan" },
  { id: 31, name: "لقمان", nameEn: "Luqman", ayahs: 34, type: "meccan" },
  { id: 32, name: "السجدة", nameEn: "As-Sajda", ayahs: 30, type: "meccan" },
  { id: 33, name: "الأحزاب", nameEn: "Al-Ahzab", ayahs: 73, type: "medinan" },
  { id: 34, name: "سبأ", nameEn: "Saba", ayahs: 54, type: "meccan" },
  { id: 35, name: "فاطر", nameEn: "Fatir", ayahs: 45, type: "meccan" },
  { id: 36, name: "يس", nameEn: "Ya-Sin", ayahs: 83, type: "meccan" },
  { id: 37, name: "الصافات", nameEn: "As-Saffat", ayahs: 182, type: "meccan" },
  { id: 38, name: "ص", nameEn: "Sad", ayahs: 88, type: "meccan" },
  { id: 39, name: "الزمر", nameEn: "Az-Zumar", ayahs: 75, type: "meccan" },
  { id: 40, name: "غافر", nameEn: "Ghafir", ayahs: 85, type: "meccan" },
  { id: 41, name: "فصلت", nameEn: "Fussilat", ayahs: 54, type: "meccan" },
  { id: 42, name: "الشورى", nameEn: "Ash-Shura", ayahs: 53, type: "meccan" },
  { id: 43, name: "الزخرف", nameEn: "Az-Zukhruf", ayahs: 89, type: "meccan" },
  { id: 44, name: "الدخان", nameEn: "Ad-Dukhan", ayahs: 59, type: "meccan" },
  { id: 45, name: "الجاثية", nameEn: "Al-Jathiya", ayahs: 37, type: "meccan" },
  { id: 46, name: "الأحقاف", nameEn: "Al-Ahqaf", ayahs: 35, type: "meccan" },
  { id: 47, name: "محمد", nameEn: "Muhammad", ayahs: 38, type: "medinan" },
  { id: 48, name: "الفتح", nameEn: "Al-Fath", ayahs: 29, type: "medinan" },
  { id: 49, name: "الحجرات", nameEn: "Al-Hujurat", ayahs: 18, type: "medinan" },
  { id: 50, name: "ق", nameEn: "Qaf", ayahs: 45, type: "meccan" },
  { id: 51, name: "الذاريات", nameEn: "Adh-Dhariyat", ayahs: 60, type: "meccan" },
  { id: 52, name: "الطور", nameEn: "At-Tur", ayahs: 49, type: "meccan" },
  { id: 53, name: "النجم", nameEn: "An-Najm", ayahs: 62, type: "meccan" },
  { id: 54, name: "القمر", nameEn: "Al-Qamar", ayahs: 55, type: "meccan" },
  { id: 55, name: "الرحمن", nameEn: "Ar-Rahman", ayahs: 78, type: "medinan" },
  { id: 56, name: "الواقعة", nameEn: "Al-Waqi'a", ayahs: 96, type: "meccan" },
  { id: 57, name: "الحديد", nameEn: "Al-Hadid", ayahs: 29, type: "medinan" },
  { id: 58, name: "المجادلة", nameEn: "Al-Mujadila", ayahs: 22, type: "medinan" },
  { id: 59, name: "الحشر", nameEn: "Al-Hashr", ayahs: 24, type: "medinan" },
  { id: 60, name: "الممتحنة", nameEn: "Al-Mumtahina", ayahs: 13, type: "medinan" },
  { id: 61, name: "الصف", nameEn: "As-Saff", ayahs: 14, type: "medinan" },
  { id: 62, name: "الجمعة", nameEn: "Al-Jumu'a", ayahs: 11, type: "medinan" },
  { id: 63, name: "المنافقون", nameEn: "Al-Munafiqun", ayahs: 11, type: "medinan" },
  { id: 64, name: "التغابن", nameEn: "At-Taghabun", ayahs: 18, type: "medinan" },
  { id: 65, name: "الطلاق", nameEn: "At-Talaq", ayahs: 12, type: "medinan" },
  { id: 66, name: "التحريم", nameEn: "At-Tahrim", ayahs: 12, type: "medinan" },
  { id: 67, name: "الملك", nameEn: "Al-Mulk", ayahs: 30, type: "meccan" },
  { id: 68, name: "القلم", nameEn: "Al-Qalam", ayahs: 52, type: "meccan" },
  { id: 69, name: "الحاقة", nameEn: "Al-Haqqa", ayahs: 52, type: "meccan" },
  { id: 70, name: "المعارج", nameEn: "Al-Ma'arij", ayahs: 44, type: "meccan" },
  { id: 71, name: "نوح", nameEn: "Nuh", ayahs: 28, type: "meccan" },
  { id: 72, name: "الجن", nameEn: "Al-Jinn", ayahs: 28, type: "meccan" },
  { id: 73, name: "المزمل", nameEn: "Al-Muzzammil", ayahs: 20, type: "meccan" },
  { id: 74, name: "المدثر", nameEn: "Al-Muddaththir", ayahs: 56, type: "meccan" },
  { id: 75, name: "القيامة", nameEn: "Al-Qiyama", ayahs: 40, type: "meccan" },
  { id: 76, name: "الإنسان", nameEn: "Al-Insan", ayahs: 31, type: "medinan" },
  { id: 77, name: "المرسلات", nameEn: "Al-Mursalat", ayahs: 50, type: "meccan" },
  { id: 78, name: "النبأ", nameEn: "An-Naba", ayahs: 40, type: "meccan" },
  { id: 79, name: "النازعات", nameEn: "An-Nazi'at", ayahs: 46, type: "meccan" },
  { id: 80, name: "عبس", nameEn: "Abasa", ayahs: 42, type: "meccan" },
  { id: 81, name: "التكوير", nameEn: "At-Takwir", ayahs: 29, type: "meccan" },
  { id: 82, name: "الانفطار", nameEn: "Al-Infitar", ayahs: 19, type: "meccan" },
  { id: 83, name: "المطففين", nameEn: "Al-Mutaffifin", ayahs: 36, type: "meccan" },
  { id: 84, name: "الانشقاق", nameEn: "Al-Inshiqaq", ayahs: 25, type: "meccan" },
  { id: 85, name: "البروج", nameEn: "Al-Buruj", ayahs: 22, type: "meccan" },
  { id: 86, name: "الطارق", nameEn: "At-Tariq", ayahs: 17, type: "meccan" },
  { id: 87, name: "الأعلى", nameEn: "Al-A'la", ayahs: 19, type: "meccan" },
  { id: 88, name: "الغاشية", nameEn: "Al-Ghashiya", ayahs: 26, type: "meccan" },
  { id: 89, name: "الفجر", nameEn: "Al-Fajr", ayahs: 30, type: "meccan" },
  { id: 90, name: "البلد", nameEn: "Al-Balad", ayahs: 20, type: "meccan" },
  { id: 91, name: "الشمس", nameEn: "Ash-Shams", ayahs: 15, type: "meccan" },
  { id: 92, name: "الليل", nameEn: "Al-Layl", ayahs: 21, type: "meccan" },
  { id: 93, name: "الضحى", nameEn: "Ad-Duha", ayahs: 11, type: "meccan" },
  { id: 94, name: "الشرح", nameEn: "Ash-Sharh", ayahs: 8, type: "meccan" },
  { id: 95, name: "التين", nameEn: "At-Tin", ayahs: 8, type: "meccan" },
  { id: 96, name: "العلق", nameEn: "Al-Alaq", ayahs: 19, type: "meccan" },
  { id: 97, name: "القدر", nameEn: "Al-Qadr", ayahs: 5, type: "meccan" },
  { id: 98, name: "البينة", nameEn: "Al-Bayyina", ayahs: 8, type: "medinan" },
  { id: 99, name: "الزلزلة", nameEn: "Az-Zalzala", ayahs: 8, type: "medinan" },
  { id: 100, name: "العاديات", nameEn: "Al-Adiyat", ayahs: 11, type: "meccan" },
  { id: 101, name: "القارعة", nameEn: "Al-Qari'a", ayahs: 11, type: "meccan" },
  { id: 102, name: "التكاثر", nameEn: "At-Takathur", ayahs: 8, type: "meccan" },
  { id: 103, name: "العصر", nameEn: "Al-Asr", ayahs: 3, type: "meccan" },
  { id: 104, name: "الهمزة", nameEn: "Al-Humaza", ayahs: 9, type: "meccan" },
  { id: 105, name: "الفيل", nameEn: "Al-Fil", ayahs: 5, type: "meccan" },
  { id: 106, name: "قريش", nameEn: "Quraysh", ayahs: 4, type: "meccan" },
  { id: 107, name: "الماعون", nameEn: "Al-Ma'un", ayahs: 7, type: "meccan" },
  { id: 108, name: "الكوثر", nameEn: "Al-Kawthar", ayahs: 3, type: "meccan" },
  { id: 109, name: "الكافرون", nameEn: "Al-Kafirun", ayahs: 6, type: "meccan" },
  { id: 110, name: "النصر", nameEn: "An-Nasr", ayahs: 3, type: "medinan" },
  { id: 111, name: "المسد", nameEn: "Al-Masad", ayahs: 5, type: "meccan" },
  { id: 112, name: "الإخلاص", nameEn: "Al-Ikhlas", ayahs: 4, type: "meccan" },
  { id: 113, name: "الفلق", nameEn: "Al-Falaq", ayahs: 5, type: "meccan" },
  { id: 114, name: "الناس", nameEn: "An-Nas", ayahs: 6, type: "meccan" },
];

// Readers with Quran.com recitation IDs
export const readers: Reader[] = [
  {
    id: "ar.alafasy",
    name: "مشاري العفاسي",
    nameEn: "Mishary Al-Afasy",
    recitationId: 7,
    qualities: [
      { label: "128kbps", bitrate: "128kbps", audioId: "ar.alafasy" },
    ],
  },
  {
    id: "ar.abdulbasitmurattal",
    name: "عبد الباسط عبد الصمد",
    nameEn: "Abdul Basit (Murattal)",
    recitationId: 1,
    qualities: [
      { label: "192kbps", bitrate: "192kbps", audioId: "ar.abdulbasitmurattal" },
    ],
  },
  {
    id: "ar.abdulbasitmujawwad",
    name: "عبد الباسط (مجود)",
    nameEn: "Abdul Basit (Mujawwad)",
    recitationId: 1,
    qualities: [
      { label: "128kbps", bitrate: "128kbps", audioId: "ar.abdulbasitmujawwad" },
    ],
  },
  {
    id: "ar.sudais",
    name: "عبد الرحمن السديس",
    nameEn: "Abdurrahman As-Sudais",
    recitationId: 4,
    qualities: [
      { label: "192kbps", bitrate: "192kbps", audioId: "ar.sudais" },
    ],
  },
  {
    id: "ar.shaatree",
    name: "أبو بكر الشاطري",
    nameEn: "Abu Bakr Ash-Shatri",
    recitationId: 3,
    qualities: [
      { label: "128kbps", bitrate: "128kbps", audioId: "ar.shaatree" },
    ],
  },
  {
    id: "ar.ahmedajamy",
    name: "أحمد العجمي",
    nameEn: "Ahmed Al-Ajmy",
    recitationId: 2,
    qualities: [
      { label: "128kbps", bitrate: "128kbps", audioId: "ar.ahmedajamy" },
    ],
  },
  {
    id: "ar.saaborimuneer",
    name: "سعود الشريم",
    nameEn: "Saood Ash-Shuraym",
    recitationId: 9,
    qualities: [
      { label: "64kbps", bitrate: "64kbps", audioId: "ar.saaborimuneer" },
    ],
  },
  {
    id: "ar.hanirifai",
    name: "هاني الرفاعي",
    nameEn: "Hani Ar-Rifai",
    recitationId: 16,
    qualities: [
      { label: "192kbps", bitrate: "192kbps", audioId: "ar.hanirifai" },
    ],
  },
  {
    id: "ar.husary",
    name: "محمود خليل الحصري",
    nameEn: "Mahmoud Khalil Al-Husary",
    recitationId: 5,
    qualities: [
      { label: "128kbps", bitrate: "128kbps", audioId: "ar.husary" },
    ],
  },
  {
    id: "ar.hudhaify",
    name: "علي الحذيفي",
    nameEn: "Ali Al-Hudhaify",
    recitationId: 8,
    qualities: [
      { label: "128kbps", bitrate: "128kbps", audioId: "ar.hudhaify" },
    ],
  },
  {
    id: "ar.mahermuaiqly",
    name: "ماهر المعيقلي",
    nameEn: "Maher Al-Muaiqly",
    recitationId: 10,
    qualities: [
      { label: "128kbps", bitrate: "128kbps", audioId: "ar.mahermuaiqly" },
    ],
  },
  {
    id: "ar.minshawi",
    name: "محمد صديق المنشاوي",
    nameEn: "Muhammad Siddiq Al-Minshawi",
    recitationId: 6,
    qualities: [
      { label: "192kbps", bitrate: "192kbps", audioId: "ar.minshawi" },
    ],
  },
  {
    id: "ar.abdullahbasfar",
    name: "عبد الله بصفر",
    nameEn: "Abdullah Basfar",
    recitationId: 11,
    qualities: [
      { label: "192kbps", bitrate: "192kbps", audioId: "ar.abdullahbasfar" },
    ],
  },
  {
    id: "ar.aymanswaid",
    name: "أيمن سويد",
    nameEn: "Ayman Suwayd",
    recitationId: 22,
    qualities: [
      { label: "64kbps", bitrate: "64kbps", audioId: "ar.aymanswaid" },
    ],
  },
];

// Qudra Studio Templates - Arabic-Themed Design Identity
export const videoTemplates = [
  {
    id: "noor",
    name: "النور",
    nameEn: "Noor",
    icon: "✦",
    description: "ظلام عميق مع لمسات ذهبية",
    bg1: "#0a0a0c",
    bg2: "#12121a",
    accentColor: "#c9a84c",
    patternType: "arabic",
  },
  {
    id: "tubar",
    name: "الطُّبار",
    nameEn: "Tubar",
    icon: "◈",
    description: "أسود فاخر مع نقوش هندسية",
    bg1: "#08080a",
    bg2: "#0f0f14",
    accentColor: "#d4ba6a",
    patternType: "geometric",
  },
  {
    id: "rawasi",
    name: "الرَّوَاسِي",
    nameEn: "Rawasi",
    icon: "◆",
    description: "رمادي داكن صلب كالجبال",
    bg1: "#111114",
    bg2: "#19191f",
    accentColor: "#8b9dc3",
    patternType: "hexagonal",
  },
  {
    id: "dihan",
    name: "الدِّهان",
    nameEn: "Dihan",
    icon: "✧",
    description: "بني دافئ مستوحى من الطبيعة",
    bg1: "#100c08",
    bg2: "#1a140e",
    accentColor: "#c4884c",
    patternType: "floral",
  },
  {
    id: "zulumat",
    name: "الظُّلُمَات",
    nameEn: "Zulumat",
    icon: "◉",
    description: "سواد حالق مع تدرجات خفية",
    bg1: "#050506",
    bg2: "#0a0a0c",
    accentColor: "#9a9a9a",
    patternType: "none",
  },
  {
    id: "bahar",
    name: "البَحْر",
    nameEn: "Bahar",
    icon: "◇",
    description: "أخضر غامق كأعماق البحار",
    bg1: "#080f0c",
    bg2: "#0e1a15",
    accentColor: "#4a9e7a",
    patternType: "waves",
  },
  {
    id: "hamra",
    name: "الحَمْرَاء",
    nameEn: "Hamra",
    icon: "❖",
    description: "أحمر قرمزي مع لمسات داكنة",
    bg1: "#120808",
    bg2: "#1a0c0c",
    accentColor: "#c94c4c",
    patternType: "arabic",
  },
  {
    id: "sahra",
    name: "الصَّحْرَاء",
    nameEn: "Sahra",
    icon: "◇",
    description: "رمال دافئة بلمسات ترابية",
    bg1: "#14120e",
    bg2: "#1c1a14",
    accentColor: "#c9a84c",
    patternType: "minimal",
  },
  {
    id: "chroma",
    name: "كروما",
    nameEn: "Chroma",
    icon: "□",
    description: "خلفية سوداء صافية للمونتاج",
    bg1: "#000000",
    bg2: "#000000",
    accentColor: "#ffffff",
    patternType: "none",
  },
];

export const patternTypes = [
  { id: "arabic", name: "عربية" },
  { id: "geometric", name: "هندسية" },
  { id: "floral", name: "نباتية" },
  { id: "waves", name: "أمواج" },
  { id: "hexagonal", name: "سداسية" },
  { id: "minimal", name: "بسيطة" },
  { id: "none", name: "بدون" },
];

export const fontTypes = [
  { id: "amiri", name: "أميري (Amiri)" },
  { id: "cairo", name: "القاهرة (Cairo)" },
  { id: "naskh", name: "خط النسخ" },
  { id: "thuluth", name: "خط الثلث" },
  { id: "kufi", name: "خط الكوفي" },
];

export const aspectRatios = [
  { id: "9:16", name: "طولي 9:16", desc: "Reels / TikTok / Shorts", width: 1080, height: 1920 },
  { id: "16:9", name: "عريض 16:9", desc: "YouTube", width: 1920, height: 1080 },
  { id: "1:1", name: "مربع 1:1", desc: "Instagram Post", width: 1080, height: 1080 },
  { id: "4:5", name: "4:5", desc: "Instagram Feed", width: 1080, height: 1350 },
];

export const imageMotionOptions = [
  { id: "none", name: "بدون حركة" },
  { id: "zoom-in", name: "تكبير تدريجي" },
  { id: "zoom-out", name: "تصغير تدريجي" },
  { id: "ken-burns", name: "كين بيرنز" },
  { id: "pan", name: "تحريك أفقي" },
];

export const transitionTypes = [
  { id: "fade", name: "تلاشي" },
  { id: "slide", name: "انزلاق" },
  { id: "zoom", name: "تكبير" },
  { id: "none", name: "بدون انتقال" },
];

// Alias for backward compatibility with DesignPanel
export const videoEffects = transitionTypes;

export const textPositionOptions = [
  { id: "center", name: "وسط" },
  { id: "top", name: "أعلى" },
  { id: "bottom", name: "أسفل" },
];

export const videoPresets = [
  { id: "1080p", name: "1080p - عالية" },
  { id: "720p", name: "720p - متوسطة" },
  { id: "480p", name: "480p - منخفضة" },
];

export const fpsOptions = [
  { id: "24", name: "24 إطار" },
  { id: "30", name: "30 إطار" },
];

export const textStyleOptions = [
  { id: "normal", name: "عادي" },
  { id: "bold", name: "عريض" },
  { id: "with-shadow", name: "مع ظل" },
  { id: "outlined", name: "محاط" },
];

export const qualityOptions = [
  { id: "high", name: "عالية" },
  { id: "medium", name: "متوسطة" },
  { id: "low", name: "منخفضة" },
];

export const crfOptions = [
  { id: "18", name: "عالية جداً (18)" },
  { id: "23", name: "عالية (23) - موصى به" },
  { id: "28", name: "متوسطة (28)" },
  { id: "32", name: "منخفضة (32)" },
];

export const hadithCollections = [
  { id: "bukhari", name: "صحيح البخاري", nameEn: "Sahih al-Bukhari" },
  { id: "muslim", name: "صحيح مسلم", nameEn: "Sahih Muslim" },
  { id: "tirmidhi", name: "سنن الترمذي", nameEn: "Jami at-Tirmidhi" },
  { id: "abuDawud", name: "سنن أبي داود", nameEn: "Sunan Abi Dawud" },
  { id: "nasai", name: "سنن النسائي", nameEn: "Sunan an-Nasa'i" },
  { id: "ibnMajah", name: "سنن ابن ماجه", nameEn: "Sunan Ibn Majah" },
  { id: "malik", name: "موطأ مالك", nameEn: "Muwatta Malik" },
  { id: "ahmad", name: "مسند أحمد", nameEn: "Musnad Ahmad" },
];

// Helper: Build audio URL for a specific ayah using the Islamic Network CDN
export function getAudioUrl(audioId: string, surahNumber: number, ayahNumber: number): string {
  const surahAyahOffsets = [0, 7, 293, 493, 669, 789, 954, 1160, 1234, 1363, 1492, 1615, 1728, 1771, 1823, 1922, 2050, 2161, 2272, 2370, 2505, 2617, 2695, 2813, 2877, 2954, 3059, 3152, 3240, 3329, 3389, 3423, 3453, 3526, 3580, 3625, 3708, 3890, 3978, 4053, 4107, 4161, 4250, 4339, 4398, 4435, 4470, 4508, 4527, 4572, 4632, 4692, 4754, 4809, 4864, 4942, 5038, 5067, 5089, 5102, 5115, 5129, 5143, 5154, 5165, 5177, 5189, 5201, 5212, 5223, 5234, 5244, 5254, 5264, 5274, 5284, 5294, 5304, 5314, 5324, 5334, 5344, 5354, 5364, 5374, 5384, 5394, 5404, 5414, 5424, 5434, 5444, 5454, 5464, 5474, 5484, 5494, 5504, 5514, 5524, 5534, 5544, 5554, 5564, 5574, 5584, 5594, 5604, 5614, 5624, 5634, 5644, 5654, 5664, 5674, 5684, 5694, 5704, 5714, 5724, 5734, 5744, 5754, 5764, 5774, 5784, 5794, 5804, 5814, 5824, 5834, 5844, 5854, 5864, 5874, 5884, 5894, 5904, 5914, 5924, 5934, 5944, 5954, 5964, 5974, 5984, 5994, 6004, 6014, 6024, 6034, 6044, 6054, 6064, 6114, 6118, 6124, 6130, 6135, 6140, 6147, 6152, 6157, 6164, 6168, 6176, 6181, 6186, 6192, 6197, 6202, 6207, 6213, 6218, 6223, 6229, 6234, 6236];
  
  const absoluteAyah = surahAyahOffsets[surahNumber - 1] + ayahNumber;
  return `https://cdn.islamic.network/quran/audio/128/${audioId}/${absoluteAyah}.mp3`;
}

// Helper: Get ayah text from API
export function getAyahApiUrl(surahNumber: number, ayahNumber: number): string {
  return `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}`;
}

// Helper: Build Quran.com audio URL using recitation ID
export function getQuranComAudioUrl(recitationId: number, chapterNumber: number): string {
  return `https://api.quran.com/api/v4/recitations/${recitationId}/by_chapter/${chapterNumber}`;
}

// Get pattern CSS background
export function getPatternCSS(type: string, color: string, density: number): string {
  const size = (density + 1) * 12;
  switch (type) {
    case "arabic":
      return `repeating-linear-gradient(45deg, ${color}08 0px, ${color}08 1px, transparent 1px, transparent ${size}px), repeating-linear-gradient(-45deg, ${color}08 0px, ${color}08 1px, transparent 1px, transparent ${size}px)`;
    case "geometric":
      return `linear-gradient(30deg, ${color}08 12%, transparent 12.5%, transparent 87%, ${color}08 87.5%), linear-gradient(150deg, ${color}08 12%, transparent 12.5%, transparent 87%, ${color}08 87.5%)`;
    case "hexagonal":
      return `radial-gradient(circle at 50% 50%, ${color}0a 1px, transparent 1px)`;
    case "floral":
      return `radial-gradient(ellipse at 25% 25%, ${color}0a 0%, transparent 50%), radial-gradient(ellipse at 75% 75%, ${color}0a 0%, transparent 50%)`;
    case "waves":
      return `repeating-linear-gradient(0deg, ${color}06 0px, transparent 3px, transparent ${size}px)`;
    case "minimal":
      return `linear-gradient(180deg, ${color}04 0%, transparent 100%)`;
    default:
      return "none";
  }
}
