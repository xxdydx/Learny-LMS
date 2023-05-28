import axios from "axios";
import {
  Course,
  NewChapter,
  NewCourse,
  NewSection,
  NewFile,
  NewEnrollment,
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

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAll,
  create,
  getOne,
  remove,
  setToken,
  createChapter,
  removeChapter,
  createSection,
  removeSection,
  createFile,
  removeFile,
  createEnrollment,
};
