export interface Surah {
  id: number;
  name: string;
  nameEn: string;
  ayahs: number;
  type: "meccan" | "medinan";
}

export interface ReaderQuality {
  label: string;
  bitrate: string;
}

export interface Reader {
  id: string;
  name: string;
  qualities: ReaderQuality[];
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

export const readers: Reader[] = [
  {
    id: "abdulbasit-murattal",
    name: "عبد الباسط عبد الصمد",
    qualities: [
      { label: "مرتل", bitrate: "64kbps" },
      { label: "مرتل - جودة عالية", bitrate: "192kbps" },
      { label: "مجود", bitrate: "128kbps" },
    ],
  },
  {
    id: "abdullah-basfar",
    name: "عبد الله بصفر",
    qualities: [
      { label: "عادي", bitrate: "32kbps" },
      { label: "عادي", bitrate: "64kbps" },
      { label: "جودة عالية", bitrate: "192kbps" },
    ],
  },
  {
    id: "abdulrahman-sudais",
    name: "عبد الرحمن السديس",
    qualities: [
      { label: "عادي", bitrate: "64kbps" },
      { label: "جودة عالية", bitrate: "192kbps" },
    ],
  },
  {
    id: "abubakr-shatri",
    name: "أبو بكر الشاطري",
    qualities: [
      { label: "عادي", bitrate: "64kbps" },
      { label: "جودة عالية", bitrate: "128kbps" },
    ],
  },
  {
    id: "ahmad-ajmi",
    name: "أحمد بن علي العجمي",
    qualities: [
      { label: "عادي", bitrate: "64kbps" },
      { label: "جودة عالية", bitrate: "128kbps" },
    ],
  },
  {
    id: "mishary-afasy",
    name: "مشاري بن راشد العفاسي",
    qualities: [
      { label: "عادي", bitrate: "64kbps" },
      { label: "جودة عالية", bitrate: "128kbps" },
    ],
  },
  {
    id: "saad-ghamdi",
    name: "سعد الغامدي",
    qualities: [{ label: "عادي", bitrate: "40kbps" }],
  },
  {
    id: "hani-rrifai",
    name: "هاني الرفاعي",
    qualities: [
      { label: "عادي", bitrate: "64kbps" },
      { label: "جودة عالية", bitrate: "192kbps" },
    ],
  },
  {
    id: "mahmoud-husary",
    name: "محمود خليل الحصري",
    qualities: [
      { label: "عادي", bitrate: "64kbps" },
      { label: "جودة عالية", bitrate: "128kbps" },
      { label: "مجود", bitrate: "64kbps" },
      { label: "مجود - جودة عالية", bitrate: "128kbps" },
    ],
  },
  {
    id: "ali-hudhaifi",
    name: "علي بن عبدالرحمن الحذيفي",
    qualities: [
      { label: "عادي", bitrate: "32kbps" },
      { label: "عادي", bitrate: "64kbps" },
      { label: "جودة عالية", bitrate: "128kbps" },
    ],
  },
  {
    id: "ibrahim-akhdar",
    name: "إبراهيم الأخضر",
    qualities: [
      { label: "عادي", bitrate: "32kbps" },
      { label: "عادي", bitrate: "64kbps" },
    ],
  },
  {
    id: "mahir-muaiqly",
    name: "ماهر المعيقلي",
    qualities: [
      { label: "عادي", bitrate: "64kbps" },
      { label: "جودة عالية", bitrate: "128kbps" },
    ],
  },
  {
    id: "mohammad-minshawi",
    name: "محمد صديق المنشاوي",
    qualities: [
      { label: "عادي", bitrate: "16kbps" },
      { label: "عادي", bitrate: "32kbps" },
      { label: "مجود", bitrate: "64kbps" },
      { label: "مجود - جودة عالية", bitrate: "192kbps" },
      { label: "مرتل", bitrate: "128kbps" },
    ],
  },
  {
    id: "mohammad-tablawi",
    name: "محمد الطبلاوي",
    qualities: [
      { label: "عادي", bitrate: "64kbps" },
      { label: "جودة عالية", bitrate: "128kbps" },
    ],
  },
  {
    id: "mohammad-ayyub",
    name: "محمد أيوب",
    qualities: [
      { label: "عادي", bitrate: "128kbps" },
      { label: "عادي", bitrate: "64kbps" },
      { label: "عادي", bitrate: "32kbps" },
    ],
  },
  {
    id: "mohammad-jibreel",
    name: "محمد جبريل",
    qualities: [
      { label: "عادي", bitrate: "64kbps" },
      { label: "جودة عالية", bitrate: "128kbps" },
    ],
  },
  {
    id: "mustafa-ismail",
    name: "مصطفى إسماعيل",
    qualities: [{ label: "عادي", bitrate: "48kbps" }],
  },
  {
    id: "saud-shuraim",
    name: "سعود بن إبراهيم الشريم",
    qualities: [
      { label: "عادي", bitrate: "64kbps" },
      { label: "جودة عالية", bitrate: "128kbps" },
    ],
  },
  {
    id: "salah-bukhatir",
    name: "صلاح بوخاطر",
    qualities: [{ label: "عادي", bitrate: "128kbps" }],
  },
  {
    id: "mohsen-qasim",
    name: "محسن القاسم",
    qualities: [{ label: "جودة عالية", bitrate: "192kbps" }],
  },
  {
    id: "abdullah-juhani",
    name: "عبد الله عواد الجهني",
    qualities: [{ label: "عادي", bitrate: "128kbps" }],
  },
  {
    id: "salah-budair",
    name: "صلاح البدير",
    qualities: [{ label: "عادي", bitrate: "128kbps" }],
  },
  {
    id: "abdullah-matrud",
    name: "عبد الله المطرود",
    qualities: [{ label: "عادي", bitrate: "128kbps" }],
  },
  {
    id: "ahmad-nuina",
    name: "أحمد نعينع",
    qualities: [{ label: "عادي", bitrate: "128kbps" }],
  },
  {
    id: "mohammad-abdulkareem",
    name: "محمد عبد الكريم",
    qualities: [{ label: "عادي", bitrate: "128kbps" }],
  },
  {
    id: "khalifa-taniji",
    name: "خليفة الطنيجي",
    qualities: [{ label: "عادي", bitrate: "64kbps" }],
  },
  {
    id: "mahmoud-banna",
    name: "محمود علي البنا",
    qualities: [{ label: "عادي", bitrate: "32kbps" }],
  },
  {
    id: "khaled-qahtani",
    name: "خالد عبد الله القحطاني",
    qualities: [{ label: "جودة عالية", bitrate: "192kbps" }],
  },
  {
    id: "yasser-dosari",
    name: "ياسر الدوسري",
    qualities: [{ label: "عادي", bitrate: "128kbps" }],
  },
  {
    id: "nasser-qatami",
    name: "ناصر القطامي",
    qualities: [{ label: "عادي", bitrate: "128kbps" }],
  },
  {
    id: "ali-suwaisi",
    name: "علي حجاج السويسي",
    qualities: [{ label: "عادي", bitrate: "128kbps" }],
  },
  {
    id: "sahl-yaseen",
    name: "سهل ياسين",
    qualities: [{ label: "عادي", bitrate: "128kbps" }],
  },
  {
    id: "aziz-alili",
    name: "عزيز عليلي",
    qualities: [{ label: "عادي", bitrate: "128kbps" }],
  },
  {
    id: "yasser-salama",
    name: "ياسر سلامة",
    qualities: [{ label: "عادي", bitrate: "128kbps" }],
  },
  {
    id: "akram-alalqmi",
    name: "أكرم العلاقمي",
    qualities: [{ label: "عادي", bitrate: "128kbps" }],
  },
  {
    id: "ali-jaber",
    name: "علي جابر",
    qualities: [{ label: "عادي", bitrate: "64kbps" }],
  },
  {
    id: "faris-abbad",
    name: "فارس عباد",
    qualities: [{ label: "عادي", bitrate: "64kbps" }],
  },
  {
    id: "ayman-suwayd",
    name: "أيمن سويد",
    qualities: [{ label: "عادي", bitrate: "64kbps" }],
  },
];

export const videoTemplates = [
  {
    id: "laylat-alqadr",
    name: "ليلة القدر",
    icon: "🌙",
    description: "أجواء إيمانية هادئة مع تدرج داكن وزخارف ذهبية",
    bg1: "#0a0f1e",
    bg2: "#050810",
    accentColor: "#d4a853",
    patternType: "hexagonal",
  },
  {
    id: "emerald",
    name: "زمرد",
    icon: "🕌",
    description: "تصميم ملكي باللون الأخضر الزمردي والزخارف الإسلامية",
    bg1: "#0a1a15",
    bg2: "#050d0a",
    accentColor: "#10b981",
    patternType: "hexagonal",
  },
  {
    id: "golden-classic",
    name: "ذهبي كلاسيكي",
    icon: "✨",
    description: "التصميم التقليدي الفاخر باللون الأسود والذهبي",
    bg1: "#0f0f0f",
    bg2: "#080808",
    accentColor: "#d4a853",
    patternType: "arabic",
  },
  {
    id: "green-islamic",
    name: "أخضر إسلامي",
    icon: "🌿",
    description: "تناغم الطبيعة مع اللون الأخضر الداكن والزخارف النبيلة",
    bg1: "#0a1a10",
    bg2: "#050d08",
    accentColor: "#22c55e",
    patternType: "floral",
  },
  {
    id: "calm-blue",
    name: "أزرق هادئ",
    icon: "🌊",
    description: "تصميم مريح للعين بألوان سماوية هادئة",
    bg1: "#0a1520",
    bg2: "#050a12",
    accentColor: "#3b82f6",
    patternType: "waves",
  },
  {
    id: "warm-brown",
    name: "بني دافئ",
    icon: "☕",
    description: "أجواء خشبية دافئة تذكر بالمساجد القديمة",
    bg1: "#1a1008",
    bg2: "#0d0804",
    accentColor: "#c2703e",
    patternType: "geometric",
  },
  {
    id: "pure-white",
    name: "أبيض نقي",
    icon: "⚪",
    description: "تصميم عصري بسيط بخلفية فاتحة وتفاصيل دقيقة",
    bg1: "#f5f0eb",
    bg2: "#e8e0d5",
    accentColor: "#1a1a1a",
    patternType: "minimal",
  },
  {
    id: "chroma",
    name: "كروما",
    icon: "📺",
    description: "خلفية سوداء بالكامل لتسهيل دمج النص في برامج المونتاج",
    bg1: "#000000",
    bg2: "#000000",
    accentColor: "#ffffff",
    patternType: "none",
  },
];

export const patternTypes = [
  { id: "hexagonal", name: "شبكة سداسية" },
  { id: "arabic", name: "زخرفة عربية" },
  { id: "floral", name: "زخرفة نباتية" },
  { id: "geometric", name: "هندسية" },
  { id: "waves", name: "أمواج" },
  { id: "minimal", name: "بسيطة" },
  { id: "none", name: "بدون زخرفة" },
];

export const fontTypes = [
  { id: "naskh", name: "خط النسخ (التقليدي)" },
  { id: "thuluth", name: "خط الثلث" },
  { id: "diwani", name: "خط الديواني" },
  { id: "kufi", name: "خط الكوفي" },
  { id: "modern", name: "خط عصري" },
];

export const aspectRatios = [
  { id: "9:16", name: "طولي 9:16 (Reels/TikTok)", width: 1080, height: 1920 },
  { id: "16:9", name: "عريض 16:9 (YouTube)", width: 1920, height: 1080 },
  { id: "1:1", name: "مربع 1:1 (Instagram)", width: 1080, height: 1080 },
  { id: "4:5", name: "4:5 (Instagram Post)", width: 1080, height: 1350 },
];

export const videoEffects = [
  { id: "none", name: "بدون تأثير" },
  { id: "fade", name: "تلاشي" },
  { id: "slide", name: "انزلاق" },
  { id: "zoom", name: "تكبير" },
  { id: "blur", name: "ضبابية" },
];

export const videoPresets = [
  { id: "1080p", name: "دقة عالية (1080p)" },
  { id: "720p", name: "متوسط (720p)" },
  { id: "480p", name: "منخفض (480p)" },
];

export const fpsOptions = [
  { id: "24", name: "24 إطاراً" },
  { id: "30", name: "30 إطاراً" },
  { id: "60", name: "60 إطاراً" },
];

export const crfOptions = [
  { id: "18", name: "18 (أعلى جودة)" },
  { id: "23", name: "23 (متوازن)" },
  { id: "28", name: "28 (ملف أصغر)" },
];

export const textStyleOptions = [
  { id: "normal", name: "عادي" },
  { id: "bold", name: "عريض" },
  { id: "with-shadow", name: "مع ظل" },
  { id: "outlined", name: "محاط" },
];

export const imageMotionOptions = [
  { id: "none", name: "بدون حركة" },
  { id: "zoom-in", name: "تكبير تدريجي" },
  { id: "zoom-out", name: "تصغير تدريجي" },
  { id: "pan-left", name: "تحريك لليسار" },
  { id: "pan-right", name: "تحريك لليمين" },
  { id: "ken-burns", name: "كين بيرنز" },
];

export const hadithCategories = [
  { id: "bukhari", name: "صحيح البخاري" },
  { id: "muslim", name: "صحيح مسلم" },
  { id: "tirmidhi", name: "سنن الترمذي" },
  { id: "abuDawud", name: "سنن أبي داود" },
  { id: "nasai", name: "سنن النسائي" },
  { id: "ibnMajah", name: "سنن ابن ماجه" },
  { id: "malik", name: "موطأ مالك" },
  { id: "ahmad", name: "مسند أحمد" },
];
