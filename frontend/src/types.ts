export interface SubjectResult {
  name: string;
  maxTheory?: number;
  obtTheory?: number;
  monthlyTestObt?: number;
  terminalObt?: number;
  halfObt?: number;
  projectObt?: number;
}

export interface MarksheetRecord {
  id: string;
  rollNo: string;
  scholarsNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  className: string;
  section: string;
  dob: string;
  session: string;
  attendance: string;
  height?: string;
  weight?: string;
  disciplineGrade: string;
  remarks: string;
  subjects: SubjectResult[];
}

export interface TransferCertificateRecord {
  id: string;
  tcNo: string;
  bookNo: string;
  scholarNo: string;
  sssmiId?: string;
  studentAadhar?: string;
  name: string;
  motherName: string;
  fatherName: string;
  nationality: string;
  category: string;
  dob: string;
  dobWords: string;
  firstAdmissionDateClass: string;
  classInWhichLeaving: string;
  schoolBoardAnnualExam: string;
  whetherFailed: string;
  subjectsStudied: string;
  qualifiedForPromotion: string;
  duePaidMonth: string;
  anyFeeConcession: string;
  totalWorkingDays: number;
  totalDaysPresent: number;
  nccBoyScout?: string;
  gamesExtraActivities?: string;
  generalConduct: string;
  tcApplicationDate: string;
  tcIssueDate: string;
  reasonForLeaving: string;
  anyOtherRemarks?: string;
}

export interface AdmissionFormRecord {
  id: string;
  docketNo: string;
  diseCode: string;
  psNo: string;
  admissionNo: string;
  enrollmentDate: string;
  session: string;
  name: string;
  gender: string;
  bloodGroup: string;
  dob: string;
  dobWords: string;
  birthPlace: string;
  nationality: string;
  religion: string;
  category: string;
  motherTongue: string;
  classTarget: string;
  prevSchool: string;
  fatherName: string;
  fatherOcc: string;
  motherName: string;
  motherOcc: string;
  guardianName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pinCode: string;
  sssmiId?: string;
  aadharNo?: string;
  aparId?: string;
  transportRequired: 'YES' | 'NO';
  photoUrl?: string | null;
}

export interface ScholarRow {
  className: string;
  admDate: string;
  withdrawalDate: string;
  totalDays: string;
  presentDays: string;
  totalStudents: string;
  rank: string;
  conduct: string;
  principalSign: string;
}

export interface ScholarProfile {
  id: string;
  scholarNo: string;
  enrollmentNo?: string;
  studentName: string;
  currentClass?: string;
  dob?: string;
  religionCaste?: string;
  prevSchool?: string;
  fatherName?: string;
  motherName?: string;
  guardianName?: string;
  relation?: string;
  occupation?: string;
  address?: string;
  mobile?: string;
  admissionDate?: string;
  removalDate?: string;
  withdrawalCause?: string;
  rollNo5th?: string;
  rollNo8th?: string;
  rollNo10th?: string;
  rollNo12th?: string;
  aadharNo?: string;
  ssmId?: string;
  familyId?: string;
  bankName?: string;
  bankAccount?: string;
  ifscCode?: string;
  rows?: ScholarRow[];
  annualFee?: number;
  transactions?: FeeTransaction[];
}

export interface FeeTransaction {
  id: string;
  date: string;
  category: string;
  amount: number;
  paymentMode: string;
  status: 'PAID' | 'DUE' | 'PARTIAL';
}

export type ActiveTab = 'portals' | 'admin' | 'social_media' | 'marksheet' | 'tc' | 'admission' | 'scholar' | 'erp';
