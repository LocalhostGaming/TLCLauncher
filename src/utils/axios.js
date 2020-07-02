import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'https://dev-tlc-api.localhostgaming.com/api/',
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
      });

    return config;
  },
  (err) => Promise.reject(err),
);

export default axios;
