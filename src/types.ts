export enum Role {
  STUDENT = 'student',
  ADMIN = 'admin',
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: Role;
  photoURL?: string;
  certificates?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface TestMetadata {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in seconds, default 10s per question
  questionsCount: number; // exactly 100
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  testId?: string;
  question: string;
  options: [string, string, string, string]; // exactly 4 options
  correctAnswer: string;
}

export interface TestResult {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  testId: string;
  testName: string;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  percentage: number;
  timeTaken: number; // in seconds
  performanceStatus: string;
  motivationalMessage: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

export interface LiveClass {
  id: string;
  title: string;
  videoUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum BottomTab {
  HOME = 'home',
  LIVE = 'live',
  TESTS = 'tests',
  RESULTS = 'results',
  PROFILE = 'profile',
}
