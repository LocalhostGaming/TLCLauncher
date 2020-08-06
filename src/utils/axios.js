import Axios from 'axios';

/* eslint-disable */
import { remote } from 'electron';
/* eslint-enable */

import file from '@/utils/file';
import path from 'path';

const axios = Axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
});

axios.interceptors.request.use(
  async (config) => {
    try {
      const tempPath = remote.app.getPath('temp');
      const filePath = path.join(tempPath, 'tlc.json');

      const { token } = await file.read(filePath);

      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = token ? `Bearer ${token}` : '';
    } catch (error) {
      return config;
    }

    return config;
  },
  (err) => Promise.reject(err),
);

export default axios;
