export type AlertColor = "success" | "info" | "warning" | "error";

export interface File {
  name: string;
  link: string;
  awskey: string;
  id: number;
  visibledate: string;
}

export interface Section {
  title: string;
  files: File[];
  id: number;
}

export interface Chapter {
  title: string;
  sections: Section[];
  id: number;
}

export interface Teacher {
  id: number;
  name: string;
  username: string;
}

enum UserRole {
  Student = "student",
  Teacher = "teacher",
  Admin = "admin",
}
export interface NewUser {
  courseString: string;
  name: string;
  email?: string;
  password?: string;
  username: string;
}
export interface User {
  id: number;
  name: string;
  email?: string;
  password?: string;
  username: string;
  role: UserRole;
  passwordHash?: string;
}

export interface UserIdentifier {
  name: string;
  username: string;
  token: string;
  role: UserRole;
}

// New course that has yet to be updated on backend
export interface NewCourse {
  title: string;
  description: string;
}
export interface NewChapter {
  title: string;
}
export interface NewSection {
  title: string;
}
export interface NewFile {
  name: string;
  link?: string;
  awskey?: string;
  visibledate?: string;
}

export interface NewEnrollment {
  username: string;
  courseId: number;
}

export interface Notif {
  type: AlertColor;
  message: string;
}

export interface Course {
  title: string;
  id: number;
  teacher: Teacher;
  description?: string;
  author?: string;
  chapters: Chapter[];
  students: User[];
  createdAt: string;
  updatedAt: string;
}
