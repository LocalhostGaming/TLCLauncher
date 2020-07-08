import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});

axios.interceptors.request.use(
  (config) => {
    window.getToken()
      .then((result) => {
        const token = result;
        if (token != null) {
          /* eslint-disable */
          config.headers.Authorization = token ? `Bearer ${token}` : '';
          /* eslint-enable */
        }
      })
      .catch((error) => {
        window.ERROR(error);
      });

    return config;
  },
  (err) => Promise.reject(err),
);

export default axios;
