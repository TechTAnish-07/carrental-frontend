import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    Accept: "application/json, text/plain, */*",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

/* ===================== REQUEST INTERCEPTOR ===================== */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token && token.split(".").length === 3) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ multipart/form-data support
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===================== RESPONSE INTERCEPTOR ===================== */

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // ❌ Ignore refresh endpoint itself
    if (originalRequest.url.includes("/auth/refresh")) {
      logout();
      return Promise.reject(error);
    }

    // 🔐 Access token expired
    if (status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        // Queue pending requests
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          logout();
          return Promise.reject(error);
        }

        const res = await axios.post(
          "http://localhost:8080/auth/refresh",
          { refreshToken }
        );

        const newAccessToken = res.data.token;

        // ✅ Save new token
        localStorage.setItem("accessToken", newAccessToken);

        // Update headers
        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (err) {
        processQueue(err, null);
        logout();
        return Promise.reject(err);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/* ===================== HELPERS ===================== */

const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};

export default api;
