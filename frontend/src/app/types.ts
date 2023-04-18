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

export interface Course {
  title: string;
  id: number;
  teacher: Teacher;
  description?: string;
  author?: string;
  chapters: Chapter[];
  students?: string;
}
