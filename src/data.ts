import type {
  AdmissionFormRecord,
  MarksheetRecord,
  ScholarProfile,
  ScholarRow,
  SubjectResult,
  TransferCertificateRecord
} from './types';

export const SAMPLE_MARKSHEETS: MarksheetRecord[] = [
  {
    id: 'mk-default',
    rollNo: '24',
    scholarsNo: 'A-4928',
    name: 'RAHUL SHARMA',
    fatherName: 'MR. SURENDRA SHARMA',
    motherName: 'MRS. SAVITA SHARMA',
    className: 'CLASS VIII',
    section: 'A',
    dob: '2012-05-14',
    session: '2025-26',
    attendance: '194/210',
    height: '145 cm',
    weight: '38 kg',
    disciplineGrade: 'A',
    remarks: 'Excellent concentration and diligent academic performance.',
    subjects: [
      { name: 'Hindi', maxTheory: 140, obtTheory: 114, monthlyTestObt: 16, terminalObt: 41, halfObt: 42, projectObt: 15 },
      { name: 'English', maxTheory: 140, obtTheory: 108, monthlyTestObt: 15, terminalObt: 38, halfObt: 39, projectObt: 16 },
      { name: 'Mathematics', maxTheory: 140, obtTheory: 134, monthlyTestObt: 19, terminalObt: 48, halfObt: 47, projectObt: 20 },
      { name: 'Science', maxTheory: 140, obtTheory: 125, monthlyTestObt: 18, terminalObt: 44, halfObt: 45, projectObt: 18 },
      { name: 'Social Science', maxTheory: 140, obtTheory: 117, monthlyTestObt: 17, terminalObt: 42, halfObt: 41, projectObt: 17 },
      { name: 'General Knowledge', maxTheory: 140, obtTheory: 73, monthlyTestObt: 14, terminalObt: 23, halfObt: 22, projectObt: 14 }
    ]
  },
  {
    id: 'mk-sample-2',
    rollNo: '12',
    scholarsNo: 'A-5014',
    name: 'KABIR GUPTA',
    fatherName: 'MR. ANIL GUPTA',
    motherName: 'MRS. NISHA GUPTA',
    className: 'CLASS V',
    section: 'B',
    dob: '2015-09-02',
    session: '2025-26',
    attendance: '204/210',
    height: '138 cm',
    weight: '32 kg',
    disciplineGrade: 'A',
    remarks: 'Consistent academic performer, very quiet and highly analytical.',
    subjects: [
      { name: 'Hindi', maxTheory: 140, obtTheory: 126, monthlyTestObt: 18, terminalObt: 45, halfObt: 45, projectObt: 18 },
      { name: 'English', maxTheory: 140, obtTheory: 121, monthlyTestObt: 17, terminalObt: 43, halfObt: 43, projectObt: 18 },
      { name: 'Mathematics', maxTheory: 140, obtTheory: 138, monthlyTestObt: 20, terminalObt: 49, halfObt: 49, projectObt: 20 },
      { name: 'Science', maxTheory: 140, obtTheory: 133, monthlyTestObt: 19, terminalObt: 47, halfObt: 48, projectObt: 19 },
      { name: 'Social Science', maxTheory: 140, obtTheory: 127, monthlyTestObt: 18, terminalObt: 46, halfObt: 45, projectObt: 18 },
      { name: 'General Knowledge', maxTheory: 140, obtTheory: 80, monthlyTestObt: 16, terminalObt: 24, halfObt: 24, projectObt: 16 }
    ]
  },
  {
    id: 'mk-sample-3',
    rollNo: '37',
    scholarsNo: 'A-4839',
    name: 'DIVYA SINHA',
    fatherName: 'MR. AMIT SINHA',
    motherName: 'MRS. KANCHAN SINHA',
    className: 'CLASS VI',
    section: 'C',
    dob: '2014-02-28',
    session: '2025-26',
    attendance: '175/210',
    height: '141 cm',
    weight: '35 kg',
    disciplineGrade: 'B',
    remarks: 'Creative and active in extracurriculars. Needs minor focus in Math.',
    subjects: [
      { name: 'Hindi', maxTheory: 140, obtTheory: 102, monthlyTestObt: 16, terminalObt: 41, halfObt: 42, projectObt: 15 },
      { name: 'English', maxTheory: 140, obtTheory: 117, monthlyTestObt: 15, terminalObt: 37, halfObt: 39, projectObt: 16 },
      { name: 'Mathematics', maxTheory: 140, obtTheory: 130, monthlyTestObt: 19, terminalObt: 46, halfObt: 46, projectObt: 19 },
      { name: 'Science', maxTheory: 140, obtTheory: 98, monthlyTestObt: 13, terminalObt: 35, halfObt: 36, projectObt: 14 },
      { name: 'Social Science', maxTheory: 140, obtTheory: 109, monthlyTestObt: 15, terminalObt: 40, halfObt: 39, projectObt: 15 },
      { name: 'General Knowledge', maxTheory: 140, obtTheory: 66, monthlyTestObt: 12, terminalObt: 21, halfObt: 20, projectObt: 13 }
    ]
  },
  {
    id: 'mk-preset-pre-primary',
    rollNo: '02',
    scholarsNo: 'PP-1092',
    name: 'AYAN KHAN',
    fatherName: 'MR. AMIR KHAN',
    motherName: 'MRS. FARAH KHAN',
    className: 'PRE-PRIMARY',
    section: 'A',
    dob: '2021-04-10',
    session: '2025-26',
    attendance: '198/210',
    height: '105 cm',
    weight: '18 kg',
    disciplineGrade: 'A',
    remarks: 'Very sweet child, highly active and enthusiastic in learning new concepts.',
    subjects: [
      { name: 'ENGLISH', maxTheory: 140, obtTheory: 127, monthlyTestObt: 18, terminalObt: 46, halfObt: 45, projectObt: 18 },
      { name: 'HINDI', maxTheory: 140, obtTheory: 123, monthlyTestObt: 17, terminalObt: 43, halfObt: 44, projectObt: 19 },
      { name: 'MATHS', maxTheory: 140, obtTheory: 134, monthlyTestObt: 19, terminalObt: 48, halfObt: 47, projectObt: 20 },
      { name: 'URDU', maxTheory: 140, obtTheory: 126, monthlyTestObt: 18, terminalObt: 45, halfObt: 45, projectObt: 18 },
      { name: 'ARABIC', maxTheory: 140, obtTheory: 131, monthlyTestObt: 19, terminalObt: 47, halfObt: 46, projectObt: 19 },
      { name: 'MORAL SCIENCE', maxTheory: 140, obtTheory: 115, monthlyTestObt: 16, terminalObt: 42, halfObt: 40, projectObt: 17 },
      { name: 'ART & CRAFT', maxTheory: 140, obtTheory: 125, monthlyTestObt: 18, terminalObt: 44, halfObt: 45, projectObt: 18 }
    ]
  },
  {
    id: 'mk-preset-primary',
    rollNo: '15',
    scholarsNo: 'PR-3081',
    name: 'SARA ALAM',
    fatherName: 'MR. JAMEEL ALAM',
    motherName: 'MRS. SAJIDA ALAM',
    className: 'PRIMARY (CLASS IV)',
    section: 'A',
    dob: '2017-08-25',
    session: '2025-26',
    attendance: '202/212',
    height: '130 cm',
    weight: '28 kg',
    disciplineGrade: 'A',
    remarks: 'Exceptional drawing skills and high academic accuracy. Keep it up!',
    subjects: [
      { name: 'ENGLISH', maxTheory: 140, obtTheory: 115, monthlyTestObt: 16, terminalObt: 41, halfObt: 42, projectObt: 16 },
      { name: 'HINDI', maxTheory: 140, obtTheory: 109, monthlyTestObt: 15, terminalObt: 39, halfObt: 40, projectObt: 15 },
      { name: 'MATHS', maxTheory: 140, obtTheory: 127, monthlyTestObt: 18, terminalObt: 45, halfObt: 46, projectObt: 18 },
      { name: 'URDU', maxTheory: 140, obtTheory: 119, monthlyTestObt: 17, terminalObt: 42, halfObt: 43, projectObt: 17 },
      { name: 'ARABIC', maxTheory: 140, obtTheory: 125, monthlyTestObt: 18, terminalObt: 44, halfObt: 45, projectObt: 18 },
      { name: 'E.V.S.', maxTheory: 140, obtTheory: 133, monthlyTestObt: 19, terminalObt: 48, halfObt: 47, projectObt: 19 },
      { name: 'COMPUTER BASIC', maxTheory: 140, obtTheory: 106, monthlyTestObt: 15, terminalObt: 38, halfObt: 37, projectObt: 16 }
    ]
  },
  {
    id: 'mk-preset-middle',
    rollNo: '08',
    scholarsNo: 'MD-5928',
    name: 'ZAIN SHAIKH',
    fatherName: 'MR. ANWAR SHAIKH',
    motherName: 'MRS. RUKHSAR SHAIKH',
    className: 'MIDDLE (CLASS VII)',
    section: 'B',
    dob: '2014-11-05',
    session: '2025-26',
    attendance: '195/210',
    height: '146 cm',
    weight: '39 kg',
    disciplineGrade: 'A',
    remarks: 'Zain is very strong in IT, computer applications, and analytical science.',
    subjects: [
      { name: 'ENGLISH', maxTheory: 140, obtTheory: 119, monthlyTestObt: 17, terminalObt: 43, halfObt: 42, projectObt: 17 },
      { name: 'HINDI', maxTheory: 140, obtTheory: 115, monthlyTestObt: 16, terminalObt: 41, halfObt: 41, projectObt: 16 },
      { name: 'URDU/SANSKRIT', maxTheory: 140, obtTheory: 125, monthlyTestObt: 18, terminalObt: 44, halfObt: 45, projectObt: 18 },
      { name: 'MATHS', maxTheory: 140, obtTheory: 133, monthlyTestObt: 19, terminalObt: 48, halfObt: 47, projectObt: 19 },
      { name: 'SCIENCE', maxTheory: 140, obtTheory: 127, monthlyTestObt: 18, terminalObt: 45, halfObt: 46, projectObt: 18 },
      { name: 'SOCIAL SCIENCE', maxTheory: 140, obtTheory: 108, monthlyTestObt: 15, terminalObt: 39, halfObt: 38, projectObt: 16 },
      { name: 'AI TOOLS', maxTheory: 140, obtTheory: 133, monthlyTestObt: 19, terminalObt: 47, halfObt: 48, projectObt: 19 },
      { name: 'DIGITAL MARKETING', maxTheory: 140, obtTheory: 127, monthlyTestObt: 18, terminalObt: 46, halfObt: 45, projectObt: 18 }
    ]
  }
];

export const SAMPLE_TCS: TransferCertificateRecord[] = [
  {
    id: 'tc-default',
    tcNo: 'SXC/2026/084',
    bookNo: 'XII / 2026',
    scholarNo: '5281',
    sssmiId: '104928172',
    studentAadhar: '4928-1029-4829',
    name: 'PRIYA PATEL',
    motherName: 'MRS. RADHIKA PATEL',
    fatherName: 'MR. RAJESH PATEL',
    nationality: 'INDIAN',
    category: 'OBC',
    dob: '2013-11-20',
    dobWords: 'TWENTIETH OF NOVEMBER TWO THOUSAND THIRTEEN',
    firstAdmissionDateClass: '04/04/2019, Class I',
    classInWhichLeaving: 'VII (Seventh)',
    schoolBoardAnnualExam: 'Passed VII Class Examination',
    whetherFailed: 'No',
    subjectsStudied: 'HINDI, ENGLISH, MATHEMATICS, SCIENCE, SOCIAL STUDIES, SANSKRIT',
    qualifiedForPromotion: 'Yes, promoted to Class VIII',
    duePaidMonth: 'March 2026',
    anyFeeConcession: 'No',
    totalWorkingDays: 220,
    totalDaysPresent: 201,
    nccBoyScout: 'N/A',
    gamesExtraActivities: 'Inter-school Badminton Finalist',
    generalConduct: 'Excellent',
    tcApplicationDate: '2026-03-24',
    tcIssueDate: '2026-03-31',
    reasonForLeaving: 'Parents transfer to Bhopal',
    anyOtherRemarks: 'Priya is an outstanding student with keen interest in sports.'
  },
  {
    id: 'tc-sample-2',
    tcNo: 'SXC/2026/110',
    bookNo: 'XV / 2026',
    scholarNo: '4821',
    sssmiId: '109284102',
    studentAadhar: '2981-2204-1928',
    name: 'ROHAN VERMA',
    motherName: 'MRS. REKHA VERMA',
    fatherName: 'MR. MANOJ VERMA',
    nationality: 'INDIAN',
    category: 'SC',
    dob: '2012-07-15',
    dobWords: 'FIFTEENTH OF JULY TWO THOUSAND TWELVE',
    firstAdmissionDateClass: '02/07/2018, Class I',
    classInWhichLeaving: 'VIII (Eighth)',
    schoolBoardAnnualExam: 'Passed VIII Board Examination',
    whetherFailed: 'No',
    subjectsStudied: 'HINDI, ENGLISH, MATHEMATICS, SCIENCE, SOCIAL STUDIES, SANSKRIT',
    qualifiedForPromotion: 'Yes, promoted to Class IX',
    duePaidMonth: 'March 2026',
    anyFeeConcession: 'No',
    totalWorkingDays: 220,
    totalDaysPresent: 212,
    nccBoyScout: 'Troop Leader A',
    gamesExtraActivities: 'District-level Athletic Champion',
    generalConduct: 'Excellent',
    tcApplicationDate: '2026-04-02',
    tcIssueDate: '2026-04-10',
    reasonForLeaving: 'Higher studies in other institute',
    anyOtherRemarks: 'Rohan is highly disciplined and possesses natural leadership skills.'
  }
];


export const SAMPLE_ADMISSIONS: AdmissionFormRecord[] = [
  {
    id: 'adm-123',
    docketNo: 'SXC-REG-2026-AYA-893',
    diseCode: '23260519102',
    psNo: 'PS-1294',
    admissionNo: 'ADM-2026/084',
    enrollmentDate: '2026-03-15',
    session: '2026-27',
    name: 'AYAN KHAN',
    gender: 'MALE',
    bloodGroup: 'O+',
    dob: '2021-04-10',
    dobWords: 'TENTH OF APRIL TWO THOUSAND TWENTY ONE',
    birthPlace: 'INDORE',
    nationality: 'INDIAN',
    religion: 'ISLAM',
    category: 'GENERAL',
    motherTongue: 'HINDI',
    classTarget: 'Pre-Primary (PP-I)',
    prevSchool: 'Bright Kids Play School, Indore',
    fatherName: 'MR. AMIR KHAN',
    fatherOcc: 'BUSINESS',
    motherName: 'MRS. FARAH KHAN',
    motherOcc: 'HOUSEWIFE',
    guardianName: 'MR. AMIR KHAN',
    phone: '+91 98765 43210',
    email: 'amir.khan@gmail.com',
    address: 'Flat 402, Block C, Scheme 78, Indore',
    city: 'INDORE',
    pinCode: '452010',
    sssmiId: '104928172',
    aadharNo: '4928-1029-4829',
    aparId: 'APAR-2938-1293',
    transportRequired: 'YES',
    photoUrl: null
  },
  {
    id: 'adm-456',
    docketNo: 'SXC-REG-2026-SRA-294',
    diseCode: '23260519102',
    psNo: 'PS-1295',
    admissionNo: 'ADM-2026/092',
    enrollmentDate: '2026-03-20',
    session: '2026-27',
    name: 'SARA ALAM',
    gender: 'FEMALE',
    bloodGroup: 'A+',
    dob: '2017-08-25',
    dobWords: 'TWENTY FIFTH OF AUGUST TWO THOUSAND SEVENTEEN',
    birthPlace: 'INDORE',
    nationality: 'INDIAN',
    religion: 'ISLAM',
    category: 'GENERAL',
    motherTongue: 'URDU',
    classTarget: 'Primary (Class IV)',
    prevSchool: 'Indore Public Nursery School',
    fatherName: 'MR. JAMEEL ALAM',
    fatherOcc: 'SERVICE',
    motherName: 'MRS. SAJIDA ALAM',
    motherOcc: 'TEACHER',
    guardianName: 'MR. JAMEEL ALAM',
    phone: '+91 78799 57124',
    email: 'jameel.alam@yahoo.com',
    address: '102 Gandhi Gram, Khajrana',
    city: 'INDORE',
    pinCode: '452016',
    sssmiId: '110283921',
    aadharNo: '8839-2918-4829',
    aparId: 'APAR-8839-1029',
    transportRequired: 'NO',
    photoUrl: null
  }
];

// Helper to generate empty rows for Scholar Ledger grid table
const makeDefaultRows = (): ScholarRow[] => {
  const classes = ['Nursery', 'LKG', 'UKG', 'Class I', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI', 'Class XII'];
  return classes.map(c => ({
    className: c.toUpperCase(),
    admDate: '',
    withdrawalDate: '',
    totalDays: '220',
    presentDays: '',
    totalStudents: '40',
    rank: '',
    conduct: 'EXCELLENT',
    principalSign: 'SEAL'
  }));
};

export const SAMPLE_SCHOLARS: ScholarProfile[] = [
  {
    id: 'sc-1',
    scholarNo: '5281',
    enrollmentNo: 'ENR-2019-SXC-5281',
    studentName: 'PRIYA PATEL',
    dob: '2013-11-20',
    religionCaste: 'HINDU / OBC',
    prevSchool: 'Little Sparks Nursery School, Indore',
    fatherName: 'MR. RAJESH PATEL',
    motherName: 'MRS. RADHIKA PATEL',
    guardianName: 'MR. RAJESH PATEL',
    relation: 'FATHER',
    occupation: 'SOFTWARE ENGINEER',
    address: 'B-102, Silver Springs, Indore',
    mobile: '+91 9876543210',
    admissionDate: '2019-04-04',
    removalDate: '',
    withdrawalCause: '',
    rollNo5th: '50291',
    rollNo8th: '',
    rollNo10th: '',
    rollNo12th: '',
    aadharNo: '4928-1029-4829',
    ssmId: '104928172',
    familyId: '9928392',
    bankName: 'STATE BANK OF INDIA',
    bankAccount: '30291029381',
    ifscCode: 'SBIN0003014',
    rows: (() => {
      const rows = makeDefaultRows();
      // Pre-fill some academic history rows
      rows[0].admDate = '2019-04-04'; rows[0].presentDays = '205'; rows[0].rank = '1st';
      rows[1].admDate = '2020-04-05'; rows[1].presentDays = '212'; rows[1].rank = '2nd';
      rows[2].admDate = '2021-04-08'; rows[2].presentDays = '198'; rows[2].rank = '1st';
      rows[3].admDate = '2022-04-10'; rows[3].presentDays = '208'; rows[3].rank = '3rd';
      rows[4].admDate = '2023-04-04'; rows[4].presentDays = '215'; rows[4].rank = '2nd';
      rows[5].admDate = '2024-04-06'; rows[5].presentDays = '201'; rows[5].rank = '1st';
      rows[6].admDate = '2025-04-04'; rows[6].presentDays = '204'; rows[6].rank = '2nd';
      return rows;
    })(),
    annualFee: 42000,
    transactions: [
      { id: 'TXN-9021', date: '2025-04-10', category: 'Tuition Fee Installment I', amount: 15000, paymentMode: 'UPI / GooglePay', status: 'PAID' },
      { id: 'TXN-9381', date: '2025-08-15', category: 'Tuition Fee Installment II', amount: 15000, paymentMode: 'Bank Transfer (NEFT)', status: 'PAID' },
      { id: 'TXN-9821', date: '2025-11-20', category: 'Annual Computer & Lab Fee', amount: 5000, paymentMode: 'Credit Card', status: 'PAID' },
      { id: 'TXN-pending', date: '2026-03-01', category: 'Transportation Fee Q4', amount: 7000, paymentMode: 'Pending', status: 'DUE' }
    ]
  },
  {
    id: 'sc-2',
    scholarNo: '4928',
    enrollmentNo: 'ENR-2018-SXC-4928',
    studentName: 'RAHUL SHARMA',
    dob: '2012-05-14',
    religionCaste: 'HINDU / GENERAL',
    prevSchool: 'Indore Play School Academy',
    fatherName: 'MR. SURENDRA SHARMA',
    motherName: 'MRS. SAVITA SHARMA',
    guardianName: 'MR. SURENDRA SHARMA',
    relation: 'FATHER',
    occupation: 'BUSINESSMAN',
    address: 'Plot 42, Scheme 54, Vijay Nagar, Indore',
    mobile: '+91 9123456780',
    admissionDate: '2018-07-02',
    removalDate: '',
    withdrawalCause: '',
    rollNo5th: '49201',
    rollNo8th: '82049',
    rollNo10th: '',
    rollNo12th: '',
    aadharNo: '2981-2204-1928',
    ssmId: '109284102',
    familyId: '8839281',
    bankName: 'HDFC BANK',
    bankAccount: '501002930291',
    ifscCode: 'HDFC0000036',
    rows: (() => {
      const rows = makeDefaultRows();
      rows[0].admDate = '2018-07-02'; rows[0].presentDays = '210'; rows[0].rank = '3rd';
      rows[1].admDate = '2019-04-04'; rows[1].presentDays = '198'; rows[1].rank = '2nd';
      rows[2].admDate = '2020-04-05'; rows[2].presentDays = '204'; rows[2].rank = '2nd';
      rows[3].admDate = '2021-04-08'; rows[3].presentDays = '212'; rows[3].rank = '1st';
      rows[4].admDate = '2022-04-10'; rows[4].presentDays = '205'; rows[4].rank = '4th';
      rows[5].admDate = '2023-04-04'; rows[5].presentDays = '209'; rows[5].rank = '2nd';
      rows[6].admDate = '2024-04-06'; rows[6].presentDays = '211'; rows[6].rank = '3rd';
      rows[7].admDate = '2025-04-04'; rows[7].presentDays = '208'; rows[7].rank = '2nd';
      return rows;
    })(),
    annualFee: 38000,
    transactions: [
      { id: 'TXN-1011', date: '2025-05-02', category: 'Registration & Admission Ledger', amount: 12000, paymentMode: 'Net-Banking', status: 'PAID' },
      { id: 'TXN-1012', date: '2025-09-10', category: 'Tuition Fee Q1-Q2 Bundle', amount: 18000, paymentMode: 'Cash Deposit', status: 'PAID' }
    ]
  }
];

export function calculateMarksTotal(subjects: SubjectResult[]) {
  let max = 0;
  let obt = 0;
  subjects.forEach(sub => {
    if (sub.monthlyTestObt !== undefined || sub.terminalObt !== undefined || sub.halfObt !== undefined || sub.projectObt !== undefined) {
      max += 140;
      obt += (sub.monthlyTestObt ?? 0) + (sub.terminalObt ?? 0) + (sub.halfObt ?? 0) + (sub.projectObt ?? 0);
    } else {
      max += sub.maxTheory ?? 100;
      obt += sub.obtTheory ?? 0;
    }
  });

  const percentage = max > 0 ? (obt / max) * 100 : 0;
  let grade = 'E';
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B';
  else if (percentage >= 60) grade = 'C';
  else if (percentage >= 50) grade = 'D';
  else if (percentage >= 33) grade = 'E';
  else grade = 'Fail';

  return { max, obt, percentage, grade };
}
