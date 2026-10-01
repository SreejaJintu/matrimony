import axios from "axios";

const executiveAuthService = {
  login: async (userName, password) => {
    const response = await axios.post("/api/executive/login", { userName, password });
    return response.data;
  },
};

export default executiveAuthService;
