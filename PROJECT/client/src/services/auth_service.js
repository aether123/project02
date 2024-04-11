import axios from "axios";
const API_URL = "http://localhost:8080/auth";

class AuthService {
  register(username, mail, password) {
    return axios.post(API_URL + "/signup", { username, mail, password });
  }
  login(username, password) {
    return axios.post(API_URL + "/login", { username, password });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  CheckGoogleLogin() {
    return axios.get(API_URL + "/login/sucess", { withCredentials: true }); //{ withCredentials: true }
  }

  logout() {
    localStorage.removeItem("user");
  }
}

export default new AuthService();
