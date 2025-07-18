export interface Candidate {
  name: string;
  email: string;
  phone?: string;
  location: string;
  submitted_at: string;
  work_availability: string[];
  annual_salary_expectation: { [key: string]: string };
  work_experiences: { company: string; roleName: string }[];
  education: {
    highest_level: string;
    degrees: {
      degree: string;
      subject: string;
      school?: string;
      gpa?: string;
      startDate?: string;
      endDate?: string;
      originalSchool?: string;
      isTop50?: boolean;
      isTop25?: boolean;
    }[];
  };
  skills: string[];

  // Computed properties to be added in the backend
  experienceProxy?: number;
  salaryNumeric?: number;
  isTopSchool?: boolean;
  matchScore?: number;
}

export interface FilterState {
  skills: string;
  minExp: number;
  maxExp: number;
  minSalary: number;
  maxSalary: number;
  topSchool: boolean;
  sortBy: string;
  page: number;
  limit: number;
}

export interface ApiResponse {
  candidates: Candidate[];
  hasMore: boolean;
} 