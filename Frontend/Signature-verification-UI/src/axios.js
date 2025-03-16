import axios from "axios";

// Set Axios defaults using environment variables
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials =
  import.meta.env.VITE_WITH_CREDENTIALS === "true";

export default axios;
