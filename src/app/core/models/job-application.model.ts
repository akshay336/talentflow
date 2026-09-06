/**
 * Enterprise Job Application Data Models & State Contracts
 */

export interface PersonalInformation {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export interface QualificationItem {
  id: 'SSC' | 'HSC' | 'Graduation' | 'Post Graduation';
  label: string;
  isMandatory: boolean;
  instituteName: string;
  boardOrUniversity: string;
  cgpaOrPercentage: number | null;
  passingYear: number | null;
}

export interface EducationDetails {
  ssc: QualificationItem;
  hsc: QualificationItem;
  graduation: QualificationItem;
  postGraduation: QualificationItem;
  includeGraduation: boolean;
  includePostGraduation: boolean;
}

export interface WorkExperience {
  id: string;
  companyName: string;
  jobTitle: string;
  duration: string;
  description?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuingOrg: string;
  issueYear: number | null;
}

export interface ResumeMetadata {
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  formattedSize: string;
  uploadedAt: string;
  base64Data?: string;
}

export interface StepValidationStatus {
  step1Valid: boolean;
  step2Valid: boolean;
  step3Valid: boolean;
  step4Valid: boolean;
  step5Valid: boolean;
}

export interface ApplicationState {
  currentStep: number;
  personalInformation: PersonalInformation;
  education: EducationDetails;
  workExperience: WorkExperience[];
  isFresher: boolean;
  technicalSkills: string[];
  certifications: Certification[];
  coverLetter: string;
  resume: ResumeMetadata | null;
  stepValidation: StepValidationStatus;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submittedAt?: string;
  applicationId?: string;
}

export interface StepDefinition {
  stepIndex: number;
  title: string;
  subtitle: string;
  icon: string;
  isCompleted: boolean;
  isValid: boolean;
}

export interface SubmissionPayload {
  applicationId: string;
  submittedAt: string;
  candidate: {
    personal: PersonalInformation;
    education: {
      ssc: QualificationItem;
      hsc: QualificationItem;
      graduation?: QualificationItem;
      postGraduation?: QualificationItem;
    };
    experience: {
      isFresher: boolean;
      records: WorkExperience[];
    };
    qualifications: {
      technicalSkills: string[];
      certifications: Certification[];
    };
    additional: {
      coverLetter: string;
      resume: {
        fileName: string;
        fileSize: number;
        fileType: string;
      } | null;
    };
  };
}
