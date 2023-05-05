export interface File {
  name: string;
  link: string;
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
