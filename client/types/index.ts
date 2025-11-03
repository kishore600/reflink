// types/index.ts
export interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  title: string;
  experience: string;
  bio?: string;
  location: string;
  remotePolicy: string;
  desiredRoles: string[];
  targetCompanies: string[];
  skills: Skill[];
  projects: Project[];
  consultingOffers: ConsultingOffer[];
  availableSlots: number;
  completedSessions: number;
  successStories: SuccessStory[];
  profileViews: number;
  isAvailable: boolean;
  socialLinks?: SocialLinks;
}

export interface Skill {
  name: string;
  level: number;
}

export interface Project {
  name: string;
  description?: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
}

export interface ConsultingOffer {
  _id: string;
  title: string;
  description: string;
  duration: number;
  skills: string[];
  benefits: string;
  createdBy: string | User;
  isActive: boolean;
  category: string;
  difficulty: string;
}

export interface Session {
  _id: string;
  consultingOffer: ConsultingOffer;
  jobSeeker: User;
  employee: User;
  scheduledAt: string;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  meetingLink?: string;
  notes?: string;
  referralSubmitted: boolean;
}

export interface Referral {
  _id: string;
  session: Session;
  jobSeeker: User;
  employee: User;
  company: string;
  position: string;
  jobDescription?: string;
  status: 'submitted' | 'under-review' | 'interview' | 'rejected' | 'hired';
  employeeNotes?: string;
  applicationLink?: string;
  interviewUpdates: InterviewUpdate[];
}

export interface InterviewUpdate {
  stage: string;
  date: string;
  notes: string;
  status: string;
}

export interface SuccessStory {
  testimonial: string;
  employee: string;
  company: string;
  createdAt: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  portfolio?: string;
}

export interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  name: string;
  title: string;
  token: string;
}