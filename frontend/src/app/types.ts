export interface File {
  fileName: string;
  fileLink: string;
  id: number;
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
export interface User {
  id: number;
  name: string;
  username: string;
  role: UserRole;
  passwordHash?: string;
}

export interface UserIdentifier {
  name: string;
  username: string;
  token: string;
}

export interface Course {
  title: string;
  id: number;
  teacher: Teacher;
  description?: string;
  author?: string;
  chapters: Chapter[];
  students?: string;
  createdAt: string;
  updatedAt: string;
}
