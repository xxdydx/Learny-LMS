import axios from "axios";
import { Course } from "../types";
const apiBaseUrl = "http://localhost:3001/api";

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

const create = async (object: Course) => {
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

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAll,
  create,
  getOne,
  remove,
  setToken,
};
