import axios from "axios";
import { Course } from "../types";
const apiBaseUrl = "http://localhost:3001/api";

const getAll = async () => {
  const { data } = await axios.get(`${apiBaseUrl}/courses`);

  return data;
};

const getOne = async (id: number) => {
  const { data } = await axios.get(`${apiBaseUrl}/courses/${id}`);

  return data;
};

const create = async (object: any) => {
  const { data } = await axios.post(`${apiBaseUrl}/courses`, object);

  return data;
};

const remove = async (id: number) => {
  const { data } = await axios.delete(`${apiBaseUrl}/courses/${id}`);
  return data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAll,
  create,
  getOne,
  remove,
};
