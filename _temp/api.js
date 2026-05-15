import axios from "axios";

export default axios.create({
  baseURL: "http://103.175.219.57:8001/api",
  headers: {
    Authorization: "Bearer TOKEN_KAMU"
  }
});
