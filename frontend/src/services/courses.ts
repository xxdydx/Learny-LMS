import axios from "axios";
import {
  Course,
  NewChapter,
  NewCourse,
  NewSection,
  NewFile,
  NewEnrollment,
  User,
  NewUser,
} from "../types";
const apiBaseUrl = "/api";

let token: string = "";

const setToken = async (newToken: string) => {
  token = `bearer ${newToken}`;
};
const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  };
  const { data } = await axios.get(`${apiBaseUrl}/courses`, config);

  return data;
};

const getOne = async (id: number) => {
  const { data } = await axios.get(`${apiBaseUrl}/courses/${id}`);

  return data;
};

const create = async (object: NewCourse) => {
  const config = {
    headers: { Authorization: token },
  };

  const { data } = await axios.post(`${apiBaseUrl}/courses`, object, config);

  return data;
};

const update = async (id: number, object: NewCourse) => {
  const config = {
    headers: { Authorization: token },
  };
  const { data } = await axios.put(
    `${apiBaseUrl}/courses/${id}`,
    object,
    config
  );

  return data;
};

const remove = async (id: number) => {
  const config = {
    headers: { Authorization: token },
  };
  const { data } = await axios.delete(`${apiBaseUrl}/courses/${id}`, config);
  return data;
};

const createChapter = async (object: NewChapter, id: number) => {
  const config = {
    headers: { Authorization: token },
  };

  const { data } = await axios.post(
    `${apiBaseUrl}/courses/${id}/chapters`,
    object,
    config
  );

  return data;
};

const updateChapter = async (chapter: NewChapter, chapterId: number) => {
  const config = {
    headers: { Authorization: token },
  };
  const { data } = await axios.put(
    `${apiBaseUrl}/chapters/${chapterId}`,
    chapter,
    config
  );
  return data;
};

const removeChapter = async (id: number) => {
  const config = {
    headers: { Authorization: token },
  };
  const { data } = await axios.delete(`${apiBaseUrl}/chapters/${id}`, config);
  return data;
};

const createSection = async (section: NewSection, chpId: number) => {
  const config = {
    headers: { Authorization: token },
  };

  const { data } = await axios.post(
    `${apiBaseUrl}/chapters/${chpId}/sections`,
    section,
    config
  );
  return data;
};
const removeSection = async (id: number) => {
  const config = {
    headers: { Authorization: token },
  };
  const { data } = await axios.delete(`${apiBaseUrl}/sections/${id}`, config);
  return data;
};

const createFile = async (file: FormData, sxnId: number) => {
  const config = {
    headers: { Authorization: token, "Content-Type": "multipart/form-data" },
  };

  const { data } = await axios.post(
    `${apiBaseUrl}/sections/${sxnId}/files`,
    file,
    config
  );
  return data;
};

const updateFile = async (file: NewFile, fileId: number) => {
  const config = {
    headers: { Authorization: token },
  };
  const { data } = await axios.put(
    `${apiBaseUrl}/files/${fileId}`,
    file,
    config
  );
  return data;
};

const removeFile = async (id: number) => {
  const config = {
    headers: { Authorization: token },
  };
  const { data } = await axios.delete(`${apiBaseUrl}/files/${id}`, config);
  return data;
};

const createEnrollment = async (enrollment: NewEnrollment) => {
  const config = {
    headers: { Authorization: token },
  };

  const { data } = await axios.post(
    `${apiBaseUrl}/enrollment`,
    enrollment,
    config
  );

  return data;
};

const removeEnrollment = async (student_id: number, course_id: number) => {
  const config = {
    headers: { Authorization: token },
    data: {
      studentId: student_id,
      courseId: course_id,
    },
  };

  const { data } = await axios.delete(
    `${apiBaseUrl}/enrollment/${student_id}`,
    config
  );

  return data;
};

const getZoomRecordings = async (courseId: number) => {
  const config = {
    headers: { Authorization: token },
  };

  const { data } = await axios.get(
    `${apiBaseUrl}/recordings?courseId=${courseId}`,
    config
  );

  return data;
};

const getAllZoomRecordings = async () => {
  const config = {
    headers: { Authorization: token },
  };

  const { data } = await axios.get(`${apiBaseUrl}/recordings/all`, config);

  return data;
};

const syncZoomRecordings = async (codeParam: string) => {
  const config = {
    headers: { Authorization: token },
  };
  const { data } = await axios.post(
    `/api/recordings/sync?code=${codeParam}`,
    null,
    config
  );
  return data;
};

const directSignUp = async (courseId: string, user: NewUser) => {
  const { data } = await axios.post(
    `${apiBaseUrl}/users/directsignup/${courseId}`,
    user
  );

  return data;
};

const userSignUp = async (user: NewUser) => {
  const { data } = await axios.post(`${apiBaseUrl}/users`, user);

  return data;
};

const getAssignment = async (id: number) => {
  const config = {
    headers: { Authorization: token },
  };
  const { data } = await axios.get(`${apiBaseUrl}/assignments/${id}`, config);

  return data;
};

const createAssignment = async (file: FormData, sxnId: number) => {
  const config = {
    headers: { Authorization: token, "Content-Type": "multipart/form-data" },
  };

  const { data } = await axios.post(
    `${apiBaseUrl}/sections/${sxnId}/assignments`,
    file,
    config
  );
  return data;
};

const submitAssignment = async (file: FormData, assignmentId: number) => {
  const config = {
    headers: { Authorization: token, "Content-Type": "multipart/form-data" },
  };

  const { data } = await axios.post(
    `${apiBaseUrl}/assignments/${assignmentId}/submissions`,
    file,
    config
  );
  return data;
};

const gradeAssignment = async (file: FormData, submissionId: number) => {
  const config = {
    headers: { Authorization: token, "Content-Type": "multipart/form-data" },
  };

  const { data } = await axios.put(
    `${apiBaseUrl}/submissions/${submissionId}/grade`,
    file,
    config
  );
  return data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAll,
  create,
  getOne,
  remove,
  update,
  setToken,
  createChapter,
  updateChapter,
  removeChapter,
  createSection,
  removeSection,
  createFile,
  updateFile,
  removeFile,
  createEnrollment,
  removeEnrollment,
  getZoomRecordings,
  getAllZoomRecordings,
  syncZoomRecordings,
  directSignUp,
  userSignUp,
  getAssignment,
  createAssignment,
  submitAssignment,
  gradeAssignment,
};
