// Multilingual Localization Strings for Saint Xavier Convent School Portal (English / Hindi / Urdu)

export type LangType = 'en' | 'hi' | 'ur';

export const DICTIONARY: Record<string, Record<LangType, string>> = {
  // Navigation / Headers
  studentPortals: {
    en: 'Student Portals',
    hi: 'छात्र पोर्टल',
    ur: 'اسٹوڈنٹ پورٹلز'
  },
  adminDesk: {
    en: 'Admin Desk',
    hi: 'एडमिन डेस्क',
    ur: 'ایڈمن ڈیسک'
  },
  administrativeLogin: {
    en: 'ADMINISTRATOR SECURE LOGIN',
    hi: 'प्रशासक सुरक्षित लॉगिन',
    ur: 'ایڈمنسٹریٹر لاگ ان'
  },
  secureTerminal: {
    en: 'SECURE TERMINAL',
    hi: 'सुरक्षित टर्मिनल',
    ur: 'سیکیور ٹرمینل'
  },
  schoolHome: {
    en: 'School Home',
    hi: 'स्कूल होम पेज',
    ur: 'اسکول ہوم'
  },
  parentsLogin: {
    en: 'Parents Login',
    hi: 'अभिभावक लॉगिन',
    ur: 'والدین لاگ ان'
  },
  teacherLogin: {
    en: 'Teacher Login',
    hi: 'शिक्षक लॉगिन',
    ur: 'ٹیچر لاگ ان'
  },
  studentLogin: {
    en: 'Student Login',
    hi: 'विद्यार्थी लॉगिन',
    ur: 'طالب علم لاگ ان'
  },
  homework: {
    en: 'Home-work',
    hi: 'गृहकार्य (होमवर्क)',
    ur: 'ہوم ورک'
  },
  liveClass: {
    en: 'Live-Class',
    hi: 'लाइव क्लास',
    ur: 'لائیو क्लास'
  },
  classroomCameras: {
    en: 'AI Classroom Cameras',
    hi: 'एआई क्लासरूम कैमरे',
    ur: 'کلاس روم کیمرے'
  },
  todayPresent: {
    en: 'Today Present Student',
    hi: 'आज उपस्थित छात्र',
    ur: 'آج حاضر طلباء'
  },
  absentStudent: {
    en: 'Absent Student',
    hi: 'अनुपस्थित छात्र',
    ur: 'غیر حاضر طلبہ'
  },
  newScholarship: {
    en: 'New Scholarship',
    hi: 'नई छात्रवृत्ति',
    ur: 'نئی اسکالرشپ'
  },
  guildlinesTitle: {
    en: 'Document Portal Operational Guide',
    hi: 'दस्तावेज़ पोर्टल परिचालन मार्गदर्शिका',
    ur: 'دستاویز پورٹل آپریشنل گائیڈ'
  },

  // Admin Dashboard
  masterDashboard: {
    en: 'Master Admin Dashboard',
    hi: 'मुख्य एडमिन डैशबोर्ड',
    ur: 'ماسٹر एडमिन डेश बोर्ड'
  },
  selectModule: {
    en: 'Select a restricted module below to manage school operations.',
    hi: 'स्कूल संचालन का प्रबंधन करने के लिए नीचे दिए गए मॉड्यूल का चयन करें।',
    ur: 'اسکول کے انتظامات سنبھالنے کے لیے نیچے دیے گئے ماڈیول کا انتخاب کریں۔'
  },
  marksheetBuilder: {
    en: 'Marksheet Builder',
    hi: 'अंकसूची निर्माता (मार्कशीट)',
    ur: 'مارک شیٹ بلڈر'
  },
  tcEngine: {
    en: 'TC Engine',
    hi: 'स्थानांतरण प्रमाणपत्र (टी.सी.) इंजन',
    ur: 'ٹی سی انجن'
  },
  admissionCrm: {
    en: 'Admission CRM',
    hi: 'प्रवेश प्रबंधन (एडमिशन crm)',
    ur: 'داخلہ سی آر ایم'
  },
  scholarLedger: {
    en: 'Scholar Ledger',
    hi: 'छात्र बहीखाता (स्कॉलर लेजर)',
    ur: 'اسکالر لیجر'
  },
  cloudErp: {
    en: 'Cloud ERP & LMS',
    hi: 'क्लाउड ईआरपी एवं एलएमएस',
    ur: 'کلاؤڈ ای آر پی'
  },
  aiCameras: {
    en: 'AI Camera System',
    hi: 'एआई सीसीटीवी कैमरा प्रणाली',
    ur: 'کیمرہ سسٹم'
  },
  terminateSession: {
    en: 'Terminate Session',
    hi: 'सत्र समाप्त करें (लॉगआउट)',
    ur: 'لاگ آؤٹ'
  },

  // Scholar Tab / Filtering
  nurseryTo8th: {
    en: 'Nursery to 8th (Primary / Middle)',
    hi: 'नर्सरी से आठवीं (प्राथमिक / माध्यमिक)',
    ur: 'نرسری سے آٹھویں (پرائمری)'
  },
  '9thTo12th': {
    en: '9th to 12th (High Secondary)',
    hi: 'नौवीं से बारहवीं (उच्चतर माध्यमिक)',
    ur: 'نویں سے بارہویں (سیکنڈری)'
  },
  allClasses: {
    en: 'All Classes Roster',
    hi: 'सभी कक्षाएं बहीखाता',
    ur: 'تمام کلاسز'
  },
  addScholar: {
    en: 'Add Scholar',
    hi: 'नया स्कॉलर जोड़ें',
    ur: 'اسکالر شامل کریں'
  },
  schoolFeeStatus: {
    en: '₹ SCHOOL FEE STATUS',
    hi: '₹ स्कूल शुल्क का विवरण',
    ur: '₹ اسکول فیس کی تفصیلات'
  },
  payOutstandingDues: {
    en: 'Pay Outstanding Dues',
    hi: 'बकाया राशि का भुगतान करें',
    ur: 'بقایا فیس ادا کریں'
  },
  outstandingDueBalance: {
    en: 'outstanding due balance',
    hi: 'कुल बकाया शेष राशि',
    ur: 'کل واجب الادا رقم'
  },
  allSettled: {
    en: 'All fee dues are settled. Thank you!',
    hi: 'सभी शुल्क का भुगतान हो चुका है। धन्यवाद!',
    ur: 'فیس مکمل طور पर جمع ہو چکی ہے۔ شکریہ!'
  },
  viewLedgerAccount: {
    en: 'View Ledger Account',
    hi: 'बहीखाता खाता देखें',
    ur: 'لیجر بک دیکھیں'
  },
  ledgerSynced: {
    en: 'Paid Ledger Synced',
    hi: 'भुगतान बहीखाता समन्वित',
    ur: 'ادائیگی کی تفصیلات مطابقت پذیر'
  },

  // Home Page Hero Section
  heroTagline: {
    en: 'Empowering minds, building character, and shaping the future leaders of tomorrow through holistic education and innovation.',
    hi: 'समग्र शिक्षा और नवाचार के माध्यम से मस्तिष्क को सशक्त बनाना, चरित्र निर्माण करना और कल के भविष्य के नेताओं को आकार देना।',
    ur: 'ذہنوں کو بااختیار بنانا، کردار سازی کرنا اور جامع تعلیم کے ذریعے آنے والے کل کے رہنماؤں کو تیار کرنا۔'
  },
  applyForAdmission: {
    en: 'Apply for Admission',
    hi: 'प्रवेश के लिए आवेदन करें',
    ur: 'داخلہ کے لیے درخواست دیں'
  },
  campusTour: {
    en: 'Campus Tour',
    hi: 'कैंपस भ्रमण',
    ur: 'کیمپس دورہ'
  },

  // Stats Section
  statPassRate: {
    en: 'Pass Rate',
    hi: 'उत्तीर्णता दर',
    ur: 'پاس ریٹ'
  },
  statStudents: {
    en: 'Students',
    hi: 'विद्यार्थी',
    ur: 'طلباء'
  },
  statCourses: {
    en: 'Courses',
    hi: 'पाठ्यक्रम',
    ur: 'کورسز'
  },
  statEst: {
    en: 'Est.',
    hi: 'स्थापना',
    ur: 'قیام'
  },

  // Campus Tour Video Hub
  campusTourVideoHub: {
    en: 'Campus Tour Video Hub',
    hi: 'कैंपस भ्रमण वीडियो हब',
    ur: 'کیمپس ٹور ویڈیو ہب'
  },
  campusTourSubtitle: {
    en: 'Explore key campus spaces before booking a visit.',
    hi: 'विजिट बुक करने से पहले कैंपस के प्रमुख स्थानों को देखें।',
    ur: 'وزٹ بک کرنے سے پہلے کیمپس کی اہم جگہیں دیکھیں۔'
  },

  // Hall of Fame
  hallOfFame: {
    en: 'Hall of Fame',
    hi: 'हॉल ऑफ फेम (गौरव दीर्घा)',
    ur: 'ہال آف فیم'
  },
  starOfWeek: {
    en: 'Star of the Week',
    hi: 'सप्ताह का सितारा',
    ur: 'ہفتے کا ستارہ'
  },
  ourHero: {
    en: 'Our Hero',
    hi: 'हमारा नायक',
    ur: 'ہمارا ہیرو'
  },
  starOfMonth: {
    en: 'Star of the Month',
    hi: 'माह का सितारा',
    ur: 'مہینے کا ستارہ'
  },
  heroAchievement: {
    en: 'Class IX • National Science Olympiad Gold',
    hi: 'कक्षा IX • राष्ट्रीय विज्ञान ओलंपियाड स्वर्ण',
    ur: 'کلاس IX • نیشنل سائنس اولمپیاڈ گولڈ'
  },
  heroDesc: {
    en: 'Consistently demonstrating exceptional intellect, humility, and leadership at Saint Xavier\'s.',
    hi: 'सेंट जेवियर में असाधारण बुद्धिमत्ता, विनम्रता और नेतृत्व का निरंतर प्रदर्शन।',
    ur: 'سینٹ زیویرز میں غیر معمولی ذہانت، انکساری اور قیادت کا مسلسل مظاہرہ۔'
  },

  // Info Grid Cards
  latestNews: {
    en: 'Latest News',
    hi: 'ताज़ा समाचार',
    ur: 'تازہ خبریں'
  },
  news1: {
    en: 'Annual Sports Meet 2026 scheduled for November.',
    hi: 'वार्षिक खेल मेला 2026 नवंबर माह में निर्धारित है।',
    ur: 'سالانہ اسپورٹس میٹ 2026 نومبر میں طے شدہ ہے۔'
  },
  news2: {
    en: 'Board Examination dates announced by CBSE.',
    hi: 'सीबीएसई द्वारा बोर्ड परीक्षा की तिथियाँ घोषित।',
    ur: 'سی بی ایس ای نے بورڈ امتحان کی تاریخیں اعلان کر دیں۔'
  },
  news3: {
    en: 'Winter vacation starting from 25th Dec.',
    hi: 'शीतकालीन अवकाश 25 दिसंबर से प्रारंभ होगा।',
    ur: 'موسم سرما کی چھٹیاں 25 دسمبر سے شروع ہوں گی۔'
  },
  achievements: {
    en: 'Achievements',
    hi: 'उपलब्धियाँ',
    ur: 'کامیابیاں'
  },
  achievement1: {
    en: '100% Pass result in Class XII Board Exams.',
    hi: 'कक्षा XII बोर्ड परीक्षा में 100% उत्तीर्णता परिणाम।',
    ur: 'کلاس XII بورڈ امتحانات میں 100% پاس نتیجہ۔'
  },
  achievement2: {
    en: 'Won Inter-School Debate Championship.',
    hi: 'इंटर-स्कूल वाद-विवाद प्रतियोगिता जीती।',
    ur: 'انٹر اسکول مباحثہ چیمپئن شپ جیتی۔'
  },
  achievement3: {
    en: 'Best Eco-Friendly Campus Award 2025.',
    hi: 'सर्वश्रेष्ठ पर्यावरण-अनुकूल कैंपस पुरस्कार 2025।',
    ur: 'بہترین ماحول دوست کیمپس ایوارڈ 2025۔'
  },
  contactUs: {
    en: 'Contact Us',
    hi: 'संपर्क करें',
    ur: 'ہم سے رابطہ کریں'
  },
  socialLinks: {
    en: '🔗 Social Links / सोशल मीडिया:',
    hi: '🔗 सोशल मीडिया लिंक:',
    ur: '🔗 سوشل میڈیا لنکس:'
  },

  // Login Form
  usernameOrId: {
    en: 'Username or ID',
    hi: 'उपयोगकर्ता नाम या आईडी',
    ur: 'صارف نام یا آئی ڈی'
  },
  usernamePlaceholder: {
    en: 'parent / school ID',
    hi: 'अभिभावक / स्कूल आईडी',
    ur: 'والدین / اسکول آئی ڈی'
  },
  password: {
    en: 'Password',
    hi: 'पासवर्ड',
    ur: 'پاس ورڈ'
  },
  feeBalance: {
    en: 'Fee Balance',
    hi: 'शुल्क बकाया',
    ur: 'فیس بقایا'
  },
  rememberMe: {
    en: 'Remember Me',
    hi: 'मुझे याद रखें',
    ur: 'مجھے یاد رکھیں'
  },
  forgotPassword: {
    en: 'Forgot Password?',
    hi: 'पासवर्ड भूल गए?',
    ur: 'پاس ورڈ بھول گئے؟'
  },
  secureLogin: {
    en: 'Secure Login',
    hi: 'सुरक्षित लॉगिन',
    ur: 'محفوظ لاگ ان'
  },
  loginSubtitle: {
    en: 'Authorize workspace to access your dynamic portal.',
    hi: 'अपना डायनामिक पोर्टल एक्सेस करने के लिए वर्कस्पेस को अधिकृत करें।',
    ur: 'اپنا ڈائنامک پورٹل تک رسائی کے لیے ورک اسپیس کو اجازت دیں۔'
  },

  // Homework Section
  digitalHomework: {
    en: 'Digital Homework',
    hi: 'डिजिटल गृहकार्य',
    ur: 'ڈیجیٹل ہوم ورک'
  },
  recentAssignments: {
    en: 'Recent assignments and submissions',
    hi: 'हाल के असाइनमेंट और सबमिशन',
    ur: 'حالیہ اسائنمنٹس اور جمع کرائے گئے کام'
  },
  uploadAssignment: {
    en: 'Upload Assignment',
    hi: 'असाइनमेंट अपलोड करें',
    ur: 'اسائنمنٹ اپ لوڈ کریں'
  },
  due: {
    en: 'Due:',
    hi: 'देय तिथि:',
    ur: 'آخری تاریخ:'
  },

  // Live Class
  liveVirtualClassrooms: {
    en: 'Live Virtual Classrooms',
    hi: 'लाइव वर्चुअल क्लासरूम',
    ur: 'لائیو ورچوئل کلاس رومز'
  },
  liveNow: {
    en: 'LIVE NOW',
    hi: 'अभी लाइव',
    ur: 'ابھی لائیو'
  },
  joinMeeting: {
    en: 'Join Meeting',
    hi: 'मीटिंग में शामिल हों',
    ur: 'میٹنگ میں شامل ہوں'
  },

  // Classroom Cameras
  aiClassroomSurveillance: {
    en: 'AI Classroom Surveillance',
    hi: 'एआई क्लासरूम निगरानी',
    ur: 'اے آئی کلاس روم نگرانی'
  },

  // Present/Absent Students
  todayPresentStudents: {
    en: 'Today Present Students',
    hi: 'आज उपस्थित छात्र',
    ur: 'آج حاضر طلباء'
  },
  todayAbsentStudents: {
    en: 'Today Absent Students',
    hi: 'आज अनुपस्थित छात्र',
    ur: 'آج غیر حاضر طلباء'
  },
  dateLabel: {
    en: 'Date:',
    hi: 'तिथि:',
    ur: 'تاریخ:'
  },
  studentIdCol: {
    en: 'Student ID',
    hi: 'छात्र आईडी',
    ur: 'طالب علم آئی ڈی'
  },
  nameCol: {
    en: 'Name',
    hi: 'नाम',
    ur: 'نام'
  },
  classSectionCol: {
    en: 'Class & Sec',
    hi: 'कक्षा और अनुभाग',
    ur: 'کلاس اور سیکشن'
  },
  statusCol: {
    en: 'Status',
    hi: 'स्थिति',
    ur: 'حیثیت'
  },
  presentLabel: {
    en: 'PRESENT',
    hi: 'उपस्थित',
    ur: 'حاضر'
  },
  absentLabel: {
    en: 'ABSENT',
    hi: 'अनुपस्थित',
    ur: 'غیر حاضر'
  },

  // Scholarship
  openNow: {
    en: 'OPEN NOW',
    hi: 'अभी खुला है',
    ur: 'ابھی کھلا ہے'
  },
  meritScholarship: {
    en: 'Merit Scholarship 2026',
    hi: 'मेरिट छात्रवृत्ति 2026',
    ur: 'میرٹ اسکالرشپ 2026'
  },
  scholarshipDesc: {
    en: 'Up to 100% tuition fee waiver for outstanding academic performers. Apply before 31st August.',
    hi: 'उत्कृष्ट शैक्षणिक प्रदर्शनकर्ताओं के लिए 100% तक ट्यूशन शुल्क माफी। 31 अगस्त से पहले आवेदन करें।',
    ur: 'بہترین تعلیمی کارکردگی والوں کے لیے 100% تک ٹیوشن فیس معافی۔ 31 اگست سے پہلے درخواست دیں۔'
  },
  applicationForm: {
    en: 'Application Form',
    hi: 'आवेदन पत्र',
    ur: 'درخواست فارم'
  },
  phStudentName: {
    en: 'Student Full Name',
    hi: 'छात्र का पूरा नाम',
    ur: 'طالب علم کا پورا نام'
  },
  phEnrollment: {
    en: 'Enrollment / Scholar No',
    hi: 'नामांकन / स्कॉलर नंबर',
    ur: 'انرولمنٹ / اسکالر نمبر'
  },
  phClassSection: {
    en: 'Current Class & Section',
    hi: 'वर्तमान कक्षा और अनुभाग',
    ur: 'موجودہ کلاس اور سیکشن'
  },
  phPrevGrade: {
    en: 'Previous Year % or Grade',
    hi: 'पिछले वर्ष की प्रतिशत या ग्रेड',
    ur: 'پچھلے سال کا فیصد یا گریڈ'
  },
  phWhyScholarship: {
    en: 'Why do you deserve this scholarship?',
    hi: 'आप इस छात्रवृत्ति के हकदार क्यों हैं?',
    ur: 'آپ اس اسکالرشپ کے مستحق کیوں ہیں؟'
  },
  submitApplication: {
    en: 'Submit Application',
    hi: 'आवेदन जमा करें',
    ur: 'درخواست جمع کریں'
  },

  // Module Under Construction
  moduleUnderConstruction: {
    en: 'Module Under Construction',
    hi: 'मॉड्यूल निर्माणाधीन है',
    ur: 'ماڈیول زیر تعمیر ہے'
  },
  moduleUnderConstructionDesc: {
    en: 'This section is currently being developed.',
    hi: 'यह अनुभाग अभी विकास के अधीन है।',
    ur: 'یہ سیکشن ابھی تیار ہو رہا ہے۔'
  },

  promptEnterStudentName: {
    en: 'Enter Student Full Name for Admission:',
    hi: 'प्रवेश के लिए छात्र का पूरा नाम दर्ज करें:',
    ur: 'داخلہ کے لیے طالب علم کا پورا نام درج کریں:'
  },
  promptFatherName: {
    en: "Enter Father's Name:",
    hi: 'पिता का नाम दर्ज करें:',
    ur: 'والد کا نام درج کریں:'
  },
  promptTargetClass: {
    en: 'Enter Target Class (e.g. Class I):',
    hi: 'लक्षित कक्षा दर्ज करें (जैसे कक्षा I):',
    ur: 'مطلوبہ کلاس درج کریں (مثلاً کلاس I):'
  },
  alertAdmissionSuccess: {
    en: 'Application submitted successfully! Our administration will review it in the Admin Dashboard.',
    hi: 'आवेदन सफलतापूर्वक जमा हो गया! हमारा प्रशासन एडमिन डैशबोर्ड में इसकी समीक्षा करेगा।',
    ur: 'درخواست کامیابی سے جمع ہو گئی! ہمارا انتظامیہ ایڈمن ڈیش بورڈ میں اس کا جائزہ لے گا۔'
  },
  promptTourName: {
    en: 'Enter Student Name for Campus Tour Booking:',
    hi: 'कैंपस टूर बुकिंग के लिए छात्र का नाम दर्ज करें:',
    ur: 'کیمپس ٹور بکنگ کے لیے طالب علم کا نام درج کریں:'
  },
  promptTourDate: {
    en: 'Enter preferred Date (e.g. YYYY-MM-DD):',
    hi: 'पसंदीदा तिथि दर्ज करें (जैसे YYYY-MM-DD):',
    ur: 'پسندیدہ تاریخ درج کریں (مثلاً YYYY-MM-DD):'
  },
  promptTourPhone: {
    en: 'Enter Contact Number:',
    hi: 'संपर्क नंबर दर्ज करें:',
    ur: 'رابطہ نمبر درج کریں:'
  },
  alertTourSuccess: {
    en: 'Campus Tour booked successfully! Our administration will confirm shortly.',
    hi: 'कैंपस टूर सफलतापूर्वक बुक हो गया! हमारा प्रशासन जल्द ही पुष्टि करेगा।',
    ur: 'کیمپس ٹور کامیابی سے بک ہو گیا! ہمارا انتظامیہ جلد تصدیق کرے گا۔'
  },

  // Voice command suggestions
  voiceCommandSuggestions: {
    en: 'Try speaking: "go to admin", "go to portals", "pay outstanding", "set hindi", "filter nursery"',
    hi: 'बोल कर देखें: "go to admin", "go to portals", "pay outstanding", "set hindi", "filter nursery"',
    ur: 'بولیں: "go to admin", "go to portals", "pay outstanding", "set urdu", "filter secondary"'
  }
};

export function getTranslation(key: string, lang: LangType): string {
  if (DICTIONARY[key] && DICTIONARY[key][lang]) {
    return DICTIONARY[key][lang];
  }
  return key; // Fallback to raw key
}
