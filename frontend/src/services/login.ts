import axios from "axios";
const baseUrl = "/api/login";

interface credentials {
  username: string;
  password: string;
}
const api = axios.create({
  timeout: 6000,
});

const login = async (credentials: credentials) => {
  const response = await api.post(baseUrl, credentials);
  return response.data;
};

export default { login };
